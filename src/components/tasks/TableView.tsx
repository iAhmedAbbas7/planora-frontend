// <== IMPORTS ==>
import {
  Clock,
  Circle,
  CheckCircle2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Calendar,
  Flag,
  Table2,
} from "lucide-react";
import type { Task } from "../../types/task";
import { useState, useMemo, JSX } from "react";

// <== PROPS TYPE INTERFACE ==>
type Props = {
  // <== TASKS ARRAY ==>
  tasks: Task[];
  // <== FILTERED TASKS ARRAY ==>
  filteredTasks: Task[];
  // <== SEARCH TERM ==>
  searchTerm: string;
  // <== LOADING STATE ==>
  loading: boolean;
  // <== HAS LOADED STATE ==>
  hasLoaded: boolean;
  // <== ON TASK EDITED CALLBACK ==>
  onTaskEdited: (taskId: string) => void;
  // <== ON TASK DELETED CALLBACK ==>
  onTaskDeleted: (taskId: string) => void;
  // <== ON BULK DELETE CALLBACK ==>
  onBulkDelete: (taskIds: string[]) => void;
};

// <== SORT DIRECTION TYPE ==>
type SortDirection = "asc" | "desc" | null;

// <== SORT FIELD TYPE ==>
type SortField = "title" | "status" | "priority" | "dueDate" | null;

// <== STATUS CONFIG ==>
const STATUS_CONFIG: Record<
  string,
  { icon: JSX.Element; color: string; bg: string }
