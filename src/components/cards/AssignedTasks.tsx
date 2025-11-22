// <== IMPORTS ==>
import { Link } from "react-router-dom";
import { Plus, Folder, X } from "lucide-react";
import { JSX, useState, useEffect } from "react";
import AddProjectModal from "../projects/AddProjectModal";
import { useDashboardStore } from "../../store/useDashboardStore";

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
  // GET RECENT PROJECTS FROM DASHBOARD STORE
  const projects =
    useDashboardStore((state) => state.getRecentProjects()) || [];
  // PROJECT MODAL OPEN STATE
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  // EDIT PROJECT STATE
  const [editProject, setEditProject] = useState<Project | null>(null);
  // HANDLE PROJECT ADDED FUNCTION
  const handleProjectAdded = (): void => {
    // CLOSE MODAL
    setIsProjectModalOpen(false);
    // RESET EDIT PROJECT STATE
    setEditProject(null);
  };
  // PREVENT BACKGROUND SCROLLING WHEN MODAL IS OPEN
  useEffect(() => {
    if (isProjectModalOpen) {
      // SAVE ORIGINAL OVERFLOW STYLE
      const originalOverflow = document.body.style.overflow;
      // DISABLE BODY SCROLLING
      document.body.style.overflow = "hidden";
      // CLEANUP: RESTORE ORIGINAL OVERFLOW ON UNMOUNT OR WHEN MODAL CLOSES
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isProjectModalOpen]);
  // RETURN THE ASSIGNED TASKS COMPONENT
  return (
    // ASSIGNED TASKS MAIN CONTAINER
    <div className="flex flex-col border border-[var(--border)] bg-[var(--cards-bg)] rounded-xl overflow-hidden h-full w-full">
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
      <div className="grid grid-cols-1 gap-2 p-3 flex-1">
        {/* ADD PROJECT BUTTON */}
        <button
          onClick={() => setIsProjectModalOpen(true)}
          className="border border-[var(--accent-color)] flex justify-center items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--accent-color)] hover:bg-[var(--inside-card-bg)] transition cursor-pointer"
        >
          {/* PLUS ICON */}
          <Plus size={16} />
          {/* BUTTON TEXT */}
          Add Project
        </button>
        {/* MAPPING THROUGH PROJECTS */}
        {projects.map((item, index) => (
          // PROJECT ITEM CARD
          <div
            key={item._id || index}
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
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            {/* EMPTY STATE ICON */}
            <Folder size={48} className="text-[var(--light-text)] opacity-50" />
            {/* EMPTY STATE TEXT */}
            <p className="text-sm text-[var(--light-text)] text-center">
              No projects yet
            </p>
          </div>
        )}
      </div>
      {/* PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-[var(--black-overlay)] flex items-center justify-center z-50 p-2 sm:p-4">
          {/* MODAL CONTAINER */}
          <div className="relative bg-[var(--bg)] rounded-xl shadow-lg w-full max-w-md max-h-[95vh] flex flex-col overflow-hidden">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-3 sm:p-4 pb-2 border-b border-[var(--border)] flex-shrink-0">
              {/* MODAL TITLE */}
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {editProject ? "Edit Project" : "Add Project"}
              </h2>
              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  setIsProjectModalOpen(false);
                  setEditProject(null);
                }}
                className="cursor-pointer bg-[var(--accent-color)] rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white hover:bg-[var(--accent-btn-hover-color)] transition"
              >
                {/* CLOSE ICON */}
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
            {/* SCROLLABLE CONTENT AREA - FORM ONLY */}
            <div className="overflow-y-auto flex-1 min-h-0">
              {/* ADD PROJECT MODAL FORM */}
              <AddProjectModal
                initialProject={editProject || undefined}
                onClose={() => {
                  setIsProjectModalOpen(false);
                  setEditProject(null);
                }}
                onProjectAdded={handleProjectAdded}
                showButtons={false}
              />
            </div>
            {/* FIXED FOOTER - BUTTONS */}
            <div className="flex justify-end gap-2 p-2 sm:p-3 pt-2 border-t border-[var(--border)] flex-shrink-0 bg-[var(--bg)] rounded-b-xl">
              {/* CANCEL BUTTON */}
              <button
                type="button"
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm border border-[var(--border)] hover:bg-[var(--hover-bg)] cursor-pointer"
                onClick={() => {
                  setIsProjectModalOpen(false);
                  setEditProject(null);
                }}
              >
                Cancel
              </button>
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                form="project-form"
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] shadow cursor-pointer"
              >
                {editProject ? "Update Project" : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedTasks;
