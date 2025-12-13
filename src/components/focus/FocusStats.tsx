// <== IMPORTS ==>
import {
  Clock,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Timer,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  useFocusStats,
  formatFocusDuration,
} from "../../hooks/useFocusSession";
import { useState } from "react";
import { FocusStatsSkeleton } from "../skeletons/FocusSkeleton";

// <== FOCUS STATS COMPONENT ==>
const FocusStats = () => {
  // PERIOD STATE
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  // FETCH FOCUS STATS QUERY
  const { data: stats, isLoading, isError } = useFocusStats(period);
  // IF LOADING, RETURN FOCUS STATS SKELETON
  if (isLoading) {
    return <FocusStatsSkeleton />;
  }
  // IF ERROR OR NO STATS, RETURN ERROR MESSAGE
  if (isError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <XCircle size={32} className="text-red-500 mb-2" />
        <p className="text-[var(--text-primary)] font-medium">
          Failed to load focus stats
        </p>
        <p className="text-sm text-[var(--light-text)]">
          Please try again later
        </p>
      </div>
    );
  }
  // FORMAT HOUR DISPLAY
  const formatHour = (hour: number): string => {
    // IF HOUR IS 0, RETURN 12 AM
    if (hour === 0) return "12 AM";
    // IF HOUR IS 12, RETURN 12 PM
    if (hour === 12) return "12 PM";
    // IF HOUR IS LESS THAN 12, RETURN HOUR AND AM
    if (hour < 12) return `${hour} AM`;
    // IF HOUR IS GREATER THAN 12, RETURN HOUR - 12 AND PM
    return `${hour - 12} PM`;
  };
  // FORMAT DATE FOR CHART
  const formatDateForChart = (dateStr: string): string => {
    // CREATE DATE OBJECT FROM DATE STRING
    const date = new Date(dateStr);
    // RETURN DATE STRING IN FORMAT MONTH SHORT DAY NUMERIC
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  // RETURN FOCUS STATS COMPONENT
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* PERIOD SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
          Focus Statistics
        </h2>
        <div className="flex items-center gap-1 p-1 bg-[var(--hover-bg)] rounded-lg w-fit">
          {(["week", "month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                period === p
                  ? "bg-[var(--accent-color)] text-white"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* TOTAL FOCUS TIME */}
        <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Clock
                size={14}
                className="text-[var(--accent-color)] sm:hidden"
              />
              <Clock
                size={16}
                className="text-[var(--accent-color)] hidden sm:block"
              />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-[var(--text-primary)]">
            {formatFocusDuration(stats.summary.totalDuration)}
          </p>
          <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
            Total Focus Time
          </p>
        </div>
        {/* SESSIONS */}
        <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
              <Target size={14} className="text-green-500 sm:hidden" />
              <Target size={16} className="text-green-500 hidden sm:block" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-[var(--text-primary)]">
            {stats.summary.completedSessions}
          </p>
          <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
            <span className="hidden sm:inline">
              Sessions ({stats.summary.completionRate}% rate)
            </span>
            <span className="sm:hidden">
              {stats.summary.completionRate}% rate
            </span>
          </p>
        </div>
        {/* AVERAGE SESSION */}
        <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <Timer size={14} className="text-blue-500 sm:hidden" />
              <Timer size={16} className="text-blue-500 hidden sm:block" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-[var(--text-primary)]">
            {formatFocusDuration(stats.summary.avgDuration)}
          </p>
          <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
            Avg Session
          </p>
        </div>
        {/* POMODOROS */}
        <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
              <Award size={14} className="text-red-500 sm:hidden" />
              <Award size={16} className="text-red-500 hidden sm:block" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-[var(--text-primary)]">
            {stats.summary.totalPomodoros} 🍅
          </p>
          <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
            Pomodoros
          </p>
        </div>
      </div>
      {/* CHARTS ROW */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* DAILY FOCUS CHART */}
        <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-[var(--accent-color)]" />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              Daily Focus Time
            </h3>
          </div>
          {stats.dailyBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={stats.dailyBreakdown.map((d) => ({
                  ...d,
                  date: formatDateForChart(d.date),
                }))}
              >
                <defs>
                  <linearGradient
                    id="colorDuration"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--accent-color)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--accent-color)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "var(--light-text)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--light-text)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${Math.round(value)}m`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  formatter={(value: number) => [
                    formatFocusDuration(value),
                    "Focus Time",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="duration"
                  stroke="var(--accent-color)"
                  strokeWidth={2}
                  fill="url(#colorDuration)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              <TrendingUp size={24} className="text-[var(--light-text)] mb-2" />
              <p className="text-xs text-[var(--light-text)]">
                No focus data for this period
              </p>
            </div>
          )}
        </div>
        {/* BEST FOCUS HOURS */}
        <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[var(--accent-color)]" />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              Best Focus Hours
            </h3>
          </div>
          {stats.bestFocusHours.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={stats.bestFocusHours.map((h) => ({
                  ...h,
                  hourLabel: formatHour(h.hour),
                }))}
                layout="vertical"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "var(--light-text)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="hourLabel"
                  tick={{ fontSize: 10, fill: "var(--light-text)" }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  formatter={(value: number, name: string) => [
                    name === "sessions"
                      ? `${value} sessions`
                      : formatFocusDuration(value),
                    name === "sessions" ? "Sessions" : "Total Time",
                  ]}
                />
                <Bar
                  dataKey="sessions"
                  fill="var(--accent-color)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              <Clock size={24} className="text-[var(--light-text)] mb-2" />
              <p className="text-xs text-[var(--light-text)]">
                Complete more sessions to see patterns
              </p>
            </div>
          )}
        </div>
      </div>
      {/* ADDITIONAL STATS */}
      <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-3 sm:p-4">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3 sm:mb-4">
          Session Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <CheckCircle2
              size={18}
              className="text-green-500 flex-shrink-0 sm:hidden"
            />
            <CheckCircle2
              size={20}
              className="text-green-500 flex-shrink-0 hidden sm:block"
            />
            <div className="min-w-0">
              <p className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                {stats.summary.completedSessions}
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
                Completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <XCircle
              size={18}
              className="text-red-500 flex-shrink-0 sm:hidden"
            />
            <XCircle
              size={20}
              className="text-red-500 flex-shrink-0 hidden sm:block"
            />
            <div className="min-w-0">
              <p className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                {stats.summary.abandonedSessions}
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
                Abandoned
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Timer
              size={18}
              className="text-blue-500 flex-shrink-0 sm:hidden"
            />
            <Timer
              size={20}
              className="text-blue-500 flex-shrink-0 hidden sm:block"
            />
            <div className="min-w-0">
              <p className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                {formatFocusDuration(stats.summary.longestSession)}
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
                <span className="hidden sm:inline">Longest Session</span>
                <span className="sm:hidden">Longest</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Target
              size={18}
              className="text-[var(--accent-color)] flex-shrink-0 sm:hidden"
            />
            <Target
              size={20}
              className="text-[var(--accent-color)] flex-shrink-0 hidden sm:block"
            />
            <div className="min-w-0">
              <p className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                {stats.summary.completionRate}%
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
                <span className="hidden sm:inline">Success Rate</span>
                <span className="sm:hidden">Success</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusStats;
