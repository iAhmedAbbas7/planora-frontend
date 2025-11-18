// <== IMPORTS ==>
import { X } from "lucide-react";
import { useState, useEffect, JSX } from "react";

// <== PROJECT TYPE INTERFACE ==>
type Project = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
  // <== STATUS ==>
  status: string;
  // <== DUE DATE ==>
  dueDate: string;
  // <== PRIORITY ==>
  priority: string;
  // <== DESCRIPTION ==>
  description: string;
};
// <== TASK TYPE INTERFACE ==>
type Task = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description?: string;
  // <== DUE DATE ==>
  dueDate?: string;
  // <== STATUS ==>
  status?: string;
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
  // PROJECT STATE
  const [project, setProject] = useState<Project | null>(null);
  // TASKS STATE
  const [tasks, setTasks] = useState<Task[]>([]);
  // COMMENTS STATE
  const [comments, setComments] = useState<Comment[]>([]);
  // LOADING STATE
  const [loading, setLoading] = useState<boolean>(false);
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<"tasks" | "comments">("tasks");
  // FETCH PROJECT AND TASKS EFFECT (MOCK DATA - NO API)
  useEffect(() => {
    // CHECK IF PROJECT ID EXISTS
    if (!projectId) return;
    // SET LOADING
    setLoading(true);
    // SIMULATE API CALL (UI ONLY)
    setTimeout(() => {
      // MOCK PROJECT DATA
      const mockProject: Project = {
        _id: projectId,
        title: "Sample Project",
        status: "In Progress",
        dueDate: new Date().toISOString(),
        priority: "High",
        description: "This is a sample project description.",
      };
      // SET PROJECT
      setProject(mockProject);
      // SET EMPTY TASKS
      setTasks([]);
      // SET LOADING TO FALSE
      setLoading(false);
    }, 500);
  }, [projectId]);
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
          {/* PROJECT TITLE */}
          <p className="text-left text-xl text-[var(--primary-text)]">
            {loading ? "Loading..." : project?.title || "Project Details"}
          </p>
          {/* DUE DATE */}
          <div className="flex gap-6">
            {/* DUE DATE LABEL */}
            <p className="font-medium text-[var(--light-text)]">Due Date</p>
            {/* DUE DATE VALUE */}
            <p>
              {project?.dueDate
                ? new Date(project.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
          {/* STATUS */}
          <div className="flex gap-10">
            {/* STATUS LABEL */}
            <span className="font-medium text-[var(--light-text)]">Status</span>
            {/* STATUS BADGE */}
            <span
              className={`px-2 py-0.5 rounded-full flex justify-center items-center text-xs ${
                project?.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : project?.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-violet-100 text-violet-700"
              }`}
            >
              {project?.status || "Unknown"}
            </span>
          </div>
          {/* PRIORITY */}
          <div className="flex gap-10">
            {/* PRIORITY LABEL */}
            <p className="font-medium text-[var(--light-text)]">Priority</p>
            {/* PRIORITY VALUE */}
            <p>{project?.priority || "N/A"}</p>
          </div>
        </main>
        {/* DESCRIPTION SECTION */}
        <div className="flex flex-col p-4 pt-2 pb-2 gap-2">
          {/* DESCRIPTION LABEL */}
          <p className="text-left text-base">Description:</p>
          {/* DESCRIPTION TEXT */}
          <p className="text-left text-[var(--light-text)]">
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
              className={`px-4 py-2 font-medium cursor-pointer ${
                activeTab === "tasks"
                  ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                  : "text-[var(--light-text)] hover:text-[var(--primary-text)]"
              }`}
            >
              Tasks
            </button>
            {/* COMMENTS TAB */}
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-4 py-2 font-medium cursor-pointer ${
                activeTab === "comments"
                  ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                  : "text-[var(--light-text)] hover:text-[var(--primary-text)]"
              }`}
            >
              Comments
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
                      className="border border-[var(--border)] p-3 rounded-lg hover:bg-[var(--hover-bg)] transition"
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
                          Due: {new Date(task.dueDate).toLocaleDateString()}
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
    </>
  );
};

export default ProjectDetails;
