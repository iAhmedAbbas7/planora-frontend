// <== IMPORTS ==>
import { JSX } from "react";

// <== TASK STATS TYPE INTERFACE ==>
type TaskStats = {
  // <== TOTAL COUNT ==>
  totalCount: number;
  // <== COMPLETED COUNT ==>
  completedCount: number;
  // <== IN PROGRESS COUNT ==>
  inProgressCount: number;
  // <== PENDING COUNT ==>
  pendingCount: number;
  // <== DUE TODAY COUNT ==>
  dueTodayCount: number;
  // <== IS TRASHED ==>
  isTrashed: boolean;
};

// <== TASKS OVERVIEW COMPONENT ==>
const TasksOverview = (): JSX.Element => {
  // MOCK STATS DATA (NO API)
  const stats: TaskStats = {
    totalCount: 0,
    completedCount: 0,
    inProgressCount: 0,
    pendingCount: 0,
    dueTodayCount: 0,
    isTrashed: false,
  };
  // STATS COLLECTION ARRAY
  const collection = stats
    ? [
        { name: "Total tasks", count: stats.totalCount },
        { name: "Pending tasks", count: stats.pendingCount },
        { name: "Completed tasks", count: stats.completedCount },
        { name: "In Progress", count: stats.inProgressCount },
        { name: "Due today", count: stats.dueTodayCount },
      ]
    : [];
  // RETURNING THE TASKS OVERVIEW COMPONENT
  return (
    // TASKS OVERVIEW MAIN CONTAINER
    <div className="p-4 pt-4 pb-3 dark:bg-gray-900 rounded-xl">
      {/* STATS GRID */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {/* MAPPING THROUGH COLLECTION */}
        {collection.map((item, index) => (
          // STAT CARD
          <div
            key={index}
            className="p-1.5 sm:p-2 flex flex-col items-center justify-center border rounded-xl border-[var(--border)] bg-[var(--cards-bg)] backdrop-blur-[var(--blur)]"
          >
            {/* STAT NAME */}
            <p className="text-xs sm:text-sm font-medium text-[var(--light-text)] text-center">
              {item.name}
            </p>
            {/* STAT COUNT */}
            <p className="text-lg sm:text-xl font-bold dark:text-white mt-1 sm:mt-2">
              {item.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksOverview;
