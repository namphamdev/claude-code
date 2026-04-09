interface Props {
  requestId: string;
  toolName: string;
  toolInput: Record<string, unknown>;
  description: string;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function PermissionPrompt({ requestId, toolName, toolInput, description, onApprove, onReject }: Props) {
  const inputStr = JSON.stringify(toolInput, null, 2);

  return (
    <div className="bg-bg-permission border border-[#F0D9A8] rounded-xl px-6 py-5 max-w-[95%] shadow-md animate-slide-up">
      <div className="font-display font-semibold text-[0.92rem] text-orange mb-2.5 flex items-center gap-1.5">
        Permission Request
      </div>
      {description && <div className="text-sm text-text-secondary mb-2.5 leading-relaxed">{description}</div>}
      <div className="text-[0.82rem] font-semibold text-text-primary mb-1.5">{toolName}</div>
      {toolName !== "AskUserQuestion" && (
        <div className="font-mono text-xs text-text-secondary bg-bg-card px-3.5 py-2.5 rounded-md mb-3.5 whitespace-pre-wrap break-all max-h-40 overflow-y-auto border border-border-light">
          {inputStr.length > 500 ? inputStr.slice(0, 500) + "..." : inputStr}
        </div>
      )}
      <div className="flex gap-2.5">
        <button
          onClick={() => onApprove(requestId)}
          className="bg-success text-text-light px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#347A5E] hover:-translate-y-px active:translate-y-0 transition-all"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(requestId)}
          className="text-danger border-[1.5px] border-danger px-5 py-2 rounded-lg text-sm font-semibold hover:bg-danger-bg hover:-translate-y-px active:translate-y-0 transition-all"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
