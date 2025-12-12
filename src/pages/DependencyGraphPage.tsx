// <== IMPORTS ==>
import {
  ChevronDown,
  Folder,
  Check,
  Layers,
  Info,
  X,
  ClipboardList,
} from "lucide-react";
import useTitle from "../hooks/useTitle";
import type { Task } from "../types/task";
import { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import { useSearchParams } from "react-router-dom";
import AddNewTask from "../components/tasks/AddNewTask";
import { DependencyGraph } from "../components/dependencies";
import DashboardHeader from "../components/layout/DashboardHeader";
import DependencySkeleton from "../components/skeletons/DependencySkeleton";

// <== DEPENDENCY GRAPH PAGE COMPONENT ==>
const DependencyGraphPage = () => {
  // SET PAGE TITLE
  useTitle("PlanOra - Dependencies");
  // SEARCH PARAMS
  const [searchParams, setSearchParams] = useSearchParams();
  // PROJECT DROPDOWN STATE
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  // EDIT TASK MODAL STATE
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // TASK TO EDIT STATE
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  // GET PROJECT ID FROM URL
  const projectId = searchParams.get("projectId") || undefined;
  // FETCH PROJECTS
  const { projects, isLoading: isProjectsLoading } = useProjects();
  // FETCH TASKS
  const { tasks } = useTasks();
  // GET SELECTED PROJECT NAME
  const selectedProject = projects?.find((p) => p._id === projectId);
  // PREVENT BACKGROUND SCROLL WHEN MODAL IS OPEN
  useEffect(() => {
    // IF EDIT MODAL IS OPEN, PREVENT BACKGROUND SCROLL
    if (isEditModalOpen) {
      // SAVE ORIGINAL OVERFLOW STYLE
      const originalOverflow = document.body.style.overflow;
      // DISABLE BODY SCROLLING
      document.body.style.overflow = "hidden";
      // CLEANUP: RESTORE ORIGINAL OVERFLOW ON UNMOUNT OR WHEN MODAL CLOSES
      return () => {
        // RESTORE ORIGINAL OVERFLOW
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isEditModalOpen]);
  // HANDLE PROJECT SELECT
  const handleProjectSelect = (id: string | null) => {
    // IF PROJECT ID IS PROVIDED, SET PROJECT ID IN SEARCH PARAMS
    if (id) {
      // SET PROJECT ID IN SEARCH PARAMS
      setSearchParams({ projectId: id });
    } else {
      // IF PROJECT ID IS NOT PROVIDED, CLEAR PROJECT ID IN SEARCH PARAMS
      setSearchParams({});
    }
    // CLOSE PROJECT DROPDOWN
    setIsProjectDropdownOpen(false);
  };
  // HANDLE TASK CLICK
  const handleTaskClick = (taskId: string) => {
    // FIND THE TASK FROM TASKS LIST
    const task = tasks.find((t) => t._id === taskId);
    // IF TASK IS FOUND, OPEN EDIT MODAL
    if (task) {
      // SET TASK TO EDIT
      setTaskToEdit(task as Task);
      // OPEN EDIT MODAL
      setIsEditModalOpen(true);
    }
  };
  // HANDLE CLOSE MODAL
  const handleCloseModal = () => {
    // CLOSE EDIT MODAL
    setIsEditModalOpen(false);
    // CLEAR TASK TO EDIT
    setTaskToEdit(null);
  };
  // SHOW SKELETON WHILE PROJECTS ARE LOADING
  if (isProjectsLoading) {
    // SHOW DEPENDENCY SKELETON
    return <DependencySkeleton />;
  }
  // SHOW DEPENDENCY GRAPH PAGE
  return (
    // DEPENDENCY GRAPH PAGE MAIN CONTAINER
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* PAGE HEADER */}
      <DashboardHeader
        title="Dependency Graph"
        subtitle="Visualize task dependencies and relationships"
      />
      {/* CONTENT SECTION */}
      <div className="p-4 space-y-4">
        {/* TOP BAR CARD */}
        <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* LEFT SIDE - INFO */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[var(--accent-color)]/10">
                <Layers size={20} className="text-[var(--accent-color)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {selectedProject ? selectedProject.title : "All Projects"}
                </p>
                <p className="text-xs text-[var(--light-text)]">
                  Click on nodes to view task details
                </p>
              </div>
            </div>
            {/* RIGHT SIDE - PROJECT FILTER DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <Folder size={16} className="text-[var(--accent-color)]" />
                <span className="max-w-[150px] truncate">
                  {selectedProject ? selectedProject.title : "All Projects"}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition ${
                    isProjectDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isProjectDropdownOpen && (
                <>
                  {/* BACKDROP TO CLOSE DROPDOWN */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProjectDropdownOpen(false)}
                  />
                  {/* DROPDOWN MENU */}
                  <div className="absolute top-full right-0 mt-1 w-56 max-h-[70vh] overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-xl z-50 py-1">
                    {/* ALL PROJECTS OPTION */}
                    <button
                      onClick={() => handleProjectSelect(null)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                    >
                      <Layers
                        size={16}
                        className={
                          !projectId
                            ? "text-[var(--accent-color)]"
                            : "text-[var(--light-text)]"
                        }
                      />
                      <span className="flex-1 text-left">All Projects</span>
                      {!projectId && (
                        <Check
                          size={14}
                          className="text-[var(--accent-color)]"
                        />
                      )}
                    </button>
                    {/* DIVIDER */}
                    {projects && projects.length > 0 && (
                      <div className="border-t border-[var(--border)] my-1" />
                    )}
                    {/* PROJECT OPTIONS */}
                    {projects?.map((project) => (
                      <button
                        key={project._id}
                        onClick={() => handleProjectSelect(project._id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                      >
                        <Folder
                          size={16}
                          className={
                            projectId === project._id
                              ? "text-[var(--accent-color)]"
                              : "text-[var(--light-text)]"
                          }
                        />
                        <span className="flex-1 text-left truncate">
                          {project.title}
                        </span>
                        {projectId === project._id && (
                          <Check
                            size={14}
                            className="text-[var(--accent-color)]"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* DEPENDENCY GRAPH */}
        <DependencyGraph projectId={projectId} onNodeClick={handleTaskClick} />
        {/* TIPS SECTION */}
        <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-[var(--accent-color)]" />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              Quick Tips
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 mt-0.5 rounded border border-red-500 bg-red-500/10 shrink-0"></div>
              <p className="text-xs text-[var(--light-text)]">
                Red borders indicate blocked tasks
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-4 h-0.5 mt-1.5 bg-red-500 shrink-0"></div>
              <p className="text-xs text-[var(--light-text)]">
                Red arrows show blocking dependencies
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-4 h-0.5 mt-1.5 bg-blue-500 shrink-0"></div>
              <p className="text-xs text-[var(--light-text)]">
                Blue arrows indicate subtask relationships
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div
                className="w-4 h-0.5 mt-1.5 bg-gray-500 shrink-0"
                style={{ borderTop: "2px dashed" }}
              ></div>
              <p className="text-xs text-[var(--light-text)]">
                Dashed lines show related tasks
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* EDIT TASK MODAL */}
      {isEditModalOpen && taskToEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--black-overlay)] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          {/* MODAL CONTAINER - FIXED HEADER/FOOTER */}
          <div
            className="bg-[var(--bg)] w-full max-w-lg rounded-2xl border border-[var(--border)] shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* FIXED HEADER */}
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
                {/* TITLE AND SUBTITLE */}
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Edit Task
                  </h2>
                  <p className="text-xs text-[var(--light-text)]">
                    Update task details, dependencies, and subtasks
                  </p>
                </div>
              </div>
              {/* CLOSE BUTTON */}
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            {/* SCROLLABLE CONTENT AREA */}
            <div className="overflow-y-auto flex-1 min-h-0">
              <AddNewTask
                initialTask={taskToEdit}
                onClose={handleCloseModal}
                onTaskAdded={handleCloseModal}
                showButtons={false}
              />
            </div>
            {/* FIXED FOOTER */}
            <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
              {/* CANCEL BUTTON */}
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] cursor-pointer transition"
                onClick={handleCloseModal}
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
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DependencyGraphPage;
