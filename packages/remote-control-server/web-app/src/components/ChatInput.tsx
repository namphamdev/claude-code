import { useState, useRef, useEffect } from "react";

interface Props {
  onSend: (text: string) => void;
  onInterrupt: () => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, onInterrupt, isLoading }: Props) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  function handleSubmit() {
    if (isLoading) {
      onInterrupt();
      return;
    }
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape" && isLoading) {
      onInterrupt();
    }
  }

  return (
    <div className="flex items-end gap-2.5 pt-5 border-t border-border-light mt-auto shrink-0">
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 px-4 py-3 border-[1.5px] border-border-default rounded-3xl bg-bg-card text-[0.92rem] text-text-primary outline-none resize-none shadow-sm transition-all focus:border-accent focus:shadow-md focus:ring-2 focus:ring-accent/10 placeholder:text-text-muted"
        style={{ minHeight: "44px", maxHeight: "160px" }}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = Math.min(el.scrollHeight, 160) + "px";
        }}
      />
      <button
        onClick={handleSubmit}
        className={`w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0 transition-all shadow-md hover:-translate-y-px active:translate-y-0 ${
          isLoading
            ? "bg-danger hover:bg-[#B33838] shadow-danger/25"
            : "bg-accent hover:bg-accent-hover shadow-accent/25"
        }`}
        aria-label={isLoading ? "Stop" : "Send"}
      >
        {isLoading ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="3" width="12" height="12" rx="2" fill="white" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 10L17 3L10 17L9 11L3 10Z" fill="white" />
          </svg>
        )}
      </button>
    </div>
  );
}
