// <== IMPORTS ==>
import {
  ChevronDown,
  ClipboardList,
  Search,
  FileText,
  CircleDot,
  Calendar,
  Flag,
  Settings,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import type { Task } from "../../types/task";
import { useEffect, useState, JSX, Dispatch, SetStateAction } from "react";

// <== LIST VIEW PROPS TYPE INTERFACE ==>
type ListViewProps = {
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
  // <== PARENT MODAL OPEN ==>
  parentModalOpen?: boolean;
  // <== ON TASK DELETED FUNCTION ==>
  onTaskDeleted?: (taskId: string) => void;
  // <== ON TASK EDITED FUNCTION ==>
  onTaskEdited?: (taskId: string) => void;
  // <== ON BULK DELETE FUNCTION ==>
  onBulkDelete?: (taskIds: string[]) => void;
};
// <== COLUMN PROPS TYPE INTERFACE ==>
type ColumnProps = {
  // <== TITLE ==>
  title: "To Do" | "In Progress" | "Completed";
  // <== TASKS (FILTERED) ==>
  tasks: Task[];
  // <== ORIGINAL TASKS (UNFILTERED) ==>
  originalTasks: Task[];
  // <== SET TASKS FUNCTION ==>
  setTasks: Dispatch<SetStateAction<Task[]>>;
  // <== PARENT MODAL OPEN ==>
  parentModalOpen?: boolean;
  // <== ON TASK EDITED FUNCTION ==>
  onTaskEdited?: (taskId: string) => void;
  // <== ON TASK DELETED FUNCTION ==>
  onTaskDeleted?: (taskId: string) => void;
  // <== ON BULK DELETE FUNCTION ==>
  onBulkDelete?: (taskIds: string[]) => void;
  // <== HAS LOADED ==>
  hasLoaded: boolean;
  // <== LOADING ==>
  loading: boolean;
  // <== SECTION SEARCH TERM ==>
  sectionSearchTerm?: string;
  // <== ON SECTION SEARCH CHANGE ==>
  onSectionSearchChange?: (term: string) => void;
};
// <== TASK COLUMN COMPONENT ==>
function TaskColumn({
  title,
  tasks,
  originalTasks,
  setTasks: _setTasks,
  onTaskEdited,
  onTaskDeleted,
  onBulkDelete,
  hasLoaded,
  loading,
  sectionSearchTerm = "",
  onSectionSearchChange,
}: ColumnProps): JSX.Element {
  // SUPPRESS UNUSED VARIABLE WARNING - setTasks KEPT FOR API COMPATIBILITY
  void _setTasks;
  // TABLE OPEN STATE
  const [isOpen, setIsOpen] = useState<boolean>(true);
  // SELECTED ITEMS STATE
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // DOT COLOR BASED ON TITLE
  const dotColor =
    title === "To Do"
      ? "bg-violet-500"
      : title === "In Progress"
      ? "bg-yellow-500"
      : "bg-green-500";
  // HANDLE SELECT ALL FUNCTION
  const handleSelectAll = (checked: boolean): void => {
    // UPDATE SELECTED ITEMS
    setSelectedItems(checked ? tasks.map((t) => t._id) : []);
  };
  // HANDLE SELECT FUNCTION
  const handleSelect = (taskId: string, checked: boolean): void => {
    // UPDATE SELECTED ITEMS
    setSelectedItems((prev) =>
      checked ? [...prev, taskId] : prev.filter((id) => id !== taskId)
    );
  };
  // HANDLE CANCEL SELECTION FUNCTION
  const handleCancelSelection = (): void => {
    // CLEAR SELECTED ITEMS
    setSelectedItems([]);
  };
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
  // RETURNING THE TASK COLUMN COMPONENT
  return (
    // COLUMN CONTAINER
    <div className="w-full flex flex-col gap-3 p-4 border border-[var(--border)] rounded-2xl">
      {/* COLUMN HEADER */}
      <header className="flex justify-between items-center">
        {/* HEADER LEFT */}
        <div className="flex gap-2 items-center">
          {/* STATUS DOT */}
          <span className={`w-3 h-3 rounded-full ${dotColor}`} />
          {/* COLUMN TITLE */}
          <button className="font-semibold">{title}</button>
          {/* COLLAPSE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[var(--light-text)] hover:text-gray-700 transition-transform"
          >
            {/* CHEVRON DOWN ICON */}
            <ChevronDown
              size={16}
              className={`transform transition-transform duration-300 ${
                isOpen ? "rotate-0" : "-rotate-90"
              }`}
            />
          </button>
        </div>
        {/* SELECT ALL CHECKBOX - VISIBLE ON ALL DEVICES */}
        {tasks.length > 0 && (
          <div className="flex items-center gap-2 md:hidden">
            <input
              type="checkbox"
              className="accent-[var(--accent-color)] cursor-pointer"
              checked={
                tasks.length > 0 &&
                tasks.every((task) => selectedItems.includes(task._id))
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </div>
        )}
      </header>
      {/* SECTION SEARCH BAR - ONLY SHOW IF SECTION HAS TASKS */}
      {originalTasks.length > 0 && (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-[var(--accent-color)]" />
          <input
            type="text"
            value={sectionSearchTerm}
            onChange={(e) => onSectionSearchChange?.(e.target.value)}
            placeholder={`Search in ${title}...`}
            className="border border-[var(--border)] pl-8 pr-2.5 py-1.5 rounded-lg w-full focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-xs bg-[var(--bg)] text-[var(--text-primary)]"
          />
        </div>
      )}
      {/* TABLE */}
      {isOpen && (
        <main className="overflow-x-auto animate-fadeIn relative">
          {/* DESKTOP TABLE */}
          <div className="hidden md:block">
            <table className="w-full border-collapse">
              {/* TABLE HEADER */}
              <thead>
                <tr className="text-left text-sm text-[var(--light-text)] border-b border-[var(--border)]">
                  {/* SELECT ALL CHECKBOX HEADER */}
                  <th className="py-2.5 px-4 w-12">
                    <input
                      type="checkbox"
                      className="accent-[var(--accent-color)] cursor-pointer"
                      checked={
                        tasks.length > 0 &&
                        tasks.every((task) => selectedItems.includes(task._id))
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  {/* TASK NAME COLUMN HEADER - ALWAYS VISIBLE */}
                  <th className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <FileText
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <span className="font-medium">Task</span>
                    </div>
                  </th>
                  {/* STATUS COLUMN HEADER - ALWAYS VISIBLE */}
                  <th className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <CircleDot
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <span className="font-medium">Status</span>
                    </div>
                  </th>
                  {/* DUE DATE COLUMN HEADER - HIDDEN ON SMALL, VISIBLE FROM LG */}
                  <th className="py-2.5 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <span className="font-medium">Due Date</span>
                    </div>
                  </th>
                  {/* PRIORITY COLUMN HEADER - HIDDEN ON SMALL, VISIBLE FROM MD */}
                  <th className="py-2.5 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Flag size={16} className="text-[var(--accent-color)]" />
                      <span className="font-medium">Priority</span>
                    </div>
                  </th>
                  {/* ACTION COLUMN HEADER - ALWAYS VISIBLE */}
                  <th className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <Settings
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <span className="font-medium">Action</span>
                    </div>
                  </th>
                </tr>
              </thead>
              {/* TABLE BODY */}
              <tbody>
                {/* CHECK IF TASKS EXIST AND DATA HAS LOADED */}
                {tasks.length === 0 && !loading && hasLoaded ? (
                  // EMPTY STATE ROW
                  <tr>
                    <td colSpan={6} className="py-12">
                      {/* EMPTY STATE CONTAINER */}
                      <div className="flex flex-col items-center justify-center gap-3">
                        {/* CHECK IF SECTION HAS TASKS BUT SEARCH RETURNED NO RESULTS */}
                        {originalTasks.length > 0 &&
                        sectionSearchTerm.trim() !== "" ? (
                          <>
                            {/* SEARCH NO RESULTS ICON */}
                            <Search
                              size={48}
                              className="text-[var(--light-text)] opacity-50"
                            />
                            {/* SEARCH NO RESULTS TEXT */}
                            <p className="text-sm font-medium text-[var(--light-text)]">
                              No tasks found
                            </p>
                            <p className="text-xs text-[var(--light-text)] text-center">
                              Your search does not match any tasks in this
                              section.
                            </p>
                          </>
                        ) : (
                          <>
                            {/* NO TASKS ICON */}
                            <ClipboardList
                              size={48}
                              className="text-[var(--light-text)] opacity-50"
                            />
                            {/* NO TASKS TEXT */}
                            <p className="text-sm font-medium text-[var(--light-text)]">
                              No tasks in this section
                            </p>
                            <p className="text-xs text-[var(--light-text)] text-center">
                              Add tasks to this section to get started.
                            </p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : tasks.length > 0 ? (
                  // MAPPING THROUGH TASKS
                  tasks.map((task) => (
                    // TABLE ROW
                    <tr
                      key={task._id}
                      className="text-sm text-[var(--text-primary)] border-b border-[var(--border)] transition-colors duration-150 hover:bg-[var(--hover-bg)]"
                    >
                      {/* SELECT CHECKBOX CELL */}
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          className="accent-[var(--accent-color)] cursor-pointer"
                          checked={selectedItems.includes(task._id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelect(task._id, e.target.checked);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      {/* TASK NAME CELL - ALWAYS VISIBLE */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-[var(--accent-color)] text-left">
                          {task.title}
                        </span>
                      </td>
                      {/* STATUS CELL - ALWAYS VISIBLE */}
                      <td className="py-3 px-4">
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
                            style={{ color: `var(--accent-color)` }}
                          >
                            {task.status || "N/A"}
                          </span>
                        </span>
                      </td>
                      {/* DUE DATE CELL - HIDDEN ON SMALL, VISIBLE FROM LG */}
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-[var(--light-text)]">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </span>
                      </td>
                      {/* PRIORITY CELL - HIDDEN ON SMALL, VISIBLE FROM MD */}
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span
                          className={`font-medium ${
                            task.priority === "high"
                              ? "text-red-500"
                              : task.priority === "medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {task.priority
                            ? task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)
                            : "N/A"}
                        </span>
                      </td>
                      {/* ACTION CELL - ALWAYS VISIBLE */}
                      <td
                        className="py-3 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* ACTION BUTTONS */}
                        <div className="flex items-center gap-2">
                          {/* EDIT BUTTON */}
                          <button
                            className="cursor-pointer text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskEdited?.(task._id);
                            }}
                            title="Edit Task"
                          >
                            <Edit size={18} />
                          </button>
                          {/* DELETE BUTTON */}
                          <button
                            className="cursor-pointer text-[var(--light-text)] hover:text-red-500 transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskDeleted?.(task._id);
                            }}
                            title="Delete Task"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>
          </div>
          {/* MOBILE VERTICAL LAYOUT */}
          <div className="md:hidden space-y-3">
            {/* MAPPING THROUGH TASKS */}
            {tasks.length === 0 && !loading && hasLoaded ? (
              // EMPTY STATE
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                {originalTasks.length > 0 && sectionSearchTerm.trim() !== "" ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <ClipboardList
                      size={48}
                      className="text-[var(--light-text)] opacity-50"
                    />
                    <p className="text-sm font-medium text-[var(--light-text)]">
                      No tasks in this section
                    </p>
                    <p className="text-xs text-[var(--light-text)] text-center">
                      Add tasks to this section to get started.
                    </p>
                  </>
                )}
              </div>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                // MOBILE TASK CARD
                <div
                  key={task._id}
                  className="border border-[var(--border)] rounded-lg p-4 bg-[var(--cards-bg)] shadow-sm"
                >
                  {/* TASK TITLE SECTION */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border)]">
                    {/* TASK TITLE WITH ICON AND CHECKBOX */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        className="accent-[var(--accent-color)] cursor-pointer flex-shrink-0"
                        checked={selectedItems.includes(task._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelect(task._id, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <FileText
                        size={16}
                        className="text-[var(--accent-color)] flex-shrink-0"
                      />
                      <span className="font-semibold text-[var(--accent-color)] text-left truncate">
                        {task.title}
                      </span>
                    </div>
                  </div>
                  {/* TASK DETAILS SECTION */}
                  <div className="space-y-2.5">
                    {/* STATUS */}
                    <div className="flex items-center gap-2">
                      <CircleDot
                        size={14}
                        className="text-[var(--accent-color)] flex-shrink-0"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-medium text-[var(--light-text)] min-w-[60px]">
                          Status
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative capitalize">
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
                            {task.status || "N/A"}
                          </span>
                        </span>
                      </div>
                    </div>
                    {/* DUE DATE */}
                    {task.dueDate && (
                      <div className="flex items-center gap-2">
                        <Calendar
                          size={14}
                          className="text-[var(--accent-color)] flex-shrink-0"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs font-medium text-[var(--light-text)] min-w-[60px]">
                            Due Date
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
                      </div>
                    )}
                    {/* PRIORITY */}
                    {task.priority && (
                      <div className="flex items-center gap-2">
                        <Flag
                          size={14}
                          className="text-[var(--accent-color)] flex-shrink-0"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs font-medium text-[var(--light-text)] min-w-[60px]">
                            Priority
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              task.priority === "high"
                                ? "text-red-500"
                                : task.priority === "medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-2 pt-2 mt-3 border-t border-[var(--border)]">
                    {/* EDIT BUTTON */}
                    <button
                      className="cursor-pointer text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskEdited?.(task._id);
                      }}
                      title="Edit Task"
                    >
                      <Edit size={18} />
                    </button>
                    {/* DELETE BUTTON */}
                    <button
                      className="cursor-pointer text-[var(--light-text)] hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskDeleted?.(task._id);
                      }}
                      title="Delete Task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </main>
      )}
      {/* SELECTED TASKS MODAL */}
      {selectedItems.length > 0 && (
        <div
          className="fixed inset-0 min-h-screen bg-[var(--black-overlay)] z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelSelection();
            }
          }}
        >
          {/* MODAL CONTAINER */}
          <div
            className="bg-[var(--bg)] rounded-xl w-full max-w-2xl shadow-lg relative overflow-hidden border border-[var(--border)] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-3 sm:p-4 pb-2 border-b border-[var(--border)] flex-shrink-0">
              {/* MODAL TITLE */}
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Selected Tasks ({selectedItems.length})
              </h2>
              {/* CLOSE BUTTON */}
              <button
                onClick={handleCancelSelection}
                className="cursor-pointer bg-[var(--accent-color)] rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white hover:bg-[var(--accent-btn-hover-color)] transition"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
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
                          <div className="flex items-center gap-2">
                          <CircleDot
                            size={14}
                            className="text-[var(--light-text)] flex-shrink-0"
                          />
                            <span className="text-xs text-[var(--light-text)] min-w-[80px]">
                              Status:
                            </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative capitalize">
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
                              {task.status || "N/A"}
                            </span>
                            </span>
                          </div>
                        {/* PRIORITY */}
                        {task.priority && (
                          <div className="flex items-center gap-2">
                            <Flag
                              size={14}
                              className="text-[var(--light-text)] flex-shrink-0"
                            />
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
                            <FileText
                              size={14}
                              className="text-[var(--light-text)] flex-shrink-0"
                            />
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
            <div className="flex justify-end gap-2 p-3 sm:p-4 pt-2 border-t border-[var(--border)] flex-shrink-0 bg-[var(--bg)]">
              {/* CANCEL BUTTON */}
              <button
                className="px-4 py-2 text-sm bg-[var(--inside-card-bg)] rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer text-[var(--text-primary)] transition-colors"
                onClick={handleCancelSelection}
              >
                Cancel
              </button>
              {/* DELETE BUTTON */}
              <button
                className="px-4 py-2 text-sm cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={() => {
                  // CALL BULK DELETE HANDLER
                  onBulkDelete?.(selectedItems);
                  // CLEAR SELECTION
                  setSelectedItems([]);
                }}
              >
                Delete Selected ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// <== LIST VIEW COMPONENT ==>
const ListView = ({
  tasks,
  filteredTasks,
  searchTerm,
  loading,
  hasLoaded,
  setTasks,
  parentModalOpen,
  onTaskDeleted,
  onTaskEdited,
  onBulkDelete,
}: ListViewProps): JSX.Element => {
  // SELECTED ITEMS STATE (FOR SEARCH RESULTS)
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // SECTION SEARCH TERMS STATE
  const [sectionSearchTerms, setSectionSearchTerms] = useState<{
    [key: string]: string;
  }>({
    "to do": "",
    "in progress": "",
    completed: "",
  });
  // HANDLE SELECT FUNCTION (FOR SEARCH RESULTS)
  const handleSelect = (taskId: string, checked: boolean): void => {
    setSelectedItems((prev) =>
      checked ? [...prev, taskId] : prev.filter((id) => id !== taskId)
    );
  };
  // HANDLE CANCEL SELECTION FUNCTION (FOR SEARCH RESULTS)
  const handleCancelSelection = (): void => {
    setSelectedItems([]);
  };
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
  // CHECK IF LOADING
  if (loading) return <p className="text-center">Loading tasks...</p>;
  // CHECK IF MAIN SEARCH IS ACTIVE
  const isMainSearchActive = searchTerm.trim() !== "";
  // RETURNING THE LIST VIEW COMPONENT
  return (
    // LIST VIEW MAIN CONTAINER
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* CHECK IF MAIN SEARCH IS ACTIVE */}
      {isMainSearchActive ? (
        // SEARCH RESULTS SECTION
        <div className="w-full">
          <div className="w-full flex flex-col gap-3 p-4 border border-[var(--border)] rounded-2xl">
            {/* SEARCH RESULTS HEADER */}
            <header className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Search
                  size={16}
                  className="text-[var(--accent-color)] flex-shrink-0"
                />
                <button className="font-semibold text-[var(--text-primary)]">
                  Search Results
                </button>
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
              {/* SELECT ALL CHECKBOX - MOBILE ONLY */}
              {filteredTasks.length > 0 && (
                <div className="flex items-center gap-2 md:hidden">
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
                      const isChecked = e.target.checked;
                      const taskIds = filteredTasks.map((task) => task._id);
                      setSelectedItems((prev) =>
                        isChecked
                          ? Array.from(new Set([...prev, ...taskIds]))
                          : prev.filter((id) => !taskIds.includes(id))
                      );
                    }}
                  />
                </div>
              )}
            </header>
            {/* SEARCH RESULTS CONTENT */}
            {filteredTasks.length > 0 ? (
              <>
                {/* DESKTOP TABLE VIEW - HIDDEN ON MOBILE */}
                <div className="overflow-x-auto hidden md:block">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-sm text-[var(--light-text)] border-b border-[var(--border)]">
                        <th className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <FileText
                              size={16}
                              className="text-[var(--accent-color)]"
                            />
                            <span className="font-medium">Task</span>
                          </div>
                        </th>
                        <th className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <CircleDot
                              size={16}
                              className="text-[var(--accent-color)]"
                            />
                            <span className="font-medium">Status</span>
                          </div>
                        </th>
                        <th className="py-2.5 px-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <Calendar
                              size={16}
                              className="text-[var(--accent-color)]"
                            />
                            <span className="font-medium">Due Date</span>
                          </div>
                        </th>
                        <th className="py-2.5 px-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Flag
                              size={16}
                              className="text-[var(--accent-color)]"
                            />
                            <span className="font-medium">Priority</span>
                          </div>
                        </th>
                        <th className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <Settings
                              size={16}
                              className="text-[var(--accent-color)]"
                            />
                            <span className="font-medium">Action</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map((task) => (
                        <tr
                          key={task._id}
                          className="text-sm text-[var(--text-primary)] border-b border-[var(--border)] transition-colors duration-150 hover:bg-[var(--hover-bg)]"
                        >
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              className="accent-[var(--accent-color)] cursor-pointer"
                              checked={selectedItems.includes(task._id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelect(task._id, e.target.checked);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-[var(--accent-color)] text-left">
                              {task.title}
                            </span>
                          </td>
                          <td className="py-3 px-4">
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
                                style={{ color: `var(--accent-color)` }}
                              >
                                {task.status || "N/A"}
                              </span>
                            </span>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            <span className="text-[var(--light-text)]">
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </span>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <span
                              className={`font-medium ${
                                task.priority === "high"
                                  ? "text-red-500"
                                  : task.priority === "medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              }`}
                            >
                              {task.priority
                                ? task.priority.charAt(0).toUpperCase() +
                                  task.priority.slice(1)
                                : "N/A"}
                            </span>
                          </td>
                          <td
                            className="py-3 px-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* ACTION BUTTONS */}
                            <div className="flex items-center gap-2">
                              {/* EDIT BUTTON */}
                              <button
                                className="cursor-pointer text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTaskEdited?.(task._id);
                                }}
                                title="Edit Task"
                              >
                                <Edit size={18} />
                              </button>
                              {/* DELETE BUTTON */}
                              <button
                                className="cursor-pointer text-[var(--light-text)] hover:text-red-500 transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTaskDeleted?.(task._id);
                                }}
                                title="Delete Task"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* MOBILE CARD VIEW FOR SEARCH RESULTS - ONLY ON MOBILE */}
                <div className="md:hidden space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task._id}
                      className="border border-[var(--border)] rounded-lg p-4 bg-[var(--cards-bg)] shadow-sm"
                    >
                      {/* TASK TITLE SECTION */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border)]">
                        {/* TASK TITLE WITH ICON AND CHECKBOX */}
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            className="accent-[var(--accent-color)] cursor-pointer flex-shrink-0"
                            checked={selectedItems.includes(task._id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelect(task._id, e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <FileText
                            size={16}
                            className="text-[var(--accent-color)] flex-shrink-0"
                          />
                          <span className="font-semibold text-[var(--accent-color)] text-left truncate">
                            {task.title}
                          </span>
                        </div>
                      </div>
                      {/* TASK DETAILS */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <CircleDot
                            size={14}
                            className="text-[var(--accent-color)] flex-shrink-0"
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-medium text-[var(--light-text)] min-w-[60px]">
                              Status
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative capitalize">
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
                                {task.status || "N/A"}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar
                            size={14}
                            className="text-[var(--accent-color)] flex-shrink-0"
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-medium text-[var(--light-text)] min-w-[60px]">
                              Due Date
                            </span>
                            <span className="text-xs text-[var(--text-primary)]">
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flag
                            size={14}
                            className="text-[var(--accent-color)] flex-shrink-0"
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-medium text-[var(--light-text)] min-w-[60px]">
                              Priority
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                task.priority === "high"
                                  ? "text-red-500"
                                  : task.priority === "medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              }`}
                            >
                              {task.priority
                                ? task.priority.charAt(0).toUpperCase() +
                                  task.priority.slice(1)
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* ACTION BUTTONS */}
                      <div className="flex items-center gap-2 pt-2 mt-3 border-t border-[var(--border)]">
                        {/* EDIT BUTTON */}
                        <button
                          className="cursor-pointer text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)]"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskEdited?.(task._id);
                          }}
                          title="Edit Task"
                        >
                          <Edit size={18} />
                        </button>
                        {/* DELETE BUTTON */}
                        <button
                          className="cursor-pointer text-[var(--light-text)] hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-[var(--hover-bg)]"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskDeleted?.(task._id);
                          }}
                          title="Delete Task"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
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
      ) : (
        // NORMAL THREE SECTIONS
        <>
          {/* TO DO COLUMN */}
          <TaskColumn
            title="To Do"
            tasks={filterTasksBySectionSearch(
              tasks.filter((t) => t.status === "to do"),
              sectionSearchTerms["to do"]
            )}
            originalTasks={tasks.filter((t) => t.status === "to do")}
            setTasks={setTasks}
            parentModalOpen={parentModalOpen}
            onTaskDeleted={onTaskDeleted}
            onTaskEdited={onTaskEdited}
            onBulkDelete={onBulkDelete}
            hasLoaded={hasLoaded}
            loading={loading}
            sectionSearchTerm={sectionSearchTerms["to do"]}
            onSectionSearchChange={(term) =>
              updateSectionSearchTerm("to do", term)
            }
          />
          {/* IN PROGRESS COLUMN */}
          <TaskColumn
            title="In Progress"
            tasks={filterTasksBySectionSearch(
              tasks.filter((t) => t.status === "in progress"),
              sectionSearchTerms["in progress"]
            )}
            originalTasks={tasks.filter((t) => t.status === "in progress")}
            setTasks={setTasks}
            parentModalOpen={parentModalOpen}
            onTaskDeleted={onTaskDeleted}
            onTaskEdited={onTaskEdited}
            onBulkDelete={onBulkDelete}
            hasLoaded={hasLoaded}
            loading={loading}
            sectionSearchTerm={sectionSearchTerms["in progress"]}
            onSectionSearchChange={(term) =>
              updateSectionSearchTerm("in progress", term)
            }
          />
          {/* COMPLETED COLUMN */}
          <TaskColumn
            title="Completed"
            tasks={filterTasksBySectionSearch(
              tasks.filter((t) => t.status === "completed"),
              sectionSearchTerms["completed"]
            )}
            originalTasks={tasks.filter((t) => t.status === "completed")}
            setTasks={setTasks}
            parentModalOpen={parentModalOpen}
            onTaskDeleted={onTaskDeleted}
            onTaskEdited={onTaskEdited}
            onBulkDelete={onBulkDelete}
            hasLoaded={hasLoaded}
            loading={loading}
            sectionSearchTerm={sectionSearchTerms["completed"]}
            onSectionSearchChange={(term) =>
              updateSectionSearchTerm("completed", term)
            }
          />
        </>
      )}
      {/* SELECTED TASKS MODAL (FOR SEARCH RESULTS) */}
      {isMainSearchActive && selectedItems.length > 0 && (
        <div
          className="fixed inset-0 min-h-screen bg-[var(--black-overlay)] z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelSelection();
            }
          }}
        >
          {/* MODAL CONTAINER */}
          <div
            className="bg-[var(--bg)] rounded-xl w-full max-w-2xl shadow-lg relative overflow-hidden border border-[var(--border)] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-3 sm:p-4 pb-2 border-b border-[var(--border)] flex-shrink-0">
              {/* MODAL TITLE */}
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Selected Tasks ({selectedItems.length})
              </h2>
              {/* CLOSE BUTTON */}
              <button
                onClick={handleCancelSelection}
                className="cursor-pointer bg-[var(--accent-color)] rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white hover:bg-[var(--accent-btn-hover-color)] transition"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
            {/* MODAL CONTENT - SELECTED TASKS LIST */}
            <div className="overflow-y-auto flex-1 min-h-0 p-4 sm:p-6">
              <div className="flex flex-col gap-3">
                {selectedItems.map((taskId) => {
                  const task = filteredTasks.find((t) => t._id === taskId);
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
                          <div className="flex items-center gap-2">
                          <CircleDot
                            size={14}
                            className="text-[var(--light-text)] flex-shrink-0"
                          />
                            <span className="text-xs text-[var(--light-text)] min-w-[80px]">
                              Status:
                            </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative capitalize">
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
                              {task.status || "N/A"}
                            </span>
                            </span>
                          </div>
                        {/* PRIORITY */}
                        {task.priority && (
                          <div className="flex items-center gap-2">
                            <Flag
                              size={14}
                              className="text-[var(--light-text)] flex-shrink-0"
                            />
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
                            <FileText
                              size={14}
                              className="text-[var(--light-text)] flex-shrink-0"
                            />
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
            <div className="flex justify-end gap-2 p-3 sm:p-4 pt-2 border-t border-[var(--border)] flex-shrink-0 bg-[var(--bg)]">
              {/* CANCEL BUTTON */}
              <button
                className="px-4 py-2 text-sm bg-[var(--inside-card-bg)] rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer text-[var(--text-primary)] transition-colors"
                onClick={handleCancelSelection}
              >
                Cancel
              </button>
              {/* DELETE BUTTON */}
              <button
                className="px-4 py-2 text-sm cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={() => {
                  // CALL BULK DELETE HANDLER
                  onBulkDelete?.(selectedItems);
                  // CLEAR SELECTION
                  setSelectedItems([]);
                }}
              >
                Delete Selected ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListView;
