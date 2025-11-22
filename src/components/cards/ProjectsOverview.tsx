// <== IMPORTS ==>
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  ArrowRightCircle,
  Calendar,
} from "lucide-react";
import { JSX } from "react";
import { useProjects } from "../../hooks/useProjects";

// <== PROJECTS OVERVIEW COMPONENT ==>
const ProjectsOverview = (): JSX.Element => {
  // GET PROJECT STATS FROM HOOK
  const { projectStats } = useProjects();
  // STATS WITH FALLBACK VALUES
  const stats = projectStats || {
    totalCount: 0,
    completedCount: 0,
    inProgressCount: 0,
    pendingCount: 0,
    dueTodayCount: 0,
  };
  // STATS COLLECTION ARRAY WITH ICONS
  const collection = [
    {
      name: "Total Projects",
      count: stats?.totalCount,
      icon: FolderKanban,
      color: "text-blue-500",
    },
    {
      name: "Pending Projects",
      count: stats?.pendingCount,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      name: "Completed Projects",
      count: stats?.completedCount,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      name: "In Progress",
      count: stats?.inProgressCount,
      icon: ArrowRightCircle,
      color: "text-purple-500",
    },
    {
      name: "Due today",
      count: stats?.dueTodayCount,
      icon: Calendar,
      color: "text-red-500",
    },
  ];
  // RETURNING THE PROJECTS OVERVIEW COMPONENT
  return (
    // PROJECTS OVERVIEW MAIN CONTAINER
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 p-4 pt-4 pb-3 rounded-xl">
      {/* MAPPING THROUGH COLLECTION */}
      {collection.map((item, index) => {
        // GET ICON COMPONENT
        const IconComponent = item.icon;
        // RETURN STAT CARD
        return (
          // STAT CARD
          <div
            key={index}
            className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3 border rounded-xl bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] border-[var(--border)]"
          >
            {/* STAT ICON */}
            <IconComponent
              className={`h-6 w-6 sm:h-7 sm:w-7 ${item.color} flex-shrink-0`}
            />
            {/* STAT INFO CONTAINER */}
            <div className="flex flex-col min-w-0 flex-1">
              {/* STAT COUNT */}
              <p className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                {item.count ?? 0}
              </p>
              {/* STAT NAME */}
              <p className="text-xs sm:text-sm font-medium text-[var(--light-text)] truncate">
                {item.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsOverview;
