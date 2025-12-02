// <== IMPORTS ==>
import AddNewTask from "../tasks/AddNewTask";
import { useState, useEffect, JSX } from "react";
import ListModeProjects from "./ListModeProjects";
import CardsModeProjects from "./CardsModeProjects";
import AddProjectModal from "../projects/AddProjectModal";
import ConfirmationModal from "../common/ConfirmationModal";
import { Search, List, LayoutGrid, X, Plus } from "lucide-react";
import { useProjects, useDeleteProject } from "../../hooks/useProjects";

// <== PROJECT TYPE INTERFACE ==>
type Project = {
  // <== PROJECT ID ==>
  _id: string;
  // <== PROJECT TITLE ==>
  title: string;
  // <== PROJECT STATUS ==>
  status?: string;
  // <== PROJECT DUE DATE ==>
  dueDate?: string;
  // <== PROJECT IN CHARGE NAME ==>
  inChargeName?: string;
  // <== PROJECT IS TRASHED ==>
  isTrashed?: boolean;
  // <== PROJECT ROLE ==>
  role?: string;
  // <== PROJECT COMPLETED TASKS ==>
  completedTasks?: number;
  // <== PROJECT TOTAL TASKS ==>
  totalTasks?: number;
  // <== PROJECT PROGRESS ==>
  progress?: number;
};
// <== VIEW MODE TYPE ==>
type ViewMode = "list" | "card";