> = {
  // TO DO STATUS CONFIG
  "to do": {
    icon: <Circle size={14} />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  // IN PROGRESS STATUS CONFIG
  "in progress": {
    icon: <Clock size={14} />,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  // COMPLETED STATUS CONFIG
  completed: {
    icon: <CheckCircle2 size={14} />,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
};

// <== PRIORITY CONFIG ==>
const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  // HIGH PRIORITY CONFIG
  high: { color: "text-red-500", bg: "bg-red-500/10" },
  // MEDIUM PRIORITY CONFIG
  medium: { color: "text-yellow-500", bg: "bg-yellow-500/10" },
  // LOW PRIORITY CONFIG
  low: { color: "text-green-500", bg: "bg-green-500/10" },
};

// <== TABLE VIEW COMPONENT ==>
const TableView = ({
  filteredTasks,
  loading,
  hasLoaded,
  onTaskEdited,
  onTaskDeleted,
  onBulkDelete,
}: Props): JSX.Element => {
  // SORT FIELD STATE
  const [sortField, setSortField] = useState<SortField>(null);
  // SORT DIRECTION STATE
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  // SELECTED TASKS STATE
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  // HANDLE SORT
  const handleSort = (field: SortField): void => {
    // CHECK IF SORT FIELD IS THE SAME AS THE CURRENT SORT FIELD
    if (sortField === field) {
      // CHECK IF SORT DIRECTION IS ASCENDING
      if (sortDirection === "asc") {
        // SET SORT DIRECTION TO DESCENDING
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        // SET SORT FIELD TO NULL
        setSortField(null);
        // SET SORT DIRECTION TO NULL
        setSortDirection(null);
      } else {
        // SET SORT DIRECTION TO ASCENDING
        setSortDirection("asc");
      }
    } else {
      // SET SORT FIELD TO THE NEW FIELD
      setSortField(field);
      // SET SORT DIRECTION TO ASCENDING
      setSortDirection("asc");
    }
  };

  // GET SORT ICON
  const getSortIcon = (field: SortField) => {
    // CHECK IF SORT FIELD IS NOT THE SAME AS THE CURRENT SORT FIELD
    if (sortField !== field) {
      // RETURN ARROW UP DOWN ICON
      return <ArrowUpDown size={14} className="text-[var(--light-text)]" />;
    }
    // CHECK IF SORT DIRECTION IS ASCENDING
    if (sortDirection === "asc") {
      // RETURN ARROW UP ICON
      return <ArrowUp size={14} className="text-[var(--accent-color)]" />;
    }
    // RETURN ARROW DOWN ICON
    return <ArrowDown size={14} className="text-[var(--accent-color)]" />;
  };

  // SORTED TASKS
  const sortedTasks = useMemo(() => {
    // CHECK IF SORT FIELD OR SORT DIRECTION IS NULL
    if (!sortField || !sortDirection) return filteredTasks;
    // SORT TASKS
    return [...filteredTasks].sort((a, b) => {
      // CREATE COMPARISON VARIABLE
      let comparison = 0;
      // SWITCH SORT FIELD
      switch (sortField) {
        // TITLE SORT FIELD
        case "title":
          // COMPARE TITLES
          comparison = a.title.localeCompare(b.title);
          break;
        // STATUS SORT FIELD
        case "status": {
          // CREATE STATUS ORDER OBJECT
          const statusOrder = { "to do": 0, "in progress": 1, completed: 2 };
          // COMPARE STATUSES
          comparison =
            (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
          break;
        }
        // PRIORITY SORT FIELD
        case "priority": {
          // CREATE PRIORITY ORDER OBJECT
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          // COMPARE PRIORITIES
          comparison =
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 2) -
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 2);
          break;
        }
        // DUE DATE SORT FIELD
        case "dueDate": {
          // CREATE DATE A
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          // CREATE DATE B
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          // COMPARE DATES
          comparison = dateA - dateB;
          break;
        }
      }
      // RETURN COMPARISON
      return sortDirection === "desc" ? -comparison : comparison;
    });
  }, [filteredTasks, sortField, sortDirection]);
  // HANDLE SELECT ALL
  const handleSelectAll = (): void => {
    // CHECK IF SELECTED TASKS SIZE IS THE SAME AS THE SORTED TASKS LENGTH
    if (selectedTasks.size === sortedTasks.length) {
      // SET SELECTED TASKS TO EMPTY SET
      setSelectedTasks(new Set());
    } else {
      // SET SELECTED TASKS TO THE SORTED TASKS IDS
      setSelectedTasks(new Set(sortedTasks.map((t) => t._id)));
    }
  };
  // HANDLE SELECT TASK
  const handleSelectTask = (taskId: string): void => {
    // CREATE NEW SELECTED TASKS SET
    const newSelected = new Set(selectedTasks);
    // CHECK IF TASK ID IS IN THE NEW SELECTED TASKS SET
    if (newSelected.has(taskId)) {
      // DELETE TASK ID FROM NEW SELECTED TASKS SET
      newSelected.delete(taskId);
    } else {
      // ADD TASK ID TO NEW SELECTED TASKS SET
      newSelected.add(taskId);
    }
    // SET SELECTED TASKS TO THE NEW SELECTED TASKS SET
    setSelectedTasks(newSelected);
  };
  // HANDLE BULK DELETE
  const handleBulkDeleteClick = (): void => {
    // CALL ON BULK DELETE FUNCTION
    onBulkDelete(Array.from(selectedTasks));
    // SET SELECTED TASKS TO EMPTY SET
    setSelectedTasks(new Set());
  };
  // FORMAT DATE
  const formatDate = (date: number | string | undefined): string => {
    // CHECK IF DATE IS NULL
    if (!date) return "—";
    // CREATE NEW DATE
    const d = new Date(date);
    // RETURN DATE STRING
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  // CHECK IF OVERDUE
  const isOverdue = (
    date: number | string | undefined,
    status: string
  ): boolean => {
    // CHECK IF DATE IS NULL OR STATUS IS COMPLETED
    if (!date || status === "completed") return false;
    // RETURN TRUE IF DATE IS BEFORE TODAY
    return new Date(date) < new Date();
  };
  // RENDER LOADING STATE
  if (loading && !hasLoaded) {
    // RETURN LOADING STATE
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--accent-color)] border-t-transparent" />
      </div>
    );
  }
  // RENDER EMPTY STATE
  if (sortedTasks.length === 0) {
    // RETURN EMPTY STATE
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Table2 size={48} className="text-[var(--light-text)] mb-4" />
        <p className="text-[var(--light-text)] text-sm">No tasks to display</p>
      </div>
    );
  }
  // RENDER TABLE VIEW
  return (
    <div className="w-full">
      {/* BULK ACTIONS */}
      {selectedTasks.size > 0 && (
        <div className="flex items-center justify-between mb-4 p-2 sm:p-3 bg-[var(--accent-color)]/10 rounded-lg border border-[var(--accent-color)]/30">
          <span className="text-xs sm:text-sm text-[var(--text-primary)]">
            {selectedTasks.size} selected
          </span>
          <button
            onClick={handleBulkDeleteClick}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Delete Selected</span>
            <span className="sm:hidden">Delete</span>
          </button>
        </div>
      )}
      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full min-w-[400px] sm:min-w-0">
          {/* TABLE HEAD */}
          <thead className="bg-[var(--inside-card-bg)]">
            <tr>
              {/* CHECKBOX */}
              <th className="w-8 sm:w-10 p-2 sm:p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedTasks.size === sortedTasks.length}
                  onChange={handleSelectAll}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-[var(--border)] accent-[var(--accent-color)]"
                />
              </th>
              {/* TITLE */}
              <th className="p-2 sm:p-3 text-left">
                <button
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-semibold text-[var(--light-text)] uppercase tracking-wider hover:text-[var(--text-primary)] transition"
                >
                  Title
                  {getSortIcon("title")}
                </button>
              </th>
              {/* STATUS */}
              <th className="p-2 sm:p-3 text-left">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-semibold text-[var(--light-text)] uppercase tracking-wider hover:text-[var(--text-primary)] transition"
                >
                  Status
                  {getSortIcon("status")}
                </button>
              </th>
              {/* PRIORITY - HIDDEN ON MOBILE */}
              <th className="hidden md:table-cell p-2 sm:p-3 text-left">
                <button
                  onClick={() => handleSort("priority")}
                  className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-semibold text-[var(--light-text)] uppercase tracking-wider hover:text-[var(--text-primary)] transition"
                >
                  Priority
                  {getSortIcon("priority")}
                </button>
              </th>
              {/* DUE DATE */}
              <th className="p-2 sm:p-3 text-left">
                <button
                  onClick={() => handleSort("dueDate")}
                  className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-semibold text-[var(--light-text)] uppercase tracking-wider hover:text-[var(--text-primary)] transition"
                >
                  <span className="hidden sm:inline">Due Date</span>
                  <span className="sm:hidden">Due</span>
                  {getSortIcon("dueDate")}
                </button>
              </th>
              {/* ACTIONS - HIDDEN ON SMALL MOBILE */}
              <th className="hidden sm:table-cell w-20 sm:w-24 p-2 sm:p-3 text-center">
                <span className="text-[10px] sm:text-xs font-semibold text-[var(--light-text)] uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          {/* TABLE BODY */}
          <tbody className="divide-y divide-[var(--border)]">
            {sortedTasks.map((task) => {
              const statusConfig =
                STATUS_CONFIG[task.status] || STATUS_CONFIG["to do"];
              const priorityConfig =
                PRIORITY_CONFIG[task.priority || "medium"] ||
                PRIORITY_CONFIG["medium"];
              const overdue = isOverdue(task.dueDate, task.status);

              return (
                <tr
                  key={task._id}
                  onClick={() => onTaskEdited(task._id)}
                  className={`hover:bg-[var(--hover-bg)] transition cursor-pointer sm:cursor-default ${
                    selectedTasks.has(task._id)
                      ? "bg-[var(--accent-color)]/5"
                      : ""
                  }`}
                >
                  {/* CHECKBOX */}
                  <td
                    className="p-2 sm:p-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTasks.has(task._id)}
                      onChange={() => handleSelectTask(task._id)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-[var(--border)] accent-[var(--accent-color)]"
                    />
                  </td>

                  {/* TITLE */}
                  <td className="p-2 sm:p-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskEdited(task._id);
                      }}
                      className="text-left hover:text-[var(--accent-color)] transition"
                    >
                      <p
                        className={`text-xs sm:text-sm font-medium line-clamp-1 ${
                          task.status === "completed"
                            ? "text-[var(--light-text)] line-through"
                            : "text-[var(--text-primary)]"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="hidden sm:block text-xs text-[var(--light-text)] line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </button>
                  </td>
                  {/* STATUS */}
                  <td className="p-2 sm:p-3">
                    <span
                      className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}
                    >
                      {statusConfig.icon}
                      <span className="hidden sm:inline capitalize">
                        {task.status}
                      </span>
                    </span>
                  </td>
                  {/* PRIORITY - HIDDEN ON MOBILE */}
                  <td className="hidden md:table-cell p-2 sm:p-3">
                    <span
                      className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color}`}
                    >
                      <Flag size={12} />
                      <span className="capitalize">
                        {task.priority || "Medium"}
                      </span>
                    </span>
                  </td>
                  {/* DUE DATE */}
                  <td className="p-2 sm:p-3">
                    <span
                      className={`inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs whitespace-nowrap ${
                        overdue ? "text-red-500" : "text-[var(--light-text)]"
                      }`}
                    >
                      <Calendar
                        size={10}
                        className="sm:w-3 sm:h-3 flex-shrink-0"
                      />
                      <span className="hidden sm:inline">
                        {formatDate(task.dueDate)}
                      </span>
                      <span className="sm:hidden">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </span>
                      {overdue && (
                        <span className="hidden sm:inline text-[10px] font-medium">
                          OVERDUE
                        </span>
                      )}
                    </span>
                  </td>
                  {/* ACTIONS - HIDDEN ON SMALL MOBILE */}
                  <td
                    className="hidden sm:table-cell p-2 sm:p-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                      <button
                        onClick={() => onTaskEdited(task._id)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--accent-color)] transition"
                        title="Edit task"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onTaskDeleted(task._id)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-red-500/10 text-[var(--light-text)] hover:text-red-500 transition"
                        title="Delete task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* TABLE FOOTER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 mt-3 sm:mt-4 text-[10px] sm:text-xs text-[var(--light-text)]">
        <span>
          Showing {sortedTasks.length} of {filteredTasks.length} tasks
        </span>
        {sortField && (
          <span>
            Sorted by{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {sortField}
            </span>{" "}
            ({sortDirection})
          </span>
        )}
      </div>
    </div>
  );
};

export default TableView;
