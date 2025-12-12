// <== IMPORTS ==>
import {
  Plus,
  X,
  ClipboardList,
  Flag,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  Edit,
  Trash2,
  CircleDot,
  Play,
  Square,
  Clock,
  Check,
} from "lucide-react";
import {
  useActiveTimer,
  useStartTimer,
  useStopTimer,
  formatElapsedTime,
} from "../../hooks/useTimeTracking";
import AddNewTask from "./AddNewTask";
import type { Task } from "../../types/task";
import { TimeLogModal } from "../time-tracking";
import { useEffect, useState, JSX, Dispatch, SetStateAction } from "react";

// <== BOARD VIEW PROPS TYPE INTERFACE ==>
type Props = {
  // <== TASKS ==>
  tasks: Task[];
  // <== FILTERED TASKS (FROM MAIN SEARCH) ==>
  filteredTasks: Task[];
  // <== SEARCH TERM (FROM MAIN SEARCH) ==>
  searchTerm: string;
  // <== LOADING ==>
  loading: boolean;
  // <== HAS LOADED ==>
  hasLoaded: boolean;
  // <== SET TASKS FUNCTION ==>
  setTasks: Dispatch<SetStateAction<Task[]>>;
  // <== ON TASK DELETED FUNCTION ==>
  onTaskDeleted?: (taskId: string) => void;
  // <== ON TASK EDITED FUNCTION ==>
  onTaskEdited?: (taskId: string) => void;
  // <== ON BULK DELETE FUNCTION ==>
  onBulkDelete?: (taskIds: string[]) => void;
  // <== PARENT MODAL OPEN ==>
  parentModalOpen?: boolean;
};

