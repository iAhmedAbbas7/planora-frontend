// <== IMPORTS ==>
import ListView from "./ListView";
import BoardView from "./BoardView";
import AddNewTask from "./AddNewTask";
import type { Task } from "../../types/task";
import { useEffect, useState, JSX } from "react";
import ConfirmationModal from "../common/ConfirmationModal";
import { useTasks, useDeleteTask } from "../../hooks/useTasks";
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
  const { tasks: fetchedTasks, refetchTasks, isLoading } = useTasks();
  // DELETE TASK MUTATION
  const deleteTaskMutation = useDeleteTask();
  // VIEW MODE STATE
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
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
            <div className="flex gap-2">
              {/* LIST VIEW BUTTON */}
              <button
                onClick={() => handleViewChange("list")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md cursor-pointer transition-colors ${
                  viewMode === "list"
                    ? "border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] hover:text-white"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              {/* BOARD VIEW BUTTON */}
              <button
                onClick={() => handleViewChange("board")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md cursor-pointer transition-colors ${
                  viewMode === "board"
                    ? "border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] hover:text-white"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Board</span>
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
        {viewMode === "board" ? (
          // BOARD VIEW
          <BoardView
            tasks={tasks}
            filteredTasks={filteredTasks}
            searchTerm={searchTerm}
            loading={isLoading}
            hasLoaded={hasLoaded}
            setTasks={setTasks}
            onTaskDeleted={handleDeleteTask}
            onTaskEdited={handleEditTask}
            parentModalOpen={isOpen}
          />
        ) : (
          // LIST VIEW
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
