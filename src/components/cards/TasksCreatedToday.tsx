// <== IMPORTS ==>
import { JSX } from "react";
import { Link } from "react-router-dom";

// <== TASK TYPE INTERFACE ==>
type Task = {
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
  // MOCK TASKS DATA (NO API)
  const tasks: Task[] = [];
  // PRIORITY COLORS MAPPING
  const priorityColors: Record<Task["priority"], string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };
  // RETURNING THE TASKS CREATED TODAY COMPONENT
  return (
    // TASKS CREATED TODAY MAIN CONTAINER
    <div className="flex flex-col justify-between p-4 pt-2.5 pb-3 border border-[var(--border)] rounded-2xl min-h-[261px] w-full bg-[var(--cards-bg)]">
      {/* CARD HEADER */}
      <div className="flex justify-between items-center mb-3">
        {/* CARD TITLE */}
        <p className="text-lg font-medium">Recent Tasks</p>
        {/* ADD TASK BUTTON */}
        <button className="px-3 py-1 text-sm rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer">
          + Add Task
        </button>
      </div>
      {/* TABLE CONTAINER */}
      <div className="overflow-x-auto flex-1">
        {/* CHECK IF TASKS EXIST */}
        {tasks.length === 0 ? (
          // EMPTY STATE
          <p className="text-sm text-[var(--light-text)] text-center py-6">
            No recent tasks found
          </p>
        ) : (
          // TASKS TABLE
          <table className="w-full border-collapse">
            {/* TABLE HEADER */}
            <thead>
              <tr className="text-left text-sm text-[var(--light-text)] border-b border-[var(--border)]">
                {/* TASK NAME HEADER */}
                <th className="py-2">Task Name</th>
                {/* DUE DATE HEADER */}
                <th className="py-2">Due Date</th>
                {/* PRIORITY HEADER */}
                <th className="py-2">Priority</th>
                {/* STATUS HEADER */}
                <th className="py-2">Status</th>
              </tr>
            </thead>
            {/* TABLE BODY */}
            <tbody>
              {/* MAPPING THROUGH TASKS */}
              {tasks.map((task, index) => (
                // TABLE ROW
                <tr
                  key={index}
                  className="text-sm text-[var(--light-text)] odd:bg-[var(--bg)] even:bg-[var(--inside-card-bg)] border-b border-[var(--border)]"
                >
                  {/* TASK NAME CELL */}
                  <td className="py-2">{task.title}</td>
                  {/* DUE DATE CELL */}
                  <td>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  {/* PRIORITY CELL */}
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  {/* STATUS CELL */}
                  <td className="capitalize">
                    {task.status.replace("-", " ")}
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
    </div>
  );
};

export default TasksCreatedToday;
