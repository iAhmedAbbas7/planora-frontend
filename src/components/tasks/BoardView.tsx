// <== IMPORTS ==>
import {
  useEffect,
  useRef,
  useState,
  JSX,
  Dispatch,
  SetStateAction,
} from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import AddNewTask from "./AddNewTask";
import type { Task } from "../../types/task";
import ActionDropdown from "./dropdown/ActionDropdown";
import { MoreHorizontal, Plus, X, ClipboardList } from "lucide-react";

// <== BOARD VIEW PROPS TYPE INTERFACE ==>
type Props = {
  // <== TASKS ==>
  tasks: Task[];
  // <== LOADING ==>
  loading: boolean;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  // <== ON TASK DELETED FUNCTION ==>
  onTaskDeleted?: (taskId: string) => void;
  // <== ON TASK EDITED FUNCTION ==>
  onTaskEdited?: (taskId: string) => void;
  // <== PARENT MODAL OPEN ==>
  parentModalOpen?: boolean;
};

// <== BOARD VIEW COMPONENT ==>
const BoardView = ({
  tasks,
  loading,
  setTasks,
  onTaskDeleted,
  onTaskEdited,
  parentModalOpen,
}: Props): JSX.Element => {
  // SELECTED ITEMS STATE
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // DROPDOWN OPEN STATE
  const [isDropdownOpen, setDropdownIsOpen] = useState<boolean>(false);
  // MODAL OPEN STATE
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // TASK TO EDIT STATE
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  // COLUMN STATUS FOR NEW TASK STATE
  const [newTaskStatus, setNewTaskStatus] = useState<Task["status"] | null>(
    null
  );
  // DROPDOWN TASK ID STATE
  const [dropdownTaskId, setDropdownTaskId] = useState<string | null>(null);
  // DROPDOWN POSITION STATE
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // HANDLE DELETE TASK FUNCTION
  const handleDeleteTask = (taskId: string): void => {
    // REMOVE TASK FROM STATE (UI ONLY - NO API)
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    // LOG DELETION (UI ONLY)
    console.log("Task deleted:", taskId);
    // CALL ON TASK DELETED CALLBACK
    onTaskDeleted?.(taskId);
  };
  // HANDLE CANCEL FUNCTION
  const handleCancel = (): void => {
    // CLEAR SELECTED ITEMS
    setSelectedItems([]);
  };
  // OPEN DROPDOWN FUNCTION
  const openDropdown = (e: React.MouseEvent, taskId: string): void => {
    // GET BUTTON POSITION
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    // GET DROPDOWN WIDTH
    const dropdownWidth = 150;
    // CALCULATE SPACE ON RIGHT
    const spaceRight = window.innerWidth - rect.right;
    // CALCULATE LEFT POSITION
    const left =
      spaceRight > dropdownWidth
        ? rect.right + window.scrollX
        : rect.left - dropdownWidth + window.scrollX;
    // SET DROPDOWN TASK ID
    setDropdownTaskId(taskId);
    // SET DROPDOWN POSITION
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: left,
    });
  };
  // CLOSE DROPDOWN FUNCTION
  const closeDropdown = (): void => {
    // CLOSE DROPDOWN
    setDropdownTaskId(null);
  };
  // HANDLE CLICK OUTSIDE EFFECT
  useEffect(() => {
    // HANDLE CLICK OUTSIDE FUNCTION
    const handleClickOutside = (event: MouseEvent): void => {
      // CHECK IF CLICK IS OUTSIDE DROPDOWN
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // CLOSE DROPDOWN
        closeDropdown();
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  // CLOSE DROPDOWN WHEN MODAL OPENS EFFECT
  useEffect(() => {
    // CLOSE DROPDOWN IF MODAL IS OPEN
    if (isOpen || parentModalOpen) setDropdownTaskId(null);
  }, [isOpen, parentModalOpen]);
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
  // COLUMNS CONFIGURATION
  const columns = [
    {
      id: "to do",
      title: "To Do",
      color: "border-l-violet-500",
      dot: "bg-violet-500",
    },
    {
      id: "in progress",
      title: "In Progress",
      color: "border-l-yellow-500",
      dot: "bg-yellow-500",
    },
    {
      id: "completed",
      title: "Completed",
      color: "border-l-green-500",
      dot: "bg-green-500",
    },
  ];
  // REORDER FUNCTION
  const reorder = (
    list: Task[],
    startIndex: number,
    endIndex: number
  ): Task[] => {
    // CREATE RESULT ARRAY
    const result = Array.from(list);
    // REMOVE ITEM FROM START INDEX
    const [removed] = result.splice(startIndex, 1);
    // INSERT ITEM AT END INDEX
    result.splice(endIndex, 0, removed);
    // RETURN RESULT
    return result;
  };
  // ON DRAG END FUNCTION
  const onDragEnd = (result: DropResult): void => {
    // CHECK IF NO DESTINATION
    if (!result.destination) return;
    // GET SOURCE AND DESTINATION
    const { source, destination, draggableId } = result;
    // UPDATE TASKS STATE
    setTasks((prev) => {
      // GET SOURCE TASKS
      const sourceTasks = prev.filter(
        (task) => task.status === source.droppableId
      );
      // CHECK IF MOVING WITHIN SAME COLUMN
      if (source.droppableId === destination.droppableId) {
        // REORDER TASKS
        const reordered = reorder(sourceTasks, source.index, destination.index);
        // RETURN UPDATED TASKS
        return prev.map((task) =>
          task.status !== source.droppableId
            ? task
            : reordered.find((t) => t._id === task._id) || task
        );
      }
      // MOVING ACROSS COLUMNS
      const newStatus = destination.droppableId as Task["status"];
      // UPDATE TASK STATUS (UI ONLY - NO API)
      const updatedTasks = prev.map((task) =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      );
      // LOG STATUS UPDATE (UI ONLY)
      console.log("Task status updated:", draggableId, newStatus);
      // RETURN UPDATED TASKS
      return updatedTasks;
    });
  };
  // SHOW LOADING STATE IF LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--primary-text)]">Loading tasks...</p>
      </div>
    );
  }
  // RETURNING THE BOARD VIEW COMPONENT
  return (
    // DRAG DROP CONTEXT
    <DragDropContext onDragEnd={onDragEnd}>
      {/* COLUMNS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start relative">
        {/* MAPPING THROUGH COLUMNS */}
        {columns.map((col) => {
          // FILTER TASKS BY STATUS
          const filteredTasks = tasks.filter((task) => task.status === col.id);
          return (
            // COLUMN CONTAINER
            <div
              key={col.id}
              className="bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] rounded-xl shadow-sm p-4 flex flex-col"
            >
              {/* COLUMN HEADER */}
              <div className="flex items-center justify-between mb-3">
                {/* COLUMN TITLE CONTAINER */}
                <div className="flex items-center gap-2">
                  {/* STATUS DOT */}
                  <span className={`w-3 h-3 rounded-full ${col.dot}`}></span>
                  {/* COLUMN TITLE */}
                  <h2 className="font-semibold">{col.title}</h2>
                </div>
                {/* SELECT ALL CHECKBOX */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-[var(--accent-color)] cursor-pointer"
                    checked={
                      filteredTasks.length > 0 &&
                      filteredTasks.every((task) =>
                        selectedItems.includes(task._id)
                      )
                    }
                    onClick={() => setDropdownIsOpen(!isDropdownOpen)}
                    onChange={(e) => {
                      // GET CHECKED STATE
                      const isChecked = e.target.checked;
                      // GET TASK IDS FROM COLUMN
                      const taskIds = filteredTasks.map((task) => task._id);
                      // UPDATE SELECTED ITEMS
                      setSelectedItems((prev) =>
                        isChecked
                          ? Array.from(new Set([...prev, ...taskIds]))
                          : prev.filter((id) => !taskIds.includes(id))
                      );
                    }}
                  />
                </div>
              </div>
              {/* DROPPABLE AREA */}
              <Droppable droppableId={col.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-col gap-3 flex-1 min-h-[100px] max-h-[600px] overflow-y-auto relative z-0"
                  >
                    {/* CHECK IF TASKS EXIST */}
                    {filteredTasks.length > 0 ? (
                      // MAPPING THROUGH TASKS
                      filteredTasks.map((task, index) => (
                        // DRAGGABLE TASK
                        <Draggable
                          key={task._id}
                          draggableId={task._id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            // TASK CARD
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                transform: snapshot.isDragging
                                  ? provided.draggableProps.style?.transform
                                  : "none",
                                transition: snapshot.isDragging
                                  ? "transform 0.1s ease"
                                  : undefined,
                                zIndex: snapshot.isDragging ? 9999 : "auto",
                                position: snapshot.isDragging
                                  ? "relative"
                                  : "static",
                              }}
                              className={`bg-[var(--inside-card-bg)] rounded-lg shadow-sm border border-[var(--border)] p-3 border-l-4 ${
                                col.color
                              } ${
                                snapshot.isDragging
                                  ? "shadow-xl scale-[1.03] border-l-8"
                                  : ""
                              }`}
                            >
                              {/* TASK HEADER */}
                              <div className="flex justify-between items-center mb-2">
                                {/* TASK TITLE */}
                                <p className="text-sm font-medium">
                                  {task.title}
                                </p>
                                {/* TASK ACTIONS */}
                                <div className="flex items-center gap-2">
                                  {/* SELECT CHECKBOX */}
                                  <input
                                    type="checkbox"
                                    checked={selectedItems.includes(task._id)}
                                    onChange={() => {
                                      // TOGGLE SELECTION
                                      setSelectedItems((prev) =>
                                        prev.includes(task._id)
                                          ? prev.filter((id) => id !== task._id)
                                          : [...prev, task._id]
                                      );
                                    }}
                                    className="accent-[var(--accent-color)] cursor-pointer"
                                  />
                                  {/* DROPDOWN BUTTON */}
                                  <button
                                    className="text-[var(--light-text)] hover:text-[var(--primary-text)] cursor-pointer"
                                    onClick={(e) => openDropdown(e, task._id)}
                                  >
                                    <MoreHorizontal size={16} />
                                  </button>
                                </div>
                              </div>
                              {/* TASK DESCRIPTION */}
                              <p className="text-xs mb-2">
                                {task.description || "No description"}
                              </p>
                              {/* TASK FOOTER */}
                              <div className="flex justify-between text-xs text-[var(--light-text)]">
                                {/* DUE DATE */}
                                <p>
                                  {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "long",
                                          day: "numeric",
                                          year: "numeric",
                                        }
                                      )
                                    : "No due date"}
                                </p>
                                {/* PRIORITY */}
                                <p
                                  className={`font-medium ${
                                    task.priority === "high"
                                      ? "text-[var(--high-priority-color)]"
                                      : "text-[var(--light-text)]"
                                  }`}
                                >
                                  {task.priority?.toUpperCase() || "—"}
                                </p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      // EMPTY STATE
                      <div className="flex flex-col items-center justify-center py-8 gap-3">
                        {/* EMPTY STATE ICON */}
                        <ClipboardList
                          size={48}
                          className="text-[var(--light-text)] opacity-50"
                        />
                        {/* EMPTY STATE TEXT */}
                        <p className="text-sm text-[var(--light-text)] text-center">
                          No tasks yet
                        </p>
                      </div>
                    )}
                    {/* PLACEHOLDER */}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {/* ADD TASK BUTTON */}
              <button
                className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-[var(--accent-color)] cursor-pointer text-[var(--primary-text)] rounded-lg transition"
                onClick={() => {
                  setDropdownTaskId(null);
                  setTaskToEdit(null);
                  setNewTaskStatus(col.id as Task["status"]);
                  setTimeout(() => setIsOpen(true), 0);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--accent-btn-hover-color)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--primary-text)";
                }}
              >
                {/* PLUS ICON */}
                <Plus size={16} />
                {/* BUTTON TEXT */}
                <span className="text-sm font-medium">Add Task</span>
              </button>
            </div>
          );
        })}
      </div>
      {/* FLOATING ACTION BAR */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--cards-bg)] border border-[var(--border)] shadow-lg px-4 sm:px-6 py-3 rounded-xl flex gap-3 sm:gap-4 items-center animate-fadeIn z-50">
          {/* SELECTED COUNT */}
          <p className="text-sm text-[var(--primary-text)]">
            {selectedItems.length} selected
          </p>
          {/* CANCEL BUTTON */}
          <button
            className="px-3 py-1.5 text-sm bg-[var(--inside-card-bg)] rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer text-[var(--primary-text)]"
            onClick={handleCancel}
          >
            Cancel
          </button>
          {/* DELETE BUTTON */}
          <button
            className="px-3 py-1.5 text-sm cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={() => {
              // DELETE SELECTED TASKS
              selectedItems.forEach((taskId) => {
                handleDeleteTask(taskId);
              });
              // CLEAR SELECTION
              setSelectedItems([]);
            }}
          >
            Delete
          </button>
        </div>
      )}
      {/* DROPDOWN MENU */}
      {dropdownTaskId && (
        <div
          className="fixed z-[99999]"
          ref={dropdownRef}
          style={{
            top: dropdownPosition.top + 2,
            left: dropdownPosition.left,
          }}
        >
          <ActionDropdown
            onEditTask={() => {
              // FIND TASK TO EDIT
              const task = tasks.find((t) => t._id === dropdownTaskId);
              if (task) {
                // SET TASK TO EDIT
                setTaskToEdit(task);
                // CLOSE DROPDOWN
                closeDropdown();
                // OPEN MODAL
                setIsOpen(true);
              }
            }}
            onDeleteTask={() => {
              onTaskDeleted?.(dropdownTaskId!);
              closeDropdown();
            }}
          />
        </div>
      )}
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
                  setNewTaskStatus(null);
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
                  setNewTaskStatus(null);
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
                  // CALL ON TASK EDITED IF EDITING
                  if (taskToEdit) {
                    onTaskEdited?.(newTask._id);
                  }
                  // CLOSE MODAL
                  setIsOpen(false);
                  // CLEAR TASK TO EDIT
                  setTaskToEdit(null);
                  // CLEAR NEW TASK STATUS
                  setNewTaskStatus(null);
                }}
                initialTask={
                  taskToEdit
                    ? taskToEdit
                    : newTaskStatus
                    ? { status: newTaskStatus }
                    : undefined
                }
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
                  setNewTaskStatus(null);
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
    </DragDropContext>
  );
};

export default BoardView;
