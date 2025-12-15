// <== IMPORTS ==>
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Circle,
  CheckCircle2,
  Calendar,
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
};

// <== STATUS DOT COLORS ==>
const STATUS_DOT_COLORS: Record<string, string> = {
  // TO DO STATUS DOT COLOR
  "to do": "bg-blue-500",
  // IN PROGRESS STATUS DOT COLOR
  "in progress": "bg-yellow-500",
  // COMPLETED STATUS DOT COLOR
  completed: "bg-green-500",
};

// <== PRIORITY BORDER COLORS ==>
const PRIORITY_BORDER_COLORS: Record<string, string> = {
  // HIGH PRIORITY BORDER COLOR
  high: "border-l-red-500",
  // MEDIUM PRIORITY BORDER COLOR
  medium: "border-l-yellow-500",
  // LOW PRIORITY BORDER COLOR
  low: "border-l-green-500",
};

// <== GET STATUS ICON ==>
const getStatusIcon = (status: string) => {
  // SWITCH STATUS
  switch (status) {
    // TO DO STATUS
    case "to do":
      // RETURN TO DO STATUS ICON
      return <Circle size={10} className="text-blue-500" />;
    // IN PROGRESS STATUS
    case "in progress":
      // RETURN IN PROGRESS STATUS ICON
      return <Clock size={10} className="text-yellow-500" />;
    // COMPLETED STATUS
    case "completed":
      // RETURN COMPLETED STATUS ICON
      return <CheckCircle2 size={10} className="text-green-500" />;
    default:
      // RETURN DEFAULT CIRCLE ICON
      return <Circle size={10} className="text-gray-500" />;
  }
};

