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
  Flag,
  Clock,
  Send,
  Trash2,
  Github,
} from "lucide-react";
import {
  useCommentsByProjectId,
  useCreateComment,
  useDeleteComment,
  Comment as CommentType,
} from "../../hooks/useComments";
import AddNewTask from "../tasks/AddNewTask";
import { useState, useEffect, useRef, JSX } from "react";
import { useProjectById } from "../../hooks/useProjects";
import { useTasksByProjectId } from "../../hooks/useTasks";
import ProjectGitHubTab, { FullDrawerRepoSelector } from "./ProjectGitHubTab";
import { AITaskGenerator } from "./AITaskGenerator";

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
  // FETCH COMMENTS BY PROJECT ID
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isError: isErrorComments,
  } = useCommentsByProjectId(projectId);
  // CREATE COMMENT MUTATION
  const createCommentMutation = useCreateComment();
  // DELETE COMMENT MUTATION
  const deleteCommentMutation = useDeleteComment();
  // COMMENT INPUT STATE
  const [commentText, setCommentText] = useState<string>("");
  // COMMENT INPUT REF
  const commentInputRef = useRef<HTMLInputElement>(null);
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<"tasks" | "comments" | "github">(
    "tasks"
  );
  // EDIT TASK MODAL STATE
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] =
    useState<boolean>(false);
  // SELECTED TASK FOR EDITING
  const [selectedTaskForEdit, setSelectedTaskForEdit] =
    useState<TaskLocal | null>(null);
  // SHOW FULL DRAWER REPO SELECTOR STATE
  const [showFullRepoSelector, setShowFullRepoSelector] =
    useState<boolean>(false);
  // SHOW AI TASK GENERATOR STATE
  const [showAIGenerator, setShowAIGenerator] = useState<boolean>(false);
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
  // COMMENTS FROM API
  const comments: CommentType[] = commentsData || [];
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
  // HANDLE ADD COMMENT FUNCTION
  const handleAddComment = (): void => {
    // CHECK IF COMMENT TEXT IS EMPTY OR ALREADY SUBMITTING
    if (!commentText.trim() || !projectId || createCommentMutation.isPending) {
      return;
    }
    // GET COMMENT TEXT
    const textToSend = commentText.trim();
    // CLEAR COMMENT INPUT IMMEDIATELY (OPTIMISTIC UPDATE)
    setCommentText("");
    // CREATE COMMENT
    createCommentMutation.mutate(
      {
        text: textToSend,
        projectId,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // FOCUS ON INPUT
          commentInputRef.current?.focus();
        },
        // <== ON ERROR ==>
        onError: () => {
          // RESTORE COMMENT TEXT ON ERROR
          setCommentText(textToSend);
        },
      }
    );
  };
  // HANDLE DELETE COMMENT FUNCTION
  const handleDeleteComment = (commentId: string): void => {
    // DELETE COMMENT
    deleteCommentMutation.mutate(commentId);
  };
  // FORMAT DATE FUNCTION
  const formatDate = (dateString: string): string => {
    // GET DATE
    const date = new Date(dateString);
    // GET NOW
    const now = new Date();
    // GET DIFFERENCE IN SECONDS
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    // IF LESS THAN 1 MINUTE
    if (diffInSeconds < 60) {
      // RETURN FORMATTED DATE
      return "Just now";
    }
    // IF LESS THAN 1 HOUR
    if (diffInSeconds < 3600) {
      // GET MINUTES
      const minutes = Math.floor(diffInSeconds / 60);
      // RETURN FORMATTED DATE
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
    // IF LESS THAN 24 HOURS
    if (diffInSeconds < 86400) {
      // GET HOURS
      const hours = Math.floor(diffInSeconds / 3600);
      // RETURN FORMATTED DATE
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
    // IF LESS THAN 7 DAYS
    if (diffInSeconds < 604800) {
      // GET DAYS
      const days = Math.floor(diffInSeconds / 86400);
      // RETURN FORMATTED DATE
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
    // RETURN FORMATTED DATE
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
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
        {/* FULL DRAWER REPO SELECTOR */}
        {showFullRepoSelector && projectId ? (
          <FullDrawerRepoSelector
            projectId={projectId}
            onClose={() => setShowFullRepoSelector(false)}
          />
        ) : showAIGenerator && projectId ? (
          <AITaskGenerator
            projectId={projectId}
            githubRepo={project?.githubRepo}
            onClose={() => setShowAIGenerator(false)}
          />
        ) : (
          <div className="flex flex-col h-full">
            {/* DRAWER HEADER */}
            <header className="flex justify-between p-4 pt-2 pb-2 relative flex-shrink-0">
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
            <main className="flex flex-col p-4 gap-4 flex-shrink-0">
              {/* ERROR MESSAGE */}
              {(isErrorProject || isErrorTasks || isErrorComments) && (
                <div className="bg-[var(--inside-card-bg)] border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm">
                  {isErrorProject
                    ? "Failed to load project details. Please try again."
                    : isErrorTasks
                    ? "Failed to load tasks. Please try again."
                    : "Failed to load comments. Please try again."}
                </div>
              )}
              {/* LOADING SKELETON */}
              {loading ? (
                <>
                  {/* PROJECT TITLE SKELETON */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                    <div className="h-6 w-48 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  </div>
                  {/* PROJECT INFO SKELETON */}
                  <div className="grid grid-cols-1 gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded animate-pulse flex-shrink-0" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="h-4 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                          <div className="h-5 w-24 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* PROJECT TITLE */}
                  <div className="flex items-center gap-2 mb-2">
                    <FileText
                      size={20}
                      className="text-[var(--accent-color)]"
                    />
                    <p className="text-left text-xl text-[var(--text-primary)] font-semibold">
                      {project?.title || "Project Details"}
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
                            ? new Date(project.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
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
                </>
              )}
            </main>
            {/* DESCRIPTION SECTION */}
            {loading ? (
              <div className="flex flex-col p-4 pt-2 pb-2 gap-2 border-t border-[var(--border)] flex-shrink-0">
                <div className="h-5 w-24 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                <div className="h-4 w-full bg-[var(--inside-card-bg)] rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              </div>
            ) : (
              <div className="flex flex-col p-4 pt-2 pb-2 gap-2 border-t border-[var(--border)] flex-shrink-0">
                {/* DESCRIPTION LABEL */}
                <p className="text-left text-base font-medium text-[var(--text-primary)]">
                  Description
                </p>
                {/* DESCRIPTION TEXT */}
                <p className="text-left text-sm text-[var(--light-text)] leading-relaxed">
                  {project?.description || "No description available."}
                </p>
              </div>
            )}
            {/* TABS SECTION */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* TABS */}
              <div className="flex gap-2 border-b border-[var(--border)] p-4 pb-0 flex-shrink-0">
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
                {/* GITHUB TAB */}
                <button
                  onClick={() => setActiveTab("github")}
                  className={`flex items-center gap-2 px-4 py-2 font-medium cursor-pointer transition-colors ${
                    activeTab === "github"
                      ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                      : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Github size={16} />
                  <span>GitHub</span>
                </button>
              </div>
              {/* TAB CONTENT */}
              <div className="p-4 text-sm flex-1 overflow-y-auto custom-scroll">
                {/* TASKS TAB CONTENT */}
                {activeTab === "tasks" ? (
                  isLoadingTasks ? (
                    // TASKS LOADING SKELETON
                    <ul className="flex flex-col gap-3 pb-2">
                      {[1, 2, 3].map((item) => (
                        <li
                          key={item}
                          className="border border-[var(--border)] p-3 rounded-lg"
                        >
                          <div className="h-5 w-3/4 bg-[var(--inside-card-bg)] rounded animate-pulse mb-2" />
                          <div className="h-4 w-full bg-[var(--inside-card-bg)] rounded animate-pulse mb-2" />
                          <div className="flex items-center gap-2 mt-2">
                            <div className="h-3 w-3 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                            <div className="h-3 w-16 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                            <div className="h-3 w-3 bg-[var(--inside-card-bg)] rounded animate-pulse ml-auto" />
                            <div className="h-3 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : tasks.length > 0 ? (
                    // TASKS LIST
                    <ul className="flex flex-col gap-3 pb-2">
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
                          {/* TASK HEADER */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            {/* TASK TITLE */}
                            <p className="font-medium text-[var(--text-primary)] flex-1">
                              {task.title}
                            </p>
                            {/* PRIORITY BADGE */}
                            {task.priority && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative flex-shrink-0">
                                <span
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    backgroundColor: `var(--accent-color)`,
                                    opacity: 0.15,
                                  }}
                                ></span>
                                <span
                                  className="relative flex items-center gap-1"
                                  style={{ color: `var(--accent-color)` }}
                                >
                                  <Flag size={12} />
                                  {task.priority.toUpperCase()}
                                </span>
                              </span>
                            )}
                          </div>
                          {/* TASK DESCRIPTION */}
                          {task.description && (
                            <p className="text-sm text-[var(--light-text)] mb-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          {/* TASK METADATA */}
                          <div className="flex items-center gap-3 flex-wrap mt-2">
                            {/* STATUS BADGE */}
                            {task.status && (
                              <div className="flex items-center gap-1.5">
                                <CircleDot
                                  size={14}
                                  className="text-[var(--accent-color)]"
                                />
                                <span className="text-xs text-[var(--light-text)] capitalize">
                                  {task.status.replace(
                                    "inprogress",
                                    "in progress"
                                  )}
                                </span>
                              </div>
                            )}
                            {/* DUE DATE */}
                            {task.dueDate && (
                              <div className="flex items-center gap-1.5">
                                <Clock
                                  size={14}
                                  className="text-[var(--light-text)]"
                                />
                                <span className="text-xs text-[var(--light-text)]">
                                  Due:{" "}
                                  {new Date(
                                    typeof task.dueDate === "string"
                                      ? task.dueDate
                                      : task.dueDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    // EMPTY TASKS STATE
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <CheckSquare
                        size={48}
                        className="text-[var(--light-text)] opacity-50"
                      />
                      <p className="text-[var(--light-text)] font-medium">
                        No tasks yet
                      </p>
                      <p className="text-sm text-[var(--light-text)] text-center">
                        Add tasks to track progress on this project.
                      </p>
                    </div>
                  )
                ) : activeTab === "comments" ? (
                  // COMMENTS TAB CONTENT
                  <div className="flex flex-col gap-3">
                    {/* ADD COMMENT INPUT */}
                    <div className="flex gap-2">
                      {/* COMMENT INPUT */}
                      <input
                        ref={commentInputRef}
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 border border-[var(--border)] p-2 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-[var(--text-primary)]"
                        onKeyDown={(e) => {
                          // CHECK IF ENTER KEY PRESSED
                          if (e.key === "Enter" && commentText.trim() !== "") {
                            // PREVENT DEFAULT BEHAVIOR
                            e.preventDefault();
                            // ADD COMMENT
                            handleAddComment();
                          }
                        }}
                        disabled={createCommentMutation.isPending}
                      />
                      {/* SEND BUTTON */}
                      <button
                        type="button"
                        onClick={(e) => {
                          // PREVENT DEFAULT BEHAVIOR
                          e.preventDefault();
                          // ADD COMMENT
                          handleAddComment();
                        }}
                        disabled={
                          !commentText.trim() ||
                          createCommentMutation.isPending ||
                          !projectId
                        }
                        className="px-3 py-2 rounded-md bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                    {/* COMMENTS LIST */}
                    {isLoadingComments ? (
                      // COMMENTS LOADING SKELETON
                      <ul className="flex flex-col gap-3 pb-2">
                        {[1, 2, 3].map((item) => (
                          <li
                            key={item}
                            className="border border-[var(--border)] p-3 rounded-lg"
                          >
                            <div className="h-4 w-3/4 bg-[var(--inside-card-bg)] rounded animate-pulse mb-2" />
                            <div className="h-3 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                          </li>
                        ))}
                      </ul>
                    ) : comments.length > 0 ? (
                      // MAPPING THROUGH COMMENTS
                      <ul className="flex flex-col gap-3 pb-2">
                        {comments.map((comment) => (
                          // COMMENT ITEM
                          <li
                            key={comment._id}
                            className="border border-[var(--border)] p-3 rounded-lg hover:bg-[var(--hover-bg)] transition"
                          >
                            {/* COMMENT HEADER */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              {/* COMMENT TEXT */}
                              <p className="text-sm text-[var(--text-primary)] flex-1">
                                {comment.text}
                              </p>
                              {/* DELETE BUTTON */}
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                disabled={deleteCommentMutation.isPending}
                                className="text-[var(--accent-color)] hover:opacity-75 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 p-1"
                                title="Delete comment"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            {/* COMMENT FOOTER */}
                            <div className="flex items-center gap-1.5">
                              <Clock
                                size={12}
                                className="text-[var(--light-text)]"
                              />
                              <span className="text-xs text-[var(--light-text)]">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      // EMPTY COMMENTS STATE
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <MessageSquare
                          size={48}
                          className="text-[var(--light-text)] opacity-50"
                        />
                        <p className="text-[var(--light-text)] font-medium">
                          No comments yet
                        </p>
                        <p className="text-sm text-[var(--light-text)] text-center">
                          Be the first to add a comment on this project.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // GITHUB TAB CONTENT
                  <ProjectGitHubTab
                    projectId={projectId || ""}
                    githubRepo={project?.githubRepo}
                    onShowFullSelector={() => setShowFullRepoSelector(true)}
                    onShowAIGenerator={() => setShowAIGenerator(true)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
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
