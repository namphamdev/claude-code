import { useState } from "react";

interface Props {
  name: string;
  input?: Record<string, unknown>;
  content?: string;
  isResult?: boolean;
}

export function ToolCard({ name, input, content, isResult }: Props) {
  const [expanded, setExpanded] = useState(false);
  const body = content || (input ? JSON.stringify(input, null, 2) : "");
  const truncated = body.length > 2000 ? body.slice(0, 2000) + "..." : body;

  return (
    <div className="self-start max-w-[95%] animate-slide-up">
      <div className={`rounded-lg border transition-colors ${isResult ? "bg-bg-tool-card border-border-default" : "bg-bg-tool-card border-border-default hover:border-accent"}`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 w-full px-4 py-2.5 text-left"
        >
          <span className={`text-accent text-[0.7rem] transition-transform ${expanded ? "rotate-90" : ""}`}>&#9654;</span>
          <span className="text-[0.82rem] font-semibold text-text-secondary">
            {isResult ? "Tool Result" : <>Tool: <span className="text-text-primary">{name}</span></>}
          </span>
        </button>
        {expanded && (
          <div className="mx-4 mb-3 px-3.5 py-2.5 bg-bg-card rounded-md border border-border-light font-mono text-xs text-text-secondary whitespace-pre-wrap break-all max-h-60 overflow-y-auto">
            {truncated}
          </div>
        )}
      </div>
    </div>
  );
}
