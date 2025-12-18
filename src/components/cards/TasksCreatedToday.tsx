// <== IMPORTS ==>
import {
  ClipboardList,
  X,
  FileText,
  Calendar,
  Flag,
  Circle,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import AddNewTask from "../tasks/AddNewTask";
import { JSX, useState, useEffect } from "react";
import { useDashboardStore } from "../../store/useDashboardStore";

// <== TASK TYPE INTERFACE ==>
type Task = {
  // <== TASK ID ==>
  _id?: string;
  // <== TASK TITLE ==>
  title: string;
  // <== TASK PRIORITY ==>
  priority: "low" | "medium" | "high";
  // <== TASK DUE DATE ==>
  dueDate: string;
  // <== TASK STATUS ==>
  status: "to do" | "in progress" | "completed";
};

// <== TASKS CREATED TODAY COMPONENT ==>
const TasksCreatedToday = (): JSX.Element => {
  // GET RECENT TASKS FROM DASHBOARD STORE
  const tasks = useDashboardStore((state) => state.getRecentTasks()) || [];
  // MODAL OPEN STATE
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // PRIORITY COLORS MAPPING
  const priorityColors: Record<Task["priority"], string> = {
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  // STATUS COLORS MAPPING
  const statusColors: Record<Task["status"], string> = {
    "to do": "text-[var(--light-text)]",
    "in progress": "text-blue-500 dark:text-blue-400",
    completed: "text-green-500 dark:text-green-400",
  };
  // HANDLE TASK ADDED FUNCTION
  const handleTaskAdded = (): void => {
    // CLOSE MODAL
    setIsOpen(false);
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
  // RETURN THE TASKS CREATED TODAY COMPONENT
  return (
    // TASKS CREATED TODAY MAIN CONTAINER
    <div className="flex flex-col justify-between p-4 pt-2.5 pb-3 border border-[var(--border)] rounded-2xl w-full bg-[var(--cards-bg)] h-full">
      {/* CARD HEADER */}
      <div className="flex justify-between items-center mb-3">
        {/* CARD TITLE */}
        <p className="text-lg font-medium">Recent Tasks</p>
        {/* ADD TASK BUTTON */}
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1 text-sm rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer"
        >
          + Add Task
        </button>
      </div>
      {/* TABLE CONTAINER */}
      <div className="overflow-x-auto flex-1">
        {/* CHECK IF TASKS EXIST */}
        {tasks.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center h-full py-8 gap-3">
            {/* EMPTY STATE ICON */}
            <ClipboardList
              size={48}
              className="text-[var(--light-text)] opacity-50"
            />
            {/* EMPTY STATE TEXT */}
            <p className="text-sm text-[var(--light-text)] text-center">
              No recent tasks found
            </p>
          </div>
        ) : (
          // TASKS TABLE
          <table className="w-full border-collapse">
            {/* TABLE HEADER */}
            <thead>
              <tr className="text-left text-sm text-[var(--light-text)] border-b border-[var(--border)]">
                {/* TASK NAME HEADER - ALWAYS VISIBLE */}
                <th className="py-2.5 px-1">
                  <div className="flex items-center gap-2">
                    {/* FILE TEXT ICON */}
                    <FileText
                      size={16}
                      className="text-[var(--accent-color)]"
                    />
                    <span className="font-medium">Task Name</span>
                  </div>
                </th>
                {/* DUE DATE HEADER - HIDDEN ON MOBILE, VISIBLE FROM SM */}
                <th className="py-2.5 px-1 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    {/* CALENDAR ICON */}
                    <Calendar
                      size={16}
                      className="text-[var(--accent-color)]"
                    />
                    <span className="font-medium">Due Date</span>
                  </div>
                </th>
                {/* PRIORITY HEADER - VISIBLE FROM MD */}
                <th className="py-2.5 px-1 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    {/* FLAG ICON */}
                    <Flag size={16} className="text-[var(--accent-color)]" />
                    <span className="font-medium">Priority</span>
                  </div>
                </th>
                {/* STATUS HEADER - ALWAYS VISIBLE */}
                <th className="py-2.5 px-1">
                  <div className="flex items-center gap-2">
                    {/* CIRCLE ICON */}
                    <Circle size={16} className="text-[var(--accent-color)]" />
                    <span className="font-medium">Status</span>
                  </div>
                </th>
              </tr>
            </thead>
            {/* TABLE BODY */}
            <tbody>
              {/* MAPPING THROUGH TASKS */}
              {tasks.map((task, index) => (
                // TABLE ROW
                <tr
                  key={task._id || index}
                  className="text-sm text-[var(--text-primary)] border-b border-[var(--border)] transition-colors duration-150 hover:bg-[var(--hover-bg)] cursor-pointer"
                >
                  {/* TASK NAME CELL - ALWAYS VISIBLE */}
                  <td className="py-3 px-1">
                    <span className="font-medium text-[var(--text-primary)]">
                      {task.title}
                    </span>
                  </td>
                  {/* DUE DATE CELL - HIDDEN ON MOBILE, VISIBLE FROM SM */}
                  <td className="py-3 px-1 hidden sm:table-cell">
                    <span className="text-[var(--light-text)]">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </td>
                  {/* PRIORITY CELL - VISIBLE FROM MD */}
                  <td className="py-3 px-1 hidden md:table-cell">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  {/* STATUS CELL - ALWAYS VISIBLE */}
                  <td className="py-3 px-1">
                    <span
                      className={`capitalize font-medium ${
                        statusColors[task.status]
                      }`}
                    >
                      {task.status.replace("-", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* FOOTER */}
      {tasks.length > 0 && (
        <div className="flex justify-end mt-3">
          {/* SEE ALL TASKS LINK */}
          <Link
            to="/tasks"
            className="text-sm text-[var(--accent-color)] hover:underline cursor-pointer"
          >
            See all tasks →
          </Link>
        </div>
      )}
      {/* ADD TASK MODAL - RENDERED IN PORTAL */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-[var(--black-overlay)] z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false);
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
                    <ClipboardList
                      size={20}
                      className="text-[var(--accent-color)]"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                      Create New Task
                    </h2>
                    <p className="text-xs text-[var(--light-text)]">
                      Add a new task to your project
                    </p>
                  </div>
                </div>
                {/* CLOSE BUTTON */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              {/* SCROLLABLE CONTENT AREA - FORM ONLY */}
              <div className="overflow-y-auto flex-1 min-h-0">
                {/* ADD NEW TASK FORM */}
                <AddNewTask
                  onClose={() => setIsOpen(false)}
                  onTaskAdded={handleTaskAdded}
                  showButtons={false}
                />
              </div>
              {/* FIXED FOOTER - BUTTONS */}
              <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
                {/* CANCEL BUTTON */}
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] cursor-pointer transition"
                  onClick={() => setIsOpen(false)}
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
                  Create Task
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default TasksCreatedToday;
