// <== IMPORTS ==>
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Task } from "../../types/task";
import { useState, useMemo, useEffect, JSX } from "react";

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
};

// <== STATUS COLORS ==>
const STATUS_COLORS: Record<string, { bg: string; border: string }> = {
  // TO DO STATUS COLOR
  "to do": { bg: "bg-blue-500/20", border: "border-blue-500" },
  // IN PROGRESS STATUS COLOR
  "in progress": { bg: "bg-yellow-500/20", border: "border-yellow-500" },
  // COMPLETED STATUS COLOR
  completed: { bg: "bg-green-500/20", border: "border-green-500" },
};

// <== PRIORITY COLORS ==>
const PRIORITY_COLORS: Record<string, string> = {
  // HIGH PRIORITY COLOR
  high: "bg-red-500",
  // MEDIUM PRIORITY COLOR
  medium: "bg-yellow-500",
  // LOW PRIORITY COLOR
  low: "bg-green-500",
};

// <== GET STATUS ICON ==>
const getStatusIcon = (status: string) => {
  // SWITCH STATUS
  switch (status) {
    // TO DO STATUS
    case "to do":
      // RETURN TO DO STATUS ICON
      return <Circle size={12} className="text-blue-500" />;
    // IN PROGRESS STATUS
    case "in progress":
      // RETURN IN PROGRESS STATUS ICON
      return <Clock size={12} className="text-yellow-500" />;
    // COMPLETED STATUS
    case "completed":
      // RETURN COMPLETED STATUS ICON
      return <CheckCircle2 size={12} className="text-green-500" />;
    // DEFAULT STATUS
    default:
      // RETURN DEFAULT CIRCLE ICON
      return <Circle size={12} className="text-gray-500" />;
  }
};

