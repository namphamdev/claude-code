import type { SessionSummary, SessionDetail, Environment, SessionEvent } from "@/types";

const BASE = "";

function getUuid(): string {
  let uuid = localStorage.getItem("rcs_uuid");
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem("rcs_uuid", uuid);
  }
  return uuid;
}

export function setUuid(uuid: string) {
  localStorage.setItem("rcs_uuid", uuid);
}

export { getUuid };

async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const uuid = getUuid();
  const sep = path.includes("?") ? "&" : "?";
  const url = `${BASE}${path}${sep}uuid=${encodeURIComponent(uuid)}`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || res.statusText);
  }
  return data as T;
}

export const fetchSessions = () => api<SessionSummary[]>("GET", "/web/sessions/all");
export const fetchSession = (id: string) => api<SessionDetail>("GET", `/web/sessions/${id}`);
export const fetchSessionHistory = (id: string) => api<{ events: SessionEvent[] }>("GET", `/web/sessions/${id}/history`);
export const fetchEnvironments = () => api<Environment[]>("GET", "/web/environments");
export const createSession = (body: { title?: string; environment_id?: string }) => api<SessionDetail>("POST", "/web/sessions", body);
export const bindSession = (sessionId: string) => api<void>("POST", "/web/bind", { sessionId });
export const sendEvent = (sessionId: string, body: { type: string; content?: string }) => api<void>("POST", `/web/sessions/${sessionId}/events`, body);
export const sendControl = (sessionId: string, body: Record<string, unknown>) => api<void>("POST", `/web/sessions/${sessionId}/control`, body);
export const interruptSession = (sessionId: string) => api<void>("POST", `/web/sessions/${sessionId}/interrupt`);
