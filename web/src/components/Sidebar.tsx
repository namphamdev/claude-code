import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="bg-[#f5f4ed] dark:bg-stone-900 h-full w-64 border-r border-[#9a4021]/5 flex flex-col p-4 gap-2 shrink-0 z-50 overflow-y-auto">
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">keyboard</span>
        </div>
        <div>
          <h1 className="font-serif text-xl text-[#9a4021]">Editorial Agent</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">V1.2.0-Manuscript</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-auto">
        <Link to="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg shadow-sm transition-transform group ${isActive("/") ? "bg-white dark:bg-stone-800 text-[#9a4021] dark:text-orange-400 font-bold" : "text-stone-600 dark:text-stone-400 hover:translate-x-1"}`}>
          <span className="material-symbols-outlined">folder_open</span>
          <span className="font-sans text-sm tracking-tight group-hover:text-[#9a4021]">Projects</span>
        </Link>
        <Link to="/workspace" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-transform group ${isActive("/workspace") ? "bg-white dark:bg-stone-800 text-[#9a4021] dark:text-orange-400 font-bold shadow-sm" : "text-stone-600 dark:text-stone-400 hover:translate-x-1"}`}>
          <span className="material-symbols-outlined">chat</span>
          <span className="font-sans text-sm tracking-tight group-hover:text-[#9a4021]">Chat / Code</span>
        </Link>
        <Link to="/deploy" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-transform group ${isActive("/deploy") ? "bg-[#ecebe0] text-[#9a4021] font-semibold" : "text-stone-600 dark:text-stone-400 hover:translate-x-1"}`}>
          <span className="material-symbols-outlined">rocket_launch</span>
          <span className="font-sans text-sm tracking-tight group-hover:text-[#9a4021]">Deploy</span>
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 text-stone-600 dark:text-stone-400 hover:translate-x-1 transition-transform group">
          <span className="material-symbols-outlined">insights</span>
          <span className="font-sans text-sm tracking-tight group-hover:text-[#9a4021]">Analytics</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 text-stone-600 dark:text-stone-400 hover:translate-x-1 transition-transform group">
          <span className="material-symbols-outlined">settings_accessibility</span>
          <span className="font-sans text-sm tracking-tight group-hover:text-[#9a4021]">Configure</span>
        </button>
      </div>

      <button className="mt-4 mb-8 mx-2 py-3 bg-primary text-on-primary rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all">
        <span className="material-symbols-outlined text-lg">add</span>
        New Project
      </button>

      <div className="border-t border-[#9a4021]/5 pt-4 flex flex-col gap-1">
        <button className="flex items-center gap-3 px-3 py-2 text-stone-600 dark:text-stone-400 hover:bg-white/50 transition-colors rounded-lg">
          <span className="material-symbols-outlined">help_outline</span>
          <span className="font-sans text-sm">Help</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 text-stone-600 dark:text-stone-400 hover:bg-white/50 transition-colors rounded-lg">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="font-sans text-sm">Logs</span>
        </button>

        <div className="mt-6 flex items-center gap-3 px-2 pt-2 pb-2">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30">
            <img alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO_4iblT0afMbbS3wz11fS-wLjdOvMzdM240C-xQy1vho_2UV9wPQ4echIY4Ver0VE-R0swhw9BUnviS9BU8iP3vTy02ALi6Zx0PTQ1w8ZxAJOC7nljBpPo_tt8gxFSmN1KFw6lJvKVS69JXfl8QaTuu70fEYrmNrRfc9eceelHv5QaA4Awsk7nHHUik7XyioL61HDJV4l-3WqnvMxOI7kWpSoabTwCf6MepJim1xzVHBIseeluYbqroBAOiT6YlGNm8hBr33hEmTR"/>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">Dr. Julian Thorne</p>
            <p className="text-xs text-on-surface-variant truncate">Lead Editor</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