// <== CALENDAR VIEW COMPONENT ==>
const CalendarView = ({
  filteredTasks,
  loading,
  hasLoaded,
  onTaskEdited,
}: Props): JSX.Element => {
  // CURRENT MONTH STATE
  const [currentDate, setCurrentDate] = useState(new Date());
  // SELECTED DATE STATE
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // GET DAYS IN MONTH
  const getDaysInMonth = (date: Date): number => {
    // RETURN DAYS IN MONTH
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  // GET FIRST DAY OF MONTH (0 = SUNDAY)
  const getFirstDayOfMonth = (date: Date): number => {
    // RETURN FIRST DAY OF MONTH
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  // CALENDAR DATA
  const calendarData = useMemo(() => {
    // GET DAYS IN MONTH
    const daysInMonth = getDaysInMonth(currentDate);
    // GET FIRST DAY OF MONTH
    const firstDay = getFirstDayOfMonth(currentDate);
    // CREATE EMPTY DAYS ARRAY
    const days: (number | null)[] = [];
    // ADD EMPTY CELLS FOR DAYS BEFORE FIRST DAY
    for (let i = 0; i < firstDay; i++) {
      // PUSH NULL TO DAYS ARRAY
      days.push(null);
    }
    // ADD DAYS OF MONTH
    for (let i = 1; i <= daysInMonth; i++) {
      // PUSH DAY TO DAYS ARRAY
      days.push(i);
    }
    // RETURN DAYS ARRAY
    return days;
  }, [currentDate]);
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
  // NAVIGATE PREVIOUS MONTH
  const navigatePrevious = (): void => {
    // CREATE NEW DATE
    const newDate = new Date(currentDate);
    // SET NEW DATE TO CURRENT DATE MINUS 1 MONTH
    newDate.setMonth(newDate.getMonth() - 1);
    // SET CURRENT DATE TO NEW DATE
    setCurrentDate(newDate);
  };
  // NAVIGATE NEXT MONTH
  const navigateNext = (): void => {
    // CREATE NEW DATE
    const newDate = new Date(currentDate);
    // SET NEW DATE TO CURRENT DATE PLUS 1 MONTH
    newDate.setMonth(newDate.getMonth() + 1);
    // SET CURRENT DATE TO NEW DATE
    setCurrentDate(newDate);
  };
  // NAVIGATE TO TODAY
  const navigateToday = (): void => {
    // SET CURRENT DATE TO TODAY
    setCurrentDate(new Date());
    // SET SELECTED DATE TO TODAY
    setSelectedDate(new Date());
  };
  // FORMAT MONTH YEAR
  const formatMonthYear = (): string => {
    // RETURN MONTH AND YEAR
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };
  // GET DATE KEY FOR DAY
  const getDateKey = (day: number): string => {
    // RETURN DATE KEY
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toDateString();
  };
  // CHECK IF DATE IS TODAY
  const isToday = (day: number): boolean => {
    // CREATE TODAY DATE
    const today = new Date();
    // CHECK IF DATE IS TODAY
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };
  // CHECK IF DATE IS SELECTED
  const isSelected = (day: number): boolean => {
    // CHECK IF SELECTED DATE IS NULL
    if (!selectedDate) return false;
    // CHECK IF DATE IS SELECTED
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };
  // HANDLE DATE CLICK
  const handleDateClick = (day: number): void => {
    // SET SELECTED DATE TO NEW DATE
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
  };
  // GET SELECTED DATE TASKS
  const selectedDateTasks = useMemo(() => {
    // CHECK IF SELECTED DATE IS NULL
    if (!selectedDate) return [];
    // RETURN SELECTED DATE TASKS
    return tasksByDate[selectedDate.toDateString()] || [];
  }, [selectedDate, tasksByDate]);
  // RENDER LOADING STATE
  if (loading && !hasLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--accent-color)] border-t-transparent" />
      </div>
    );
  }
  // WEEKDAY HEADERS - SHORT FOR MOBILE, FULL FOR LARGER SCREENS
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // WEEKDAY HEADERS - SHORT FOR MOBILE, FULL FOR LARGER SCREENS
  const weekDaysMobile = ["S", "M", "T", "W", "T", "F", "S"];
  // RETURN CALENDAR VIEW
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
              title="Previous month"
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
              title="Next month"
            >
              <ChevronRight size={18} className="text-[var(--light-text)]" />
            </button>
          </div>
          {/* CURRENT MONTH */}
          <span className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
            {formatMonthYear()}
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
      {/* CALENDAR AND DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CALENDAR GRID */}
        <div className="lg:col-span-2">
          {/* WEEKDAY HEADERS */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className="text-center text-[10px] sm:text-xs font-medium text-[var(--light-text)] py-1 sm:py-2"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{weekDaysMobile[index]}</span>
              </div>
            ))}
          </div>
          {/* CALENDAR DAYS */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {calendarData.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="aspect-square bg-[var(--inside-card-bg)]/30 rounded-md sm:rounded-lg"
                  />
                );
              }
              // GET DATE KEY
              const dateKey = getDateKey(day);
              // GET DAY TASKS
              const dayTasks = tasksByDate[dateKey] || [];
              // CHECK IF DATE IS TODAY
              const todayClass = isToday(day);
              // CHECK IF DATE IS SELECTED
              const selectedClass = isSelected(day);
              // RETURN DAY BUTTON
              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square p-0.5 sm:p-1 rounded-md sm:rounded-lg border transition relative ${
                    selectedClass
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10"
                      : todayClass
                      ? "border-[var(--accent-color)]/50 bg-[var(--accent-color)]/5"
                      : "border-transparent hover:border-[var(--border)] hover:bg-[var(--hover-bg)]"
                  }`}
                >
                  {/* DAY NUMBER */}
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      todayClass
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {day}
                  </span>
                  {/* TASK DOTS - FEWER ON MOBILE */}
                  {dayTasks.length > 0 && (
                    <div className="absolute bottom-0.5 sm:bottom-1 left-0.5 sm:left-1 right-0.5 sm:right-1 flex justify-center gap-0.5 flex-wrap">
                      {dayTasks.slice(0, 3).map((task) => (
                        <span
                          key={task._id}
                          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                            STATUS_DOT_COLORS[task.status] || "bg-gray-500"
                          }`}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="text-[6px] sm:text-[8px] text-[var(--light-text)]">
                          +{dayTasks.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* SELECTED DATE DETAILS */}
        <div className="bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)] p-3 sm:p-4">
          {selectedDate ? (
            <>
              {/* SELECTED DATE HEADER */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-[var(--border)]">
                <Calendar
                  size={16}
                  className="text-[var(--accent-color)] sm:w-[18px] sm:h-[18px]"
                />
                <span className="font-medium text-sm sm:text-base text-[var(--text-primary)]">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {/* TASKS LIST */}
              {selectedDateTasks.length > 0 ? (
                <div className="space-y-2 max-h-[250px] sm:max-h-[400px] overflow-y-auto">
                  {selectedDateTasks.map((task) => (
                    <button
                      key={task._id}
                      onClick={() => onTaskEdited(task._id)}
                      className={`w-full text-left p-2 sm:p-3 rounded-lg bg-[var(--hover-bg)] hover:bg-[var(--border)] transition border-l-2 ${
                        PRIORITY_BORDER_COLORS[task.priority || "medium"]
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(task.status)}
                        <span className="text-[10px] sm:text-xs text-[var(--light-text)] capitalize">
                          {task.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--text-primary)] font-medium line-clamp-2">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="hidden sm:block text-xs text-[var(--light-text)] mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 sm:py-10">
                  <Calendar
                    size={28}
                    className="text-[var(--light-text)] mb-2 sm:w-8 sm:h-8"
                  />
                  <p className="text-xs sm:text-sm text-[var(--light-text)]">
                    No tasks for this date
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 sm:py-10">
              <Calendar
                size={28}
                className="text-[var(--light-text)] mb-2 sm:w-8 sm:h-8"
              />
              <p className="text-xs sm:text-sm text-[var(--light-text)]">
                Select a date to view tasks
              </p>
            </div>
          )}
        </div>
      </div>
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

export default CalendarView;
