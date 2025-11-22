// <== IMPORTS ==>
import ListView from "./ListView";
import BoardView from "./BoardView";
import AddNewTask from "./AddNewTask";
import type { Task } from "../../types/task";
import { useTasks } from "../../hooks/useTasks";
import { useEffect, useState, JSX } from "react";
import { Search, List, LayoutGrid, Plus, X } from "lucide-react";

// <== VIEWS COMBINED COMPONENT ==>
const ViewsCombined = (): JSX.Element => {
  // MODAL OPEN STATE
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // SEARCH TERM STATE
  const [searchTerm, setSearchTerm] = useState<string>("");
  // TASK TO EDIT STATE
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  // PREVENT BACKGROUND SCROLLING WHEN MODAL IS OPEN
  useEffect(() => {
    if (isOpen) {
      // SAVE ORIGINAL OVERFLOW STYLE
      const originalOverflow = document.body.style.overflow;
      // DISABLE BODY SCROLLING
      document.body.style.overflow = "hidden";
      // CLEANUP: RESTORE ORIGINAL OVERFLOW ON UNMOUNT OR WHEN MODAL CLOSES
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);
  // GET TASKS DATA FROM HOOK
  const { tasks: fetchedTasks, refetchTasks } = useTasks();
  // VIEW MODE STATE
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  // TASKS STATE (LOCAL STATE FOR UI UPDATES)
  const [tasks, setTasks] = useState<Task[]>([]);
  // UPDATE TASKS FROM FETCHED DATA
  useEffect(() => {
    // UPDATE TASKS FROM API
    if (fetchedTasks) {
      // SET TASKS FROM FETCHED DATA
      setTasks(fetchedTasks as Task[]);
    }
  }, [fetchedTasks]);
  // GET VIEW MODE FROM URL PARAMS EFFECT
  useEffect(() => {
    // CHECK IF WINDOW EXISTS
    if (typeof window !== "undefined") {
      // GET URL PARAMS
      const params = new URLSearchParams(window.location.search);
      // GET VIEW MODE FROM PARAMS
      const view = params.get("view") as "board" | "list";
      // SET VIEW MODE IF EXISTS
      if (view) setViewMode(view);
    }
  }, []);
  // HANDLE VIEW CHANGE FUNCTION
  const handleViewChange = (mode: "board" | "list"): void => {
    // SET VIEW MODE
    setViewMode(mode);
    // UPDATE URL PARAMS
    if (typeof window !== "undefined") {
      // GET URL
      const url = new URL(window.location.href);
      // SET VIEW MODE IN URL PARAMS
      url.searchParams.set("view", mode);
      // PUSH STATE TO URL
      window.history.pushState({}, "", url);
    }
  };
  // FILTER TASKS
  const filteredTasks = tasks.filter((task) =>
    [task.title, task.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  // HANDLE DELETE TASK FUNCTION
  const handleDeleteTask = (taskId: string): void => {
    // REMOVE TASK FROM STATE
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    // REFETCH TASKS TO GET UPDATED DATA
    refetchTasks();
  };
  // HANDLE EDIT TASK FUNCTION
  const handleEditTask = (taskId: string): void => {
    // FIND TASK
    const task = tasks.find((t) => t._id === taskId);
    // CHECK IF TASK EXISTS
    if (task) {
      // SET TASK TO EDIT
      setTaskToEdit(task);
      // OPEN MODAL
      setIsOpen(true);
    }
  };
  // RETURNING THE VIEWS COMBINED COMPONENT
  return (
    // VIEWS COMBINED MAIN CONTAINER
    <div className="p-4 rounded-2xl flex flex-col w-full border border-[var(--border)]">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        {/* SEARCH CONTAINER */}
        <div className="relative w-full sm:w-64">
          {/* SEARCH ICON */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--light-text)]" />
          {/* SEARCH INPUT */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search task..."
            className="border border-[var(--border-color)] pl-10 pr-3 py-2 rounded-xl w-full focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm"
          />
        </div>
        {/* ACTIONS CONTAINER */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-3">
          {/* TOGGLE VIEW BUTTONS */}
          <div className="flex gap-2">
            {/* LIST VIEW BUTTON */}
            <button
              onClick={() => handleViewChange("list")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded-xl cursor-pointer ${
                viewMode === "list"
                  ? "bg-[var(--inside-card-bg)] border-[var(--accent-color)] text-[var(--accent-color)]"
                  : "border-[var(--border-color)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              {/* LIST ICON */}
              <List className="h-4 w-4" />
              {/* BUTTON TEXT */}
              <span className="hidden sm:inline">List</span>
            </button>
            {/* BOARD VIEW BUTTON */}
            <button
              onClick={() => handleViewChange("board")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded-xl cursor-pointer ${
                viewMode === "board"
                  ? "bg-[var(--inside-card-bg)] border-[var(--accent-color)] text-[var(--accent-color)]"
                  : "border-[var(--border)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              {/* LAYOUT GRID ICON */}
              <LayoutGrid className="h-4 w-4" />
              {/* BUTTON TEXT */}
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>
          {/* ADD TASK BUTTON */}
          <button
            onClick={() => {
              setTaskToEdit(null);
              setIsOpen(true);
            }}
            style={{ backgroundColor: "var(--accent-color)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--accent-btn-hover-color)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent-color)")
            }
            className="px-4 sm:px-5 py-2 flex items-center justify-center gap-1 rounded-full text-white text-sm shadow cursor-pointer"
          >
            {/* PLUS ICON */}
            <Plus className="h-4 w-4" />
            {/* BUTTON TEXT */}
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </header>
      {/* MAIN CONTENT */}
      <main className="overflow-x-auto">
        {/* RENDER VIEW MODE */}
        {viewMode === "board" ? (
          // BOARD VIEW
          <BoardView
            tasks={filteredTasks}
            loading={false}
            setTasks={setTasks}
            onTaskDeleted={handleDeleteTask}
            onTaskEdited={handleEditTask}
            parentModalOpen={isOpen}
          />
        ) : (
          // LIST VIEW
          <ListView
            tasks={filteredTasks}
            loading={false}
            setTasks={setTasks}
            onTaskDeleted={handleDeleteTask}
            onTaskEdited={handleEditTask}
            parentModalOpen={isOpen}
          />
        )}
      </main>
      {/* ADD TASK MODAL */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--black-overlay)] z-50 p-2 sm:p-4">
          {/* MODAL CONTAINER */}
          <div className="bg-[var(--bg)] rounded-xl w-full max-w-md max-h-[95vh] flex flex-col relative overflow-hidden">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-3 sm:p-4 pb-2 border-b border-[var(--border)] flex-shrink-0">
              {/* MODAL TITLE */}
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {taskToEdit ? "Edit Task" : "Add Task"}
              </h2>
              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTaskToEdit(null);
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
                onClose={() => {
                  setIsOpen(false);
                  setTaskToEdit(null);
                }}
                onTaskAdded={(newTask) => {
                  // CHECK IF TASK EXISTS
                  setTasks((prev) => {
                    const exists = prev.some((t) => t._id === newTask._id);
                    // UPDATE OR ADD TASK
                    return exists
                      ? prev.map((t) => (t._id === newTask._id ? newTask : t))
                      : [...prev, newTask];
                  });
                  // REFETCH TASKS TO GET UPDATED DATA
                  refetchTasks();
                  // CLOSE MODAL
                  setIsOpen(false);
                  // CLEAR TASK TO EDIT
                  setTaskToEdit(null);
                }}
                initialTask={taskToEdit ?? undefined}
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
                  setIsOpen(false);
                  setTaskToEdit(null);
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
                {taskToEdit ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewsCombined;
