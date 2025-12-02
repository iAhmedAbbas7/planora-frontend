// <== IMPORTS ==>
import {
  X,
  Calendar,
  CircleDot,
  User,
  Briefcase,
  FileText,
  MessageSquare,
  CheckSquare,
} from "lucide-react";
import AddNewTask from "../tasks/AddNewTask";
import { useState, useEffect, JSX } from "react";
import { useProjectById } from "../../hooks/useProjects";
import { useTasksByProjectId } from "../../hooks/useTasks";

// <== TASK TYPE INTERFACE (LOCAL) ==>
type TaskLocal = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description?: string;
  // <== DUE DATE ==>
  dueDate?: string | number;
  // <== STATUS ==>
  status?: string;
  // <== PRIORITY ==>
  priority?: string;
};
// <== COMMENT TYPE INTERFACE ==>
type Comment = {
  // <== ID ==>
  id: string;
  // <== TEXT ==>
  text: string;
};
// <== PROJECT DETAILS PROPS TYPE INTERFACE ==>
type ProjectDrawerProps = {
  // <== PROJECT ID ==>
  projectId: string | null;
  // <== ON CLOSE FUNCTION ==>
  onClose: () => void;
};

// <== PROJECT DETAILS COMPONENT ==>
const ProjectDetails = ({
  projectId,
  onClose,
}: ProjectDrawerProps): JSX.Element => {
  // FETCH PROJECT BY ID
  const {
    data: project,
    isLoading: isLoadingProject,
    isError: isErrorProject,
  } = useProjectById(projectId);
  // FETCH TASKS BY PROJECT ID
  const {
    data: tasksData,
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
  } = useTasksByProjectId(projectId);
  // COMMENTS STATE
  const [comments, setComments] = useState<Comment[]>([]);
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<"tasks" | "comments">("tasks");
  // EDIT TASK MODAL STATE
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] =
    useState<boolean>(false);
  // SELECTED TASK FOR EDITING
  const [selectedTaskForEdit, setSelectedTaskForEdit] =
    useState<TaskLocal | null>(null);
  // LOADING STATE (COMBINED)
  const loading = isLoadingProject || isLoadingTasks;
  // CONVERT TASKS TO LOCAL FORMAT
  const tasks: TaskLocal[] =
    tasksData?.map((task) => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
    })) || [];
  // LOAD COMMENTS FROM LOCAL STORAGE EFFECT
  useEffect(() => {
    // CHECK IF PROJECT ID EXISTS
    if (!projectId) return;
    // GET COMMENTS FROM LOCAL STORAGE
    const storedComments = JSON.parse(
      localStorage.getItem(`comments_${projectId}`) || "[]"
    );
    // SET COMMENTS
    setComments(storedComments);
  }, [projectId]);
  // SAVE COMMENTS TO LOCAL STORAGE EFFECT
  useEffect(() => {
    // CHECK IF PROJECT ID EXISTS
    if (projectId) {
      // SAVE COMMENTS TO LOCAL STORAGE
      localStorage.setItem(`comments_${projectId}`, JSON.stringify(comments));
    }
  }, [comments, projectId]);
  // BODY OVERFLOW EFFECT
  useEffect(() => {
    // SET BODY OVERFLOW
    if (projectId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // CLEANUP
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [projectId]);
  // ADD COMMENT FUNCTION
  const addComment = (text: string): void => {
    // CREATE NEW COMMENT
    const newComment: Comment = { id: Date.now().toString(), text };
    // ADD COMMENT TO STATE
    setComments((prev) => [...prev, newComment]);
  };
  // DELETE COMMENT FUNCTION
  const deleteComment = (id: string): void => {
    // REMOVE COMMENT FROM STATE
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  };
  // RETURNING THE PROJECT DETAILS COMPONENT
  return (
    // PROJECT DETAILS MAIN CONTAINER
    <>
      {/* BACKDROP */}
      {projectId && (
        <div className="fixed inset-0 bg-black/10 z-50" onClick={onClose}></div>
      )}
      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[var(--bg)] shadow-xl border-l border-[var(--border)] z-50 transform transition-transform duration-300 ease-in-out ${
          projectId ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* DRAWER HEADER */}
        <header className="flex justify-between p-4 pt-2 pb-2 relative">
          {/* CLOSE BUTTON */}
          <button className="absolute text-white top-1 right-1 rounded-full bg-[var(--accent-color)] p-1.5">
            {/* CLOSE ICON */}
            <X
              size={17}
              className="rounded-full cursor-pointer"
              onClick={onClose}
            />
          </button>
        </header>
        {/* DRAWER MAIN CONTENT */}
        <main className="flex flex-col p-4 gap-4">
          {/* ERROR MESSAGE */}
          {(isErrorProject || isErrorTasks) && (
            <div className="bg-[var(--inside-card-bg)] border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm">
              {isErrorProject
                ? "Failed to load project details. Please try again."
                : "Failed to load tasks. Please try again."}
            </div>
          )}
          {/* PROJECT TITLE */}
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} className="text-[var(--accent-color)]" />
            <p className="text-left text-xl text-[var(--text-primary)] font-semibold">
              {loading ? "Loading..." : project?.title || "Project Details"}
            </p>
          </div>
          {/* PROJECT INFO GRID */}
          <div className="grid grid-cols-1 gap-3">
            {/* STATUS */}
            <div className="flex items-center gap-3">
              {/* ICON */}
              <CircleDot
                size={18}
                className="text-[var(--accent-color)] flex-shrink-0"
              />
              {/* CONTENT */}
              <div className="flex items-center gap-3 flex-1">
                {/* STATUS LABEL */}
                <span className="font-medium text-[var(--light-text)] text-sm min-w-[80px]">
                  Status
                </span>
                {/* STATUS BADGE */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold relative">
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: `var(--accent-color)`,
                      opacity: 0.15,
                    }}
                  ></span>
                  <span
                    className="relative"
                    style={{ color: `var(--accent-color)` }}
                  >
                    {project?.status || "Unknown"}
                  </span>
                </span>
              </div>
            </div>
            {/* DUE DATE */}
            <div className="flex items-center gap-3">
              {/* ICON */}
              <Calendar
                size={18}
                className="text-[var(--accent-color)] flex-shrink-0"
              />
              {/* CONTENT */}
              <div className="flex items-center gap-3 flex-1">
                {/* DUE DATE LABEL */}
                <span className="font-medium text-[var(--light-text)] text-sm min-w-[80px]">
                  Due Date
                </span>
                {/* DUE DATE VALUE */}
                <p className="text-[var(--text-primary)] text-sm">
                  {project?.dueDate
                    ? new Date(project.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
            {/* IN CHARGE */}
            {project?.inChargeName && (
              <div className="flex items-center gap-3">
                {/* ICON */}
                <User
                  size={18}
                  className="text-[var(--accent-color)] flex-shrink-0"
                />
                {/* CONTENT */}
                <div className="flex items-center gap-3 flex-1">
                  {/* IN CHARGE LABEL */}
                  <span className="font-medium text-[var(--light-text)] text-sm min-w-[80px]">
                    In Charge
                  </span>
                  {/* IN CHARGE VALUE */}
                  <p className="text-[var(--text-primary)] text-sm">
                    {project.inChargeName}
                  </p>
                </div>
              </div>
            )}
            {/* ROLE */}
            {project?.role && (
              <div className="flex items-center gap-3">
                {/* ICON */}
                <Briefcase
                  size={18}
                  className="text-[var(--accent-color)] flex-shrink-0"
                />
                {/* CONTENT */}
                <div className="flex items-center gap-3 flex-1">
                  {/* ROLE LABEL */}
                  <span className="font-medium text-[var(--light-text)] text-sm min-w-[80px]">
                    Role
                  </span>
                  {/* ROLE VALUE */}
                  <p className="text-[var(--text-primary)] text-sm">
                    {project.role}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
        {/* DESCRIPTION SECTION */}
        <div className="flex flex-col p-4 pt-2 pb-2 gap-2 border-t border-[var(--border)]">
          {/* DESCRIPTION LABEL */}
          <p className="text-left text-base font-medium text-[var(--text-primary)]">
            Description
          </p>
          {/* DESCRIPTION TEXT */}
          <p className="text-left text-sm text-[var(--light-text)] leading-relaxed">
            {project?.description || "No description available."}
          </p>
        </div>
        {/* TABS SECTION */}
        <div>
          {/* TABS */}
          <div className="flex gap-2 border-b border-[var(--border)] p-4 pb-0">
            {/* TASKS TAB */}
            <button
              onClick={() => setActiveTab("tasks")}
              className={`flex items-center gap-2 px-4 py-2 font-medium cursor-pointer transition-colors ${
                activeTab === "tasks"
                  ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              <CheckSquare size={16} />
              <span>Tasks</span>
            </button>
            {/* COMMENTS TAB */}
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex items-center gap-2 px-4 py-2 font-medium cursor-pointer transition-colors ${
                activeTab === "comments"
                  ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              <MessageSquare size={16} />
              <span>Comments</span>
            </button>
          </div>
          {/* TAB CONTENT */}
          <div className="p-4 text-sm max-h-[300px] overflow-y-auto custom-scroll">
            {/* TASKS TAB CONTENT */}
            {activeTab === "tasks" ? (
              tasks.length > 0 ? (
                // TASKS LIST
                <ul className="flex flex-col gap-3">
                  {/* MAPPING THROUGH TASKS */}
                  {tasks.map((task) => (
                    // TASK ITEM
                    <li
                      key={task._id}
                      onClick={() => {
                        setSelectedTaskForEdit(task);
                        setIsEditTaskModalOpen(true);
                      }}
                      className="border border-[var(--border)] p-3 rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer"
                    >
                      {/* TASK TITLE */}
                      <p className="font-medium">{task.title}</p>
                      {/* TASK DESCRIPTION */}
                      {task.description && (
                        <p className="text-sm text-[var(--light-text)]">
                          {task.description}
                        </p>
                      )}
                      {/* TASK DUE DATE */}
                      {task.dueDate && (
                        <p className="text-xs text-[var(--light-text)] mt-1">
                          Due:{" "}
                          {new Date(
                            typeof task.dueDate === "string"
                              ? task.dueDate
                              : task.dueDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                // EMPTY TASKS STATE
                <p className="text-[var(--light-text)] italic">No tasks yet.</p>
              )
            ) : (
              // COMMENTS TAB CONTENT
              <div className="flex flex-col gap-3">
                {/* ADD COMMENT INPUT */}
                <div className="flex gap-2">
                  {/* COMMENT INPUT */}
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 border border-[var(--border)] p-2 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                    onKeyDown={(e) => {
                      // CHECK IF ENTER KEY PRESSED
                      if (
                        e.key === "Enter" &&
                        e.currentTarget.value.trim() !== ""
                      ) {
                        // ADD COMMENT
                        addComment(e.currentTarget.value.trim());
                        // CLEAR INPUT
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>
                {/* COMMENTS LIST */}
                <ul className="flex flex-col gap-2">
                  {/* CHECK IF COMMENTS EXIST */}
                  {comments.length > 0 ? (
                    // MAPPING THROUGH COMMENTS
                    comments.map((comment) => (
                      // COMMENT ITEM
                      <li
                        key={comment.id}
                        className="flex justify-between items-center border border-[var(--border)] p-2 rounded-md"
                      >
                        {/* COMMENT TEXT */}
                        <span>{comment.text}</span>
                        {/* DELETE BUTTON */}
                        <button
                          className="text-[var(--accent-color)] hover:opacity-75 cursor-pointer text-sm"
                          onClick={() => deleteComment(comment.id)}
                        >
                          Delete
                        </button>
                      </li>
                    ))
                  ) : (
                    // EMPTY COMMENTS STATE
                    <p className="text-[var(--light-text)] italic">
                      No comments yet.
                    </p>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* EDIT TASK MODAL */}
      {isEditTaskModalOpen && selectedTaskForEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--black-overlay)] z-50 p-2 sm:p-4">
          {/* MODAL CONTAINER */}
          <div className="bg-[var(--bg)] rounded-xl w-full max-w-md max-h-[95vh] flex flex-col relative overflow-hidden">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-3 sm:p-4 pb-2 border-b border-[var(--border)] flex-shrink-0">
              {/* MODAL TITLE */}
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Edit Task
              </h2>
              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  setIsEditTaskModalOpen(false);
                  setSelectedTaskForEdit(null);
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
                initialTask={{
                  _id: selectedTaskForEdit._id,
                  title: selectedTaskForEdit.title,
                  description: selectedTaskForEdit.description,
                  dueDate:
                    typeof selectedTaskForEdit.dueDate === "number"
                      ? selectedTaskForEdit.dueDate
                      : selectedTaskForEdit.dueDate
                      ? new Date(selectedTaskForEdit.dueDate).getTime()
                      : undefined,
                  status: selectedTaskForEdit.status as
                    | "to do"
                    | "in progress"
                    | "completed"
                    | undefined,
                  priority: selectedTaskForEdit.priority,
                  projectId: projectId || undefined,
                }}
                projectId={projectId}
                onClose={() => {
                  setIsEditTaskModalOpen(false);
                  setSelectedTaskForEdit(null);
                }}
                onTaskAdded={() => {
                  // REFETCH TASKS TO UPDATE DATA
                  // The query will automatically refetch due to invalidation
                  setIsEditTaskModalOpen(false);
                  setSelectedTaskForEdit(null);
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
                  setIsEditTaskModalOpen(false);
                  setSelectedTaskForEdit(null);
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
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetails;