// <== BOARD VIEW COMPONENT ==>
const BoardView = ({
  tasks,
  filteredTasks,
  searchTerm,
  loading,
  hasLoaded,
  setTasks,
  onTaskDeleted,
  onTaskEdited,
  onBulkDelete,
}: Props): JSX.Element => {
  // SELECTED ITEMS STATE
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // EXPANDED TASKS STATE
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  // SECTION SEARCH TERMS STATE
  const [sectionSearchTerms, setSectionSearchTerms] = useState<{
    [key: string]: string;
  }>({
    "to do": "",
    "in progress": "",
    completed: "",
  });
  // MODAL OPEN STATE
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // TASK TO EDIT STATE
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  // COLUMN STATUS FOR NEW TASK STATE
  const [newTaskStatus, setNewTaskStatus] = useState<Task["status"] | null>(
    null
  );
  // TIME LOG MODAL STATE
  const [timeLogTask, setTimeLogTask] = useState<{
    id: string;
    title: string;
  } | null>(null);
  // TIME TRACKING HOOKS
  const { data: activeTimer } = useActiveTimer();
  const startTimer = useStartTimer();
  const stopTimer = useStopTimer();
  // PREVENT BACKGROUND SCROLLING WHEN TASKS ARE SELECTED
  useEffect(() => {
    // CHECK IF SELECTED ITEMS ARE GREATER THAN 0
    if (selectedItems.length > 0) {
      // DISABLE BODY SCROLLING
      document.body.style.overflow = "hidden";
    } else {
      // ENABLE BODY SCROLLING
      document.body.style.overflow = "unset";
    }
    // RETURN FROM THE EFFECT
    return () => {
      // ENABLE BODY SCROLLING
      document.body.style.overflow = "unset";
    };
  }, [selectedItems.length]);
  // HANDLE CANCEL FUNCTION
  const handleCancel = (): void => {
    // CLEAR SELECTED ITEMS
    setSelectedItems([]);
  };
  // TOGGLE TASK EXPAND FUNCTION
  const toggleTaskExpand = (taskId: string, e?: React.MouseEvent): void => {
    // STOP PROPAGATION IF EVENT EXISTS
    if (e) {
      e.stopPropagation();
    }
    // SET EXPANDED TASKS
    setExpandedTasks((prev) => {
      // CREATE NEW SET
      const newSet = new Set(prev);
      // CHECK IF TASK IS EXPANDED
      if (newSet.has(taskId)) {
        // DELETE TASK FROM SET
        newSet.delete(taskId);
      } else {
        // ADD TASK TO SET
        newSet.add(taskId);
      }
      return newSet;
    });
  };
  // PREVENT BACKGROUND SCROLLING WHEN MODAL IS OPEN
  useEffect(() => {
    if (isOpen) {
      // SAVE ORIGINAL OVERFLOW STYLE
      const originalOverflow = document.body.style.overflow;
      // DISABLE BODY SCROLLING
      document.body.style.overflow = "hidden";
      // CLEANUP: RESTORE ORIGINAL OVERFLOW ON UNMOUNT OR WHEN MODAL CLOSES
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);
  // COLUMNS CONFIGURATION
  const columns = [
    {
      id: "to do",
      title: "To Do",
      color: "border-l-violet-500",
      dot: "bg-violet-500",
    },
    {
      id: "in progress",
      title: "In Progress",
      color: "border-l-yellow-500",
      dot: "bg-yellow-500",
    },
    {
      id: "completed",
      title: "Completed",
      color: "border-l-green-500",
      dot: "bg-green-500",
    },
  ];
  // FILTER TASKS BY SECTION SEARCH TERM
  const filterTasksBySectionSearch = (
    sectionTasks: Task[],
    searchTerm: string
  ): Task[] => {
    // CHECK IF SEARCH TERM IS EMPTY
    if (!searchTerm.trim()) return sectionTasks;
    // FILTER TASKS BY SEARCH TERM
    return sectionTasks.filter((task) =>
      [task.title, task.description]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  };
  // UPDATE SECTION SEARCH TERM FUNCTION
  const updateSectionSearchTerm = (sectionId: string, term: string): void => {
    // UPDATE SECTION SEARCH TERMS
    setSectionSearchTerms((prev) => ({
      ...prev,
      [sectionId]: term,
    }));
  };
  // SHOW LOADING STATE IF LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--primary-text)]">Loading tasks...</p>
      </div>
    );
  }
  // CHECK IF MAIN SEARCH IS ACTIVE
  const isMainSearchActive = searchTerm.trim() !== "";
  // RETURNING THE BOARD VIEW COMPONENT
  return (
    <>
      {/* CHECK IF MAIN SEARCH IS ACTIVE */}
      {isMainSearchActive ? (
        // SEARCH RESULTS SECTION
        <div className="w-full">
          <div className="bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] rounded-xl shadow-sm p-4 sm:p-5 flex flex-col border border-[var(--border)] h-full">
            {/* SEARCH RESULTS HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Search
                  size={16}
                  className="text-[var(--accent-color)] flex-shrink-0"
                />
                <h2 className="font-semibold text-[var(--text-primary)]">
                  Search Results
                </h2>
                {filteredTasks.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative">
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: `var(--accent-color)`,
                        opacity: 0.15,
                      }}
                    ></span>
                    <span
                      className="relative"
                      style={{ color: `var(--accent-color)` }}
                    >
                      {filteredTasks.length}
                    </span>
                  </span>
                )}
              </div>
              {/* SELECT ALL CHECKBOX */}
              {filteredTasks.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-[var(--accent-color)] cursor-pointer"
                    checked={
                      filteredTasks.length > 0 &&
                      filteredTasks.every((task) =>
                        selectedItems.includes(task._id)
                      )
                    }
                    onChange={(e) => {
                      // GET CHECKED STATE
                      const isChecked = e.target.checked;
                      // GET TASK IDS FROM SEARCH RESULTS
                      const taskIds = filteredTasks.map((task) => task._id);
                      // UPDATE SELECTED ITEMS
                      setSelectedItems((prev) =>
                        isChecked
                          ? Array.from(new Set([...prev, ...taskIds]))
                          : prev.filter((id) => !taskIds.includes(id))
                      );
                    }}
                  />
                </div>
              )}
            </div>
            {/* SEARCH RESULTS CONTENT */}
            <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-[100px] max-h-[600px] overflow-y-auto relative z-0">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-[var(--inside-card-bg)] rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition-all hover:bg-[var(--hover-bg)]"
                  >
                    {/* Render task card - same as in columns */}
                    {expandedTasks.has(task._id) ? (
                      // EXPANDED STATE - same structure as before
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(task._id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSelectedItems((prev) =>
                                  prev.includes(task._id)
                                    ? prev.filter((id) => id !== task._id)
                                    : [...prev, task._id]
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="accent-[var(--accent-color)] flex-shrink-0 cursor-pointer"
                            />
                            <p className="text-sm font-medium text-[var(--text-primary)] flex-1">
                              {task.title}
                            </p>
                            <button
                              onClick={(e) => toggleTaskExpand(task._id, e)}
                              className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)] flex-shrink-0 cursor-pointer"
                              title="Collapse"
                            >
                              <ChevronUp size={18} />
                            </button>
                          </div>
                        </div>
                        <section className="flex flex-col gap-3 text-sm">
                          {task.description && (
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <p className="text-sm text-[var(--light-text)] leading-relaxed">
                                  {task.description}
                                </p>
                              </div>
                            </div>
                          )}
                          {/* STATUS */}
                          <div className="flex items-center gap-3">
                            <CircleDot
                              size={16}
                              className="text-[var(--accent-color)] flex-shrink-0"
                            />
                            <div className="flex items-center gap-3 flex-1 justify-between">
                              <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                                Status
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold relative capitalize">
                                <span
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    backgroundColor: `var(--accent-color)`,
                                    opacity: 0.15,
                                  }}
                                ></span>
                                <span
                                  className="relative"
                                  style={{
                                    color: `var(--accent-color)`,
                                  }}
                                >
                                  {task.status || "N/A"}
                                </span>
                              </span>
                            </div>
                          </div>
                          {task.priority && (
                            <div className="flex items-center gap-3">
                              <Flag
                                size={16}
                                className="text-[var(--accent-color)] flex-shrink-0"
                              />
                              <div className="flex items-center gap-3 flex-1 justify-between">
                                <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                                  Priority
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold relative">
                                  <span
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                      backgroundColor: `var(--accent-color)`,
                                      opacity: 0.15,
                                    }}
                                  ></span>
                                  <span
                                    className="relative"
                                    style={{
                                      color: `var(--accent-color)`,
                                    }}
                                  >
                                    {task.priority.charAt(0).toUpperCase() +
                                      task.priority.slice(1)}
                                  </span>
                                </span>
                              </div>
                            </div>
                          )}
                          {task.dueDate && (
                            <div className="flex items-center gap-3">
                              <Calendar
                                size={16}
                                className="text-[var(--accent-color)] flex-shrink-0"
                              />
                              <div className="flex items-center gap-3 flex-1 justify-between">
                                <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                                  Due Date
                                </span>
                                <span className="text-sm text-[var(--text-primary)]">
                                  {new Date(task.dueDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                          )}
                        </section>
                        {/* ACTION BUTTONS */}
                        <div className="flex items-center gap-2 pt-2 mt-3 border-t border-[var(--border)]">
                          {/* TIMER BUTTON */}
                          {activeTimer?.taskId === task._id ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                stopTimer.mutate({ taskId: task._id });
                              }}
                              disabled={stopTimer.isPending}
                              className="text-white bg-[var(--accent-color)] transition-colors p-1.5 rounded-md cursor-pointer disabled:opacity-50 flex items-center gap-1"
                              title="Stop Timer"
                            >
                              <Square size={14} />
                              <span className="text-xs font-mono">
                                {formatElapsedTime(activeTimer.startedAt)}
                              </span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startTimer.mutate({ taskId: task._id });
                              }}
                              disabled={startTimer.isPending || !!activeTimer}
                              className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              title={
                                activeTimer
                                  ? "Stop current timer first"
                                  : "Start Timer"
                              }
                            >
                              <Play size={18} />
                            </button>
                          )}
                          {/* LOG TIME BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTimeLogTask({
                                id: task._id,
                                title: task.title,
                              });
                            }}
                            className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                            title="Log Time"
                          >
                            <Clock size={18} />
                          </button>
                          {/* EDIT BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTaskToEdit(task);
                              setIsOpen(true);
                            }}
                            className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                            title="Edit Task"
                          >
                            <Edit size={18} />
                          </button>
                          {/* DELETE BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskDeleted?.(task._id);
                            }}
                            className="text-[var(--light-text)] hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // COLLAPSED STATE
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(task._id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSelectedItems((prev) =>
                                  prev.includes(task._id)
                                    ? prev.filter((id) => id !== task._id)
                                    : [...prev, task._id]
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="accent-[var(--accent-color)] flex-shrink-0 cursor-pointer"
                            />
                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                              {task.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={(e) => toggleTaskExpand(task._id, e)}
                              className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                              title="Expand"
                            >
                              <ChevronDown size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : !loading && hasLoaded && filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Search
                    size={48}
                    className="text-[var(--light-text)] opacity-50"
                  />
                  <p className="text-sm font-medium text-[var(--light-text)]">
                    No tasks found
                  </p>
                  <p className="text-xs text-[var(--light-text)] text-center">
                    Your search does not match any tasks.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        // NORMAL THREE SECTIONS
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch relative w-full">
          {/* MAPPING THROUGH COLUMNS */}
          {columns.map((col) => {
            // FILTER TASKS BY STATUS
            const sectionTasks = tasks.filter((task) => task.status === col.id);
            // FILTER BY SECTION SEARCH TERM
            const sectionSearchTerm = sectionSearchTerms[col.id] || "";
            const filteredSectionTasks = filterTasksBySectionSearch(
              sectionTasks,
              sectionSearchTerm
            );
            return (
              // COLUMN CONTAINER
              <div
                key={col.id}
                className="bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] rounded-xl shadow-sm p-4 sm:p-5 flex flex-col border border-[var(--border)] h-full"
              >
                {/* COLUMN HEADER */}
                <div className="flex items-center justify-between mb-4">
                  {/* COLUMN TITLE CONTAINER */}
                  <div className="flex items-center gap-2">
                    {/* STATUS DOT */}
                    <span className={`w-3 h-3 rounded-full ${col.dot}`}></span>
                    {/* COLUMN TITLE */}
                    <h2 className="font-semibold text-[var(--text-primary)]">
                      {col.title}
                    </h2>
                    {/* TASK COUNT BADGE */}
                    {sectionTasks.length > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative">
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundColor: `var(--accent-color)`,
                            opacity: 0.15,
                          }}
                        ></span>
                        <span
                          className="relative"
                          style={{ color: `var(--accent-color)` }}
                        >
                          {sectionTasks.length}
                        </span>
                      </span>
                    )}
                  </div>
                  {/* SELECT ALL CHECKBOX */}
                  {filteredSectionTasks.length > 0 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-[var(--accent-color)] cursor-pointer"
                        checked={
                          filteredSectionTasks.length > 0 &&
                          filteredSectionTasks.every((task) =>
                            selectedItems.includes(task._id)
                          )
                        }
                        onChange={(e) => {
                          // GET CHECKED STATE
                          const isChecked = e.target.checked;
                          // GET TASK IDS FROM COLUMN
                          const taskIds = filteredSectionTasks.map(
                            (task) => task._id
                          );
                          // UPDATE SELECTED ITEMS
                          setSelectedItems((prev) =>
                            isChecked
                              ? Array.from(new Set([...prev, ...taskIds]))
                              : prev.filter((id) => !taskIds.includes(id))
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
                {/* SECTION SEARCH BAR - ONLY SHOW IF SECTION HAS TASKS */}
                {sectionTasks.length > 0 && (
                  <div className="relative mb-3">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-[var(--accent-color)]" />
                    <input
                      type="text"
                      value={sectionSearchTerm}
                      onChange={(e) =>
                        updateSectionSearchTerm(col.id, e.target.value)
                      }
                      placeholder={`Search in ${col.title}...`}
                      className="border border-[var(--border)] pl-8 pr-2.5 py-1.5 rounded-lg w-full focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-xs bg-[var(--bg)] text-[var(--text-primary)]"
                    />
                  </div>
                )}
                {/* TASKS AREA */}
                <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-[100px] max-h-[600px] overflow-y-auto relative z-0">
                  {/* CHECK IF TASKS EXIST */}
                  {filteredSectionTasks.length > 0 ? (
                    // MAPPING THROUGH TASKS
                    filteredSectionTasks.map((task) => (
                      // TASK CARD
                      <div
                        key={task._id}
                        className="bg-[var(--inside-card-bg)] rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition-all hover:bg-[var(--hover-bg)]"
                      >
                        {/* CHECK IF TASK IS EXPANDED */}
                        {expandedTasks.has(task._id) ? (
                          // EXPANDED STATE
                          <div className="p-3 sm:p-4">
                            {/* EXPANDED HEADER */}
                            <div className="flex items-center justify-between gap-3 mb-3">
                              {/* LEFT SIDE: CHECKBOX AND TITLE */}
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(task._id)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setSelectedItems((prev) =>
                                      prev.includes(task._id)
                                        ? prev.filter((id) => id !== task._id)
                                        : [...prev, task._id]
                                    );
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="accent-[var(--accent-color)] flex-shrink-0 cursor-pointer"
                                />
                                <p className="text-sm font-medium text-[var(--text-primary)] flex-1">
                                  {task.title}
                                </p>
                                {/* COLLAPSE BUTTON */}
                                <button
                                  onClick={(e) => toggleTaskExpand(task._id, e)}
                                  className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)] flex-shrink-0 cursor-pointer"
                                  title="Collapse"
                                >
                                  <ChevronUp size={18} />
                                </button>
                              </div>
                            </div>

                            {/* EXPANDED CONTENT */}
                            <section className="flex flex-col gap-3 text-sm">
                              {/* DESCRIPTION */}
                              {task.description && (
                                <div className="flex items-start gap-3">
                                  <div className="flex-1">
                                    <p className="text-sm text-[var(--light-text)] leading-relaxed">
                                      {task.description}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* STATUS */}
                              <div className="flex items-center gap-3">
                                <CircleDot
                                  size={16}
                                  className="text-[var(--accent-color)] flex-shrink-0"
                                />
                                <div className="flex items-center gap-3 flex-1 justify-between">
                                  <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                                    Status
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold relative capitalize">
                                    <span
                                      className="absolute inset-0 rounded-full"
                                      style={{
                                        backgroundColor: `var(--accent-color)`,
                                        opacity: 0.15,
                                      }}
                                    ></span>
                                    <span
                                      className="relative"
                                      style={{
                                        color: `var(--accent-color)`,
                                      }}
                                    >
                                      {task.status || "N/A"}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              {/* PRIORITY */}
                              {task.priority && (
                                <div className="flex items-center gap-3">
                                  <Flag
                                    size={16}
                                    className="text-[var(--accent-color)] flex-shrink-0"
                                  />
                                  <div className="flex items-center gap-3 flex-1 justify-between">
                                    <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                                      Priority
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold relative">
                                      <span
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                          backgroundColor: `var(--accent-color)`,
                                          opacity: 0.15,
                                        }}
                                      ></span>
                                      <span
                                        className="relative"
                                        style={{
                                          color: `var(--accent-color)`,
                                        }}
                                      >
                                        {task.priority.charAt(0).toUpperCase() +
                                          task.priority.slice(1)}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* DUE DATE */}
                              {task.dueDate && (
                                <div className="flex items-center gap-3">
                                  <Calendar
                                    size={16}
                                    className="text-[var(--accent-color)] flex-shrink-0"
                                  />
                                  <div className="flex items-center gap-3 flex-1 justify-between">
                                    <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                                      Due Date
                                    </span>
                                    <span className="text-sm text-[var(--text-primary)]">
                                      {new Date(
                                        task.dueDate
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </section>
                            {/* ACTION BUTTONS */}
                            <div className="flex items-center gap-2 pt-2 mt-3 border-t border-[var(--border)]">
                              {/* TIMER BUTTON */}
                              {activeTimer?.taskId === task._id ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    stopTimer.mutate({ taskId: task._id });
                                  }}
                                  disabled={stopTimer.isPending}
                                  className="text-white bg-[var(--accent-color)] transition-colors p-1.5 rounded-md cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                  title="Stop Timer"
                                >
                                  <Square size={14} />
                                  <span className="text-xs font-mono">
                                    {formatElapsedTime(activeTimer.startedAt)}
                                  </span>
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startTimer.mutate({ taskId: task._id });
                                  }}
                                  disabled={
                                    startTimer.isPending || !!activeTimer
                                  }
                                  className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  title={
                                    activeTimer
                                      ? "Stop current timer first"
                                      : "Start Timer"
                                  }
                                >
                                  <Play size={18} />
                                </button>
                              )}
                              {/* LOG TIME BUTTON */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTimeLogTask({
                                    id: task._id,
                                    title: task.title,
                                  });
                                }}
                                className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                                title="Log Time"
                              >
                                <Clock size={18} />
                              </button>
                              {/* EDIT BUTTON */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTaskToEdit(task);
                                  setIsOpen(true);
                                }}
                                className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                                title="Edit Task"
                              >
                                <Edit size={18} />
                              </button>
                              {/* DELETE BUTTON */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTaskDeleted?.(task._id);
                                }}
                                className="text-[var(--light-text)] hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          // COLLAPSED STATE
                          <div className="p-3 sm:p-4">
                            <div className="flex items-center justify-between gap-3">
                              {/* LEFT SIDE: CHECKBOX AND TITLE */}
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {/* CHECKBOX */}
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(task._id)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setSelectedItems((prev) =>
                                      prev.includes(task._id)
                                        ? prev.filter((id) => id !== task._id)
                                        : [...prev, task._id]
                                    );
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="accent-[var(--accent-color)] flex-shrink-0 cursor-pointer"
                                />
                                {/* TITLE */}
                                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                  {task.title}
                                </p>
                              </div>
                              {/* ACTIONS */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {/* EXPAND BUTTON */}
                                <button
                                  onClick={(e) => toggleTaskExpand(task._id, e)}
                                  className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                                  title="Expand"
                                >
                                  <ChevronDown size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : !loading && hasLoaded && sectionTasks.length === 0 ? (
                    // EMPTY STATE (ONLY SHOW IF DATA HAS LOADED AND SECTION IS EMPTY)
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      {/* NO TASKS ICON */}
                      <ClipboardList
                        size={48}
                        className="text-[var(--light-text)] opacity-50"
                      />
                      {/* NO TASKS TEXT */}
                      <p className="text-sm font-medium text-[var(--light-text)]">
                        No tasks yet
                      </p>
                      <p className="text-xs text-[var(--light-text)] text-center">
                        Add tasks to this section to get started.
                      </p>
                    </div>
                  ) : !loading &&
                    hasLoaded &&
                    sectionTasks.length > 0 &&
                    filteredSectionTasks.length === 0 &&
                    sectionSearchTerm.trim() !== "" ? (
                    // SEARCH NO RESULTS
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Search
                        size={48}
                        className="text-[var(--light-text)] opacity-50"
                      />
                      <p className="text-sm font-medium text-[var(--light-text)]">
                        No tasks found
                      </p>
                      <p className="text-xs text-[var(--light-text)] text-center">
                        Your search does not match any tasks in this section.
                      </p>
                    </div>
                  ) : null}
                </div>
                {/* ADD TASK BUTTON */}
                <button
                  className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-[var(--accent-color)] cursor-pointer text-[var(--primary-text)] rounded-lg transition"
                  onClick={() => {
                    setTaskToEdit(null);
                    setNewTaskStatus(col.id as Task["status"]);
                    setTimeout(() => setIsOpen(true), 0);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--accent-btn-hover-color)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--primary-text)";
                  }}
                >
                  {/* PLUS ICON */}
                  <Plus size={16} />
                  {/* BUTTON TEXT */}
                  <span className="text-sm font-medium">Add Task</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
      {/* SELECTED TASKS MODAL */}
      {selectedItems.length > 0 && (
        <div
          className="fixed inset-0 min-h-screen bg-[var(--black-overlay)] z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancel();
            }
          }}
        >
          {/* MODAL CONTAINER */}
          <div
            className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                {/* ICON BADGE */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/15">
                  <Trash2 size={20} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Selected Tasks ({selectedItems.length})
                  </h2>
                  <p className="text-xs text-[var(--light-text)]">
                    Review tasks before deletion
                  </p>
                </div>
              </div>
              {/* CLOSE BUTTON */}
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            {/* MODAL CONTENT - SELECTED TASKS LIST */}
            <div className="overflow-y-auto flex-1 min-h-0 p-4 sm:p-6">
              <div className="flex flex-col gap-3">
                {selectedItems.map((taskId) => {
                  const task = tasks.find((t) => t._id === taskId);
                  if (!task) return null;
                  return (
                    <div
                      key={taskId}
                      className="bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg p-3 sm:p-4"
                    >
                      {/* TASK TITLE */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] flex-1">
                          {task.title}
                        </h3>
                      </div>
                      {/* TASK DETAILS */}
                      <div className="flex flex-col gap-2 text-sm">
                        {/* STATUS */}
                        {task.status && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--light-text)] min-w-[80px]">
                              Status:
                            </span>
                            <span className="text-xs text-[var(--text-primary)] capitalize">
                              {task.status}
                            </span>
                          </div>
                        )}
                        {/* PRIORITY */}
                        {task.priority && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--light-text)] min-w-[80px]">
                              Priority:
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative">
                              <span
                                className="absolute inset-0 rounded-full"
                                style={{
                                  backgroundColor: `var(--accent-color)`,
                                  opacity: 0.15,
                                }}
                              ></span>
                              <span
                                className="relative"
                                style={{ color: `var(--accent-color)` }}
                              >
                                {task.priority.charAt(0).toUpperCase() +
                                  task.priority.slice(1)}
                              </span>
                            </span>
                          </div>
                        )}
                        {/* DUE DATE */}
                        {task.dueDate && (
                          <div className="flex items-center gap-2">
                            <Calendar
                              size={14}
                              className="text-[var(--light-text)] flex-shrink-0"
                            />
                            <span className="text-xs text-[var(--light-text)] min-w-[80px]">
                              Due Date:
                            </span>
                            <span className="text-xs text-[var(--text-primary)]">
                              {new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        )}
                        {/* DESCRIPTION */}
                        {task.description && (
                          <div className="flex items-start gap-2 mt-1">
                            <span className="text-xs text-[var(--light-text)] min-w-[80px]">
                              Description:
                            </span>
                            <p className="text-xs text-[var(--light-text)] flex-1 line-clamp-2">
                              {task.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* MODAL FOOTER - ACTIONS */}
            <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
              {/* CANCEL BUTTON */}
              <button
                className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] cursor-pointer transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
              {/* DELETE BUTTON */}
              <button
                className="px-4 py-2 text-sm font-medium cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                onClick={() => {
                  // CALL BULK DELETE HANDLER
                  onBulkDelete?.(selectedItems);
                  // CLEAR SELECTION
                  setSelectedItems([]);
                }}
              >
                <Trash2 size={16} />
                Delete Selected ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ADD TASK MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-[var(--black-overlay)] z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
              setTaskToEdit(null);
              setNewTaskStatus(null);
            }
          }}
        >
          {/* MODAL CONTAINER */}
          <div
            className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                {/* ICON BADGE */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                  }}
                >
                  <ClipboardList size={20} className="text-[var(--accent-color)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    {taskToEdit ? "Edit Task" : "Create New Task"}
                  </h2>
                  <p className="text-xs text-[var(--light-text)]">
                    {taskToEdit ? "Update task details" : "Add a new task to your project"}
                  </p>
                </div>
              </div>
              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTaskToEdit(null);
                  setNewTaskStatus(null);
                }}
                className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            {/* SCROLLABLE CONTENT AREA - FORM ONLY */}
            <div className="overflow-y-auto flex-1 min-h-0">
              {/* ADD NEW TASK FORM */}
              <AddNewTask
                onClose={() => {
                  setIsOpen(false);
                  setTaskToEdit(null);
                  setNewTaskStatus(null);
                }}
                onTaskAdded={(newTask) => {
                  // CHECK IF TASK EXISTS
                  setTasks((prev) => {
                    const exists = prev.some((t) => t._id === newTask._id);
                    // UPDATE OR ADD TASK
                    return exists
                      ? prev.map((t) => (t._id === newTask._id ? newTask : t))
                      : [...prev, newTask];
                  });
                  // CALL ON TASK EDITED IF EDITING
                  if (taskToEdit) {
                    onTaskEdited?.(newTask._id);
                  }
                  // CLOSE MODAL
                  setIsOpen(false);
                  // CLEAR TASK TO EDIT
                  setTaskToEdit(null);
                  // CLEAR NEW TASK STATUS
                  setNewTaskStatus(null);
                }}
                initialTask={
                  taskToEdit
                    ? taskToEdit
                    : newTaskStatus
                    ? { status: newTaskStatus }
                    : undefined
                }
                showButtons={false}
              />
            </div>
            {/* FIXED FOOTER - BUTTONS */}
            <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
              {/* CANCEL BUTTON */}
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] cursor-pointer transition"
                onClick={() => {
                  setIsOpen(false);
                  setTaskToEdit(null);
                  setNewTaskStatus(null);
                }}
              >
                Cancel
              </button>
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                form="task-form"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer transition flex items-center gap-2"
              >
                <Check size={16} />
                {taskToEdit ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* TIME LOG MODAL */}
      {timeLogTask && (
        <TimeLogModal
          taskId={timeLogTask.id}
          taskTitle={timeLogTask.title}
          isOpen={!!timeLogTask}
          onClose={() => setTimeLogTask(null)}
        />
      )}
    </>
  );
};

export default BoardView;