// <== PROJECT CARDS COMPONENT ==>
const ProjectCards = (): JSX.Element => {
  // GET PROJECTS DATA FROM HOOK
  const { projects: fetchedProjects, refetchProjects } = useProjects();
  // DELETE PROJECT MUTATION
  const deleteProjectMutation = useDeleteProject();
  // VIEW MODE STATE
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  // SEARCH TERM STATE
  const [searchTerm, setSearchTerm] = useState<string>("");
  // PROJECTS STATE (LOCAL STATE FOR UI UPDATES)
  const [projects, setProjects] = useState<Project[]>([]);
  // CURRENT PAGE STATE
  const [currentPage, setCurrentPage] = useState<number>(1);
  // EDIT PROJECT STATE
  const [editProject, setEditProject] = useState<Project | null>(null);
  // PROJECT MODAL OPEN STATE
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  // SELECTED PROJECT ID STATE
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  // ADD TASK MODAL STATE
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  // SELECTED PROJECT ID FOR ADD TASK
  const [selectedProjectIdForTask, setSelectedProjectIdForTask] = useState<
    string | null
  >(null);
  // CONFIRMATION MODAL STATE
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectTitle: string;
  }>({
    isOpen: false,
    projectId: null,
    projectTitle: "",
  });
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
  // UPDATE PROJECTS FROM FETCHED DATA
  useEffect(() => {
    // UPDATE PROJECTS FROM API
    if (fetchedProjects) {
      // UPDATE PROJECTS FROM API
      setProjects(fetchedProjects);
    }
  }, [fetchedProjects]);
  // RESET PAGE WHEN VIEW MODE CHANGES EFFECT
  useEffect(() => {
    // RESET TO FIRST PAGE
    setCurrentPage(1);
  }, [viewMode]);
  // RESET PAGE WHEN SEARCH TERM CHANGES EFFECT
  useEffect(() => {
    // RESET TO FIRST PAGE WHEN SEARCH CHANGES
    setCurrentPage(1);
  }, [searchTerm]);
  // FILTER PROJECTS
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // DYNAMIC PROJECTS PER PAGE
  const dynamicProjectsPerPage = viewMode === "list" ? 10 : 6;
  // TOTAL PAGES
  const totalPages =
    Math.ceil(filteredProjects.length / dynamicProjectsPerPage) || 1;
  // INDEX OF LAST PROJECT
  const indexOfLast = currentPage * dynamicProjectsPerPage;
  // INDEX OF FIRST PROJECT
  const indexOfFirst = indexOfLast - dynamicProjectsPerPage;
  // CURRENT PROJECTS
  const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast);
  // HANDLE DELETE PROJECT FUNCTION
  const onDeleteProject = (projectId: string): void => {
    // FIND PROJECT TO GET TITLE
    const projectToDelete = projects.find((p) => p._id === projectId);
    // OPEN CONFIRMATION MODAL
    setConfirmationModal({
      isOpen: true,
      projectId,
      projectTitle: projectToDelete?.title || "this project",
    });
  };
  // HANDLE CONFIRM DELETE FUNCTION
  const handleConfirmDelete = (): void => {
    // CHECK IF PROJECT ID EXISTS
    if (confirmationModal.projectId) {
      // DELETE PROJECT
      deleteProjectMutation.mutate(confirmationModal.projectId, {
        onSuccess: () => {
          // REMOVE PROJECT FROM STATE
          setProjects((prev) =>
            prev.filter((p) => p._id !== confirmationModal.projectId)
          );
          // REFETCH PROJECTS TO GET UPDATED DATA
          refetchProjects();
          // CLOSE CONFIRMATION MODAL
          setConfirmationModal({
            isOpen: false,
            projectId: null,
            projectTitle: "",
          });
        },
      });
    }
  };
  // HANDLE PROJECT ADDED FUNCTION
  const handleProjectAdded = (newProject: Project): void => {
    // CHECK IF EDITING
    if (editProject) {
      // UPDATE EXISTING PROJECT
      setProjects((prev) =>
        prev.map((p) => (p._id === newProject._id ? newProject : p))
      );
    } else {
      // ADD NEW PROJECT
      setProjects((prev) => [newProject, ...prev]);
    }
    // REFETCH PROJECTS TO GET UPDATED DATA
    refetchProjects();
    // CLOSE MODAL
    setIsProjectModalOpen(false);
    // CLEAR EDIT PROJECT
    setEditProject(null);
  };
  // HANDLE OPEN ADD TASK FUNCTION
  const onOpenAddTask = (projectId: string): void => {
    // SET SELECTED PROJECT ID FOR TASK
    setSelectedProjectIdForTask(projectId);
    // OPEN ADD TASK MODAL
    setIsAddTaskModalOpen(true);
  };
  // COMMON PROPS FOR CHILD COMPONENTS
  const commonProps = {
    currentProjects,
    totalPages,
    currentPage,
    setCurrentPage,
    onDeleteProject,
    setSelectedProjectId,
    setEditProject,
    setIsProjectModalOpen,
    selectedProjectId,
    editProject,
    handleProjectAdded,
    onOpenAddTask,
    searchTerm,
    hasProjects: projects.length > 0,
  };
  // RETURNING THE PROJECT CARDS COMPONENT
  return (
    // PROJECT CARDS MAIN CONTAINER
    <div className="p-4 border border-[var(--border)] rounded-2xl">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* SEARCH CONTAINER */}
        <div className="relative w-full sm:w-64">
          {/* SEARCH ICON */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--accent-color)]" />
          {/* SEARCH INPUT */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search project..."
            className="border border-[var(--border)] pl-10 pr-3 py-2 rounded-xl w-full focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm bg-transparent text-[var(--text-primary)]"
          />
        </div>
        {/* ACTIONS CONTAINER */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* ACTIONS */}
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-3">
            {/* TOGGLE VIEW BUTTONS */}
            <div className="flex gap-2">
              {/* LIST VIEW BUTTON */}
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md cursor-pointer transition-colors ${
                  viewMode === "list"
                    ? "border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] hover:text-white"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              {/* CARD VIEW BUTTON */}
              <button
                onClick={() => setViewMode("card")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md cursor-pointer transition-colors ${
                  viewMode === "card"
                    ? "border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] hover:text-white"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Board</span>
              </button>
            </div>
            {/* ADD PROJECT BUTTON */}
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-center gap-1.5 sm:gap-2 rounded-md text-xs sm:text-sm border border-[var(--border)] text-[var(--accent-color)] font-medium hover:bg-[var(--accent-btn-hover-color)] hover:text-white cursor-pointer transition-colors"
            >
              {/* PLUS ICON */}
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {/* BUTTON TEXT */}
              <span className="hidden sm:inline">Add Project</span>
            </button>
          </div>
        </div>
      </header>
      {/* RENDER VIEW MODE */}
      {viewMode === "list" ? (
        <ListModeProjects {...commonProps} />
      ) : (
        <CardsModeProjects {...commonProps} />
      )}
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
      {/* ADD TASK MODAL */}
      {isAddTaskModalOpen && selectedProjectIdForTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--black-overlay)] z-50 p-2 sm:p-4">
          {/* MODAL CONTAINER */}
          <div className="bg-[var(--bg)] rounded-xl w-full max-w-md max-h-[95vh] flex flex-col relative overflow-hidden">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-3 sm:p-4 pb-2 border-b border-[var(--border)] flex-shrink-0">
              {/* MODAL TITLE */}
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Add Task
              </h2>
              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  setIsAddTaskModalOpen(false);
                  setSelectedProjectIdForTask(null);
                }}
                className="cursor-pointer bg-[var(--accent-color)] rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white hover:bg-[var(--accent-btn-hover-color)] transition"
              >
                {/* CLOSE ICON */}
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
            {/* SCROLLABLE CONTENT AREA - FORM ONLY */}
            <div className="overflow-y-auto flex-1 min-h-0">
              {/* ADD NEW TASK FORM */}
              <AddNewTask
                projectId={selectedProjectIdForTask}
                onClose={() => {
                  setIsAddTaskModalOpen(false);
                  setSelectedProjectIdForTask(null);
                }}
                onTaskAdded={() => {
                  // REFETCH PROJECTS TO UPDATE TASK COUNTS
                  refetchProjects();
                  // CLOSE MODAL
                  setIsAddTaskModalOpen(false);
                  setSelectedProjectIdForTask(null);
                }}
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
                  setIsAddTaskModalOpen(false);
                  setSelectedProjectIdForTask(null);
                }}
              >
                Cancel
              </button>
              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                form="task-form"
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] shadow cursor-pointer"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal({
            isOpen: false,
            projectId: null,
            projectTitle: "",
          })
        }
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${confirmationModal.projectTitle}"? This action cannot be undone and will also delete all associated tasks.`}
        type="warning"
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
      />
    </div>
  );
};

export default ProjectCards;
