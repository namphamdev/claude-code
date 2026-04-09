import { Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { Dashboard } from "@/pages/Dashboard";
import { Session } from "@/pages/Session";
import { Navbar } from "@/components/Navbar";

export function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar theme={theme} onToggleTheme={toggle} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/:sessionId" element={<Session />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
