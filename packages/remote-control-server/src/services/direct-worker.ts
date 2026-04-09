/**
 * Direct API Worker — calls the Anthropic Messages API via raw fetch.
 * No SDK dependency. Reads config from ~/.claude/settings.json automatically,
 * so no manual env setup is needed.
 *
 * Config resolution (in order):
 *   1. Environment variables (ANTHROPIC_API_KEY, ANTHROPIC_BASE_URL, etc.)
 *   2. ~/.claude/settings.json env block
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { getEventBus, type SessionEvent } from "../transport/event-bus";
import { publishSessionEvent } from "./transport";
import { updateSessionStatus } from "./session";

// Track active workers per session
const activeWorkers = new Map<string, () => void>();

// Conversation history per session
const sessionMessages = new Map<
  string,
  Array<{ role: "user" | "assistant"; content: string }>
>();

// Interrupt signals per session
const interruptSignals = new Map<string, AbortController>();

// ============================================================
// Config — read from ~/.claude/settings.json + env
// ============================================================

interface ClaudeSettings {
  env?: Record<string, string>;
  model?: string;
}

let _settings: ClaudeSettings | null = null;

function loadSettings(): ClaudeSettings {
  if (_settings) return _settings;
  try {
    const settingsPath = join(homedir(), ".claude", "settings.json");
    const raw = readFileSync(settingsPath, "utf-8");
    _settings = JSON.parse(raw) as ClaudeSettings;
  } catch {
    _settings = {};
  }
  return _settings;
}

function getSettingsEnv(key: string): string | undefined {
  return loadSettings().env?.[key];
}

/** Resolve a config value: process.env first, then settings.json env block */
function resolveConfig(key: string, fallback?: string): string | undefined {
  return process.env[key] || getSettingsEnv(key) || fallback;
}

function getApiKey(): string | undefined {
  // Support both ANTHROPIC_API_KEY and ANTHROPIC_AUTH_TOKEN
  return resolveConfig("ANTHROPIC_API_KEY") || resolveConfig("ANTHROPIC_AUTH_TOKEN");
}

function getModel(): string {
  return resolveConfig("ANTHROPIC_MODEL") || resolveConfig("ANTHROPIC_DEFAULT_SONNET_MODEL") || "claude-sonnet-4-20250514";
}

function getBaseUrl(): string {
  return resolveConfig("ANTHROPIC_BASE_URL") || "https://api.anthropic.com";
}

function getSystemPrompt(): string {
  return resolveConfig("SYSTEM_PROMPT") || "You are Claude, a helpful AI assistant by Anthropic. Be concise and helpful.";
}

// ============================================================
// Streaming SSE parser
// ============================================================

interface StreamEvent {
  event: string;
  data: string;
}

async function* parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): AsyncGenerator<StreamEvent> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    let currentEvent = "";
    let currentData = "";

    for (const line of lines) {
      if (line.startsWith("event: ")) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        currentData = line.slice(6);
      } else if (line === "" && currentEvent) {
        yield { event: currentEvent, data: currentData };
        currentEvent = "";
        currentData = "";
      }
    }
  }
}

// ============================================================
// API call with streaming
// ============================================================

