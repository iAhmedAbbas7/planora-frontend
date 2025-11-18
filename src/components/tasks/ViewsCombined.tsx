// <== IMPORTS ==>
import ListView from "./ListView";
import BoardView from "./BoardView";
import AddNewTask from "./AddNewTask";
import type { Task } from "../../types/task";
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
  // VIEW MODE STATE
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  // TASKS STATE
  const [tasks, setTasks] = useState<Task[]>([]);
  // LOADING STATE
  const [loading, setLoading] = useState<boolean>(true);
  // FETCH TASKS EFFECT (MOCK DATA - NO API)
  useEffect(() => {
    // SIMULATE API CALL
    setTimeout(() => {
      // SET EMPTY TASKS
      setTasks([]);
      // SET LOADING TO FALSE
      setLoading(false);
    }, 500);
  }, []);
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
      const url = new URL(window.location.href);
      url.searchParams.set("view", mode);
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
    // REMOVE TASK FROM STATE (UI ONLY - NO API)
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    // LOG DELETION (UI ONLY)
    console.log("Task deleted:", taskId);
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
            loading={loading}
            setTasks={setTasks}
            onTaskDeleted={handleDeleteTask}
            onTaskEdited={handleEditTask}
            parentModalOpen={isOpen}
          />
        ) : (
          // LIST VIEW
          <ListView
            tasks={filteredTasks}
            loading={loading}
            setTasks={setTasks}
            onTaskDeleted={handleDeleteTask}
            onTaskEdited={handleEditTask}
            parentModalOpen={isOpen}
          />
        )}
      </main>
      {/* ADD TASK MODAL */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--black-overlay)] z-50 overflow-y-auto">
          {/* MODAL CONTAINER */}
          <div className="bg-[var(--bg)] rounded-xl w-[90%] max-w-md p-6 relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 shadow-2xl rounded-full w-8.5 h-8.5 flex items-center justify-center text-violet-900 hover:bg-[var(--accent-btn-hover-color)] bg-[var(--accent-color)] cursor-pointer"
            >
              {/* CLOSE ICON */}
              <X size={18} />
            </button>
            {/* ADD NEW TASK FORM */}
            <AddNewTask
              onClose={() => setIsOpen(false)}
              onTaskAdded={(newTask) => {
                // CHECK IF TASK EXISTS
                setTasks((prev) => {
                  const exists = prev.some((t) => t._id === newTask._id);
                  // UPDATE OR ADD TASK
                  return exists
                    ? prev.map((t) => (t._id === newTask._id ? newTask : t))
                    : [...prev, newTask];
                });
                // CLOSE MODAL
                setIsOpen(false);
                // CLEAR TASK TO EDIT
                setTaskToEdit(null);
              }}
              initialTask={taskToEdit ?? undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewsCombined;
