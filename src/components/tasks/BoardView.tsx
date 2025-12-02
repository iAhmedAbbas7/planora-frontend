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
  MoreHorizontal,
  Plus,
  X,
  ClipboardList,
  Flag,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import AddNewTask from "./AddNewTask";
import type { Task } from "../../types/task";
import ActionDropdown from "./dropdown/ActionDropdown";

// <== BOARD VIEW PROPS TYPE INTERFACE ==>
type Props = {
  // <== TASKS ==>
  tasks: Task[];
  // <== FILTERED TASKS (FROM MAIN SEARCH) ==>
  filteredTasks: Task[];
  // <== SEARCH TERM (FROM MAIN SEARCH) ==>
  searchTerm: string;
  // <== LOADING ==>
  loading: boolean;
  // <== HAS LOADED ==>
  hasLoaded: boolean;
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
  filteredTasks,
  searchTerm,
  loading,
  hasLoaded,
  setTasks,
  onTaskDeleted,
  onTaskEdited,
  parentModalOpen,
}: Props): JSX.Element => {
  // SELECTED ITEMS STATE
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // EXPANDED TASKS STATE
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  // SECTION SEARCH TERMS STATE
  const [sectionSearchTerms, setSectionSearchTerms] = useState<{
    [key: string]: string;
  }>({
    "to do": "",
    "in progress": "",
    completed: "",
  });
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
  // PREVENT BACKGROUND SCROLLING WHEN TASKS ARE SELECTED
  useEffect(() => {
    // CHECK IF SELECTED ITEMS ARE GREATER THAN 0
    if (selectedItems.length > 0) {
      // DISABLE BODY SCROLLING
      document.body.style.overflow = "hidden";
    } else {
      // ENABLE BODY SCROLLING
      document.body.style.overflow = "unset";
    }
    // RETURN FROM THE EFFECT
    return () => {
      // ENABLE BODY SCROLLING
      document.body.style.overflow = "unset";
    };
  }, [selectedItems.length]);
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
  // TOGGLE TASK EXPAND FUNCTION
  const toggleTaskExpand = (taskId: string, e?: React.MouseEvent): void => {
    // STOP PROPAGATION IF EVENT EXISTS
    if (e) {
      e.stopPropagation();
    }
    // SET EXPANDED TASKS
    setExpandedTasks((prev) => {
      // CREATE NEW SET
      const newSet = new Set(prev);
      // CHECK IF TASK IS EXPANDED
      if (newSet.has(taskId)) {
        // DELETE TASK FROM SET
        newSet.delete(taskId);
      } else {
        // ADD TASK TO SET
        newSet.add(taskId);
      }
      return newSet;
    });
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
  // FILTER TASKS BY SECTION SEARCH TERM
  const filterTasksBySectionSearch = (
    sectionTasks: Task[],
    searchTerm: string
  ): Task[] => {
    // CHECK IF SEARCH TERM IS EMPTY
    if (!searchTerm.trim()) return sectionTasks;
    // FILTER TASKS BY SEARCH TERM
    return sectionTasks.filter((task) =>
      [task.title, task.description]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  };
  // UPDATE SECTION SEARCH TERM FUNCTION
  const updateSectionSearchTerm = (sectionId: string, term: string): void => {
    // UPDATE SECTION SEARCH TERMS
    setSectionSearchTerms((prev) => ({
      ...prev,
      [sectionId]: term,
    }));
  };
  // SHOW LOADING STATE IF LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--primary-text)]">Loading tasks...</p>
      </div>
    );
  }
  // CHECK IF MAIN SEARCH IS ACTIVE
  const isMainSearchActive = searchTerm.trim() !== "";
  // RETURNING THE BOARD VIEW COMPONENT
  return (
    // DRAG DROP CONTEXT
    <DragDropContext onDragEnd={onDragEnd}>
      {/* CHECK IF MAIN SEARCH IS ACTIVE */}
      {isMainSearchActive ? (
        // SEARCH RESULTS SECTION
        <div className="w-full">
          <div className="bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] rounded-xl shadow-sm p-4 sm:p-5 flex flex-col border border-[var(--border)] h-full">
            {/* SEARCH RESULTS HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Search
                  size={16}
                  className="text-[var(--accent-color)] flex-shrink-0"
                />
                <h2 className="font-semibold text-[var(--text-primary)]">
                  Search Results
                </h2>
                {filteredTasks.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative">
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
                      {filteredTasks.length}
                    </span>
                  </span>
                )}
              </div>
            </div>
            {/* SEARCH RESULTS CONTENT */}
            <Droppable droppableId="search-results">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-[100px] max-h-[600px] overflow-y-auto relative z-0"
                >
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
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
                            className={`bg-[var(--inside-card-bg)] rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition-all ${
                              snapshot.isDragging
                                ? "shadow-xl scale-[1.02]"
                                : "hover:bg-[var(--hover-bg)]"
                            }`}
                          >
                            {/* Render task card - same as in columns */}
                            {expandedTasks.has(task._id) ? (
                              // EXPANDED STATE - same structure as before
                              <div className="p-3 sm:p-4">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--text-primary)] flex-1">
                                      {task.title}
                                    </p>
                                    <button
                                      onClick={(e) =>
                                        toggleTaskExpand(task._id, e)
                                      }
                                      className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)] flex-shrink-0 cursor-pointer"
                                      title="Collapse"
                                    >
                                      <ChevronUp size={18} />
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                      className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDropdown(e, task._id);
                                      }}
                                    >
                                      <MoreHorizontal size={18} />
                                    </button>
                                  </div>
                                </div>
                                <section className="flex flex-col gap-3 text-sm">
                                  {task.description && (
                                    <div className="flex items-start gap-3">
                                      <div className="flex-1">
                                        <p className="text-sm text-[var(--light-text)] leading-relaxed">
                                          {task.description}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {task.priority && (
                                    <div className="flex items-center gap-3">
                                      <Flag
                                        size={16}
                                        className="text-[var(--accent-color)] flex-shrink-0"
                                      />
                                      <div className="flex items-center gap-3 flex-1 justify-between">
                                        <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                                          Priority
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold relative">
                                          <span
                                            className="absolute inset-0 rounded-full"
                                            style={{
                                              backgroundColor: `var(--accent-color)`,
                                              opacity: 0.15,
                                            }}
                                          ></span>
                                          <span
                                            className="relative"
                                            style={{
                                              color: `var(--accent-color)`,
                                            }}
                                          >
                                            {task.priority
                                              .charAt(0)
                                              .toUpperCase() +
                                              task.priority.slice(1)}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {task.dueDate && (
                                    <div className="flex items-center gap-3">
                                      <Calendar
                                        size={16}
                                        className="text-[var(--accent-color)] flex-shrink-0"
                                      />
                                      <div className="flex items-center gap-3 flex-1 justify-between">
                                        <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                                          Due Date
                                        </span>
                                        <span className="text-sm text-[var(--text-primary)]">
                                          {new Date(
                                            task.dueDate
                                          ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </section>
                              </div>
                            ) : (
                              // COLLAPSED STATE
                              <div className="p-3 sm:p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={selectedItems.includes(task._id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        setSelectedItems((prev) =>
                                          prev.includes(task._id)
                                            ? prev.filter(
                                                (id) => id !== task._id
                                              )
                                            : [...prev, task._id]
                                        );
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      className="accent-[var(--accent-color)] flex-shrink-0 cursor-pointer"
                                    />
                                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                      {task.title}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                      onClick={(e) =>
                                        toggleTaskExpand(task._id, e)
                                      }
                                      className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                                      title="Expand"
                                    >
                                      <ChevronDown size={18} />
                                    </button>
                                    <button
                                      className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDropdown(e, task._id);
                                      }}
                                    >
                                      <MoreHorizontal size={18} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : hasLoaded ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Search
                        size={48}
                        className="text-[var(--light-text)] opacity-50"
                      />
                      <p className="text-sm font-medium text-[var(--light-text)]">
                        No tasks found
                      </p>
                      <p className="text-xs text-[var(--light-text)] text-center">
                        Your search does not match any tasks.
                      </p>
                    </div>
                  ) : null}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      ) : (
        // NORMAL THREE SECTIONS
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch relative w-full">
          {/* MAPPING THROUGH COLUMNS */}
          {columns.map((col) => {
            // FILTER TASKS BY STATUS
            const sectionTasks = tasks.filter((task) => task.status === col.id);
            // FILTER BY SECTION SEARCH TERM
            const sectionSearchTerm = sectionSearchTerms[col.id] || "";
            const filteredSectionTasks = filterTasksBySectionSearch(
              sectionTasks,
              sectionSearchTerm
            );
            return (
              // COLUMN CONTAINER
              <div
                key={col.id}
                className="bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] rounded-xl shadow-sm p-4 sm:p-5 flex flex-col border border-[var(--border)] h-full"
              >
                {/* COLUMN HEADER */}
                <div className="flex items-center justify-between mb-4">
                  {/* COLUMN TITLE CONTAINER */}
                  <div className="flex items-center gap-2">
                    {/* STATUS DOT */}
                    <span className={`w-3 h-3 rounded-full ${col.dot}`}></span>
                    {/* COLUMN TITLE */}
                    <h2 className="font-semibold text-[var(--text-primary)]">
                      {col.title}
                    </h2>
                    {/* TASK COUNT BADGE */}
                    {sectionTasks.length > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative">
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
                          {sectionTasks.length}
                        </span>
                      </span>
                    )}
                  </div>
                  {/* SELECT ALL CHECKBOX */}
                  {filteredSectionTasks.length > 0 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-[var(--accent-color)] cursor-pointer"
                        checked={
                          filteredSectionTasks.length > 0 &&
                          filteredSectionTasks.every((task) =>
                            selectedItems.includes(task._id)
                          )
                        }
                        onClick={() => setDropdownIsOpen(!isDropdownOpen)}
                        onChange={(e) => {
                          // GET CHECKED STATE
                          const isChecked = e.target.checked;
                          // GET TASK IDS FROM COLUMN
                          const taskIds = filteredSectionTasks.map(
                            (task) => task._id
                          );
                          // UPDATE SELECTED ITEMS
                          setSelectedItems((prev) =>
                            isChecked
                              ? Array.from(new Set([...prev, ...taskIds]))
                              : prev.filter((id) => !taskIds.includes(id))
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
                {/* SECTION SEARCH BAR - ONLY SHOW IF SECTION HAS TASKS */}
                {sectionTasks.length > 0 && (
                  <div className="relative mb-3">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-[var(--accent-color)]" />
                    <input
                      type="text"
                      value={sectionSearchTerm}
                      onChange={(e) =>
                        updateSectionSearchTerm(col.id, e.target.value)
                      }
                      placeholder={`Search in ${col.title}...`}
                      className="border border-[var(--border)] pl-8 pr-2.5 py-1.5 rounded-lg w-full focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-xs bg-[var(--bg)] text-[var(--text-primary)]"
                    />
                  </div>
                )}
                {/* DROPPABLE AREA */}
                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-[100px] max-h-[600px] overflow-y-auto relative z-0"
                    >
                      {/* CHECK IF TASKS EXIST AND DATA HAS LOADED */}
                      {filteredSectionTasks.length > 0 ? (
                        // MAPPING THROUGH TASKS
                        filteredSectionTasks.map((task, index) => (
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
                                className={`bg-[var(--inside-card-bg)] rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition-all ${
                                  snapshot.isDragging
                                    ? "shadow-xl scale-[1.02]"
                                    : "hover:bg-[var(--hover-bg)]"
                                }`}
                              >
                                {/* CHECK IF TASK IS EXPANDED */}
                                {expandedTasks.has(task._id) ? (
                                  // EXPANDED STATE
                                  <div className="p-3 sm:p-4">
                                    {/* EXPANDED HEADER */}
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                      {/* LEFT SIDE: TITLE */}
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[var(--text-primary)] flex-1">
                                          {task.title}
                                        </p>
                                        {/* COLLAPSE BUTTON */}
                                        <button
                                          onClick={(e) =>
                                            toggleTaskExpand(task._id, e)
                                          }
                                          className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)] flex-shrink-0 cursor-pointer"
                                          title="Collapse"
                                        >
                                          <ChevronUp size={18} />
                                        </button>
                                      </div>
                                      {/* RIGHT SIDE: ACTIONS */}
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        {/* DROPDOWN BUTTON */}
                                        <button
                                          className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)]"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openDropdown(e, task._id);
                                          }}
                                        >
                                          <MoreHorizontal size={18} />
                                        </button>
                                      </div>
                                    </div>

                                    {/* EXPANDED CONTENT */}
                                    <section className="flex flex-col gap-3 text-sm">
                                      {/* DESCRIPTION */}
                                      {task.description && (
                                        <div className="flex items-start gap-3">
                                          <div className="flex-1">
                                            <p className="text-sm text-[var(--light-text)] leading-relaxed">
                                              {task.description}
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      {/* PRIORITY */}
                                      {task.priority && (
                                        <div className="flex items-center gap-3">
                                          <Flag
                                            size={16}
                                            className="text-[var(--accent-color)] flex-shrink-0"
                                          />
                                          <div className="flex items-center gap-3 flex-1 justify-between">
                                            <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                                              Priority
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold relative">
                                              <span
                                                className="absolute inset-0 rounded-full"
                                                style={{
                                                  backgroundColor: `var(--accent-color)`,
                                                  opacity: 0.15,
                                                }}
                                              ></span>
                                              <span
                                                className="relative"
                                                style={{
                                                  color: `var(--accent-color)`,
                                                }}
                                              >
                                                {task.priority
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  task.priority.slice(1)}
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                      {/* DUE DATE */}
                                      {task.dueDate && (
                                        <div className="flex items-center gap-3">
                                          <Calendar
                                            size={16}
                                            className="text-[var(--accent-color)] flex-shrink-0"
                                          />
                                          <div className="flex items-center gap-3 flex-1 justify-between">
                                            <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                                              Due Date
                                            </span>
                                            <span className="text-sm text-[var(--text-primary)]">
                                              {new Date(
                                                task.dueDate
                                              ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                              })}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </section>
                                  </div>
                                ) : (
                                  // COLLAPSED STATE
                                  <div className="p-3 sm:p-4">
                                    <div className="flex items-center justify-between gap-3">
                                      {/* LEFT SIDE: CHECKBOX AND TITLE */}
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {/* CHECKBOX */}
                                        <input
                                          type="checkbox"
                                          checked={selectedItems.includes(
                                            task._id
                                          )}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            setSelectedItems((prev) =>
                                              prev.includes(task._id)
                                                ? prev.filter(
                                                    (id) => id !== task._id
                                                  )
                                                : [...prev, task._id]
                                            );
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          className="accent-[var(--accent-color)] flex-shrink-0 cursor-pointer"
                                        />
                                        {/* TITLE */}
                                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                          {task.title}
                                        </p>
                                      </div>
                                      {/* ACTIONS */}
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        {/* EXPAND BUTTON */}
                                        <button
                                          onClick={(e) =>
                                            toggleTaskExpand(task._id, e)
                                          }
                                          className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                                          title="Expand"
                                        >
                                          <ChevronDown size={18} />
                                        </button>
                                        {/* DROPDOWN BUTTON */}
                                        <button
                                          className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)] cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openDropdown(e, task._id);
                                          }}
                                        >
                                          <MoreHorizontal size={18} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : hasLoaded ? (
                        // EMPTY STATE (ONLY SHOW IF DATA HAS LOADED)
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                          {/* CHECK IF SECTION HAS TASKS BUT SEARCH RETURNED NO RESULTS */}
                          {sectionTasks.length > 0 &&
                          sectionSearchTerm.trim() !== "" ? (
                            <>
                              {/* SEARCH NO RESULTS ICON */}
                              <Search
                                size={48}
                                className="text-[var(--light-text)] opacity-50"
                              />
                              {/* SEARCH NO RESULTS TEXT */}
                              <p className="text-sm font-medium text-[var(--light-text)]">
                                No tasks found
                              </p>
                              <p className="text-xs text-[var(--light-text)] text-center">
                                Your search does not match any tasks in this
                                section.
                              </p>
                            </>
                          ) : (
                            <>
                              {/* NO TASKS ICON */}
                              <ClipboardList
                                size={48}
                                className="text-[var(--light-text)] opacity-50"
                              />
                              {/* NO TASKS TEXT */}
                              <p className="text-sm font-medium text-[var(--light-text)]">
                                No tasks yet
                              </p>
                              <p className="text-xs text-[var(--light-text)] text-center">
                                Add tasks to this section to get started.
                              </p>
                            </>
                          )}
                        </div>
                      ) : null}
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
      )}
      {/* SELECTED TASKS MODAL */}
      {selectedItems.length > 0 && (
        <div
          className="fixed inset-0 min-h-screen bg-[var(--black-overlay)] z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancel();
            }
          }}
        >
          {/* MODAL CONTAINER */}
          <div
            className="bg-[var(--bg)] rounded-xl w-full max-w-2xl shadow-lg relative overflow-hidden border border-[var(--border)] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-3 sm:p-4 pb-2 border-b border-[var(--border)] flex-shrink-0">
              {/* MODAL TITLE */}
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Selected Tasks ({selectedItems.length})
              </h2>
              {/* CLOSE BUTTON */}
              <button
                onClick={handleCancel}
                className="cursor-pointer bg-[var(--accent-color)] rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white hover:bg-[var(--accent-btn-hover-color)] transition"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
            {/* MODAL CONTENT - SELECTED TASKS LIST */}
            <div className="overflow-y-auto flex-1 min-h-0 p-4 sm:p-6">
              <div className="flex flex-col gap-3">
                {selectedItems.map((taskId) => {
                  const task = tasks.find((t) => t._id === taskId);
                  if (!task) return null;
                  return (
                    <div
                      key={taskId}
                      className="bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg p-3 sm:p-4"
                    >
                      {/* TASK TITLE */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] flex-1">
                          {task.title}
                        </h3>
                      </div>
                      {/* TASK DETAILS */}
                      <div className="flex flex-col gap-2 text-sm">
                        {/* STATUS */}
                        {task.status && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--light-text)] min-w-[80px]">
                              Status:
                            </span>
                            <span className="text-xs text-[var(--text-primary)] capitalize">
                              {task.status}
                            </span>
                          </div>
                        )}
                        {/* PRIORITY */}
                        {task.priority && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--light-text)] min-w-[80px]">
                              Priority:
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative">
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
                                {task.priority.charAt(0).toUpperCase() +
                                  task.priority.slice(1)}
                              </span>
                            </span>
                          </div>
                        )}
                        {/* DUE DATE */}
                        {task.dueDate && (
                          <div className="flex items-center gap-2">
                            <Calendar
                              size={14}
                              className="text-[var(--light-text)] flex-shrink-0"
                            />
                            <span className="text-xs text-[var(--light-text)] min-w-[80px]">
                              Due Date:
                            </span>
                            <span className="text-xs text-[var(--text-primary)]">
                              {new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        )}
                        {/* DESCRIPTION */}
                        {task.description && (
                          <div className="flex items-start gap-2 mt-1">
                            <span className="text-xs text-[var(--light-text)] min-w-[80px]">
                              Description:
                            </span>
                            <p className="text-xs text-[var(--light-text)] flex-1 line-clamp-2">
                              {task.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* MODAL FOOTER - ACTIONS */}
            <div className="flex justify-end gap-2 p-3 sm:p-4 pt-2 border-t border-[var(--border)] flex-shrink-0 bg-[var(--bg)]">
              {/* CANCEL BUTTON */}
              <button
                className="px-4 py-2 text-sm bg-[var(--inside-card-bg)] rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer text-[var(--text-primary)] transition-colors"
                onClick={handleCancel}
              >
                Cancel
              </button>
              {/* DELETE BUTTON */}
              <button
                className="px-4 py-2 text-sm cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={() => {
                  // DELETE SELECTED TASKS
                  selectedItems.forEach((taskId) => {
                    handleDeleteTask(taskId);
                  });
                  // CLEAR SELECTION
                  setSelectedItems([]);
                }}
              >
                Delete Selected ({selectedItems.length})
              </button>
            </div>
          </div>
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
