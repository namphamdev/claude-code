import { useState } from "react";

export function Workspace() {
  const [inputText, setInputText] = useState("");

  const handleSpawnClaude = () => {
    console.log("Spawning Claude with message:", inputText);
    // Placeholder API call to "spawn and run the claude code"
    setInputText("");
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden relative">
      {/* Agent Interaction Panel (Left) */}
      <div className="w-[450px] flex flex-col bg-surface-container border-r border-outline-variant/10 shrink-0 h-full">
        <div className="p-4 bg-surface-container-high flex items-center justify-between border-b border-outline-variant/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
            <span className="font-serif italic text-on-surface">Editorial Agent</span>
          </div>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
          {/* Agent Message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-sm">robot_2</span>
            </div>
            <div className="space-y-2">
              <div className="bg-surface-container-lowest p-4 rounded-xl rounded-tl-none shadow-sm text-sm leading-relaxed text-on-surface-variant">
                I've analyzed the <span className="text-primary font-mono text-xs">ManuscriptEditor</span> component. It needs a more robust state management for the editorial workflow. Should I refactor it to use the new Context API?
              </div>
              <div className="flex gap-2">
                <button className="text-[10px] font-label px-3 py-1 bg-surface-container-highest rounded-full hover:bg-outline-variant/20 transition-colors">Show Plan</button>
                <button className="text-[10px] font-label px-3 py-1 bg-surface-container-highest rounded-full hover:bg-outline-variant/20 transition-colors">Ignore</button>
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-sm">person</span>
            </div>
            <div className="bg-primary-container p-4 rounded-xl rounded-tr-none shadow-sm text-sm leading-relaxed text-on-primary-container">
              Yes, please refactor it. Also, ensure the typography follows our "The Intellectual Editorial" design system tokens.
            </div>
          </div>

          {/* Agent Thinking */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-sm">robot_2</span>
            </div>
            <div className="italic text-xs text-outline font-label pt-2">
              Agent is rewriting the module...
            </div>
          </div>
        </div>

        {/* Interaction Box */}
        <div className="p-4 bg-surface-container-high border-t border-outline-variant/10 absolute bottom-0 left-0 w-[450px]">
          <div className="relative">
            <textarea
              className="w-full bg-surface-container-lowest border-none outline-none rounded-xl p-4 pr-12 text-sm focus:ring-1 focus:ring-primary placeholder:text-outline-variant resize-none h-24"
              placeholder="Describe the edit..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSpawnClaude();
                }
              }}
            ></textarea>
            <button
              className="absolute bottom-3 right-3 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
              onClick={handleSpawnClaude}
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">attach_file</span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">mic</span>
            </button>
            <div className="ml-auto text-[10px] font-label text-outline uppercase tracking-widest">
              Cmd + Enter to send
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor Area (Right) */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface h-full">
        {/* Breadcrumbs / Tab Bar */}
        <div className="h-12 flex items-center px-6 gap-4 border-b border-outline-variant/10 bg-surface-container-low">
          <div className="flex items-center gap-2 text-xs font-label text-on-surface-variant">
            <span className="opacity-50">src</span>
            <span className="opacity-50">/</span>
            <span className="opacity-50">components</span>
            <span className="opacity-50">/</span>
            <span className="text-primary font-semibold">ManuscriptEditor.tsx</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-surface-container-lowest overflow-hidden">
          <div className="flex-1 overflow-auto p-8 font-mono text-[14px] leading-relaxed text-on-surface-variant/90 relative">
            {/* Line Numbers */}
            <div className="absolute left-2 top-8 text-right w-10 pr-4 select-none text-outline-variant/40 font-mono text-sm leading-relaxed">
              1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11<br/>12<br/>13<br/>14<br/>15
            </div>
            <div className="ml-10">
              <pre>
<span className="text-tertiary">import</span> React <span className="text-tertiary">from</span> <span className="text-secondary">'react'</span>;<br/>
<span className="text-tertiary">import</span> {"{"} EditorAgent {"}"} <span className="text-tertiary">from</span> <span className="text-secondary">'@editorial/core'</span>;<br/><br/>

<span className="text-primary font-medium">export const</span> <span className="text-on-surface font-semibold">ManuscriptEditor</span> = () =&gt; {"{"}<br/>
  <span className="text-outline italic">// Initialize the living manuscript logic</span><br/>
  <span className="text-primary font-medium">const</span> [state, setState] = <span className="text-on-surface">useState</span>(<span className="text-secondary">"Draft"</span>);<br/><br/>

  <span className="text-tertiary">return</span> (<br/>
    &lt;<span className="text-primary">div</span> className=<span className="text-secondary">"editorial-surface"</span>&gt;<br/>
      &lt;<span className="text-primary">h1</span>&gt;The Living Manuscript&lt;/<span className="text-primary">h1</span>&gt;<br/>
      {/* <span className="text-outline">AI suggested implementation below</span> */}<br/>
      &lt;<span className="text-on-surface font-semibold">AgentProvider</span>&gt;<br/>
        {"{"}children{"}"}<br/>
      &lt;/<span className="text-on-surface font-semibold">AgentProvider</span>&gt;<br/>
    &lt;/<span className="text-primary">div</span>&gt;<br/>
  );<br/>
{"}"};
              </pre>
            </div>
          </div>

          {/* Code Action Bar */}
          <div className="h-16 flex items-center justify-between px-8 bg-surface-container-low border-t border-outline-variant/10 shrink-0">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-md text-sm font-label hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-sm">sync</span>
                Compare
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-md text-sm font-label hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-sm">history</span>
                Revert
              </button>
            </div>
            <button className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-md text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              Execute Build
            </button>
          </div>
        </div>
      </div>

      {/* Floating Command Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full shadow-2xl z-50">
        <span className="material-symbols-outlined text-sm opacity-60">keyboard_command_key</span>
        <span className="text-xs font-label">Search for commands or files...</span>
        <div className="ml-4 flex gap-1">
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">K</span>
        </div>
      </div>
    </div>
  );
}
