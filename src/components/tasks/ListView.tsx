// <== IMPORTS ==>
import {
  useEffect,
  useRef,
  useState,
  JSX,
  Dispatch,
  SetStateAction,
} from "react";
import type { Task } from "../../types/task";
import ActionDropdown from "./dropdown/ActionDropdown";
import { ChevronDown, MoreHorizontal, ClipboardList } from "lucide-react";

// <== LIST VIEW PROPS TYPE INTERFACE ==>
type ListViewProps = {
  // <== TASKS ==>
  tasks: Task[];
  // <== LOADING ==>
  loading: boolean;
  // <== SET TASKS FUNCTION ==>
  setTasks: Dispatch<SetStateAction<Task[]>>;
  // <== PARENT MODAL OPEN ==>
  parentModalOpen?: boolean;
  // <== ON TASK DELETED FUNCTION ==>
  onTaskDeleted?: (taskId: string) => void;
  // <== ON TASK EDITED FUNCTION ==>
  onTaskEdited?: (taskId: string) => void;
};
// <== COLUMN PROPS TYPE INTERFACE ==>
type ColumnProps = {
  // <== TITLE ==>
  title: "To Do" | "In Progress" | "Completed";
  // <== TASKS ==>
  tasks: Task[];
  // <== SET TASKS FUNCTION ==>
  setTasks: Dispatch<SetStateAction<Task[]>>;
  // <== PARENT MODAL OPEN ==>
  parentModalOpen?: boolean;
  // <== ON TASK EDITED FUNCTION ==>
  onTaskEdited?: (taskId: string) => void;
  // <== ON TASK DELETED FUNCTION ==>
  onTaskDeleted?: (taskId: string) => void;
};
// <== TASK COLUMN COMPONENT ==>
function TaskColumn({
  title,
  tasks,
  setTasks,
  parentModalOpen,
  onTaskEdited,
  onTaskDeleted,
}: ColumnProps): JSX.Element {
  // DROPDOWN TASK ID STATE
  const [dropdownTaskId, setDropdownTaskId] = useState<string | null>(null);
  // DROPDOWN POSITION STATE
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement | null>(null);
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
  // CHECK IF ALL SELECTED
  const allSelected = tasks.length > 0 && selectedItems.length === tasks.length;
  // HANDLE DELETE TASK FUNCTION
  const handleDeleteTask = (taskId: string): void => {
    // REMOVE TASK FROM STATE (UI ONLY - NO API)
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    // LOG DELETION (UI ONLY)
    console.log("Task deleted:", taskId);
    // CALL ON TASK DELETED CALLBACK
    onTaskDeleted?.(taskId);
  };
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
  // OPEN DROPDOWN FUNCTION
  const openDropdown = (e: React.MouseEvent, taskId: string): void => {
    // GET BUTTON POSITION
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    // GET DROPDOWN WIDTH
    const dropdownWidth = 150;
    // CALCULATE SPACE ON RIGHT
    const spaceRight = window.innerWidth - rect.right;
    // CALCULATE LEFT POSITION
    const left =
      spaceRight > dropdownWidth
        ? rect.right + window.scrollX
        : rect.left - dropdownWidth + window.scrollX;
    // SET DROPDOWN TASK ID
    setDropdownTaskId(taskId);
    // SET DROPDOWN POSITION
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left,
    });
  };
  // CLOSE DROPDOWN FUNCTION
  const closeDropdown = (): void => {
    // CLOSE DROPDOWN
    setDropdownTaskId(null);
  };
  // HANDLE CLICK OUTSIDE EFFECT
  useEffect(() => {
    // HANDLE CLICK OUTSIDE FUNCTION
    const handleClickOutside = (e: MouseEvent): void => {
      // CHECK IF CLICK IS OUTSIDE DROPDOWN
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        // CLOSE DROPDOWN
        closeDropdown();
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // CLOSE DROPDOWN WHEN COLUMN COLLAPSES OR MODAL OPENS EFFECT
  useEffect(() => {
    // CLOSE DROPDOWN IF COLUMN IS CLOSED OR MODAL IS OPEN
    if (!isOpen || parentModalOpen) closeDropdown();
  }, [isOpen, parentModalOpen]);
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
      </header>
      {/* TABLE */}
      {isOpen && (
        <main className="overflow-x-auto animate-fadeIn relative">
          {/* TABLE */}
          <table className="w-full border-collapse text-sm">
            {/* TABLE HEADER */}
            <thead>
              <tr className="bg-[var(--inside-card-bg)] text-[var(--light-text)]">
                {/* SELECT ALL CHECKBOX HEADER */}
                <th className="p-2 text-center w-10">
                  <input
                    type="checkbox"
                    className="accent-[var(--accent-color)] cursor-pointer"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                {/* TASK NAME HEADER */}
                <th className="p-2 text-center">Task Name</th>
                {/* DUE DATE HEADER */}
                <th className="p-2 text-center">Due Date</th>
                {/* PRIORITY HEADER */}
                <th className="p-2 text-center">Priority</th>
                {/* ACTION HEADER */}
                <th className="p-2 text-center w-12">Action</th>
              </tr>
            </thead>
            {/* TABLE BODY */}
            <tbody>
              {/* CHECK IF TASKS EXIST */}
              {tasks.length === 0 ? (
                // EMPTY STATE ROW
                <tr>
                  <td colSpan={5} className="py-8">
                    {/* EMPTY STATE CONTAINER */}
                    <div className="flex flex-col items-center justify-center gap-3">
                      {/* EMPTY STATE ICON */}
                      <ClipboardList
                        size={48}
                        className="text-[var(--light-text)] opacity-50"
                      />
                      {/* EMPTY STATE TEXT */}
                      <p className="text-sm text-[var(--light-text)] text-center">
                        No tasks in this section
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // MAPPING THROUGH TASKS
                tasks.map((task, i) => (
                  // TABLE ROW
                  <tr
                    key={task._id}
                    className={`text-center ${
                      i % 2 === 0
                        ? "bg-[var(--bg)]"
                        : "bg-[var(--inside-card-bg)]"
                    } ${
                      i !== tasks.length - 1
                        ? "border-b border-[var(--border)]"
                        : ""
                    }`}
                  >
                    {/* SELECT CHECKBOX CELL */}
                    <td className="p-2">
                      <input
                        type="checkbox"
                        className="accent-[var(--accent-color)] cursor-pointer"
                        checked={selectedItems.includes(task._id)}
                        onChange={(e) =>
                          handleSelect(task._id, e.target.checked)
                        }
                      />
                    </td>
                    {/* TASK NAME CELL */}
                    <td className="p-2">{task.title}</td>
                    {/* DUE DATE CELL */}
                    <td className="p-2">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No due date"}
                    </td>
                    {/* PRIORITY CELL */}
                    <td
                      className={`p-2 font-medium ${
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
                    </td>
                    {/* ACTION CELL */}
                    <td className="p-2">
                      {/* DROPDOWN BUTTON */}
                      <button
                        onClick={(e) => openDropdown(e, task._id)}
                        className="text-[var(--light-text)] hover:text-gray-700 cursor-pointer"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* FLOATING ACTION BAR */}
          {selectedItems.length > 0 && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--cards-bg)] border border-[var(--border)] shadow-lg px-4 sm:px-6 py-3 rounded-xl flex gap-3 sm:gap-4 items-center animate-fadeIn z-[999] backdrop-blur-sm">
              {/* SELECTED COUNT */}
              <p className="text-sm text-[var(--primary-text)]">
                {selectedItems.length} selected
              </p>
              {/* CANCEL BUTTON */}
              <button
                className="px-3 py-1.5 text-sm bg-[var(--inside-card-bg)] rounded-lg hover:bg-[var(--hover-bg)] text-[var(--primary-text)] cursor-pointer"
                onClick={handleCancelSelection}
              >
                Cancel
              </button>
              {/* DELETE BUTTON */}
              <button
                className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
                onClick={() => {
                  // DELETE SELECTED TASKS
                  selectedItems.forEach(handleDeleteTask);
                  // CLEAR SELECTION
                  setSelectedItems([]);
                }}
              >
                Delete
              </button>
            </div>
          )}
          {/* DROPDOWN MENU */}
          {dropdownTaskId && (
            <div
              className="fixed z-[99999] animate-fadeIn"
              ref={dropdownRef}
              style={{
                top: dropdownPosition.top + 4,
                left: dropdownPosition.left,
              }}
            >
              <ActionDropdown
                onEditTask={() => onTaskEdited?.(dropdownTaskId)}
                onDeleteTask={() => {
                  handleDeleteTask(dropdownTaskId);
                  closeDropdown();
                }}
              />
            </div>
          )}
        </main>
      )}
    </div>
  );
}

// <== LIST VIEW COMPONENT ==>
const ListView = ({
  tasks,
  loading,
  setTasks,
  parentModalOpen,
  onTaskDeleted,
  onTaskEdited,
}: ListViewProps): JSX.Element => {
  // CHECK IF LOADING
  if (loading) return <p className="text-center">Loading tasks...</p>;
  // RETURNING THE LIST VIEW COMPONENT
  return (
    // LIST VIEW MAIN CONTAINER
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* TO DO COLUMN */}
      <TaskColumn
        title="To Do"
        tasks={tasks.filter((t) => t.status === "to do")}
        setTasks={setTasks}
        parentModalOpen={parentModalOpen}
        onTaskDeleted={onTaskDeleted}
        onTaskEdited={onTaskEdited}
      />
      {/* IN PROGRESS COLUMN */}
      <TaskColumn
        title="In Progress"
        tasks={tasks.filter((t) => t.status === "in progress")}
        setTasks={setTasks}
        parentModalOpen={parentModalOpen}
        onTaskDeleted={onTaskDeleted}
        onTaskEdited={onTaskEdited}
      />
      {/* COMPLETED COLUMN */}
      <TaskColumn
        title="Completed"
        tasks={tasks.filter((t) => t.status === "completed")}
        setTasks={setTasks}
        parentModalOpen={parentModalOpen}
        onTaskDeleted={onTaskDeleted}
        onTaskEdited={onTaskEdited}
      />
    </div>
  );
};

export default ListView;
