// <== IMPORTS ==>
import {
  Target,
  Plus,
  Filter,
  ChevronDown,
  Check,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Search,
  RefreshCw,
} from "lucide-react";
import {
  useGoalsHierarchy,
  useGoalStats,
  Goal,
  GoalStatus,
  GOAL_STATUS_CONFIG,
  QUARTER_OPTIONS,
  getCurrentQuarter,
  getCurrentYear,
} from "../hooks/useGoals";
import useTitle from "../hooks/useTitle";
import { GoalCard, GoalForm } from "../components/goals";
import { JSX, useState, useRef, useEffect, useMemo } from "react";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== SKELETON COMPONENTS ==>
const GoalsPageSkeleton = (): JSX.Element => (
  <div
    className="flex min-h-screen"
    style={{
      backgroundColor: "var(--bg)",
      color: "var(--text-primary)",
    }}
  >
    <div className="flex-1 flex flex-col transition-all duration-300">
      {/* HEADER SKELETON - STICKY LIKE ACTUAL HEADER */}
      <div
        className="sticky top-0 z-40 p-4 pt-2 pb-2 backdrop-blur-[var(--blur)] border-b border-[var(--border)]"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="h-7 w-40 bg-[var(--light-text)]/10 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-64 bg-[var(--light-text)]/10 rounded animate-pulse" />
      </div>
      {/* CONTENT */}
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* STATS CARDS SKELETON */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)] flex items-center gap-3"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--light-text)]/10 animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <div className="h-6 sm:h-7 w-10 bg-[var(--light-text)]/10 rounded animate-pulse mb-1" />
                <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        {/* FILTERS SECTION SKELETON */}
        <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)]">
          <div className="flex flex-col gap-3">
            {/* TOP ROW - SEARCH (FULL WIDTH ON MOBILE) */}
            <div className="h-9 w-full bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
            {/* BOTTOM ROW - FILTERS AND BUTTON */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {/* QUARTER DROPDOWN SKELETON */}
                <div className="h-9 w-20 bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
                {/* YEAR DROPDOWN SKELETON */}
                <div className="h-9 w-16 bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
                {/* STATUS FILTER SKELETON */}
                <div className="h-9 w-24 bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
                {/* REFRESH BUTTON SKELETON */}
                <div className="h-9 w-9 bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
              </div>
              {/* CREATE BUTTON SKELETON */}
              <div className="h-9 w-full sm:w-28 bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
        {/* GOAL CARDS SKELETON */}
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl overflow-hidden"
            >
              {/* MAIN CONTENT */}
              <div className="p-3 sm:p-4">
                {/* HEADER ROW */}
                <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3">
                  {/* LEFT SIDE */}
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                    {/* EXPAND BUTTON SKELETON (FOR FIRST CARD) */}
                    {i === 1 && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[var(--light-text)]/10 rounded animate-pulse flex-shrink-0 mt-0.5" />
                    )}
                    {/* ICON SKELETON */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[var(--light-text)]/10 animate-pulse flex-shrink-0" />
                    {/* TITLE AND META */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        {/* TITLE */}
                        <div className="h-4 w-32 sm:w-56 bg-[var(--light-text)]/10 rounded animate-pulse" />
                        {/* STATUS BADGE */}
                        <div className="h-4 sm:h-5 w-14 sm:w-16 bg-[var(--light-text)]/10 rounded-full animate-pulse" />
                      </div>
                      {/* DESCRIPTION - HIDDEN ON MOBILE */}
                      <div className="hidden sm:block h-3 w-3/4 bg-[var(--light-text)]/10 rounded animate-pulse mb-2" />
                      {/* META ROW */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        {/* TYPE BADGE */}
                        <div className="h-4 sm:h-5 w-14 sm:w-16 bg-[var(--light-text)]/10 rounded animate-pulse" />
                        {/* QUARTER/YEAR */}
                        <div className="h-3 w-12 sm:w-14 bg-[var(--light-text)]/10 rounded animate-pulse" />
                        {/* TASKS COUNT - HIDDEN ON MOBILE */}
                        <div className="hidden sm:block h-3 w-12 bg-[var(--light-text)]/10 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                  {/* RIGHT SIDE - ACTIONS */}
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {/* ADD KEY RESULT BUTTON SKELETON (FOR FIRST CARD) - HIDDEN ON MOBILE */}
                    {i === 1 && (
                      <div className="hidden sm:block w-7 h-7 bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
                    )}
                    {/* MORE DROPDOWN SKELETON */}
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
                  </div>
                </div>
                {/* PROGRESS BAR SECTION */}
                <div className="mt-2 sm:mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="h-2.5 w-10 sm:w-12 bg-[var(--light-text)]/10 rounded animate-pulse" />
                    <div className="h-3 w-16 sm:w-20 bg-[var(--light-text)]/10 rounded animate-pulse" />
                  </div>
                  {/* PROGRESS BAR */}
                  <div className="h-1.5 sm:h-2 w-full bg-[var(--light-text)]/10 rounded-full animate-pulse" />
                  <div className="flex items-center justify-between mt-1">
                    <div className="h-2.5 w-14 sm:w-16 bg-[var(--light-text)]/10 rounded animate-pulse" />
                    <div className="h-2.5 w-20 sm:w-24 bg-[var(--light-text)]/10 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              {/* KEY RESULTS SECTION SKELETON (FOR FIRST CARD ONLY) */}
              {i === 1 && (
                <div className="border-t border-[var(--border)] p-2 sm:p-3 space-y-2 bg-[var(--hover-bg)]/30">
                  {[1, 2].map((kr) => (
                    <div
                      key={kr}
                      className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg bg-[var(--cards-bg)] border border-[var(--border)]"
                    >
                      {/* STATUS ICON SKELETON */}
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[var(--light-text)]/10 rounded animate-pulse flex-shrink-0" />
                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        <div className="h-3 sm:h-3.5 w-28 sm:w-48 bg-[var(--light-text)]/10 rounded animate-pulse mb-1.5" />
                        <div className="flex items-center gap-2">
                          {/* PROGRESS BAR */}
                          <div className="flex-1 h-1 sm:h-1.5 bg-[var(--light-text)]/10 rounded-full animate-pulse" />
                          {/* PERCENTAGE */}
                          <div className="h-2.5 w-7 sm:w-8 bg-[var(--light-text)]/10 rounded animate-pulse flex-shrink-0" />
                        </div>
                      </div>
                      {/* EDIT BUTTON SKELETON */}
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[var(--light-text)]/10 rounded animate-pulse flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// <== GOALS PAGE COMPONENT ==>
const GoalsPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Goals & OKRs");
  // QUARTER FILTER STATE
  const [quarter, setQuarter] = useState<string>(getCurrentQuarter());
  // YEAR FILTER STATE
  const [year, setYear] = useState<number>(getCurrentYear());
  // STATUS FILTER STATE
  const [statusFilter, setStatusFilter] = useState<GoalStatus | "all">("all");
  // SEARCH QUERY STATE
  const [searchQuery, setSearchQuery] = useState("");
  // QUARTER DROPDOWN STATE
  const [isQuarterDropdownOpen, setIsQuarterDropdownOpen] = useState(false);
  // YEAR DROPDOWN STATE
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  // STATUS DROPDOWN STATE
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  // FORM OPEN STATE
  const [isFormOpen, setIsFormOpen] = useState(false);
  // EDITING GOAL STATE
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  // PARENT GOAL FOR NEW GOAL STATE
  const [parentGoalForNew, setParentGoalForNew] = useState<Goal | null>(null);
  // QUARTER DROPDOWN REF
  const quarterDropdownRef = useRef<HTMLDivElement>(null);
  // YEAR DROPDOWN REF
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  // STATUS DROPDOWN REF
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  // FETCH DATA
  const {
    data: goals,
    isLoading: goalsLoading,
    refetch: refetchGoals,
  } = useGoalsHierarchy({ quarter, year: year.toString() });
  // GOAL STATS
  const { data: stats, isLoading: statsLoading } = useGoalStats({
    quarter,
    year: year.toString(),
  });
  // HANDLE CLICK OUTSIDE DROPDOWNS
  useEffect(() => {
    // HANDLE CLICK OUTSIDE DROPDOWNS
    const handleClickOutside = (event: MouseEvent) => {
      // IF QUARTER DROPDOWN REF IS CLICKED, CLOSE QUARTER DROPDOWN
      if (
        quarterDropdownRef.current &&
        !quarterDropdownRef.current.contains(event.target as Node)
      ) {
        // SET QUARTER DROPDOWN OPEN STATE TO FALSE
        setIsQuarterDropdownOpen(false);
      }
      // IF YEAR DROPDOWN REF IS CLICKED, CLOSE YEAR DROPDOWN
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        // SET YEAR DROPDOWN OPEN STATE TO FALSE
        setIsYearDropdownOpen(false);
      }
      // IF STATUS DROPDOWN REF IS CLICKED, CLOSE STATUS DROPDOWN
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        // SET STATUS DROPDOWN OPEN STATE TO FALSE
        setIsStatusDropdownOpen(false);
      }
    };
    // ADD EVENT LISTENER FOR CLICK OUTSIDE DROPDOWNS
    document.addEventListener("mousedown", handleClickOutside);
    // RETURN CLEANUP FUNCTION
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // FILTER GOALS
  const filteredGoals = useMemo(() => {
    // IF NO GOALS, RETURN EMPTY ARRAY
    if (!goals) return [];
    // INITIALIZE RESULT WITH GOALS
    let result = goals;
    // FILTER BY STATUS
    if (statusFilter !== "all") {
      // FILTER BY STATUS
      result = result.filter((g) => g.status === statusFilter);
    }
    // FILTER BY SEARCH
    if (searchQuery.trim()) {
      // INITIALIZE QUERY WITH SEARCH QUERY
      const query = searchQuery.toLowerCase();
      // FILTER BY SEARCH QUERY
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.description?.toLowerCase().includes(query)
      );
    }
    // RETURN RESULT
    return result;
  }, [goals, statusFilter, searchQuery]);
  // LOADING STATE - SHOW FULL PAGE SKELETON WHEN ANY DATA IS LOADING
  const isLoading = goalsLoading || statsLoading;
  // IF LOADING, SHOW FULL PAGE SKELETON
  if (isLoading) {
    // RETURN FULL PAGE SKELETON
    return <GoalsPageSkeleton />;
  }
  // HANDLE EDIT GOAL
  const handleEditGoal = (goal: Goal) => {
    // SET EDITING GOAL TO GOAL
    setEditingGoal(goal);
    // SET PARENT GOAL FOR NEW TO NULL
    setParentGoalForNew(null);
    // SET FORM OPEN TO TRUE
    setIsFormOpen(true);
  };
  // HANDLE ADD KEY RESULT
  const handleAddKeyResult = (parentGoal: Goal) => {
    // SET EDITING GOAL TO NULL
    setEditingGoal(null);
    // SET PARENT GOAL FOR NEW TO PARENT GOAL
    setParentGoalForNew(parentGoal);
    // SET FORM OPEN TO TRUE
    setIsFormOpen(true);
  };
  // HANDLE CREATE NEW GOAL
  const handleCreateNew = () => {
    // SET EDITING GOAL TO NULL
    setEditingGoal(null);
    // SET PARENT GOAL FOR NEW TO NULL
    setParentGoalForNew(null);
    // SET FORM OPEN TO TRUE
    setIsFormOpen(true);
  };
  // HANDLE CLOSE FORM
  const handleCloseForm = () => {
    // SET FORM OPEN TO FALSE
    setIsFormOpen(false);
    // SET EDITING GOAL TO NULL
    setEditingGoal(null);
    // SET PARENT GOAL FOR NEW TO NULL
    setParentGoalForNew(null);
  };
  // YEAR OPTIONS
  const yearOptions = [
    getCurrentYear() - 1,
    getCurrentYear(),
    getCurrentYear() + 1,
  ];
  // RETURN PAGE
  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* HEADER */}
        <DashboardHeader
          title="Goals & OKRs"
          subtitle="Track your objectives and key results"
        />
        {/* CONTENT */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {/* TOTAL GOALS */}
            <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)] flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center flex-shrink-0">
                <Target
                  size={18}
                  className="sm:hidden text-[var(--accent-color)]"
                />
                <Target
                  size={20}
                  className="hidden sm:block text-[var(--accent-color)]"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {stats?.totalGoals || 0}
                </p>
                <p className="text-xs text-[var(--light-text)]">Total Goals</p>
              </div>
            </div>
            {/* COMPLETED GOALS */}
            <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)] flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={18} className="sm:hidden text-green-500" />
                <CheckCircle2
                  size={20}
                  className="hidden sm:block text-green-500"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {stats?.completedGoals || 0}
                </p>
                <p className="text-xs text-[var(--light-text)]">Completed</p>
              </div>
            </div>
            {/* AT RISK GOALS */}
            <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)] flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle
                  size={18}
                  className="sm:hidden text-yellow-500"
                />
                <AlertTriangle
                  size={20}
                  className="hidden sm:block text-yellow-500"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {stats?.atRiskGoals || 0}
                </p>
                <p className="text-xs text-[var(--light-text)]">At Risk</p>
              </div>
            </div>
            {/* AVG PROGRESS */}
            <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)] flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={18} className="sm:hidden text-blue-500" />
                <TrendingUp
                  size={20}
                  className="hidden sm:block text-blue-500"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {stats?.avgProgress || 0}%
                </p>
                <p className="text-xs text-[var(--light-text)]">Avg Progress</p>
              </div>
            </div>
          </div>
          {/* FILTERS AND ACTIONS */}
          <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)]">
            <div className="flex flex-col gap-3">
              {/* SEARCH INPUT - FULL WIDTH */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search goals..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:border-[var(--accent-color)] transition"
                />
              </div>
              {/* FILTERS AND BUTTON ROW */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* FILTER BUTTONS */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* QUARTER DROPDOWN */}
                  <div ref={quarterDropdownRef} className="relative">
                    <button
                      onClick={() =>
                        setIsQuarterDropdownOpen(!isQuarterDropdownOpen)
                      }
                      className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent-color)] transition cursor-pointer"
                    >
                      <Calendar
                        size={14}
                        className="text-[var(--light-text)]"
                      />
                      {quarter}
                      <ChevronDown
                        size={14}
                        className={`transition ${
                          isQuarterDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isQuarterDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-40 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10 overflow-hidden">
                        {QUARTER_OPTIONS.map((q) => (
                          <button
                            key={q.value}
                            onClick={() => {
                              setQuarter(q.value);
                              setIsQuarterDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer"
                          >
                            {q.label}
                            {quarter === q.value && (
                              <Check
                                size={14}
                                className="text-[var(--accent-color)]"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* YEAR DROPDOWN */}
                  <div ref={yearDropdownRef} className="relative">
                    <button
                      onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                      className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent-color)] transition cursor-pointer"
                    >
                      {year}
                      <ChevronDown
                        size={14}
                        className={`transition ${
                          isYearDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isYearDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-24 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10 overflow-hidden">
                        {yearOptions.map((y) => (
                          <button
                            key={y}
                            onClick={() => {
                              setYear(y);
                              setIsYearDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer"
                          >
                            {y}
                            {year === y && (
                              <Check
                                size={14}
                                className="text-[var(--accent-color)]"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* STATUS FILTER */}
                  <div ref={statusDropdownRef} className="relative">
                    <button
                      onClick={() =>
                        setIsStatusDropdownOpen(!isStatusDropdownOpen)
                      }
                      className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent-color)] transition cursor-pointer"
                    >
                      <Filter size={14} className="text-[var(--light-text)]" />
                      <span className="hidden sm:inline">
                        {statusFilter === "all"
                          ? "All Status"
                          : GOAL_STATUS_CONFIG[statusFilter].label}
                      </span>
                      <span className="sm:hidden">
                        {statusFilter === "all"
                          ? "All"
                          : GOAL_STATUS_CONFIG[statusFilter].label}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition ${
                          isStatusDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isStatusDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-40 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10 overflow-hidden max-h-56 overflow-y-auto">
                        <button
                          onClick={() => {
                            setStatusFilter("all");
                            setIsStatusDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer"
                        >
                          All Status
                          {statusFilter === "all" && (
                            <Check
                              size={14}
                              className="text-[var(--accent-color)]"
                            />
                          )}
                        </button>
                        {(Object.keys(GOAL_STATUS_CONFIG) as GoalStatus[]).map(
                          (s) => (
                            <button
                              key={s}
                              onClick={() => {
                                setStatusFilter(s);
                                setIsStatusDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer"
                            >
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${GOAL_STATUS_CONFIG[s].bg} ${GOAL_STATUS_CONFIG[s].color}`}
                              >
                                {GOAL_STATUS_CONFIG[s].label}
                              </span>
                              {statusFilter === s && (
                                <Check
                                  size={14}
                                  className="text-[var(--accent-color)]"
                                />
                              )}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  {/* REFRESH BUTTON */}
                  <button
                    onClick={() => refetchGoals()}
                    className="p-2 rounded-lg border border-[var(--border)] text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                    title="Refresh"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
                {/* CREATE BUTTON */}
                <button
                  onClick={handleCreateNew}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[var(--accent-color)] text-white text-xs sm:text-sm font-medium rounded-lg hover:opacity-90 transition cursor-pointer w-full sm:w-auto"
                >
                  <Plus size={16} />
                  New Goal
                </button>
              </div>
            </div>
          </div>
          {/* GOALS LIST */}
          {filteredGoals.length === 0 ? (
            <div className="bg-[var(--cards-bg)] rounded-xl p-8 border border-[var(--border)] text-center">
              <Target
                size={48}
                className="mx-auto text-[var(--light-text)] mb-3"
              />
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                {searchQuery || statusFilter !== "all"
                  ? "No goals match your filters"
                  : "No goals yet"}
              </h3>
              <p className="text-sm text-[var(--light-text)] mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : `Create your first goal for ${quarter} ${year}`}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition cursor-pointer"
                >
                  <Plus size={16} />
                  Create Goal
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredGoals.map((goal) => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onAddKeyResult={handleAddKeyResult}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* GOAL FORM MODAL */}
      <GoalForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        goal={editingGoal}
        parentGoal={parentGoalForNew}
      />
    </div>
  );
};

export default GoalsPage;
