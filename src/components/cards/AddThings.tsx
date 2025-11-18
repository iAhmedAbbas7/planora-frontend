// <== IMPORTS ==>
import {
  PlusSquare,
  ClipboardList,
  FolderKanban,
  CheckSquare,
} from "lucide-react";
import { JSX } from "react";
import { Link } from "react-router-dom";

// <== ADD THINGS COMPONENT ==>
const AddThings = (): JSX.Element => {
  // QUICK ACTIONS ARRAY
  const actions = [
    {
      name: "Create Task",
      detail: "Add tasks to your projects",
      icon: <ClipboardList className="h-6 w-6 text-[var(--accent-color)]" />,
      path: "/tasks",
    },
    {
      name: "Add Project",
      detail: "Start a new project",
      icon: <PlusSquare className="h-6 w-6 text-[var(--accent-color)]" />,
      path: "/projects",
    },
  ];
  // STATS ARRAY (MOCK DATA - NO API)
  const stats = [
    {
      name: "Total Projects",
      count: 0,
      icon: <FolderKanban className="h-5 w-5 text-blue-500" />,
    },
    {
      name: "Total Tasks",
      count: 0,
      icon: <CheckSquare className="h-5 w-5 text-green-500" />,
    },
  ];
  // RETURNING THE ADD THINGS COMPONENT
  return (
    // ADD THINGS MAIN CONTAINER
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl">
      {/* QUICK ACTIONS */}
      {/* MAPPING THROUGH ACTIONS */}
      {actions.map((item, index) => (
        // ACTION LINK CARD
        <Link
          to={item.path}
          key={index}
          className="p-2 flex items-center gap-4 border border-[var(--border)] rounded-xl bg-[var(--cards-bg)] cursor-pointer"
        >
          {/* ACTION ICON CONTAINER */}
          <div className="p-2 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center">
            {item.icon}
          </div>
          {/* ACTION INFO CONTAINER */}
          <div className="flex flex-col">
            {/* ACTION NAME */}
            <p className="text-base font-medium">{item.name}</p>
            {/* ACTION DETAIL */}
            <p className="text-sm text-[var(--light-text)]">{item.detail}</p>
          </div>
        </Link>
      ))}
      {/* STATS CARDS */}
      {/* MAPPING THROUGH STATS */}
      {stats.map((stat, index) => (
        // STAT CARD
        <div
          key={index}
          className="p-2 flex items-center gap-4 border border-[var(--border)] rounded-xl bg-[var(--cards-bg)]"
        >
          {/* STAT ICON CONTAINER */}
          <div className="p-2.5 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center">
            {stat.icon}
          </div>
          {/* STAT INFO CONTAINER */}
          <div className="flex flex-col">
            {/* STAT COUNT */}
            <p className="text-2xl font-bold">{stat.count}</p>
            {/* STAT NAME */}
            <p className="text-sm">{stat.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddThings;
