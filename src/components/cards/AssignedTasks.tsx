// <== IMPORTS ==>
import { JSX } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

// <== PROJECT TYPE INTERFACE ==>
type Project = {
  // <== PROJECT ID ==>
  _id: string;
  // <== PROJECT TITLE ==>
  title: string;
  // <== PROJECT DUE DATE ==>
  dueDate?: string;
  // <== PROJECT IS TRASHED ==>
  isTrashed?: boolean;
  // <== PROJECT USER ID ==>
  userId?: string;
};

// <== ASSIGNED TASKS COMPONENT ==>
const AssignedTasks = (): JSX.Element => {
  // MOCK PROJECTS DATA (NO API)
  const projects: Project[] = [];
  // RETURNING THE ASSIGNED TASKS COMPONENT
  return (
    // ASSIGNED TASKS MAIN CONTAINER
    <div className="flex flex-col border border-[var(--border)] bg-[var(--cards-bg)] rounded-xl overflow-hidden">
      {/* CARD HEADER */}
      <div className="flex justify-between items-center border-b border-[var(--border)] px-4 py-1.5">
        {/* CARD TITLE */}
        <p className="text-lg font-medium text-[var(--text-primary)]">
          Projects
        </p>
        {/* VIEW MORE LINK */}
        <div>
          <Link
            to="/projects"
            className="flex justify-center items-center p-1 rounded-md text-sm transition text-[var(--accent-color)] cursor-pointer hover:underline"
          >
            View More →
          </Link>
        </div>
      </div>
      {/* PROJECT LIST CONTAINER */}
      <div className="grid grid-cols-1 gap-2 p-3">
        {/* ADD PROJECT BUTTON */}
        <button className="border border-[var(--accent-color)] flex justify-center items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--accent-color)] hover:bg-[var(--inside-card-bg)] transition cursor-pointer">
          {/* PLUS ICON */}
          <Plus size={16} />
          {/* BUTTON TEXT */}
          Add Project
        </button>
        {/* MAPPING THROUGH PROJECTS */}
        {projects.map((item, index) => (
          // PROJECT ITEM CARD
          <div
            key={index}
            className="border border-[var(--border)] flex items-center gap-4 px-3 py-1.5 rounded-lg text-sm hover:bg-[var(--hover-bg)] transition"
          >
            {/* PROJECT AVATAR */}
            <div className="w-9 h-9 bg-[var(--accent-color)] rounded-full flex justify-center items-center font-semibold text-white">
              {item.title.slice(0, 2).toLocaleUpperCase()}
            </div>
            {/* PROJECT INFO CONTAINER */}
            <div className="flex flex-col text-left">
              {/* PROJECT TITLE */}
              <h1 className="font-medium text-[var(--text-primary)]">
                {item.title}
              </h1>
              {/* PROJECT DUE DATE */}
              <p className="text-xs text-[var(--light-text)]">
                Due Date:{" "}
                {item.dueDate
                  ? new Date(item.dueDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        ))}
        {/* EMPTY STATE */}
        {projects.length === 0 && (
          <p className="text-sm text-[var(--light-text)] text-center py-4">
            No projects yet
          </p>
        )}
      </div>
    </div>
  );
};

export default AssignedTasks;
