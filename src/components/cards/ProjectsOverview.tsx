// <== IMPORTS ==>
import { JSX } from "react";

// <== PROJECT STATS TYPE INTERFACE ==>
type ProjectStats = {
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
};

// <== PROJECTS OVERVIEW COMPONENT ==>
const ProjectsOverview = (): JSX.Element => {
  // MOCK STATS DATA (NO API)
  const stats: ProjectStats = {
    totalCount: 0,
    completedCount: 0,
    inProgressCount: 0,
    pendingCount: 0,
    dueTodayCount: 0,
  };
  // STATS COLLECTION ARRAY
  const collection = [
    { name: "Total Projects", count: stats?.totalCount },
    { name: "Pending Projects", count: stats?.pendingCount },
    { name: "Completed Projects", count: stats?.completedCount },
    { name: "In Progress", count: stats?.inProgressCount },
    { name: "Due today", count: stats?.dueTodayCount },
  ];
  // RETURNING THE PROJECTS OVERVIEW COMPONENT
  return (
    // PROJECTS OVERVIEW MAIN CONTAINER
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 p-4 pt-4 pb-3 rounded-xl">
      {/* MAPPING THROUGH COLLECTION */}
      {collection.map((item, index) => (
        // STAT CARD
        <div
          key={index}
          className="p-1.5 sm:p-2 flex flex-col items-center justify-center border rounded-xl bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] border-[var(--border)]"
        >
          {/* STAT NAME */}
          <p className="text-xs sm:text-sm font-medium text-[var(--light-text)] text-center">
            {item.name}
          </p>
          {/* STAT COUNT */}
          <p className="text-lg sm:text-xl font-bold mt-1 sm:mt-2">
            {item.count ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProjectsOverview;
