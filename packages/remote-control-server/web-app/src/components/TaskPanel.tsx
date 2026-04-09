import type { TaskItem } from "@/types";

interface Props {
  tasks: Map<string, TaskItem>;
  onClose: () => void;
}

export function TaskPanel({ tasks, onClose }: Props) {
  const allTasks = [...tasks.values()];
  const completed = allTasks.filter((t) => t.status === "completed").length;
  const inProgress = allTasks.filter((t) => t.status === "in_progress").length;
  const pending = allTasks.filter((t) => t.status === "pending").length;
  const pct = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;

  return (
    <div className="w-72 shrink-0 bg-bg-card border border-border-light rounded-xl shadow-md overflow-hidden animate-slide-up flex flex-col max-h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
        <span className="font-display font-semibold text-sm">Tasks</span>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary text-lg leading-none transition-colors">&times;</button>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-b border-border-light">
        <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-xs text-text-muted mt-1.5 font-mono">{completed}/{allTasks.length} completed</div>
      </div>

      {/* Stats */}
      <div className="px-4 py-2 flex gap-3 text-xs border-b border-border-light">
        {completed > 0 && <span className="text-success font-medium">{completed} done</span>}
        {inProgress > 0 && <span className="text-accent font-medium">{inProgress} active</span>}
        {pending > 0 && <span className="text-text-muted">{pending} open</span>}
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {allTasks.length === 0 ? (
          <div className="text-text-muted text-sm text-center py-6">No tasks yet</div>
        ) : (
          <div className="flex flex-col gap-1">
            {allTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: TaskItem }) {
  const icon = statusIcon(task.status);
  const isBlocked = task.blockedBy.length > 0 && task.status !== "completed";

  return (
    <div className={`flex items-start gap-2 px-2 py-1.5 rounded-md ${task.status === "completed" ? "opacity-60" : ""} ${isBlocked ? "opacity-50" : ""}`}>
      <span className={`text-sm mt-0.5 ${icon.color}`}>{icon.char}</span>
      <div className="min-w-0 flex-1">
        <div className={`text-sm leading-snug ${task.status === "completed" ? "line-through" : ""}`}>{task.subject}</div>
        {task.activeForm && task.status === "in_progress" && (
          <div className="text-xs text-accent mt-0.5">{task.activeForm}...</div>
        )}
        {isBlocked && (
          <div className="text-xs text-text-muted mt-0.5">blocked</div>
        )}
      </div>
    </div>
  );
}

function statusIcon(status: string) {
  switch (status) {
    case "completed": return { char: "\u2713", color: "text-success" };
    case "in_progress": return { char: "\u25CF", color: "text-accent" };
    default: return { char: "\u25CB", color: "text-text-muted" };
  }
}
