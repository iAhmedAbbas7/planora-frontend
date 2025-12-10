// <== IMPORTS ==>
import {
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ListTodo,
  Flag,
} from "lucide-react";
import {
  useNLToTasks,
  useSaveAITasks,
  GeneratedTask,
} from "../../../hooks/useWorkspaceAI";
import { JSX, useState, useEffect } from "react";

// <== TASK CARD COMPONENT ==>
const TaskCard = ({
  task,
  index,
  onRemove,
  onUpdatePriority,
}: {
  task: GeneratedTask;
  index: number;
  onRemove: (index: number) => void;
  onUpdatePriority: (
    index: number,
    priority: "low" | "medium" | "high"
  ) => void;
}): JSX.Element => {
  // STATE FOR DROPDOWN
  const [showDropdown, setShowDropdown] = useState(false);
  // RETURN TASK CARD
  return (
    <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg hover:border-[var(--accent-color)]/30 transition-colors">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <ListTodo
            size={14}
            className="mt-1 text-[var(--accent-color)] flex-shrink-0"
          />
          <h4 className="text-sm font-medium text-[var(--primary-text)]">
            {task.title}
          </h4>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* PRIORITY DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 hover:bg-[var(--accent-color)]/20 transition-colors"
            >
              <Flag size={10} />
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              <ChevronDown size={10} />
            </button>
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-20 py-1 min-w-[80px]">
                  {(["low", "medium", "high"] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => {
                        onUpdatePriority(index, priority);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-3 py-1.5 text-xs text-left hover:bg-[var(--hover-bg)] ${
                        task.priority === priority
                          ? "text-[var(--accent-color)]"
                          : "text-[var(--primary-text)]"
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* REMOVE BUTTON */}
          <button
            onClick={() => onRemove(index)}
            className="p-1 rounded hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--primary-text)] transition-colors"
            title="Remove task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {/* DESCRIPTION */}
      {task.description && (
        <p className="text-xs text-[var(--light-text)] line-clamp-2 ml-5">
          {task.description}
        </p>
      )}
      {/* ESTIMATED HOURS */}
      {task.estimatedHours && (
        <p className="text-xs text-[var(--light-text)] mt-1 ml-5">
          Est: {task.estimatedHours}h
        </p>
      )}
    </div>
  );
};

// <== EXAMPLE PROMPTS ==>
const EXAMPLE_PROMPTS = [
  "Add user authentication",
  "Create dashboard with charts",
  "Fix payment bug",
  "Write unit tests",
];

// <== NL TASK INPUT COMPONENT ==>
const NLTaskInput = ({
  isOpen,
  onClose,
  workspaceId,
  projectId,
  projects,
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  projectId?: string;
  projects?: Array<{ _id: string; title: string }>;
}): JSX.Element | null => {
  // STATE FOR INPUT
  const [input, setInput] = useState("");
  // STATE FOR GENERATED TASKS
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  // STATE FOR SELECTED PROJECT ID
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
  // MUTATIONS FOR NL TO TASKS AND SAVE AI TASKS
  const nlToTasks = useNLToTasks();
  // MUTATION FOR SAVE AI TASKS
  const saveAITasks = useSaveAITasks();
  // DESTRUCTURE RESET FUNCTIONS FOR NL TO TASKS AND SAVE AI TASKS
  const { reset: resetNLToTasks } = nlToTasks;
  // DESTRUCTURE RESET FUNCTION FOR SAVE AI TASKS
  const { reset: resetSaveAITasks } = saveAITasks;
  // RESET STATE ON CLOSE
  useEffect(() => {
    // IF NOT OPEN, RESET STATE
    if (!isOpen) {
      // RESET INPUT
      setInput("");
      // RESET GENERATED TASKS
      setGeneratedTasks([]);
      // RESET NL TO TASKS
      resetNLToTasks();
      // RESET SAVE AI TASKS
      resetSaveAITasks();
    }
  }, [isOpen, resetNLToTasks, resetSaveAITasks]);
  // PREVENT BODY SCROLL WHEN MODAL IS OPEN
  useEffect(() => {
    // IF OPEN, PREVENT BODY SCROLL
    if (isOpen) {
      // PREVENT BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // ALLOW BODY SCROLL
      document.body.style.overflow = "";
    }
    // CLEANUP FUNCTION
    return () => {
      // ALLOW BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) {
    // RETURN NULL
    return null;
  }
  // HANDLE GENERATE TASKS
  const handleGenerate = async () => {
    // IF INPUT IS EMPTY, RETURN
    if (!input.trim()) return;
    // GENERATE TASKS
    try {
      // GENERATE TASKS
      const result = await nlToTasks.mutateAsync({
        workspaceId,
        input: input.trim(),
        projectId: selectedProjectId || undefined,
      });
      // SET GENERATED TASKS
      setGeneratedTasks(result.tasks);
    } catch {
      // ERROR HANDLED BY MUTATION
    }
  };
  // HANDLE REMOVE TASK
  const handleRemoveTask = (index: number) => {
    // REMOVE TASK FROM GENERATED TASKS
    setGeneratedTasks((prev) => prev.filter((_, i) => i !== index));
  };
  // HANDLE UPDATE PRIORITY
  const handleUpdatePriority = (
    index: number,
    priority: "low" | "medium" | "high"
  ) => {
    // UPDATE PRIORITY OF GENERATED TASK
    setGeneratedTasks((prev) =>
      prev.map((task, i) => (i === index ? { ...task, priority } : task))
    );
  };
  // HANDLE SAVE TASKS
  const handleSaveTasks = async () => {
    // IF NO PROJECT SELECTED, RETURN
    if (!selectedProjectId) return;
    // IF NO TASKS, RETURN
    if (generatedTasks.length === 0) return;
    // SAVE TASKS
    try {
      // SAVE TASKS
      await saveAITasks.mutateAsync({
        workspaceId,
        projectId: selectedProjectId,
        tasks: generatedTasks,
      });
      // CLOSE MODAL
      onClose();
    } catch {
      // ERROR HANDLED BY MUTATION
    }
  };
  // HANDLE EXAMPLE PROMPT
  const handleExamplePrompt = (prompt: string) => {
    // SET INPUT TO EXAMPLE PROMPT
    setInput(prompt);
  };
  // RETURN NL TASK INPUT MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* MODAL */}
      <div className="relative bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
              <Sparkles size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--primary-text)]">
                Create Tasks from Text
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                Describe tasks in natural language
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--primary-text)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {/* CONTENT */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* INPUT SECTION */}
          {generatedTasks.length === 0 ? (
            <div className="space-y-4">
              {/* TEXT INPUT */}
              <div>
                <label className="block text-sm font-medium text-[var(--primary-text)] mb-2">
                  What do you want to accomplish?
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="E.g., Add user authentication with email verification and password reset..."
                  className="w-full h-28 px-3 py-2 text-sm bg-transparent border border-[var(--border)] rounded-lg text-[var(--primary-text)] placeholder:text-[var(--light-text)] focus:outline-none focus:border-[var(--accent-color)] resize-none"
                  disabled={nlToTasks.isPending}
                />
              </div>
              {/* PROJECT SELECT */}
              {projects && projects.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[var(--primary-text)] mb-2">
                    Project (optional)
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border)] rounded-lg text-[var(--primary-text)] focus:outline-none focus:border-[var(--accent-color)]"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* EXAMPLE PROMPTS */}
              <div>
                <p className="text-xs text-[var(--light-text)] mb-2">
                  Try an example:
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleExamplePrompt(prompt)}
                      className="px-2.5 py-1 text-xs bg-[var(--hover-bg)] text-[var(--light-text)] rounded-full hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)] transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
              {/* ERROR MESSAGE */}
              {nlToTasks.isError && (
                <div className="flex items-center gap-2 p-3 bg-[var(--hover-bg)] border border-[var(--border)] rounded-lg">
                  <AlertTriangle
                    size={16}
                    className="text-[var(--accent-color)]"
                  />
                  <p className="text-sm text-[var(--primary-text)]">
                    {nlToTasks.error?.response?.data?.message ||
                      "Failed to generate tasks. Please try again."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* GENERATED TASKS SECTION */
            <div className="space-y-4">
              {/* SUCCESS MESSAGE */}
              <div className="flex items-center gap-2 p-3 bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/20 rounded-lg">
                <CheckCircle2
                  size={16}
                  className="text-[var(--accent-color)]"
                />
                <p className="text-sm text-[var(--primary-text)]">
                  Generated {generatedTasks.length} tasks from your description
                </p>
              </div>
              {/* PROJECT SELECT (IF NOT SELECTED) */}
              {!selectedProjectId && projects && projects.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[var(--primary-text)] mb-2">
                    Select a project to save tasks
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border)] rounded-lg text-[var(--primary-text)] focus:outline-none focus:border-[var(--accent-color)]"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* TASK LIST */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-[var(--primary-text)]">
                    Generated Tasks
                  </h3>
                  <span className="text-xs text-[var(--light-text)]">
                    {generatedTasks.length} tasks
                  </span>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {generatedTasks.map((task, index) => (
                    <TaskCard
                      key={index}
                      task={task}
                      index={index}
                      onRemove={handleRemoveTask}
                      onUpdatePriority={handleUpdatePriority}
                    />
                  ))}
                </div>
              </div>
              {/* NO PROJECT WARNING */}
              {!selectedProjectId && projects && projects.length > 0 && (
                <p className="text-xs text-[var(--accent-color)] text-center">
                  Please select a project to save tasks
                </p>
              )}
              {/* ERROR MESSAGE */}
              {saveAITasks.isError && (
                <div className="flex items-center gap-2 p-3 bg-[var(--hover-bg)] border border-[var(--border)] rounded-lg">
                  <AlertTriangle
                    size={16}
                    className="text-[var(--accent-color)]"
                  />
                  <p className="text-sm text-[var(--primary-text)]">
                    {saveAITasks.error?.response?.data?.message ||
                      "Failed to save tasks. Please try again."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--border)] bg-[var(--hover-bg)]/30">
          <button
            type="button"
            onClick={onClose}
            disabled={nlToTasks.isPending || saveAITasks.isPending}
            className="px-4 py-2 text-sm font-medium text-[var(--primary-text)] border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          {generatedTasks.length === 0 ? (
            <button
              onClick={handleGenerate}
              disabled={!input.trim() || nlToTasks.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--accent-color)] rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {nlToTasks.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Tasks
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGeneratedTasks([])}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--primary-text)] border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
              >
                <Plus size={16} />
                New
              </button>
              <button
                onClick={handleSaveTasks}
                disabled={
                  !selectedProjectId ||
                  generatedTasks.length === 0 ||
                  saveAITasks.isPending
                }
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--accent-color)] rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveAITasks.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Tasks
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NLTaskInput;
