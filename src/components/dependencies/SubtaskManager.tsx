// <== IMPORTS ==>
import {
  ListTodo,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import {
  useSubtasks,
  useAddSubtask,
  useRemoveSubtask,
  Subtask,
} from "../../hooks/useDependencies";
import React, { useState } from "react";

// <== SUBTASK MANAGER PROPS ==>
interface SubtaskManagerProps {
  // <== TASK ID ==>
  taskId: string;
  // <== PROJECT ID ==>
  projectId?: string;
  // <== COMPACT MODE ==>
  compact?: boolean;
}

// <== STATUS ICONS ==>
const statusIcons: Record<string, React.ReactNode> = {
  // <== TO DO ICON ==>
  "to do": <Circle size={12} className="text-[var(--light-text)]" />,
  // <== IN PROGRESS ICON ==>
  "in progress": <Clock size={12} className="text-[var(--accent-color)]" />,
  // <== COMPLETED ICON ==>
  completed: <CheckCircle2 size={12} className="text-green-500" />,
};

// <== PRIORITY COLORS ==>
const priorityColors: Record<string, string> = {
  // <== LOW PRIORITY COLOR ==>
  low: "bg-green-500/20 text-green-500",
  // <== MEDIUM PRIORITY COLOR ==>
  medium: "bg-yellow-500/20 text-yellow-500",
  // <== HIGH PRIORITY COLOR ==>
  high: "bg-red-500/20 text-red-500",
};

// <== SUBTASK MANAGER COMPONENT ==>
const SubtaskManager = ({
  taskId,
  projectId,
  compact = false,
}: SubtaskManagerProps) => {
  // ADDING SUBTASK STATE
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  // EXPANDED STATE
  const [isExpanded, setIsExpanded] = useState(true);
  // NEW SUBTASK TITLE STATE
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  // NEW SUBTASK PRIORITY STATE
  const [newSubtaskPriority, setNewSubtaskPriority] = useState("medium");
  // FETCH SUBTASKS
  const { data: subtasks, isLoading } = useSubtasks(taskId);
  // ADD SUBTASK MUTATION
  const addSubtaskMutation = useAddSubtask();
  // REMOVE SUBTASK MUTATION
  const removeSubtaskMutation = useRemoveSubtask();
  // HANDLE ADD SUBTASK
  const handleAddSubtask = () => {
    // IF NEW SUBTASK TITLE IS EMPTY, RETURN
    if (!newSubtaskTitle.trim()) return;
    // ADD SUBTASK MUTATION
    addSubtaskMutation.mutate(
      {
        parentTaskId: taskId,
        title: newSubtaskTitle.trim(),
        priority: newSubtaskPriority,
        projectId,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SET NEW SUBTASK TITLE TO EMPTY STRING
          setNewSubtaskTitle("");
          // SET NEW SUBTASK PRIORITY TO MEDIUM
          setNewSubtaskPriority("medium");
          // SET ADDING SUBTASK TO FALSE
          setIsAddingSubtask(false);
        },
      }
    );
  };
  // HANDLE REMOVE SUBTASK
  const handleRemoveSubtask = (subtaskId: string) => {
    // REMOVE SUBTASK MUTATION
    removeSubtaskMutation.mutate({
      parentTaskId: taskId,
      subtaskId,
    });
  };
  // HANDLE KEY DOWN
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // IF THE KEY IS ENTER AND THE SHIFT KEY IS NOT PRESSED, PREVENT DEFAULT AND HANDLE ADD SUBTASK
    if (e.key === "Enter" && !e.shiftKey) {
      // PREVENT DEFAULT AND HANDLE ADD SUBTASK
      e.preventDefault();
      // HANDLE ADD SUBTASK
      handleAddSubtask();
    }
    // IF THE KEY IS ESCAPE, SET ADDING SUBTASK TO FALSE AND SET NEW SUBTASK TITLE TO EMPTY STRING
    if (e.key === "Escape") {
      // SET ADDING SUBTASK TO FALSE
      setIsAddingSubtask(false);
      // SET NEW SUBTASK TITLE TO EMPTY STRING
      setNewSubtaskTitle("");
    }
  };
  // CALCULATE PROGRESS
  const completedCount =
    subtasks?.filter((s) => s.status === "completed").length || 0;
  // CALCULATE TOTAL COUNT
  const totalCount = subtasks?.length || 0;
  // CALCULATE PROGRESS PERCENT
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  // LOADING STATE
  if (isLoading) {
    // RETURN LOADING STATE
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--accent-color)]" />
      </div>
    );
  }
  // COMPACT MODE
  if (compact) {
    // RETURN COMPACT MODE
    return (
      <div className="flex items-center gap-2">
        <ListTodo size={14} className="text-[var(--light-text)]" />
        <span className="text-xs text-[var(--light-text)]">
          {completedCount}/{totalCount} subtasks
        </span>
        {totalCount > 0 && (
          <div className="w-16 h-1.5 bg-[var(--hover-bg)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent-color)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    );
  }
  // RETURN SUBTASK MANAGER
  return (
    <div className="border border-[var(--border)] rounded-lg p-3">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <ListTodo size={16} className="text-[var(--accent-color)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Subtasks
          </span>
          {totalCount > 0 && (
            <span className="text-xs text-[var(--light-text)]">
              ({completedCount}/{totalCount})
            </span>
          )}
          {isExpanded ? (
            <ChevronUp size={14} className="text-[var(--light-text)]" />
          ) : (
            <ChevronDown size={14} className="text-[var(--light-text)]" />
          )}
        </button>
        {/* ADD BUTTON */}
        <button
          type="button"
          onClick={() => setIsAddingSubtask(!isAddingSubtask)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded transition"
        >
          {isAddingSubtask ? <X size={14} /> : <Plus size={14} />}
          {isAddingSubtask ? "Cancel" : "Add"}
        </button>
      </div>
      {/* PROGRESS BAR */}
      {totalCount > 0 && (
        <div className="mb-3">
          <div className="w-full h-2 bg-[var(--hover-bg)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent-color)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-[var(--light-text)] mt-1 text-right">
            {progressPercent}% complete
          </p>
        </div>
      )}
      {/* CONTENT */}
      {isExpanded && (
        <>
          {/* ADD SUBTASK FORM */}
          {isAddingSubtask && (
            <div className="mb-3 p-3 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
              {/* TITLE INPUT */}
              <div className="mb-2">
                <label className="text-xs text-[var(--light-text)] mb-1 block">
                  Subtask Title
                </label>
                <input
                  type="text"
                  placeholder="Enter subtask title..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:border-[var(--accent-color)]"
                  autoFocus
                />
              </div>
              {/* PRIORITY SELECTOR */}
              <div className="mb-3">
                <label className="text-xs text-[var(--light-text)] mb-1 block">
                  Priority
                </label>
                <div className="flex gap-2">
                  {["low", "medium", "high"].map((priority) => (
                    <button
                      type="button"
                      key={priority}
                      onClick={() => setNewSubtaskPriority(priority)}
                      className={`px-3 py-1.5 rounded-lg text-xs capitalize transition ${
                        newSubtaskPriority === priority
                          ? priorityColors[priority]
                          : "bg-[var(--hover-bg)] text-[var(--light-text)]"
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
              {/* ACTIONS */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSubtask(false);
                    setNewSubtaskTitle("");
                  }}
                  className="px-3 py-1.5 text-xs text-[var(--light-text)] hover:bg-[var(--hover-bg)] rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  disabled={
                    !newSubtaskTitle.trim() || addSubtaskMutation.isPending
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent-color)] text-white text-xs rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addSubtaskMutation.isPending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Plus size={12} />
                  )}
                  Add Subtask
                </button>
              </div>
            </div>
          )}
          {/* SUBTASKS LIST */}
          {subtasks && subtasks.length > 0 ? (
            <div className="flex flex-col gap-1">
              {subtasks.map((subtask: Subtask) => (
                <div
                  key={subtask._id}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 bg-[var(--inside-card-bg)] rounded-lg group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* STATUS ICON */}
                    {statusIcons[subtask.status] || statusIcons["to do"]}
                    {/* TASK KEY */}
                    {subtask.taskKey && (
                      <span className="text-[10px] font-mono text-[var(--light-text)] bg-[var(--hover-bg)] px-1 py-0.5 rounded shrink-0">
                        {subtask.taskKey}
                      </span>
                    )}
                    {/* SUBTASK TITLE */}
                    <span
                      className={`text-xs truncate ${
                        subtask.status === "completed"
                          ? "text-[var(--light-text)] line-through"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* PRIORITY BADGE */}
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded capitalize ${
                        priorityColors[subtask.priority] ||
                        priorityColors["medium"]
                      }`}
                    >
                      {subtask.priority}
                    </span>
                    {/* REMOVE BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(subtask._id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--hover-bg)] rounded transition"
                      title="Remove subtask"
                    >
                      <Trash2 size={12} className="text-[var(--light-text)]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isAddingSubtask && (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <ListTodo size={24} className="text-[var(--light-text)] mb-2" />
                <p className="text-xs text-[var(--light-text)]">
                  No subtasks yet
                </p>
                <p className="text-[10px] text-[var(--light-text)] mt-1">
                  Break down this task into smaller steps
                </p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default SubtaskManager;
