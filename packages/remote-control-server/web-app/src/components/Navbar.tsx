import { Link } from "react-router-dom";

interface NavbarProps {
  theme: string;
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-bg-card border-b border-border-default shadow-sm">
      <div className="max-w-[1200px] mx-auto px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-display font-semibold text-text-primary hover:opacity-70 transition-opacity">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 1L12.2 7.8L19 10L12.2 12.2L10 19L7.8 12.2L1 10L7.8 7.8L10 1Z" fill="#D97757" />
          </svg>
          Claude Code
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-text-secondary text-sm font-medium px-3 py-1.5 rounded-md hover:text-text-primary hover:bg-bg-input transition-all">
            Dashboard
          </Link>
          <button
            onClick={onToggleTheme}
            className="text-text-secondary text-sm px-3 py-1.5 rounded-md hover:text-text-primary hover:bg-bg-input transition-all"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1A.5.5 0 018 1zm0 11a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1A.5.5 0 018 12zm7-4a.5.5 0 01-.5.5h-1a.5.5 0 010-1h1A.5.5 0 0115 8zM3 8a.5.5 0 01-.5.5h-1a.5.5 0 010-1h1A.5.5 0 013 8zm9.95-3.536a.5.5 0 010 .708l-.707.707a.5.5 0 11-.707-.707l.707-.707a.5.5 0 01.707 0zM5.464 11.535a.5.5 0 010 .708l-.707.707a.5.5 0 01-.707-.707l.707-.707a.5.5 0 01.707 0zm7.072 0a.5.5 0 01-.707 0l-.707-.707a.5.5 0 01.707-.707l.707.707a.5.5 0 010 .707zM4.757 5.172a.5.5 0 01-.707 0l-.707-.707a.5.5 0 11.707-.707l.707.707a.5.5 0 010 .707zM8 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" fill="currentColor"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 1a.5.5 0 00-.482.638A5.5 5.5 0 009.862 10.48.5.5 0 0010.5 10a5.5 5.5 0 01-4.5-9z" fill="currentColor"/></svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
