import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  content: string;
}

export function MarkdownContent({ content }: Props) {
  return (
    <div className="prose-claude">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");
            if (match) {
              return (
                <div className="relative group my-2">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#1e1e1e] rounded-t-md border-b border-white/10">
                    <span className="text-[0.7rem] text-white/50 font-mono">{match[1]}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(code)}
                      className="text-[0.7rem] text-white/40 hover:text-white/70 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: "6px",
                      borderBottomRightRadius: "6px",
                      fontSize: "0.82rem",
                      padding: "12px 14px",
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              );
            }
            return (
              <code className="bg-bg-tool-card px-1.5 py-0.5 rounded text-[0.85em] font-mono" {...props}>
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 mb-2 space-y-0.5">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 mb-2 space-y-0.5">{children}</ol>;
          },
          a({ href, children }) {
            return <a href={href} className="text-accent hover:text-accent-hover underline" target="_blank" rel="noopener noreferrer">{children}</a>;
          },
          strong({ children }) {
            return <strong className="font-semibold">{children}</strong>;
          },
          blockquote({ children }) {
            return <blockquote className="border-l-2 border-accent/40 pl-3 my-2 text-text-secondary italic">{children}</blockquote>;
          },
          table({ children }) {
            return <div className="overflow-x-auto my-2"><table className="text-sm border-collapse w-full">{children}</table></div>;
          },
          th({ children }) {
            return <th className="border border-border-default px-3 py-1.5 bg-bg-tool-card text-left font-semibold text-xs">{children}</th>;
          },
          td({ children }) {
            return <td className="border border-border-default px-3 py-1.5 text-sm">{children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
