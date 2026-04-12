import { Link, useLocation } from "react-router-dom";

export function TopNav() {
  const location = useLocation();

  return (
    <nav className="flex justify-between items-center px-8 py-3 w-full border-b border-[#9a4021]/10 bg-[#f5f4ed]/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-medium font-serif italic text-[#9a4021] dark:text-orange-500">The Intellectual Editorial</span>
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className={`font-serif transition-colors ${location.pathname === "/" ? "text-[#9a4021] dark:text-orange-400 font-semibold border-b-2 border-[#9a4021]" : "text-stone-500 hover:text-[#9a4021]"}`}>Dashboard</Link>
          <Link to="/workspace" className={`font-serif transition-colors ${location.pathname === "/workspace" ? "text-[#9a4021] dark:text-orange-400 font-semibold border-b-2 border-[#9a4021]" : "text-stone-500 hover:text-[#9a4021]"}`}>Workspace</Link>
          <a href="#" className="text-stone-500 hover:text-[#9a4021] transition-colors font-serif">Performance</a>
          <a href="#" className="text-stone-500 hover:text-[#9a4021] transition-colors font-serif">Settings</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative bg-surface-container-low px-4 py-1.5 rounded-full flex items-center gap-2 border border-outline-variant/15 hidden lg:flex">
          <span className="material-symbols-outlined text-sm text-on-surface-variant">search</span>
          <input className="bg-transparent border-none outline-none focus:ring-0 text-sm w-48 placeholder:text-on-surface-variant/50" placeholder="Search manuscript..." type="text"/>
        </div>
        <button className="p-2 text-stone-500 hover:bg-[#f5f4ed] rounded-full transition-all">
          <span className="material-symbols-outlined">terminal</span>
        </button>
        <button className="p-2 text-stone-500 hover:bg-[#f5f4ed] rounded-full transition-all">
          <span className="material-symbols-outlined">code</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-[#9a4021] rounded-full transition-all">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </nav>
  );
}
