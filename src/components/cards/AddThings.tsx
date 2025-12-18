// <== IMPORTS ==>
import {
  PlusSquare,
  ClipboardList,
  FolderKanban,
  CheckSquare,
  X,
  Check,
} from "lucide-react";
import { createPortal } from "react-dom";
import AddNewTask from "../tasks/AddNewTask";
import { JSX, useMemo, useState, useEffect } from "react";
import AddProjectModal from "../projects/AddProjectModal";
import { useDashboardStore } from "../../store/useDashboardStore";

// <== ADD THINGS COMPONENT ==>
const AddThings = (): JSX.Element => {
  // PROJECT MODAL STATE
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  // TASK MODAL STATE
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  // GET PROJECT STATS FROM DASHBOARD STORE
  const projectStats = useDashboardStore((state) => state.getProjectStats());
  // GET TASK STATS FROM DASHBOARD STORE
  const taskStats = useDashboardStore((state) => state.getTaskStats());
  // PREVENT BACKGROUND SCROLLING WHEN MODAL IS OPEN
  useEffect(() => {
    // CHECK IF ANY MODAL IS OPEN
    if (isProjectModalOpen || isTaskModalOpen) {
      // SAVE ORIGINAL OVERFLOW STYLE
      const originalOverflow = document.body.style.overflow;
      // DISABLE BODY SCROLLING
      document.body.style.overflow = "hidden";
      // CLEANUP: RESTORE ORIGINAL OVERFLOW ON UNMOUNT OR WHEN MODAL CLOSES
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isProjectModalOpen, isTaskModalOpen]);
  // QUICK ACTIONS ARRAY
  const actions = [
    {
      name: "Create Task",
      detail: "Add tasks to your projects",
      icon: <ClipboardList className="h-6 w-6 text-[var(--accent-color)]" />,
      onClick: () => setIsTaskModalOpen(true),
    },
    {
      name: "Add Project",
      detail: "Start a new project",
      icon: <PlusSquare className="h-6 w-6 text-[var(--accent-color)]" />,
      onClick: () => setIsProjectModalOpen(true),
    },
  ];
  // GET STATS ARRAY WITH DATA FROM STORE
  const stats = useMemo(
    () => [
      {
        name: "Total Projects",
        count: projectStats?.totalCount || 0,
        icon: <FolderKanban className="h-5 w-5 text-blue-500" />,
      },
      {
        name: "Total Tasks",
        count: taskStats?.totalCount || 0,
        icon: <CheckSquare className="h-5 w-5 text-green-500" />,
      },
    ],
    [projectStats, taskStats]
  );
  // RETURNING THE ADD THINGS COMPONENT
  return (
    <>
      {/* ADD THINGS MAIN CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl">
        {/* QUICK ACTIONS */}
        {/* MAPPING THROUGH ACTIONS */}
        {actions.map((item, index) => (
          // ACTION BUTTON CARD
          <button
            key={index}
            onClick={item.onClick}
            className="p-2 flex items-center gap-4 border border-[var(--border)] rounded-xl bg-[var(--cards-bg)] cursor-pointer hover:border-[var(--accent-color)] transition text-left"
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
          </button>
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
      {/* ADD PROJECT MODAL - RENDERED IN PORTAL */}
      {isProjectModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-[var(--black-overlay)] z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsProjectModalOpen(false);
              }
            }}
          >
            {/* MODAL CONTAINER - ADD PROJECT MODAL HANDLES HEADER/CONTENT/FOOTER */}
            <div
              className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <AddProjectModal
                onClose={() => setIsProjectModalOpen(false)}
                onProjectAdded={() => setIsProjectModalOpen(false)}
                showButtons={true}
              />
            </div>
          </div>,
          document.body
        )}
      {/* ADD TASK MODAL - RENDERED IN PORTAL */}
      {isTaskModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-[var(--black-overlay)] z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsTaskModalOpen(false);
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
                  onClick={() => setIsTaskModalOpen(false)}
                  className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              {/* SCROLLABLE CONTENT AREA - FORM ONLY */}
              <div className="overflow-y-auto flex-1 min-h-0">
                {/* ADD NEW TASK FORM */}
                <AddNewTask
                  onClose={() => setIsTaskModalOpen(false)}
                  onTaskAdded={() => setIsTaskModalOpen(false)}
                  showButtons={false}
                />
              </div>
              {/* FIXED FOOTER - BUTTONS */}
              <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
                {/* CANCEL BUTTON */}
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] cursor-pointer transition"
                  onClick={() => setIsTaskModalOpen(false)}
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
    </>
  );
};

export default AddThings;
