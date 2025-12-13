// <== IMPORTS ==>
import {
  Play,
  Clock,
  Timer,
  Target,
  ChevronDown,
  Check,
  Loader2,
  History,
  BarChart3,
  FileText,
  Link2,
  Infinity as InfinityIcon,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  XCircle,
  ListFilter,
  CalendarDays,
} from "lucide-react";
import {
  useActiveSession,
  useStartSession,
  useSessionHistory,
  FocusSession,
  formatFocusDuration,
} from "../hooks/useFocusSession";
import FocusSkeleton, {
  FocusHistorySkeleton,
} from "../components/skeletons/FocusSkeleton";
import "react-day-picker/dist/style.css";
import useTitle from "../hooks/useTitle";
import { DayPicker } from "react-day-picker";
import { useTasks, Task } from "../hooks/useTasks";
import { useState, useEffect, useMemo } from "react";
import { FocusMode, FocusStats } from "../components/focus";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== FOCUS PAGE COMPONENT ==>
const FocusPage = () => {
  // SET PAGE TITLE
  useTitle("PlanOra - Focus");
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<"start" | "history" | "stats">(
    "start"
  );
  // SHOW FOCUS MODE STATE
  const [showFocusMode, setShowFocusMode] = useState(false);
  // SELECTED TASK ID STATE
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  // SESSION TITLE STATE
  const [sessionTitle, setSessionTitle] = useState("");
  // PLANNED DURATION STATE
  const [plannedDuration, setPlannedDuration] = useState<number | null>(25);
  // IS POMODORO MODE STATE
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);
  // IS TASK DROPDOWN OPEN STATE
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
  // HISTORY PAGE STATE
  const [historyPage, setHistoryPage] = useState(1);
  // HISTORY STATUS STATE
  const [historyStatus, setHistoryStatus] = useState<string>("");
  // HISTORY TASK ID STATE
  const [historyTaskId, setHistoryTaskId] = useState<string>("");
  // HISTORY PERIOD STATE
  const [historyPeriod, setHistoryPeriod] = useState<string>("");
  // HISTORY START DATE STATE
  const [historyStartDate, setHistoryStartDate] = useState<string>("");
  // HISTORY END DATE STATE
  const [historyEndDate, setHistoryEndDate] = useState<string>("");
  // SHOW HISTORY FILTERS STATE
  const [showHistoryFilters, setShowHistoryFilters] = useState(false);
  // IS STATUS DROPDOWN OPEN STATE
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  // IS TASK FILTER DROPDOWN OPEN STATE
  const [isTaskFilterDropdownOpen, setIsTaskFilterDropdownOpen] =
    useState(false);
  // IS START DATE PICKER OPEN STATE
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  // IS END DATE PICKER OPEN STATE
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  // HELPER: FORMAT DATE FOR DISPLAY
  const formatDateDisplay = (dateStr: string): string => {
    // IF NO DATE, RETURN EMPTY STRING
    if (!dateStr) return "";
    // CREATE DATE OBJECT
    const date = new Date(dateStr + "T00:00:00");
    // FORMAT DATE TO LOCAL DATE STRING
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  // FORMAT DATE TO LOCAL YYYY-MM-DD (AVOIDING TIMEZONE ISSUES)
  const formatDateToLocal = (date: Date): string => {
    // GET YEAR
    const year = date.getFullYear();
    // GET MONTH
    const month = String(date.getMonth() + 1).padStart(2, "0");
    // GET DAY
    const day = String(date.getDate()).padStart(2, "0");
    // RETURN FORMATTED DATE
    return `${year}-${month}-${day}`;
  };
  // LOCK BODY SCROLL WHEN DATE PICKER IS OPEN
  useEffect(() => {
    // IF START DATE PICKER OR END DATE PICKER IS OPEN
    if (isStartDatePickerOpen || isEndDatePickerOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
      // RETURN FUNCTION TO UNLOCK BODY SCROLL
      return () => {
        // UNLOCK BODY SCROLL
        document.body.style.overflow = "";
      };
    }
  }, [isStartDatePickerOpen, isEndDatePickerOpen]);
  // MEMOIZED DATE RANGE CALCULATION TO PREVENT INFINITE LOOPS
  const dateRange = useMemo(() => {
    // HELPER: GET START OF DAY IN LOCAL TIME
    const getStartOfDay = (date: Date): string => {
      // CREATE DATE OBJECT
      const d = new Date(date);
      // SET HOURS TO 0
      d.setHours(0, 0, 0, 0);
      // RETURN ISO STRING
      return d.toISOString();
    };
    // HELPER: GET END OF DAY IN LOCAL TIME
    const getEndOfDay = (date: Date): string => {
      // CREATE DATE OBJECT
      const d = new Date(date);
      // SET HOURS TO 23
      d.setHours(23, 59, 59, 999);
      // RETURN ISO STRING
      return d.toISOString();
    };
    // PERIOD-BASED DATE RANGE
    if (historyPeriod === "today") {
      // CREATE TODAY DATE OBJECT
      const today = new Date();
      // RETURN START AND END DATE
      return {
        startDate: getStartOfDay(today),
        endDate: getEndOfDay(today),
      };
    } else if (historyPeriod === "week") {
      // CREATE END DATE OBJECT
      const end = new Date();
      // CREATE START DATE OBJECT
      const start = new Date();
      // SET DATE TO 7 DAYS AGO
      start.setDate(start.getDate() - 7);
      // RETURN START AND END DATE
      return {
        startDate: getStartOfDay(start),
        endDate: getEndOfDay(end),
      };
    } else if (historyPeriod === "month") {
      // CREATE END DATE OBJECT
      const end = new Date();
      // CREATE START DATE OBJECT
      const start = new Date();
      // SET MONTH TO 1 MONTH AGO
      start.setMonth(start.getMonth() - 1);
      // RETURN START AND END DATE
      return {
        startDate: getStartOfDay(start),
        endDate: getEndOfDay(end),
      };
    }
    // CUSTOM DATE RANGE (FROM DATE PICKERS)
    if (historyStartDate || historyEndDate) {
      // RETURN START AND END DATE
      return {
        startDate: historyStartDate
          ? getStartOfDay(new Date(historyStartDate + "T00:00:00"))
          : undefined,
        endDate: historyEndDate
          ? getEndOfDay(new Date(historyEndDate + "T00:00:00"))
          : undefined,
      };
    }
    // NO DATE FILTER
    return { startDate: undefined, endDate: undefined };
  }, [historyPeriod, historyStartDate, historyEndDate]);
  // FETCH TASKS DATA
  const { tasks, isLoading: isLoadingTasks } = useTasks();
  // FETCH ACTIVE SESSION DATA
  const { data: activeSession, isLoading: isLoadingActive } =
    useActiveSession();
  // FETCH SESSION HISTORY DATA
  const {
    data: history,
    isLoading: isLoadingHistory,
    isFetching: isFetchingHistory,
  } = useSessionHistory({
    limit: 10,
    page: historyPage,
    status: historyStatus || undefined,
    taskId: historyTaskId || undefined,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
  // RESET PAGE WHEN FILTERS CHANGE
  useEffect(() => {
    // RESET HISTORY PAGE TO 1
    setHistoryPage(1);
  }, [
    historyStatus,
    historyTaskId,
    historyPeriod,
    historyStartDate,
    historyEndDate,
  ]);
  // CLEAR ALL FILTERS
  const clearHistoryFilters = () => {
    // CLEAR HISTORY STATUS
    setHistoryStatus("");
    // CLEAR HISTORY TASK ID
    setHistoryTaskId("");
    // CLEAR HISTORY PERIOD
    setHistoryPeriod("");
    // CLEAR HISTORY START DATE
    setHistoryStartDate("");
    // CLEAR HISTORY END DATE
    setHistoryEndDate("");
    // RESET HISTORY PAGE TO 1
    setHistoryPage(1);
  };
  // CHECK IF ANY FILTER IS ACTIVE
  const hasActiveFilters =
    historyStatus ||
    historyTaskId ||
    historyPeriod ||
    historyStartDate ||
    historyEndDate;
  // MUTATIONS
  const startSessionMutation = useStartSession();
  // CHECK FOR ACTIVE SESSION
  useEffect(() => {
    // IF ACTIVE SESSION, SHOW FOCUS MODE
    if (activeSession) {
      // SHOW FOCUS MODE
      setShowFocusMode(true);
    }
  }, [activeSession]);
  // PREVENT BACKGROUND SCROLL WHEN FOCUS MODE IS OPEN
  useEffect(() => {
    // IF FOCUS MODE IS OPEN
    if (showFocusMode) {
      // GET ORIGINAL OVERFLOW
      const originalOverflow = document.body.style.overflow;
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
      // RETURN FUNCTION TO UNLOCK BODY SCROLL
      return () => {
        // UNLOCK BODY SCROLL
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showFocusMode]);
  // HANDLE START SESSION
  const handleStartSession = () => {
    // START SESSION MUTATION
    startSessionMutation.mutate(
      {
        taskId: selectedTaskId || undefined,
        title: sessionTitle || undefined,
        plannedDuration: plannedDuration ?? 0,
        isPomodoroMode,
        pomodoroSettings: isPomodoroMode
          ? {
              workDuration: 25,
              breakDuration: 5,
              longBreakDuration: 15,
              sessionsBeforeLongBreak: 4,
            }
          : undefined,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SHOW FOCUS MODE
          setShowFocusMode(true);
        },
      }
    );
  };
  // GET SELECTED TASK
  const selectedTask = tasks.find((t) => t._id === selectedTaskId);
  // FORMAT SESSION STATUS
  const formatSessionStatus = (status: string) => {
    // SWITCH CASE FOR SESSION STATUS
    switch (status) {
      // IF SESSION IS COMPLETED
      case "completed":
        // RETURN COMPLETED STATUS
        return (
          <span className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs whitespace-nowrap">
            Completed
          </span>
        );
      // IF SESSION IS ABANDONED
      case "abandoned":
        // RETURN ABANDONED STATUS
        return (
          <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded text-xs whitespace-nowrap">
            Abandoned
          </span>
        );
      default:
        // RETURN DEFAULT STATUS
        return (
          <span className="text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2 py-0.5 rounded text-xs whitespace-nowrap">
            {status}
          </span>
        );
    }
  };
  // INITIAL LOADING STATE
  const isInitialLoading = isLoadingActive && isLoadingTasks;
  // RETURN FOCUS PAGE
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* HEADER */}
      <DashboardHeader
        title="Focus Mode"
        subtitle="Deep work sessions with Pomodoro support"
      />
      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* ACTIVE SESSION BANNER */}
        {activeSession && !showFocusMode && (
          <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--accent-color)] p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Active Session
                  </p>
                  <p className="text-xs text-[var(--light-text)] truncate">
                    {activeSession.title || "Focus session in progress"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFocusMode(true)}
                className="px-4 py-2 bg-[var(--accent-color)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition w-full sm:w-auto"
              >
                Resume
              </button>
            </div>
          </div>
        )}
        {/* SHOW SKELETON IF INITIAL LOADING */}
        {isInitialLoading ? (
          <FocusSkeleton />
        ) : (
          <>
            {/* TABS */}
            <div className="flex items-center gap-1 p-1 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] w-full sm:w-fit overflow-x-auto">
              <button
                onClick={() => setActiveTab("start")}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition flex-1 sm:flex-none whitespace-nowrap ${
                  activeTab === "start"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Play size={16} />
                <span className="hidden xs:inline">Start</span>
                <span className="xs:hidden sm:inline">Session</span>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition flex-1 sm:flex-none whitespace-nowrap ${
                  activeTab === "history"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
              >
                <History size={16} />
                History
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition flex-1 sm:flex-none whitespace-nowrap ${
                  activeTab === "stats"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
              >
                <BarChart3 size={16} />
                <span className="hidden sm:inline">Statistics</span>
                <span className="sm:hidden">Stats</span>
              </button>
            </div>
            {/* TAB CONTENT */}
            {activeTab === "start" && (
              <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4 sm:p-6">
                <div className="max-w-md mx-auto space-y-5 sm:space-y-6">
                  {/* SESSION TITLE */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-2">
                      <FileText
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      Session Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      placeholder="What are you focusing on?"
                      className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:border-[var(--accent-color)] text-sm sm:text-base"
                    />
                  </div>

                  {/* TASK SELECTOR */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-2">
                      <Link2 size={16} className="text-[var(--accent-color)]" />
                      Link to Task (Optional)
                    </label>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setIsTaskDropdownOpen(!isTaskDropdownOpen)
                        }
                        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-left hover:border-[var(--accent-color)] transition"
                      >
                        <span
                          className={`truncate text-sm sm:text-base ${
                            selectedTask
                              ? "text-[var(--text-primary)]"
                              : "text-[var(--light-text)]"
                          }`}
                        >
                          {selectedTask
                            ? `${selectedTask.taskKey} - ${selectedTask.title}`
                            : "Select a task..."}
                        </span>
                        <ChevronDown
                          size={16}
                          className="text-[var(--light-text)] flex-shrink-0 ml-2"
                        />
                      </button>
                      {isTaskDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsTaskDropdownOpen(false)}
                          />
                          <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                            <button
                              onClick={() => {
                                setSelectedTaskId(null);
                                setIsTaskDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--light-text)] hover:bg-[var(--hover-bg)] transition"
                            >
                              No task
                            </button>
                            {tasks
                              .filter((t) => t.status !== "completed")
                              .slice(0, 15)
                              .map((task: Task) => (
                                <button
                                  key={task._id}
                                  onClick={() => {
                                    setSelectedTaskId(task._id);
                                    setIsTaskDropdownOpen(false);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--hover-bg)] transition"
                                >
                                  {selectedTaskId === task._id && (
                                    <Check
                                      size={14}
                                      className="text-[var(--accent-color)] flex-shrink-0"
                                    />
                                  )}
                                  <span className="font-mono text-xs text-[var(--light-text)] bg-[var(--hover-bg)] px-1.5 py-0.5 rounded flex-shrink-0">
                                    {task.taskKey}
                                  </span>
                                  <span className="text-[var(--text-primary)] truncate">
                                    {task.title}
                                  </span>
                                </button>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* POMODORO MODE TOGGLE - MOVED UP */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      <Timer
                        size={20}
                        className="text-[var(--accent-color)] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          Pomodoro Mode
                        </p>
                        <p className="text-xs text-[var(--light-text)]">
                          25 min work / 5 min break cycles
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsPomodoroMode(!isPomodoroMode);
                        // AUTO-SET NO LIMIT WHEN ENABLING POMODORO
                        if (!isPomodoroMode) {
                          setPlannedDuration(null);
                        }
                      }}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        isPomodoroMode
                          ? "bg-[var(--accent-color)]"
                          : "bg-[var(--hover-bg)]"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          isPomodoroMode ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                  {/* DURATION - HIDDEN IN POMODORO MODE */}
                  {!isPomodoroMode ? (
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-2">
                        <Clock
                          size={16}
                          className="text-[var(--accent-color)]"
                        />
                        Session Duration
                      </label>
                      {/* MOBILE: 3 COLUMNS + NO LIMIT */}
                      <div className="grid grid-cols-3 gap-2 sm:hidden">
                        {[15, 25, 30, 45, 60].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => setPlannedDuration(mins)}
                            className={`py-2.5 rounded-lg text-sm font-medium transition ${
                              plannedDuration === mins
                                ? "bg-[var(--accent-color)] text-white"
                                : "bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--inside-card-bg)]"
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                        <button
                          onClick={() => setPlannedDuration(null)}
                          title="No time limit"
                          className={`py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center ${
                            plannedDuration === null
                              ? "bg-[var(--accent-color)] text-white"
                              : "bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--inside-card-bg)]"
                          }`}
                        >
                          <InfinityIcon size={18} />
                        </button>
                      </div>
                      {/* DESKTOP: FLEX ROW */}
                      <div className="hidden sm:flex items-center gap-2">
                        {[15, 25, 30, 45, 60, 90].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => setPlannedDuration(mins)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                              plannedDuration === mins
                                ? "bg-[var(--accent-color)] text-white"
                                : "bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--inside-card-bg)]"
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                        <button
                          onClick={() => setPlannedDuration(null)}
                          title="No time limit"
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                            plannedDuration === null
                              ? "bg-[var(--accent-color)] text-white"
                              : "bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--inside-card-bg)]"
                          }`}
                        >
                          <InfinityIcon size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 sm:p-4 bg-[var(--accent-color)]/5 rounded-xl border border-[var(--accent-color)]/20">
                      <div className="flex items-start gap-3">
                        <Clock
                          size={18}
                          className="text-[var(--accent-color)] mt-0.5 flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            Pomodoro Timer Active
                          </p>
                          <p className="text-xs text-[var(--light-text)] mt-1">
                            Session runs in 25-minute work cycles with 5-minute
                            breaks. Stop anytime by ending the session manually.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* START BUTTON */}
                  <button
                    onClick={handleStartSession}
                    disabled={startSessionMutation.isPending || !!activeSession}
                    className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-[var(--accent-color)] text-white font-medium rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {startSessionMutation.isPending ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Play size={20} />
                    )}
                    {activeSession
                      ? "Session Already Active"
                      : "Start Focus Session"}
                  </button>
                </div>
              </div>
            )}
            {/* HISTORY TAB */}
            {activeTab === "history" && (
              <div className="space-y-4">
                {/* FILTER BAR */}
                <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-3 sm:p-4">
                  {/* FILTER TOGGLE & ACTIVE FILTERS */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowHistoryFilters(!showHistoryFilters)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        showHistoryFilters || hasActiveFilters
                          ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30"
                          : "bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--inside-card-bg)]"
                      }`}
                    >
                      <Filter size={16} />
                      <span className="hidden sm:inline">Filters</span>
                      {hasActiveFilters && (
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-color)]" />
                      )}
                    </button>
                    {/* CLEAR ALL BADGE */}
                    {hasActiveFilters && (
                      <button
                        onClick={clearHistoryFilters}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition"
                      >
                        <X size={12} />
                        Clear all
                      </button>
                    )}
                    {/* QUICK PERIOD FILTERS */}
                    <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                      {["today", "week", "month"].map((period) => (
                        <button
                          key={period}
                          onClick={() =>
                            setHistoryPeriod(
                              historyPeriod === period ? "" : period
                            )
                          }
                          className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            historyPeriod === period
                              ? "bg-[var(--accent-color)] text-white"
                              : "bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* EXPANDED FILTERS */}
                  {showHistoryFilters && (
                    <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* STATUS FILTER */}
                      <div className="relative">
                        <label className="flex items-center gap-1.5 text-xs text-[var(--light-text)] mb-1.5">
                          <ListFilter size={12} />
                          Status
                        </label>
                        <button
                          onClick={() => {
                            setIsStatusDropdownOpen(!isStatusDropdownOpen);
                            setIsTaskFilterDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 bg-[var(--bg)] border rounded-lg text-sm transition ${
                            isStatusDropdownOpen
                              ? "border-[var(--accent-color)]"
                              : "border-[var(--border)] hover:border-[var(--accent-color)]"
                          }`}
                        >
                          {historyStatus === "completed" ? (
                            <CheckCircle2
                              size={14}
                              className="text-green-500 flex-shrink-0"
                            />
                          ) : historyStatus === "abandoned" ? (
                            <XCircle
                              size={14}
                              className="text-red-500 flex-shrink-0"
                            />
                          ) : (
                            <ListFilter
                              size={14}
                              className="text-[var(--light-text)] flex-shrink-0"
                            />
                          )}
                          <span
                            className={`flex-1 text-left ${
                              historyStatus
                                ? "text-[var(--text-primary)]"
                                : "text-[var(--light-text)]"
                            }`}
                          >
                            {historyStatus === "completed"
                              ? "Completed"
                              : historyStatus === "abandoned"
                              ? "Abandoned"
                              : "All Status"}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`text-[var(--light-text)] transition ${
                              isStatusDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isStatusDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setIsStatusDropdownOpen(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-20 overflow-hidden">
                              {[
                                {
                                  value: "",
                                  label: "All Status",
                                  icon: (
                                    <ListFilter
                                      size={14}
                                      className="text-[var(--light-text)]"
                                    />
                                  ),
                                },
                                {
                                  value: "completed",
                                  label: "Completed",
                                  icon: (
                                    <CheckCircle2
                                      size={14}
                                      className="text-green-500"
                                    />
                                  ),
                                },
                                {
                                  value: "abandoned",
                                  label: "Abandoned",
                                  icon: (
                                    <XCircle
                                      size={14}
                                      className="text-red-500"
                                    />
                                  ),
                                },
                              ].map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => {
                                    setHistoryStatus(opt.value);
                                    setIsStatusDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[var(--hover-bg)] transition ${
                                    historyStatus === opt.value
                                      ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                                      : "text-[var(--text-primary)]"
                                  }`}
                                >
                                  {opt.icon}
                                  <span className="flex-1 text-left">
                                    {opt.label}
                                  </span>
                                  {historyStatus === opt.value && (
                                    <Check
                                      size={14}
                                      className="text-[var(--accent-color)]"
                                    />
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      {/* TASK FILTER */}
                      <div className="relative">
                        <label className="flex items-center gap-1.5 text-xs text-[var(--light-text)] mb-1.5">
                          <Target size={12} />
                          Task
                        </label>
                        <button
                          onClick={() => {
                            setIsTaskFilterDropdownOpen(
                              !isTaskFilterDropdownOpen
                            );
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 bg-[var(--bg)] border rounded-lg text-sm transition ${
                            isTaskFilterDropdownOpen
                              ? "border-[var(--accent-color)]"
                              : "border-[var(--border)] hover:border-[var(--accent-color)]"
                          }`}
                        >
                          <Target
                            size={14}
                            className={
                              historyTaskId
                                ? "text-[var(--accent-color)]"
                                : "text-[var(--light-text)]"
                            }
                          />
                          <span
                            className={`flex-1 text-left truncate ${
                              historyTaskId
                                ? "text-[var(--text-primary)]"
                                : "text-[var(--light-text)]"
                            }`}
                          >
                            {historyTaskId
                              ? tasks.find((t) => t._id === historyTaskId)
                                  ?.title || "Selected Task"
                              : "All Tasks"}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`text-[var(--light-text)] flex-shrink-0 transition ${
                              isTaskFilterDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isTaskFilterDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setIsTaskFilterDropdownOpen(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                              <button
                                onClick={() => {
                                  setHistoryTaskId("");
                                  setIsTaskFilterDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[var(--hover-bg)] transition ${
                                  !historyTaskId
                                    ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                                    : "text-[var(--text-primary)]"
                                }`}
                              >
                                <Target
                                  size={14}
                                  className="text-[var(--light-text)]"
                                />
                                <span className="flex-1 text-left">
                                  All Tasks
                                </span>
                                {!historyTaskId && (
                                  <Check
                                    size={14}
                                    className="text-[var(--accent-color)]"
                                  />
                                )}
                              </button>
                              {tasks.slice(0, 20).map((task) => (
                                <button
                                  key={task._id}
                                  onClick={() => {
                                    setHistoryTaskId(task._id);
                                    setIsTaskFilterDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[var(--hover-bg)] transition ${
                                    historyTaskId === task._id
                                      ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                                      : "text-[var(--text-primary)]"
                                  }`}
                                >
                                  <Target
                                    size={14}
                                    className={
                                      historyTaskId === task._id
                                        ? "text-[var(--accent-color)]"
                                        : "text-[var(--light-text)]"
                                    }
                                  />
                                  <span className="flex-1 text-left truncate">
                                    {task.title}
                                  </span>
                                  {historyTaskId === task._id && (
                                    <Check
                                      size={14}
                                      className="text-[var(--accent-color)] flex-shrink-0"
                                    />
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      {/* START DATE */}
                      <div>
                        <label className="flex items-center gap-1.5 text-xs text-[var(--light-text)] mb-1.5">
                          <Calendar size={12} />
                          Start Date
                        </label>
                        <button
                          onClick={() => {
                            setIsStartDatePickerOpen(true);
                            setIsStatusDropdownOpen(false);
                            setIsTaskFilterDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 bg-[var(--bg)] border rounded-lg text-sm transition ${
                            historyStartDate
                              ? "border-[var(--accent-color)]/50"
                              : "border-[var(--border)] hover:border-[var(--accent-color)]"
                          }`}
                        >
                          <Calendar
                            size={14}
                            className={
                              historyStartDate
                                ? "text-[var(--accent-color)]"
                                : "text-[var(--light-text)]"
                            }
                          />
                          <span
                            className={`flex-1 text-left ${
                              historyStartDate
                                ? "text-[var(--text-primary)]"
                                : "text-[var(--light-text)]"
                            }`}
                          >
                            {historyStartDate
                              ? formatDateDisplay(historyStartDate)
                              : "Select date"}
                          </span>
                          {historyStartDate && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setHistoryStartDate("");
                                setHistoryPeriod("");
                              }}
                              className="p-0.5 hover:bg-[var(--hover-bg)] rounded"
                            >
                              <X
                                size={12}
                                className="text-[var(--light-text)]"
                              />
                            </button>
                          )}
                        </button>
                      </div>
                      {/* END DATE */}
                      <div>
                        <label className="flex items-center gap-1.5 text-xs text-[var(--light-text)] mb-1.5">
                          <CalendarDays size={12} />
                          End Date
                        </label>
                        <button
                          onClick={() => {
                            setIsEndDatePickerOpen(true);
                            setIsStatusDropdownOpen(false);
                            setIsTaskFilterDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 bg-[var(--bg)] border rounded-lg text-sm transition ${
                            historyEndDate
                              ? "border-[var(--accent-color)]/50"
                              : "border-[var(--border)] hover:border-[var(--accent-color)]"
                          }`}
                        >
                          <CalendarDays
                            size={14}
                            className={
                              historyEndDate
                                ? "text-[var(--accent-color)]"
                                : "text-[var(--light-text)]"
                            }
                          />
                          <span
                            className={`flex-1 text-left ${
                              historyEndDate
                                ? "text-[var(--text-primary)]"
                                : "text-[var(--light-text)]"
                            }`}
                          >
                            {historyEndDate
                              ? formatDateDisplay(historyEndDate)
                              : "Select date"}
                          </span>
                          {historyEndDate && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setHistoryEndDate("");
                                setHistoryPeriod("");
                              }}
                              className="p-0.5 hover:bg-[var(--hover-bg)] rounded"
                            >
                              <X
                                size={12}
                                className="text-[var(--light-text)]"
                              />
                            </button>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* HISTORY LIST */}
                {isLoadingHistory ? (
                  <FocusHistorySkeleton />
                ) : !history?.data?.length ? (
                  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                    <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-center px-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--hover-bg)] flex items-center justify-center mb-3">
                        <Clock size={24} className="text-[var(--light-text)]" />
                      </div>
                      <p className="text-[var(--text-primary)] font-medium">
                        {hasActiveFilters
                          ? "No sessions match your filters"
                          : "No sessions yet"}
                      </p>
                      <p className="text-sm text-[var(--light-text)] mt-1">
                        {hasActiveFilters
                          ? "Try adjusting your filters"
                          : "Start your first focus session!"}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearHistoryFilters}
                          className="mt-3 px-4 py-2 text-sm text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 rounded-lg transition"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* SESSION COUNT */}
                    <div className="flex items-center justify-between text-sm text-[var(--light-text)] px-1">
                      <span>
                        Showing {(historyPage - 1) * 10 + 1}-
                        {Math.min(historyPage * 10, history.total)} of{" "}
                        {history.total} sessions
                      </span>
                      {isFetchingHistory && (
                        <Loader2
                          size={14}
                          className="animate-spin text-[var(--accent-color)]"
                        />
                      )}
                    </div>
                    {/* SESSION CARDS - GRID ON LARGER SCREENS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {history.data.map((session: FocusSession) => (
                        <div
                          key={session._id}
                          className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-3 sm:p-4 hover:border-[var(--accent-color)]/30 transition group"
                        >
                          {/* CARD HEADER */}
                          <div className="flex items-start gap-3">
                            <div
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor:
                                  session.status === "completed"
                                    ? "rgba(34, 197, 94, 0.15)"
                                    : "rgba(239, 68, 68, 0.15)",
                              }}
                            >
                              <Target
                                size={16}
                                className={
                                  session.status === "completed"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                {session.title ||
                                  (typeof session.taskId === "object"
                                    ? session.taskId?.title
                                    : null) ||
                                  "Focus Session"}
                              </p>
                              <p className="text-xs text-[var(--light-text)] mt-0.5">
                                {new Date(session.startedAt).toLocaleDateString(
                                  undefined,
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}{" "}
                                at{" "}
                                {new Date(session.startedAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                            {formatSessionStatus(session.status)}
                          </div>
                          {/* CARD STATS */}
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
                            <div className="flex items-center gap-1.5">
                              <Clock
                                size={14}
                                className="text-[var(--light-text)]"
                              />
                              <span className="text-sm font-medium text-[var(--text-primary)]">
                                {formatFocusDuration(session.duration)}
                              </span>
                            </div>
                            {session.isPomodoroMode && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">🍅</span>
                                <span className="text-sm text-[var(--light-text)]">
                                  {session.pomodorosCompleted} pomodoros
                                </span>
                              </div>
                            )}
                            {typeof session.taskId === "object" &&
                              session.taskId?.taskKey && (
                                <div className="ml-auto">
                                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--hover-bg)] text-[var(--light-text)]">
                                    {session.taskId.taskKey}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* PAGINATION */}
                    {history.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <button
                          onClick={() =>
                            setHistoryPage((p) => Math.max(1, p - 1))
                          }
                          disabled={historyPage === 1}
                          className="p-2 rounded-lg bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--inside-card-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, history.totalPages) },
                            (_, i) => {
                              let pageNum: number;
                              if (history.totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (historyPage <= 3) {
                                pageNum = i + 1;
                              } else if (
                                historyPage >=
                                history.totalPages - 2
                              ) {
                                pageNum = history.totalPages - 4 + i;
                              } else {
                                pageNum = historyPage - 2 + i;
                              }
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setHistoryPage(pageNum)}
                                  className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                                    historyPage === pageNum
                                      ? "bg-[var(--accent-color)] text-white"
                                      : "bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--inside-card-bg)]"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}
                        </div>
                        <button
                          onClick={() =>
                            setHistoryPage((p) =>
                              Math.min(history.totalPages, p + 1)
                            )
                          }
                          disabled={historyPage === history.totalPages}
                          className="p-2 rounded-lg bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--inside-card-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {/* STATS TAB */}
            {activeTab === "stats" && <FocusStats />}
          </>
        )}
      </main>
      {/* FOCUS MODE OVERLAY */}
      {showFocusMode && activeSession && (
        <FocusMode
          session={activeSession}
          onClose={() => setShowFocusMode(false)}
          onMinimize={() => setShowFocusMode(false)}
        />
      )}
      {/* START DATE PICKER MODAL - ROOT LEVEL FOR FULL VIEWPORT */}
      {isStartDatePickerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-[var(--black-overlay)]"
            onClick={() => setIsStartDatePickerOpen(false)}
          />
          {/* MODAL */}
          <div className="relative bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-lg p-3 w-full max-w-[320px] mx-4">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                  }}
                >
                  <Calendar size={14} className="text-[var(--accent-color)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Start Date
                </span>
              </div>
              <button
                onClick={() => setIsStartDatePickerOpen(false)}
                className="p-1 hover:bg-[var(--hover-bg)] rounded-lg transition"
              >
                <X size={16} className="text-[var(--light-text)]" />
              </button>
            </div>
            {/* DAY PICKER */}
            <DayPicker
              mode="single"
              selected={
                historyStartDate
                  ? new Date(historyStartDate + "T00:00:00")
                  : undefined
              }
              onSelect={(date) => {
                if (date) {
                  setHistoryStartDate(formatDateToLocal(date));
                  setHistoryPeriod("");
                }
                setIsStartDatePickerOpen(false);
              }}
              disabled={{ after: new Date() }}
              classNames={{
                day_selected:
                  "bg-[var(--accent-color)] text-white rounded-full",
                day_today: "font-bold text-[var(--accent-color)]",
                nav_button:
                  "text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded p-1",
                nav_button_next:
                  "text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded p-1",
                nav_button_previous:
                  "text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded p-1",
              }}
              className="rdp-weekdays-none"
            />
          </div>
        </div>
      )}
      {/* END DATE PICKER MODAL - ROOT LEVEL FOR FULL VIEWPORT */}
      {isEndDatePickerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-[var(--black-overlay)]"
            onClick={() => setIsEndDatePickerOpen(false)}
          />
          {/* MODAL */}
          <div className="relative bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-lg p-3 w-full max-w-[320px] mx-4">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                  }}
                >
                  <CalendarDays
                    size={14}
                    className="text-[var(--accent-color)]"
                  />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  End Date
                </span>
              </div>
              <button
                onClick={() => setIsEndDatePickerOpen(false)}
                className="p-1 hover:bg-[var(--hover-bg)] rounded-lg transition"
              >
                <X size={16} className="text-[var(--light-text)]" />
              </button>
            </div>
            {/* DAY PICKER */}
            <DayPicker
              mode="single"
              selected={
                historyEndDate
                  ? new Date(historyEndDate + "T00:00:00")
                  : undefined
              }
              onSelect={(date) => {
                if (date) {
                  setHistoryEndDate(formatDateToLocal(date));
                  setHistoryPeriod("");
                }
                setIsEndDatePickerOpen(false);
              }}
              disabled={[
                { after: new Date() },
                ...(historyStartDate
                  ? [{ before: new Date(historyStartDate + "T00:00:00") }]
                  : []),
              ]}
              classNames={{
                day_selected:
                  "bg-[var(--accent-color)] text-white rounded-full",
                day_today: "font-bold text-[var(--accent-color)]",
                nav_button:
                  "text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded p-1",
                nav_button_next:
                  "text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded p-1",
                nav_button_previous:
                  "text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded p-1",
              }}
              className="rdp-weekdays-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusPage;
