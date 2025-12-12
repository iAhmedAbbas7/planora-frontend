// <== IMPORTS ==>
import {
  Link2,
  Link2Off,
  Plus,
  X,
  ChevronDown,
  AlertTriangle,
  GitBranch,
  Loader2,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import {
  useTaskDependencies,
  useAddDependency,
  useRemoveDependency,
  DependencyType,
  DependencyTask,
} from "../../hooks/useDependencies";
import { useTasks, Task } from "../../hooks/useTasks";
import React, { useState, useRef, useEffect } from "react";

// <== DEPENDENCY MANAGER PROPS ==>
interface DependencyManagerProps {
  // <== TASK ID ==>
  taskId: string;
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

// <== DEPENDENCY TYPE LABELS ==>
const dependencyTypeLabels: Record<DependencyType, string> = {
  // <== BLOCKED BY LABEL ==>
  blocked_by: "Blocked by",
  // <== BLOCKS LABEL ==>
  blocks: "Blocks",
  // <== RELATES TO LABEL ==>
  relates_to: "Related to",
};

// <== DEPENDENCY TYPE COLORS ==>
const dependencyTypeColors: Record<DependencyType, string> = {
  // <== BLOCKED BY COLOR ==>
  blocked_by: "text-red-500 bg-red-500/10",
  // <== BLOCKS COLOR ==>
  blocks: "text-orange-500 bg-orange-500/10",
  // <== RELATES TO COLOR ==>
  relates_to: "text-blue-500 bg-blue-500/10",
};

// <== DEPENDENCY MANAGER COMPONENT ==>
const DependencyManager = ({
  taskId,
  compact = false,
}: DependencyManagerProps) => {
  // ADDING DEPENDENCY STATE
  const [isAddingDependency, setIsAddingDependency] = useState(false);
  // SELECTED TYPE STATE
  const [selectedType, setSelectedType] =
    useState<DependencyType>("blocked_by");
  // TYPE DROPDOWN OPEN STATE
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  // TASK DROPDOWN OPEN STATE
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
  // SEARCH QUERY STATE
  const [searchQuery, setSearchQuery] = useState("");
  // TYPE DROPDOWN REF
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  // TASK DROPDOWN REF
  const taskDropdownRef = useRef<HTMLDivElement>(null);
  // FETCH DEPENDENCIES
  const { data: dependencies, isLoading } = useTaskDependencies(taskId);
  // FETCH ALL TASKS FOR SELECTION
  const { tasks } = useTasks();
  // ADD DEPENDENCY MUTATION
  const addDependencyMutation = useAddDependency();
  // REMOVE DEPENDENCY MUTATION
  const removeDependencyMutation = useRemoveDependency();
  // FILTER TASKS BY SEARCH QUERY
  const filteredTasks = tasks.filter((task: Task) => {
    // IF TASK ID IS THE SAME AS THE CURRENT TASK, EXCLUDE IT
    if (task._id === taskId) return false;
    // GET ALL LINKED TASK IDs
    const allLinkedIds = [
      ...(dependencies?.blockers?.map((d) => d._id) || []),
      ...(dependencies?.blocking?.map((d) => d._id) || []),
      ...(dependencies?.related?.map((d) => d._id) || []),
    ];
    // IF TASK ID IS IN THE LIST OF LINKED TASK IDs, EXCLUDE IT
    if (allLinkedIds.includes(task._id)) return false;
    // IF SEARCH QUERY IS PROVIDED, FILTER BY SEARCH QUERY
    if (searchQuery) {
      // IF TASK TITLE OR TASK KEY INCLUDES THE SEARCH QUERY, INCLUDE IT
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.taskKey?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // IF SEARCH QUERY IS NOT PROVIDED, INCLUDE IT
    return true;
  });

  // HANDLE CLICK OUTSIDE
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // IF TYPE DROPDOWN REF IS PROVIDED AND THE CLICK IS NOT INSIDE THE TYPE DROPDOWN, CLOSE THE TYPE DROPDOWN
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        // CLOSE THE TYPE DROPDOWN
        setIsTypeDropdownOpen(false);
      }
      // IF TASK DROPDOWN REF IS PROVIDED AND THE CLICK IS NOT INSIDE THE TASK DROPDOWN, CLOSE THE TASK DROPDOWN
      if (
        taskDropdownRef.current &&
        !taskDropdownRef.current.contains(event.target as Node)
      ) {
        // CLOSE THE TASK DROPDOWN
        setIsTaskDropdownOpen(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // CLEANUP: REMOVE EVENT LISTENER ON UNMOUNT
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // HANDLE ADD DEPENDENCY
  const handleAddDependency = (dependencyTaskId: string) => {
    // ADD DEPENDENCY MUTATION
    addDependencyMutation.mutate(
      {
        taskId,
        dependencyTaskId,
        type: selectedType,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SET ADDING DEPENDENCY TO FALSE
          setIsAddingDependency(false);
          // SET SEARCH QUERY TO EMPTY STRING
          setSearchQuery("");
          // SET TASK DROPDOWN OPEN TO FALSE
          setIsTaskDropdownOpen(false);
        },
      }
    );
  };
  // HANDLE REMOVE DEPENDENCY
  const handleRemoveDependency = (dependencyId: string) => {
    // REMOVE DEPENDENCY MUTATION
    removeDependencyMutation.mutate({
      taskId,
      dependencyId,
    });
  };
  // RENDER DEPENDENCY LIST
  const renderDependencyList = (
    deps: DependencyTask[],
    type: DependencyType
  ) => {
    // IF NO DEPENDENCIES, RETURN NULL
    if (!deps?.length) return null;
    // RETURN DEPENDENCY LIST
    return (
      <div className="mb-3">
        {/* SECTION HEADER */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${dependencyTypeColors[type]}`}
          >
            {dependencyTypeLabels[type]}
          </span>
          <span className="text-xs text-[var(--light-text)]">
            ({deps.length})
          </span>
        </div>
        {/* DEPENDENCY ITEMS */}
        <div className="flex flex-col gap-1">
          {deps.map((dep) => (
            <div
              key={dep.dependencyId || dep._id}
              className="flex items-center justify-between gap-2 px-2 py-1.5 bg-[var(--inside-card-bg)] rounded-lg group"
            >
              <div className="flex items-center gap-2 min-w-0">
                {/* STATUS ICON */}
                {statusIcons[dep.status] || statusIcons["to do"]}
                {/* TASK KEY */}
                {dep.taskKey && (
                  <span className="text-[10px] font-mono text-[var(--light-text)] bg-[var(--hover-bg)] px-1 py-0.5 rounded shrink-0">
                    {dep.taskKey}
                  </span>
                )}
                {/* TASK TITLE */}
                <span className="text-xs text-[var(--text-primary)] truncate">
                  {dep.title}
                </span>
              </div>
              {/* REMOVE BUTTON */}
              <button
                type="button"
                onClick={() =>
                  handleRemoveDependency(dep.dependencyId || dep._id)
                }
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--hover-bg)] rounded transition"
                title="Remove dependency"
              >
                <X size={12} className="text-[var(--light-text)]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
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
    // CALCULATE TOTAL DEPENDENCIES
    const totalDependencies =
      (dependencies?.blockers?.length || 0) +
      (dependencies?.blocking?.length || 0) +
      (dependencies?.related?.length || 0);
    // RETURN COMPACT MODE
    return (
      <div className="flex items-center gap-2">
        <GitBranch size={14} className="text-[var(--light-text)]" />
        <span className="text-xs text-[var(--light-text)]">
          {totalDependencies} dependencies
        </span>
        {dependencies?.blockers?.length ? (
          <AlertTriangle size={12} className="text-red-500" />
        ) : null}
      </div>
    );
  }
  // RETURN DEPENDENCY MANAGER
  return (
    <div className="border border-[var(--border)] rounded-lg p-3">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Link2 size={16} className="text-[var(--accent-color)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Dependencies
          </span>
        </div>
        {/* ADD BUTTON */}
        <button
          type="button"
          onClick={() => setIsAddingDependency(!isAddingDependency)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded transition"
        >
          {isAddingDependency ? <X size={14} /> : <Plus size={14} />}
          {isAddingDependency ? "Cancel" : "Add"}
        </button>
      </div>
      {/* ADD DEPENDENCY FORM */}
      {isAddingDependency && (
        <div className="mb-3 p-3 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
          {/* TYPE SELECTOR */}
          <div className="mb-2">
            <label className="text-xs text-[var(--light-text)] mb-1 block">
              Dependency Type
            </label>
            <div ref={typeDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] hover:border-[var(--accent-color)] transition"
              >
                <span className={dependencyTypeColors[selectedType]}>
                  {dependencyTypeLabels[selectedType]}
                </span>
                <ChevronDown size={14} />
              </button>
              {isTypeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10">
                  {(Object.keys(dependencyTypeLabels) as DependencyType[]).map(
                    (type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => {
                          setSelectedType(type);
                          setIsTypeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--hover-bg)] transition ${
                          selectedType === type ? "bg-[var(--hover-bg)]" : ""
                        }`}
                      >
                        <span className={dependencyTypeColors[type]}>
                          {dependencyTypeLabels[type]}
                        </span>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
          {/* TASK SELECTOR */}
          <div>
            <label className="text-xs text-[var(--light-text)] mb-1 block">
              Select Task
            </label>
            <div ref={taskDropdownRef} className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsTaskDropdownOpen(true)}
                className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:border-[var(--accent-color)]"
              />
              {isTaskDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
                  {filteredTasks.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-[var(--light-text)]">
                      No tasks found
                    </div>
                  ) : (
                    filteredTasks.slice(0, 10).map((task: Task) => (
                      <button
                        type="button"
                        key={task._id}
                        onClick={() => handleAddDependency(task._id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--hover-bg)] transition"
                        disabled={addDependencyMutation.isPending}
                      >
                        {statusIcons[task.status] || statusIcons["to do"]}
                        {task.taskKey && (
                          <span className="font-mono text-[var(--light-text)] bg-[var(--hover-bg)] px-1 py-0.5 rounded text-[10px]">
                            {task.taskKey}
                          </span>
                        )}
                        <span className="truncate text-[var(--text-primary)]">
                          {task.title}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* IF THERE ARE ANY DEPENDENCIES, RENDER THE DEPENDENCY LIST */}
      {dependencies?.blockers?.length ||
      dependencies?.blocking?.length ||
      dependencies?.related?.length ? (
        <div>
          {renderDependencyList(dependencies?.blockers || [], "blocked_by")}
          {renderDependencyList(dependencies?.blocking || [], "blocks")}
          {renderDependencyList(dependencies?.related || [], "relates_to")}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <Link2Off size={24} className="text-[var(--light-text)] mb-2" />
          <p className="text-xs text-[var(--light-text)]">
            No dependencies yet
          </p>
          <p className="text-[10px] text-[var(--light-text)] mt-1">
            Add blockers or related tasks
          </p>
        </div>
      )}
    </div>
  );
};

export default DependencyManager;