// <== TIMELINE VIEW COMPONENT ==>
const TimelineView = ({
  filteredTasks,
  loading,
  hasLoaded,
  onTaskEdited,
}: Props): JSX.Element => {
  // CURRENT DATE STATE
  const [currentDate, setCurrentDate] = useState(new Date());
  // DAYS TO SHOW STATE - RESPONSIVE (7 ON MOBILE, 10 ON TABLET, 14 ON DESKTOP)
  const [daysToShow, setDaysToShow] = useState(7);
  // EFFECT TO HANDLE RESPONSIVE DAYS COUNT USING MEDIA QUERIES
  useEffect(() => {
    // FUNCTION TO CHECK AND UPDATE DAYS COUNT
    const updateDaysToShow = () => {
      // CHECK IF WINDOW MATCHES MEDIA QUERY
      if (window.matchMedia("(min-width: 1024px)").matches) {
        // SET DAYS TO SHOW TO 14
        setDaysToShow(14);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        // SET DAYS TO SHOW TO 10
        setDaysToShow(10);
      } else {
        // SET DAYS TO SHOW TO 7
        setDaysToShow(7);
      }
    };
    // UPDATE DAYS TO SHOW
    updateDaysToShow();
    // LISTEN FOR RESIZE EVENTS
    window.addEventListener("resize", updateDaysToShow);
    return () => window.removeEventListener("resize", updateDaysToShow);
  }, []);
  // CALCULATE DATE RANGE
  const dateRange = useMemo(() => {
    // CREATE EMPTY DATES ARRAY
    const dates: Date[] = [];
    // CREATE START DATE
    const startDate = new Date(currentDate);
    // SET START DATE TO CURRENT DATE MINUS HALF THE DAYS TO SHOW
    startDate.setDate(startDate.getDate() - Math.floor(daysToShow / 2));
    // LOOP THROUGH DAYS TO SHOW
    for (let i = 0; i < daysToShow; i++) {
      // CREATE DATE
      const date = new Date(startDate);
      // SET DATE TO START DATE PLUS THE CURRENT INDEX
      date.setDate(date.getDate() + i);
      // PUSH DATE TO DATES ARRAY
      dates.push(date);
    }
    // RETURN DATES ARRAY
    return dates;
  }, [currentDate, daysToShow]);
  // GET TODAY STRING
  const today = new Date().toDateString();
  // NAVIGATE PREVIOUS WEEK
  const navigatePrevious = (): void => {
    // CREATE NEW DATE
    const newDate = new Date(currentDate);
    // SET NEW DATE TO CURRENT DATE MINUS 7 DAYS
    newDate.setDate(newDate.getDate() - 7);
    // SET CURRENT DATE TO NEW DATE
    setCurrentDate(newDate);
  };
  // NAVIGATE NEXT WEEK
  const navigateNext = (): void => {
    // CREATE NEW DATE
    const newDate = new Date(currentDate);
    // SET NEW DATE TO CURRENT DATE PLUS 7 DAYS
    newDate.setDate(newDate.getDate() + 7);
    // SET CURRENT DATE TO NEW DATE
    setCurrentDate(newDate);
  };
  // NAVIGATE TO TODAY
  const navigateToday = (): void => {
    // SET CURRENT DATE TO TODAY
    setCurrentDate(new Date());
  };
  // FORMAT DATE FOR HEADER
  const formatDateHeader = (date: Date): { day: string; date: number } => {
    // CREATE DAYS ARRAY
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // RETURN DAY AND DATE
    return {
      day: days[date.getDay()],
      date: date.getDate(),
    };
  };
  // FORMAT MONTH YEAR
  const formatMonthYear = (date: Date): string => {
    // RETURN MONTH AND YEAR
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };
  // GROUP TASKS BY DATE
  const tasksByDate = useMemo(() => {
    // CREATE EMPTY GROUPED TASKS OBJECT
    const grouped: Record<string, Task[]> = {};
    // LOOP THROUGH FILTERED TASKS
    filteredTasks.forEach((task) => {
      // CHECK IF TASK HAS A DUE DATE
      if (task.dueDate) {
        // CREATE DATE KEY
        const dateKey = new Date(task.dueDate).toDateString();
        // CHECK IF DATE KEY EXISTS IN GROUPED TASKS OBJECT
        if (!grouped[dateKey]) {
          // CREATE EMPTY ARRAY FOR DATE KEY
          grouped[dateKey] = [];
        }
        // PUSH TASK TO GROUPED TASKS OBJECT
        grouped[dateKey].push(task);
      }
    });
    // SORT TASKS BY PRIORITY (HIGH FIRST)
    // LOOP THROUGH GROUPED TASKS OBJECT
    Object.keys(grouped).forEach((key) => {
      // SORT TASKS BY PRIORITY (HIGH FIRST)
      grouped[key].sort((a, b) => {
        // CREATE PRIORITY ORDER OBJECT
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        // RETURN PRIORITY ORDER
        return (
          (priorityOrder[a.priority as keyof typeof priorityOrder] || 2) -
          (priorityOrder[b.priority as keyof typeof priorityOrder] || 2)
        );
      });
    });
    // RETURN GROUPED TASKS OBJECT
    return grouped;
  }, [filteredTasks]);

  // GET TASKS WITHOUT DUE DATE
  const tasksWithoutDate = useMemo(() => {
    // RETURN TASKS WITHOUT DUE DATE
    return filteredTasks.filter((task) => !task.dueDate);
  }, [filteredTasks]);
  // RENDER LOADING STATE
  if (loading && !hasLoaded) {
    // RETURN LOADING STATE
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--accent-color)] border-t-transparent" />
      </div>
    );
  }
  // RETURN TIMELINE VIEW COMPONENT
  return (
    <div className="w-full">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-[var(--border)]">
        {/* TOP ROW: NAVIGATION AND MONTH */}
        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
          {/* NAVIGATION */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={navigatePrevious}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--hover-bg)] transition"
              title="Previous week"
            >
              <ChevronLeft size={18} className="text-[var(--light-text)]" />
            </button>
            <button
              onClick={navigateToday}
              className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-lg bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/20 transition"
            >
              Today
            </button>
            <button
              onClick={navigateNext}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--hover-bg)] transition"
              title="Next week"
            >
              <ChevronRight size={18} className="text-[var(--light-text)]" />
            </button>
          </div>
          {/* CURRENT MONTH */}
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {formatMonthYear(currentDate)}
          </span>
        </div>
        {/* LEGEND - HIDDEN ON MOBILE, COMPACT ON TABLET */}
        <div className="hidden sm:flex items-center gap-2 md:gap-4 text-xs text-[var(--light-text)]">
          <div className="flex items-center gap-1 md:gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="hidden md:inline">To Do</span>
          </div>
          <div className="flex items-center gap-1 md:gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="hidden md:inline">In Progress</span>
          </div>
          <div className="flex items-center gap-1 md:gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="hidden md:inline">Completed</span>
          </div>
        </div>
      </div>
      {/* TIMELINE GRID */}
      <div className="w-full">
        <div className="w-full">
          {/* DATE HEADERS */}
          <div
            className="grid gap-0.5 sm:gap-1"
            style={{
              gridTemplateColumns: `repeat(${daysToShow}, minmax(0, 1fr))`,
            }}
          >
            {dateRange.map((date) => {
              const { day, date: dateNum } = formatDateHeader(date);
              const isToday = date.toDateString() === today;
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <div
                  key={date.toISOString()}
                  className={`text-center p-1 sm:p-2 rounded-md sm:rounded-lg ${
                    isToday
                      ? "bg-[var(--accent-color)]/10 border border-[var(--accent-color)]"
                      : isWeekend
                      ? "bg-[var(--hover-bg)]/50"
                      : "bg-[var(--inside-card-bg)]"
                  }`}
                >
                  <div
                    className={`text-[10px] sm:text-xs ${
                      isToday
                        ? "text-[var(--accent-color)] font-semibold"
                        : "text-[var(--light-text)]"
                    }`}
                  >
                    {day}
                  </div>
                  <div
                    className={`text-sm sm:text-lg font-semibold ${
                      isToday
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {dateNum}
                  </div>
                </div>
              );
            })}
          </div>
          {/* TASK ROWS */}
          <div
            className="grid gap-0.5 sm:gap-1 mt-1 sm:mt-2 min-h-[150px] sm:min-h-[200px]"
            style={{
              gridTemplateColumns: `repeat(${daysToShow}, minmax(0, 1fr))`,
            }}
          >
            {dateRange.map((date) => {
              // CREATE DATE KEY
              const dateKey = date.toDateString();
              // GET DAY TASKS
              const dayTasks = tasksByDate[dateKey] || [];
              // CHECK IF DATE KEY IS TODAY
              const isToday = dateKey === today;
              // CHECK IF DATE IS IN THE PAST
              const isPast = date < new Date() && dateKey !== today;
              // SHOW FEWER TASKS ON MOBILE (WHEN DAYS TO SHOW IS 7)
              const maxTasks = daysToShow === 7 ? 3 : 5;
              // RETURN TASK ROW
              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-[150px] sm:min-h-[200px] p-0.5 sm:p-1 rounded-md sm:rounded-lg border ${
                    isToday
                      ? "border-[var(--accent-color)]/30 bg-[var(--accent-color)]/5"
                      : "border-[var(--border)]/50 bg-[var(--inside-card-bg)]/30"
                  }`}
                >
                  {dayTasks.length > 0 ? (
                    <div className="space-y-0.5 sm:space-y-1">
                      {dayTasks.slice(0, maxTasks).map((task) => (
                        <button
                          key={task._id}
                          onClick={() => onTaskEdited(task._id)}
                          className={`w-full text-left p-1 sm:p-2 rounded-md transition cursor-pointer border-l-2 ${
                            STATUS_COLORS[task.status]?.bg || "bg-gray-500/20"
                          } ${
                            STATUS_COLORS[task.status]?.border ||
                            "border-gray-500"
                          } hover:opacity-80`}
                        >
                          <div className="flex items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                            {getStatusIcon(task.status)}
                            <span
                              className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                                PRIORITY_COLORS[task.priority || "medium"]
                              }`}
                            />
                          </div>
                          <p className="text-[10px] sm:text-xs text-[var(--text-primary)] font-medium line-clamp-1 sm:line-clamp-2">
                            {task.title}
                          </p>
                        </button>
                      ))}
                      {dayTasks.length > maxTasks && (
                        <div className="text-[10px] sm:text-xs text-[var(--light-text)] text-center py-0.5 sm:py-1">
                          +{dayTasks.length - maxTasks}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`h-full flex items-center justify-center ${
                        isPast ? "opacity-50" : ""
                      }`}
                    >
                      <span className="text-[10px] sm:text-xs text-[var(--light-text)]/50">
                        —
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* UNSCHEDULED TASKS */}
      {tasksWithoutDate.length > 0 && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <AlertCircle size={14} className="text-orange-500 sm:w-4 sm:h-4" />
            <h3 className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
              Unscheduled ({tasksWithoutDate.length})
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
            {tasksWithoutDate
              .slice(0, daysToShow === 7 ? 6 : 10)
              .map((task) => (
                <button
                  key={task._id}
                  onClick={() => onTaskEdited(task._id)}
                  className="text-left p-1.5 sm:p-2 rounded-md bg-[var(--hover-bg)] hover:bg-[var(--border)] transition border border-[var(--border)]"
                >
                  <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
                    {getStatusIcon(task.status)}
                    <Calendar size={10} className="text-[var(--light-text)]" />
                  </div>
                  <p className="text-[10px] sm:text-xs text-[var(--text-primary)] line-clamp-1 sm:line-clamp-2">
                    {task.title}
                  </p>
                </button>
              ))}
            {tasksWithoutDate.length > (daysToShow === 7 ? 6 : 10) && (
              <div className="flex items-center justify-center p-1.5 sm:p-2 text-[10px] sm:text-xs text-[var(--light-text)]">
                +{tasksWithoutDate.length - (daysToShow === 7 ? 6 : 10)} more
              </div>
            )}
          </div>
        </div>
      )}
      {/* EMPTY STATE */}
      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Calendar size={48} className="text-[var(--light-text)] mb-4" />
          <p className="text-[var(--light-text)] text-sm">
            No tasks to display
          </p>
        </div>
      )}
    </div>
  );
};

export default TimelineView;
