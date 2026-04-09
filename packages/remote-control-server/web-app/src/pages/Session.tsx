import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSession, fetchSessionHistory, bindSession, sendEvent, sendControl, interruptSession } from "@/lib/api";
import { useSSE } from "@/hooks/useSSE";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { PermissionPrompt } from "@/components/PermissionPrompt";
import { TaskPanel } from "@/components/TaskPanel";
import type { SessionDetail, SessionEvent, ChatMessage, TaskItem } from "@/types";

export function Session() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [permissions, setPermissions] = useState<SessionEvent[]>([]);
  const [tasks, setTasks] = useState<Map<string, TaskItem>>(new Map());
  const [loading, setLoading] = useState(false);
  const [loadingVerb, setLoadingVerb] = useState("");
  const [loadingStart, setLoadingStart] = useState(0);
  const [showTasks, setShowTasks] = useState(false);
  const [lastSeqNum, setLastSeqNum] = useState(0);
  const seqRef = useRef(0);

  // Load session and history
  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        await bindSession(sessionId).catch(() => {});
        const s = await fetchSession(sessionId);
        setSession(s);
        const { events } = await fetchSessionHistory(sessionId);
        const { msgs, perms, taskMap, maxSeq } = processHistory(events || []);
        setMessages(msgs);
        setPermissions(perms);
        setTasks(taskMap);
        seqRef.current = maxSeq;
        setLastSeqNum(maxSeq);
      } catch {
        // handled by UI
      }
    })();
  }, [sessionId]);

  // Handle live SSE events
  const handleEvent = useCallback((event: SessionEvent) => {
    const type = event.type;
    const payload = event.payload || {};
    const direction = event.direction;

    // Skip bridge noise
    if (JSON.stringify(event).includes("Remote Control connecting")) return;

    switch (type) {
      case "user":
        if (direction === "outbound") {
          addMessage({ role: "user", content: extractText(payload) });
          startLoading();
        }
        break;
      case "assistant": {
        stopLoading();
        const text = extractText(payload);
        if (text?.trim()) addMessage({ role: "assistant", content: text });
        processTaskEvent(payload);
        break;
      }
      case "partial_assistant":
        // Skip partials for now — wait for final
        break;
      case "tool_use":
        addMessage({
          role: "tool",
          content: "",
          toolName: (payload.tool_name || payload.name) as string,
          toolInput: (payload.tool_input || payload.input) as Record<string, unknown>,
        });
        break;
      case "tool_result":
        addMessage({
          role: "tool",
          content: typeof payload.content === "string" ? payload.content : JSON.stringify(payload.content || payload.output || ""),
          toolName: "result",
        });
        break;
      case "control_request":
      case "permission_request":
        if ((payload.request as Record<string, unknown>)?.subtype === "can_use_tool" && direction === "inbound") {
          setPermissions((prev) => [...prev, event]);
        }
        break;
      case "control_response":
      case "permission_response":
        removePermission((payload as Record<string, unknown>).request_id as string);
        break;
      case "error":
        stopLoading();
        addMessage({ role: "system", content: `Error: ${(payload.message || payload.content || "Unknown error") as string}` });
        break;
      case "interrupt":
        stopLoading();
        addMessage({ role: "system", content: "Session interrupted" });
        break;
      case "result":
      case "result_success":
        stopLoading();
        break;
    }
  }, []);

  useSSE({ sessionId: sessionId || null, fromSeqNum: lastSeqNum, onEvent: handleEvent });

  function addMessage(partial: Omit<ChatMessage, "id" | "timestamp">) {
    const msg: ChatMessage = {
      ...partial,
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
  }

  function startLoading() {
    setLoading(true);
    setLoadingVerb(SPINNER_VERBS[Math.floor(Math.random() * SPINNER_VERBS.length)]);
    setLoadingStart(Date.now());
  }

  function stopLoading() {
    setLoading(false);
  }

  function removePermission(requestId: string) {
    setPermissions((prev) => prev.filter((p) => {
      const rid = (p.payload as Record<string, unknown>).request_id || p.id;
      return rid !== requestId;
    }));
  }

  function processTaskEvent(payload: Record<string, unknown>) {
    const msg = payload.message as Record<string, unknown> | undefined;
    if (!msg) return;
    const content = msg.content;
    if (!Array.isArray(content)) return;
    let changed = false;
    for (const block of content) {
      if (!block || typeof block !== "object" || (block as Record<string, unknown>).type !== "tool_use") continue;
      const name = (block as Record<string, unknown>).name as string;
      const input = ((block as Record<string, unknown>).input || {}) as Record<string, unknown>;
      if (name === "TaskCreate") {
        const id = (input.taskId || input.id || `task_${Date.now()}`) as string;
        setTasks((prev) => {
          const next = new Map(prev);
          next.set(id, {
            id,
            subject: (input.subject as string) || "Untitled",
            description: (input.description as string) || "",
            activeForm: input.activeForm as string | undefined,
            status: "pending",
            blocks: [],
            blockedBy: [],
          });
          return next;
        });
        changed = true;
      } else if (name === "TaskUpdate") {
        const id = input.taskId as string;
        if (!id) continue;
        setTasks((prev) => {
          const next = new Map(prev);
          const existing = next.get(id);
          if (existing) {
            if (input.status) existing.status = input.status as TaskItem["status"];
            if (input.subject) existing.subject = input.subject as string;
            if (input.status === "deleted") next.delete(id);
          }
          return next;
        });
        changed = true;
      }
    }
    if (changed && !showTasks) setShowTasks(true);
  }

  async function handleSend(text: string) {
    if (!sessionId || !text.trim()) return;
    addMessage({ role: "user", content: text });
    startLoading();
    try {
      await sendEvent(sessionId, { type: "user", content: text });
    } catch (err) {
      stopLoading();
      addMessage({ role: "system", content: `Failed to send: ${(err as Error).message}` });
    }
  }

  async function handleInterrupt() {
    if (!sessionId) return;
    try {
      await interruptSession(sessionId);
      stopLoading();
      addMessage({ role: "system", content: "Session interrupted" });
    } catch {
      // silent
    }
  }

  async function handleApprove(requestId: string) {
    if (!sessionId) return;
    await sendControl(sessionId, { type: "permission_response", approved: true, request_id: requestId });
    removePermission(requestId);
    startLoading();
  }

  async function handleReject(requestId: string) {
    if (!sessionId) return;
    await sendControl(sessionId, { type: "permission_response", approved: false, request_id: requestId });
    removePermission(requestId);
  }

  return (
    <div className="max-w-[880px] mx-auto px-8 py-7 flex flex-col min-h-[calc(100vh-56px)] animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Link to="/" className="text-sm text-text-secondary hover:text-accent transition-colors mb-4 inline-block">
          &larr; Dashboard
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-display font-semibold text-xl tracking-tight">{session?.title || sessionId}</h2>
          {session && <StatusBadge status={session.status} />}
          <button
            onClick={() => setShowTasks(!showTasks)}
            className={`ml-auto text-sm font-medium px-3 py-1.5 rounded-md transition-all ${showTasks ? "bg-accent/10 text-accent" : "text-text-secondary hover:text-text-primary hover:bg-bg-input"}`}
          >
            Tasks {tasks.size > 0 && <span className="ml-1 bg-accent text-text-light text-xs px-1.5 py-0.5 rounded-full">{tasks.size}</span>}
          </button>
        </div>
        {session && (
          <div className="flex gap-3 mt-2 text-xs text-text-secondary font-mono">
            <span>{session.id}</span>
            {session.environment_id && <span>{session.environment_id}</span>}
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex flex-1 gap-4 min-h-0">
        {/* Chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          <MessageList messages={messages} loading={loading} loadingVerb={loadingVerb} loadingStart={loadingStart} />

          {/* Permission prompts */}
          {permissions.length > 0 && (
            <div className="flex flex-col gap-2 py-2">
              {permissions.map((p) => {
                const payload = p.payload as Record<string, unknown>;
                const request = payload.request as Record<string, unknown>;
                const requestId = (payload.request_id || p.id) as string;
                return (
                  <PermissionPrompt
                    key={requestId}
                    requestId={requestId}
                    toolName={(request?.tool_name || "unknown") as string}
                    toolInput={(request?.input || request?.tool_input || {}) as Record<string, unknown>}
                    description={(request?.description || "") as string}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                );
              })}
            </div>
          )}

          <ChatInput onSend={handleSend} onInterrupt={handleInterrupt} isLoading={loading} />
        </div>

        {/* Task panel */}
        {showTasks && <TaskPanel tasks={tasks} onClose={() => setShowTasks(false)} />}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-success-bg text-success",
    running: "bg-success-bg text-success",
    idle: "bg-warning-bg text-warning",
    requires_action: "bg-orange-bg text-orange",
    error: "bg-danger-bg text-danger",
  };
  const cls = colors[status] || "bg-border-light text-text-muted";
  return <span className={`text-[0.72rem] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${cls}`}>{status}</span>;
}

function extractText(payload: Record<string, unknown>): string {
  if (typeof payload.content === "string") return payload.content;
  const msg = payload.message as Record<string, unknown> | undefined;
  if (msg) {
    const mc = msg.content;
    if (typeof mc === "string") return mc;
    if (Array.isArray(mc)) {
      return mc.filter((b) => b?.type === "text").map((b) => b.text || "").join("");
    }
  }
  return typeof payload === "string" ? payload : JSON.stringify(payload);
}

function processHistory(events: SessionEvent[]) {
  const msgs: ChatMessage[] = [];
  const pendingPerms = new Map<string, SessionEvent>();
  const resolvedPerms = new Set<string>();
  const taskMap = new Map<string, TaskItem>();
  let maxSeq = 0;

  for (const event of events) {
    if (event.seqNum && event.seqNum > maxSeq) maxSeq = event.seqNum;
    const payload = event.payload || {};
    switch (event.type) {
      case "user":
        if (event.direction === "outbound") {
          msgs.push({ id: event.id, role: "user", content: extractText(payload), timestamp: event.timestamp });
        }
        break;
      case "assistant": {
        const text = extractText(payload);
        if (text?.trim()) msgs.push({ id: event.id, role: "assistant", content: text, timestamp: event.timestamp });
        break;
      }
      case "tool_use":
        msgs.push({
          id: event.id,
          role: "tool",
          content: "",
          toolName: (payload.tool_name || payload.name) as string,
          toolInput: (payload.tool_input || payload.input) as Record<string, unknown>,
          timestamp: event.timestamp,
        });
        break;
      case "tool_result":
        msgs.push({
          id: event.id,
          role: "tool",
          content: typeof payload.content === "string" ? payload.content : JSON.stringify(payload.content || payload.output || ""),
          toolName: "result",
          timestamp: event.timestamp,
        });
        break;
      case "control_request":
      case "permission_request": {
        const req = (payload as Record<string, unknown>).request as Record<string, unknown> | undefined;
        if (req?.subtype === "can_use_tool" && event.direction === "inbound") {
          const rid = ((payload as Record<string, unknown>).request_id || event.id) as string;
          if (!resolvedPerms.has(rid)) pendingPerms.set(rid, event);
        }
        break;
      }
      case "control_response":
      case "permission_response": {
        const rid = (payload as Record<string, unknown>).request_id as string;
        if (rid) {
          resolvedPerms.add(rid);
          pendingPerms.delete(rid);
        }
        break;
      }
      case "error":
        msgs.push({ id: event.id, role: "system", content: `Error: ${(payload.message || payload.content || "Unknown") as string}`, timestamp: event.timestamp });
        break;
    }
  }

  return { msgs, perms: [...pendingPerms.values()], taskMap, maxSeq };
}

const SPINNER_VERBS = [
  "Thinking", "Crafting", "Computing", "Brewing", "Cooking", "Pondering",
  "Weaving", "Forging", "Conjuring", "Assembling", "Composing", "Architecting",
  "Synthesizing", "Orchestrating", "Channeling", "Crystallizing", "Hatching",
  "Sculpting", "Distilling", "Manifesting", "Calibrating", "Harmonizing",
];
