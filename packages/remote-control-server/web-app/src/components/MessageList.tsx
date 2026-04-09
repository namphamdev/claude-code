import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types";
import { MarkdownContent } from "./MarkdownContent";
import { ToolCard } from "./ToolCard";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  loadingVerb: string;
  loadingStart: number;
}

const SPINNER_FRAMES = ["·", "✢", "✳", "✶", "✻", "✽"];
const SPINNER_CYCLE = [...SPINNER_FRAMES, ...SPINNER_FRAMES.slice().reverse()];

export function MessageList({ messages, loading, loadingVerb, loadingStart }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto py-5 flex flex-col gap-3.5 scroll-smooth">
      {messages.map((msg) => (
        <MessageRow key={msg.id} message={msg} />
      ))}
      {loading && <LoadingIndicator verb={loadingVerb} startTime={loadingStart} />}
      <div ref={bottomRef} />
    </div>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  if (message.role === "tool" && message.toolName && message.toolName !== "result") {
    return <ToolCard name={message.toolName} input={message.toolInput} />;
  }
  if (message.role === "tool" && message.toolName === "result") {
    return <ToolCard name="Result" content={message.content} isResult />;
  }

  const alignment = message.role === "user" ? "self-end" : message.role === "system" ? "self-center" : "self-start";
  const maxW = message.role === "system" ? "max-w-full" : "max-w-[82%]";

  return (
    <div className={`flex ${maxW} ${alignment} animate-slide-up`}>
      <div className={bubbleClass(message.role)}>
        {message.role === "assistant" ? (
          <MarkdownContent content={message.content} />
        ) : (
          <span className="whitespace-pre-wrap break-words">{message.content}</span>
        )}
      </div>
    </div>
  );
}

function bubbleClass(role: string): string {
  switch (role) {
    case "user":
      return "px-4 py-3 rounded-2xl rounded-br-md bg-bg-user-msg text-text-light shadow-sm text-[0.92rem] leading-relaxed";
    case "assistant":
      return "px-4 py-3 rounded-2xl rounded-bl-md bg-bg-card border border-border-light shadow-sm text-[0.92rem] leading-relaxed";
    case "system":
      return "px-3 py-1 text-text-muted text-[0.82rem] text-center";
    default:
      return "px-4 py-3 rounded-2xl bg-bg-card border border-border-light shadow-sm text-[0.92rem]";
  }
}

function LoadingIndicator({ verb, startTime }: { verb: string; startTime: number }) {
  const [frame, setFrame] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const spinnerTimer = setInterval(() => setFrame((f) => (f + 1) % SPINNER_CYCLE.length), 120);
    const clockTimer = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => {
      clearInterval(spinnerTimer);
      clearInterval(clockTimer);
    };
  }, [startTime]);

  return (
    <div className="flex items-center gap-2.5 self-start px-1 py-2.5 animate-slide-up">
      <span className="text-xl text-accent leading-none min-w-[1.2em]">{SPINNER_CYCLE[frame]}</span>
      <span className="text-sm font-medium glimmer-text">{verb}...</span>
      <span className="text-xs text-text-muted font-mono ml-auto">{elapsed}s</span>
    </div>
  );
}