async function streamMessage(
  sessionId: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  signal: AbortSignal,
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const baseUrl = getBaseUrl();
  const isOfficialApi = baseUrl.includes("anthropic.com");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01",
  };

  // Official Anthropic API uses x-api-key; custom endpoints use Bearer token
  if (isOfficialApi) {
    headers["x-api-key"] = apiKey;
  } else {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const res = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: getModel(),
      max_tokens: 8192,
      system: getSystemPrompt(),
      messages,
      stream: true,
    }),
    signal,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body.slice(0, 500)}`);
  }

  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  let fullText = "";

  for await (const sseEvent of parseSSEStream(reader)) {
    if (signal.aborted) break;

    if (sseEvent.event === "content_block_delta") {
      try {
        const delta = JSON.parse(sseEvent.data);
        if (delta.delta?.type === "text_delta" && delta.delta.text) {
          fullText += delta.delta.text;
          publishSessionEvent(
            sessionId,
            "partial_assistant",
            { content: fullText },
            "inbound",
          );
        }
      } catch {
        // skip malformed delta
      }
    } else if (sseEvent.event === "message_stop") {
      break;
    } else if (sseEvent.event === "error") {
      try {
        const err = JSON.parse(sseEvent.data);
        throw new Error(err.error?.message || "Stream error");
      } catch (e) {
        if (e instanceof Error && e.message !== "Stream error") throw e;
        throw new Error("Stream error");
      }
    }
  }

  return fullText;
}

// ============================================================
// Worker lifecycle
// ============================================================

/** Start a worker for a session — listens for user messages and responds via API */
export function startDirectWorker(sessionId: string): boolean {
  if (activeWorkers.has(sessionId)) return true;

  if (!getApiKey()) {
    console.warn(
      "[DirectWorker] No ANTHROPIC_API_KEY set — direct worker disabled",
    );
    return false;
  }

  const bus = getEventBus(sessionId);
  let processing = false;

  const unsubscribe = bus.subscribe(async (event: SessionEvent) => {
    // Respond to outbound user messages (sent from web UI)
    if (event.type === "user" && event.direction === "outbound") {
      if (processing) return;

      const payload = event.payload as Record<string, unknown>;
      const content = (payload.content as string) || "";
      if (!content.trim()) return;

      processing = true;
      updateSessionStatus(sessionId, "running");

      // Build conversation history
      if (!sessionMessages.has(sessionId)) {
        sessionMessages.set(sessionId, []);
      }
      const messages = sessionMessages.get(sessionId)!;
      messages.push({ role: "user", content });

      // Create abort controller for this request
      const controller = new AbortController();
      interruptSignals.set(sessionId, controller);

      try {
        const fullText = await streamMessage(
          sessionId,
          messages,
          controller.signal,
        );

        if (!controller.signal.aborted && fullText) {
          messages.push({ role: "assistant", content: fullText });

          publishSessionEvent(
            sessionId,
            "assistant",
            {
              content: fullText,
              message: {
                role: "assistant",
                content: [{ type: "text", text: fullText }],
              },
            },
            "inbound",
          );

          publishSessionEvent(
            sessionId,
            "result_success",
            { content: fullText, result: "completed" },
            "inbound",
          );
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          publishSessionEvent(
            sessionId,
            "interrupt",
            { message: "Request cancelled" },
            "inbound",
          );
        } else {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.error(
            `[DirectWorker] API error for session ${sessionId}:`,
            errMsg,
          );
          publishSessionEvent(
            sessionId,
            "error",
            { content: `API Error: ${errMsg}`, message: errMsg },
            "inbound",
          );
        }
      } finally {
        interruptSignals.delete(sessionId);
        processing = false;
        updateSessionStatus(sessionId, "idle");
      }
    }

    // Handle interrupt events
    if (event.type === "interrupt" && event.direction === "outbound") {
      const controller = interruptSignals.get(sessionId);
      if (controller) {
        controller.abort();
        interruptSignals.delete(sessionId);
      }
    }
  });

  activeWorkers.set(sessionId, unsubscribe);
  console.log(`[DirectWorker] Started for session ${sessionId}`);
  return true;
}

/** Stop a session worker */
export function stopDirectWorker(sessionId: string) {
  const controller = interruptSignals.get(sessionId);
  if (controller) controller.abort();
  interruptSignals.delete(sessionId);

  const unsub = activeWorkers.get(sessionId);
  if (unsub) {
    unsub();
    activeWorkers.delete(sessionId);
    sessionMessages.delete(sessionId);
    console.log(`[DirectWorker] Stopped for session ${sessionId}`);
  }
}

/** Check if direct worker mode is available */
export function isDirectWorkerAvailable(): boolean {
  return !!getApiKey();
}

/** Get resolved config for display */
export function getWorkerConfig(): { apiKey: boolean; model: string; baseUrl: string } {
  return {
    apiKey: !!getApiKey(),
    model: getModel(),
    baseUrl: getBaseUrl(),
  };
}

/** Get active worker count */
export function getActiveWorkerCount(): number {
  return activeWorkers.size;
}
