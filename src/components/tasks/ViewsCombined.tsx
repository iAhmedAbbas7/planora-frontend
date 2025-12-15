// <== IMPORTS ==>
import {
  Search,
  List,
  LayoutGrid,
  Plus,
  X,
  ClipboardList,
  Check,
  Calendar,
  Table2,
  GanttChart,
} from "lucide-react";
import ListView from "./ListView";
import BoardView from "./BoardView";
import TableView from "./TableView";
import AddNewTask from "./AddNewTask";
import CalendarView from "./CalendarView";
import TimelineView from "./TimelineView";
import type { Task } from "../../types/task";
import { useEffect, useState, JSX } from "react";
import ConfirmationModal from "../common/ConfirmationModal";
import { useTasks, useDeleteTask } from "../../hooks/useTasks";

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
    // IF MODAL IS OPEN, PREVENT BACKGROUND SCROLLING
    if (isOpen) {
      // SAVE ORIGINAL OVERFLOW STYLE
      const originalOverflow = document.body.style.overflow;
      // DISABLE BODY SCROLLING
      document.body.style.overflow = "hidden";
      // CLEANUP: RESTORE ORIGINAL OVERFLOW ON UNMOUNT OR WHEN MODAL CLOSES
      return () => {
        // RESTORE ORIGINAL OVERFLOW STYLE
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);
  // GET TASKS DATA FROM HOOK
  const { tasks: fetchedTasks, refetchTasks, isLoading } = useTasks();
  // DELETE TASK MUTATION
  const deleteTaskMutation = useDeleteTask();
  // VIEW MODE STATE
  const [viewMode, setViewMode] = useState<
    "board" | "list" | "table" | "calendar" | "timeline"
  >("board");
  // TASKS STATE (LOCAL STATE FOR UI UPDATES)
  const [tasks, setTasks] = useState<Task[]>(
    Array.isArray(fetchedTasks) ? (fetchedTasks as Task[]) : []
  );
  // HAS LOADED STATE (TO TRACK IF DATA HAS BEEN LOADED AT LEAST ONCE)
  const [hasLoaded, setHasLoaded] = useState<boolean>(
    Array.isArray(fetchedTasks) && fetchedTasks.length >= 0
  );
  // UPDATE TASKS FROM FETCHED DATA
  useEffect(() => {
    // UPDATE TASKS FROM API
    if (fetchedTasks) {
      // SET TASKS FROM FETCHED DATA
      setTasks(fetchedTasks as Task[]);
      // MARK AS LOADED
      setHasLoaded(true);
    }
  }, [fetchedTasks]);
  // GET VIEW MODE FROM URL PARAMS EFFECT
  useEffect(() => {
    // CHECK IF WINDOW EXISTS
    if (typeof window !== "undefined") {
      // GET URL PARAMS
      const params = new URLSearchParams(window.location.search);
      // GET VIEW MODE FROM PARAMS
      const view = params.get("view") as
        | "board"
        | "list"
        | "table"
        | "calendar"
        | "timeline";
      // SET VIEW MODE IF EXISTS AND VALID
      if (
        view &&
        ["board", "list", "table", "calendar", "timeline"].includes(view)
      ) {
        setViewMode(view);
      }
    }
  }, []);
  // HANDLE EDIT TASK FROM URL PARAMS EFFECT
  useEffect(() => {
    // CHECK IF WINDOW EXISTS AND TASKS ARE LOADED
    if (typeof window !== "undefined" && tasks.length > 0) {
      // GET URL PARAMS
      const params = new URLSearchParams(window.location.search);
      // GET EDIT TASK ID FROM PARAMS
      const editTaskId = params.get("edit");
      // IF EDIT TASK ID EXISTS, OPEN EDIT MODAL
      if (editTaskId) {
        // FIND TASK BY ID
        const taskToEditFromUrl = tasks.find((t) => t._id === editTaskId);
        // IF TASK FOUND, OPEN EDIT MODAL
        if (taskToEditFromUrl) {
          // SET TASK TO EDIT
          setTaskToEdit(taskToEditFromUrl);
          // OPEN MODAL
          setIsOpen(true);
          // GET URL
          const url = new URL(window.location.href);
          // DELETE EDIT PARAM FROM URL
          url.searchParams.delete("edit");
          // REPLACE STATE IN URL
          window.history.replaceState({}, "", url);
        }
      }
    }
  }, [tasks]);
  // HANDLE VIEW CHANGE FUNCTION
  const handleViewChange = (
    mode: "board" | "list" | "table" | "calendar" | "timeline"
  ): void => {
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
  // CONFIRMATION MODAL STATE
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    taskId: string | null;
    taskTitle: string;
    isBulkDelete: boolean;
    taskIds: string[];
  }>({
    isOpen: false,
    taskId: null,
    taskTitle: "",
    isBulkDelete: false,
    taskIds: [],
  });
  // HANDLE DELETE TASK FUNCTION
  const handleDeleteTask = (taskId: string): void => {
    // FIND TASK
    const task = tasks.find((t) => t._id === taskId);
    // SHOW CONFIRMATION MODAL
    setConfirmationModal({
      isOpen: true,
      taskId,
      taskTitle: task?.title || "this task",
      isBulkDelete: false,
      taskIds: [],
    });
  };
  // HANDLE BULK DELETE FUNCTION
  const handleBulkDelete = (taskIds: string[]): void => {
    // SHOW CONFIRMATION MODAL
    setConfirmationModal({
      isOpen: true,
      taskId: null,
      taskTitle: "",
      isBulkDelete: true,
      taskIds,
    });
  };
  // HANDLE CONFIRM DELETE FUNCTION
  const handleConfirmDelete = (): void => {
    // CHECK IF BULK DELETE
    if (
      confirmationModal.isBulkDelete &&
      confirmationModal.taskIds.length > 0
    ) {
      // DELETE ALL TASKS
      const deletePromises = confirmationModal.taskIds.map((taskId) =>
        deleteTaskMutation.mutateAsync(taskId)
      );
      // WAIT FOR ALL DELETIONS
      Promise.all(deletePromises)
        .then(() => {
          // REMOVE TASKS FROM STATE
          setTasks((prev) =>
            prev.filter((t) => !confirmationModal.taskIds.includes(t._id))
          );
          // REFETCH TASKS TO GET UPDATED DATA
          refetchTasks();
          // CLOSE CONFIRMATION MODAL
          setConfirmationModal({
            isOpen: false,
            taskId: null,
            taskTitle: "",
            isBulkDelete: false,
            taskIds: [],
          });
        })
        .catch(() => {
          // ERROR HANDLING IS DONE IN THE MUTATION
        });
    } else if (confirmationModal.taskId) {
      // DELETE SINGLE TASK
      deleteTaskMutation.mutate(confirmationModal.taskId, {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // REMOVE TASK FROM STATE
          setTasks((prev) =>
            prev.filter((t) => t._id !== confirmationModal.taskId)
          );
          // REFETCH TASKS TO GET UPDATED DATA
          refetchTasks();
          // CLOSE CONFIRMATION MODAL
          setConfirmationModal({
            isOpen: false,
            taskId: null,
            taskTitle: "",
            isBulkDelete: false,
            taskIds: [],
          });
        },
      });
    }
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--accent-color)]" />
          {/* SEARCH INPUT */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search all tasks"
            className="border border-[var(--border)] pl-10 pr-3 py-2 rounded-xl w-full focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm bg-transparent text-[var(--text-primary)]"
          />
        </div>
        {/* ACTIONS CONTAINER */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* ACTIONS */}
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-3">
            {/* TOGGLE VIEW BUTTONS */}
            <div className="flex gap-1 p-1 bg-[var(--hover-bg)] rounded-lg">
              {/* BOARD VIEW BUTTON */}
              <button
                onClick={() => handleViewChange("board")}
                className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                  viewMode === "board"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
                title="Board View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Board</span>
              </button>
              {/* LIST VIEW BUTTON */}
              <button
                onClick={() => handleViewChange("list")}
                className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                  viewMode === "list"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
                title="List View"
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden md:inline">List</span>
              </button>
              {/* TABLE VIEW BUTTON */}
              <button
                onClick={() => handleViewChange("table")}
                className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                  viewMode === "table"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
                title="Table View"
              >
                <Table2 className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Table</span>
              </button>
              {/* CALENDAR VIEW BUTTON */}
              <button
                onClick={() => handleViewChange("calendar")}
                className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                  viewMode === "calendar"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
                title="Calendar View"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Calendar</span>
              </button>
              {/* TIMELINE VIEW BUTTON */}
              <button
                onClick={() => handleViewChange("timeline")}
                className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                  viewMode === "timeline"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
                title="Timeline View"
              >
                <GanttChart className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Timeline</span>
              </button>
            </div>
            {/* ADD TASK BUTTON */}
            <button
              onClick={() => {
                setTaskToEdit(null);
                setIsOpen(true);
              }}
              className="px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-center gap-1.5 sm:gap-2 rounded-md text-xs sm:text-sm border border-[var(--border)] text-[var(--accent-color)] font-medium hover:bg-[var(--accent-btn-hover-color)] hover:text-white cursor-pointer transition-colors"
            >
              {/* PLUS ICON */}
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {/* BUTTON TEXT */}
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </div>
      </header>
      {/* MAIN CONTENT */}
      <main className="overflow-x-auto">
        {/* RENDER VIEW MODE */}
        {viewMode === "board" && (
          <BoardView
            tasks={tasks}
            filteredTasks={filteredTasks}
            searchTerm={searchTerm}
            loading={isLoading}
            hasLoaded={hasLoaded}
            setTasks={setTasks}
            onTaskDeleted={handleDeleteTask}
            onTaskEdited={handleEditTask}
            onBulkDelete={handleBulkDelete}
            parentModalOpen={isOpen}
          />
        )}
        {viewMode === "list" && (
          <ListView
            tasks={tasks}
            filteredTasks={filteredTasks}
            searchTerm={searchTerm}
            loading={isLoading}
            hasLoaded={hasLoaded}
            setTasks={setTasks}
            onTaskDeleted={handleDeleteTask}
            onTaskEdited={handleEditTask}
            onBulkDelete={handleBulkDelete}
            parentModalOpen={isOpen}
          />
        )}
        {viewMode === "table" && (
          <TableView
            tasks={tasks}
            filteredTasks={filteredTasks}
            searchTerm={searchTerm}
            loading={isLoading}
            hasLoaded={hasLoaded}
            onTaskDeleted={handleDeleteTask}
            onTaskEdited={handleEditTask}
            onBulkDelete={handleBulkDelete}
          />
        )}
        {viewMode === "calendar" && (
          <CalendarView
            tasks={tasks}
            filteredTasks={filteredTasks}
            searchTerm={searchTerm}
            loading={isLoading}
            hasLoaded={hasLoaded}
            onTaskEdited={handleEditTask}
          />
        )}
        {viewMode === "timeline" && (
          <TimelineView
            tasks={tasks}
            filteredTasks={filteredTasks}
            searchTerm={searchTerm}
            loading={isLoading}
            hasLoaded={hasLoaded}
            onTaskEdited={handleEditTask}
          />
        )}
      </main>
      {/* ADD TASK MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-[var(--black-overlay)] z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
              setTaskToEdit(null);
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
                    {taskToEdit ? "Edit Task" : "Create New Task"}
                  </h2>
                  <p className="text-xs text-[var(--light-text)]">
                    {taskToEdit
                      ? "Update task details"
                      : "Add a new task to your project"}
                  </p>
                </div>
              </div>
              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTaskToEdit(null);
                }}
                className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <X size={20} />
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
            <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
              {/* CANCEL BUTTON */}
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] cursor-pointer transition"
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
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer transition flex items-center gap-2"
              >
                <Check size={16} />
                {taskToEdit ? "Update Task" : "Create Task"}
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
            taskId: null,
            taskTitle: "",
            isBulkDelete: false,
            taskIds: [],
          })
        }
        onConfirm={handleConfirmDelete}
        title={confirmationModal.isBulkDelete ? "Delete Tasks" : "Delete Task"}
        message={
          confirmationModal.isBulkDelete
            ? `Are you sure you want to delete ${confirmationModal.taskIds.length} task(s)? This action cannot be undone.`
            : `Are you sure you want to delete "${confirmationModal.taskTitle}"? This action cannot be undone.`
        }
        type="warning"
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
      />
    </div>
  );
};

export default ViewsCombined;
