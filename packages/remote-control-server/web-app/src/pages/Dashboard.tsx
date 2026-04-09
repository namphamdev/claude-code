import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSessions, fetchEnvironments, createSession } from "@/lib/api";
import type { SessionSummary, Environment } from "@/types";

export function Dashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEnvId, setNewEnvId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  async function load() {
    try {
      const [s, e] = await Promise.all([fetchSessions(), fetchEnvironments()]);
      setSessions((s || []).sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0)));
      setEnvironments(e || []);
    } catch {
      // silent
    }
  }

  async function handleCreate() {
    setError("");
    try {
      const body: { title?: string; environment_id?: string } = {};
      if (newTitle.trim()) body.title = newTitle.trim();
      if (newEnvId) body.environment_id = newEnvId;
      const session = await createSession(body);
      setShowDialog(false);
      navigate(`/${session.id}`);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="max-w-[880px] mx-auto px-8 py-10 animate-fade-in">
      {/* Environments */}
      <section className="mb-10">
        <h2 className="font-display font-semibold text-lg mb-4 tracking-tight">Environments</h2>
        {environments.length === 0 ? (
          <div className="text-text-muted text-sm text-center py-10 bg-bg-card rounded-xl border-2 border-dashed border-border-default">
            No active environments
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {environments.map((e) => (
              <div key={e.id} className="bg-bg-card rounded-xl px-6 py-4 border border-border-light shadow-sm hover:shadow-md hover:border-border-default transition-all grid grid-cols-[1fr_auto] items-center gap-2">
                <div>
                  <div className="font-semibold text-[0.95rem]">{e.machine_name || e.id}</div>
                  <div className="font-mono text-xs text-text-secondary">{e.directory}</div>
                </div>
                <div className="text-right">
                  <StatusBadge status={e.status} />
                  {e.branch && <div className="text-xs text-text-muted mt-1">{e.branch}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sessions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg tracking-tight">Sessions</h2>
          <button onClick={() => setShowDialog(true)} className="bg-accent text-text-light px-5 py-2 rounded-lg text-sm font-semibold hover:bg-accent-hover shadow-sm hover:shadow-md hover:-translate-y-px active:translate-y-0 transition-all">
            + New Session
          </button>
        </div>
        {sessions.length === 0 ? (
          <div className="text-text-muted text-sm text-center py-10 bg-bg-card rounded-xl border-2 border-dashed border-border-default">
            No sessions
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => navigate(`/${s.id}`)}
                className="bg-bg-card rounded-xl px-6 py-4 border border-border-light shadow-sm hover:shadow-md hover:border-accent hover:-translate-y-px active:translate-y-0 cursor-pointer transition-all grid grid-cols-[1fr_auto_auto] items-center gap-4"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-[0.95rem] truncate">{s.title || s.id}</div>
                  <div className="font-mono text-[0.72rem] text-text-muted">{s.id}</div>
                </div>
                <StatusBadge status={s.status} />
                <span className="text-xs text-text-secondary font-mono">{formatTime(s.created_at || s.updated_at)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* New Session Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[200] animate-fade-in" onClick={() => setShowDialog(false)}>
          <div className="bg-bg-card rounded-2xl shadow-lg p-8 w-full max-w-[440px] border border-border-light animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-semibold text-lg mb-5">New Session</h3>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Title</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="My session"
              className="w-full px-3.5 py-2.5 border-[1.5px] border-border-default rounded-lg bg-bg-input text-sm text-text-primary outline-none focus:border-accent focus:bg-bg-input-focus focus:ring-2 focus:ring-accent/10 transition-all"
            />
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 mt-4">Environment</label>
            <select
              value={newEnvId}
              onChange={(e) => setNewEnvId(e.target.value)}
              className="w-full px-3.5 py-2.5 border-[1.5px] border-border-default rounded-lg bg-bg-input text-sm text-text-primary outline-none focus:border-accent focus:bg-bg-input-focus focus:ring-2 focus:ring-accent/10 transition-all"
            >
              <option value="">-- None --</option>
              {environments.map((e) => (
                <option key={e.id} value={e.id}>{e.machine_name || e.id} ({e.branch || "no branch"})</option>
              ))}
            </select>
            {error && <div className="text-danger text-sm mt-2.5 px-3 py-2 bg-danger-bg rounded-md">{error}</div>}
            <div className="flex gap-2.5 justify-end mt-6">
              <button onClick={() => setShowDialog(false)} className="px-4 py-2 border-[1.5px] border-border-default rounded-lg text-sm font-medium hover:bg-bg-input transition-all">Cancel</button>
              <button onClick={handleCreate} className="bg-accent text-text-light px-5 py-2 rounded-lg text-sm font-semibold hover:bg-accent-hover transition-all">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-success-bg text-success",
    running: "bg-success-bg text-success",
    idle: "bg-warning-bg text-warning",
    requires_action: "bg-orange-bg text-orange",
    error: "bg-danger-bg text-danger",
    archived: "bg-border-light text-text-secondary",
  };
  const cls = colors[status] || "bg-border-light text-text-muted";
  return (
    <span className={`inline-flex items-center text-[0.72rem] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  );
}

function formatTime(ts: number): string {
  if (!ts) return "";
  const d = new Date(typeof ts === "number" && ts < 1e12 ? ts * 1000 : ts);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
