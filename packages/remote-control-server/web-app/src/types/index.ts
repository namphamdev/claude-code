/** Event types from the remote-control-server */

export interface SessionSummary {
  id: string;
  title: string;
  status: string;
  environment_id: string | null;
  created_at: number;
  updated_at: number;
}

export interface SessionDetail extends SessionSummary {
  source: string;
  permission_mode: string;
}

export interface Environment {
  id: string;
  machine_name: string;
  directory: string;
  branch: string;
  status: string;
}

export type EventDirection = "inbound" | "outbound";

export interface SessionEvent {
  id: string;
  type: string;
  direction: EventDirection;
  payload: Record<string, unknown>;
  seqNum?: number;
  timestamp?: number;
}

export interface ToolUsePayload {
  tool_name?: string;
  name?: string;
  tool_input?: Record<string, unknown>;
  input?: Record<string, unknown>;
}

export interface PermissionRequestPayload {
  request_id: string;
  request: {
    subtype: string;
    tool_name?: string;
    input?: Record<string, unknown>;
    tool_input?: Record<string, unknown>;
    description?: string;
  };
}

export interface MessageContent {
  type: "text" | "tool_use" | "tool_result";
  text?: string;
  name?: string;
  input?: Record<string, unknown>;
}

/** Normalized chat message for rendering */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolName?: string;
  toolInput?: Record<string, unknown>;
  isStreaming?: boolean;
  timestamp?: number;
}

export interface TaskItem {
  id: string;
  subject: string;
  description: string;
  activeForm?: string;
  status: "pending" | "in_progress" | "completed" | "deleted";
  owner?: string;
  blocks: string[];
  blockedBy: string[];
}

export interface TodoItem {
  content: string;
  status: "pending" | "in_progress" | "completed";
  activeForm: string;
}
