// <== IMPORTS ==>
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Zap,
  Award,
  Lightbulb,
  PieChart,
  Folder,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  usePersonalReport,
  ReportPeriod,
  formatReportDuration,
  formatProductiveHour,
} from "../hooks/useReports";
import { useState, JSX } from "react";
import useTitle from "../hooks/useTitle";
import DashboardHeader from "../components/layout/DashboardHeader";
import { ReportsSkeleton } from "../components/skeletons/ReportsSkeleton";

// <== PERIOD OPTIONS ==>
const PERIOD_OPTIONS: { value: ReportPeriod; label: string }[] = [
  // WEEKLY PERIOD
  { value: "week", label: "Week" },
  // MONTHLY PERIOD
  { value: "month", label: "Month" },
  // QUARTERLY PERIOD
  { value: "quarter", label: "Quarter" },
  // YEARLY PERIOD
  { value: "year", label: "Year" },
];

// <== PRIORITY COLORS ==>
const PRIORITY_COLORS: Record<string, string> = {
  // HIGH PRIORITY COLOR
  high: "#ef4444",
  // MEDIUM PRIORITY COLOR
  medium: "#f59e0b",
  // LOW PRIORITY COLOR
  low: "#22c55e",
};

// <== STAT CARD COMPONENT ==>
const StatCard = ({
  label,
  value,
  icon,
  color,
  subtext,
}: {
  label: string;
  value: string | number;
  icon: JSX.Element;
  color: string;
  subtext?: string;
}): JSX.Element => (
  // RETURN STAT CARD
  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4 hover:border-[var(--accent-color)]/30 transition">
    <div className="flex items-center gap-3">
      {/* ICON */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
        <p className="text-xs text-[var(--light-text)]">{label}</p>
        {subtext && (
          <p className="text-[10px] text-[var(--light-text)] mt-0.5">
            {subtext}
          </p>
        )}
      </div>
    </div>
  </div>
);

// <== REPORTS PAGE COMPONENT ==>
const ReportsPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Reports");
  // PERIOD STATE
  const [period, setPeriod] = useState<ReportPeriod>("month");
  // FETCH PERSONAL REPORT
  const { data: report, isLoading, isError } = usePersonalReport(period);
  // RETURNING REPORTS PAGE
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* HEADER */}
      <DashboardHeader
        title="Reports & Analytics"
        subtitle="Track your productivity and progress"
      />
      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* PERIOD SELECTOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-[var(--accent-color)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Personal Report
            </h2>
          </div>
          {/* PERIOD BUTTONS */}
          <div className="flex items-center gap-1 p-1 bg-[var(--hover-bg)] rounded-lg">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  period === opt.value
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {/* LOADING STATE */}
        {isLoading && <ReportsSkeleton />}
        {/* ERROR STATE */}
        {isError && (
          <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-8 text-center">
            <AlertCircle size={40} className="mx-auto text-red-500 mb-3" />
            <p className="text-[var(--text-primary)] font-medium">
              Failed to load report
            </p>
            <p className="text-sm text-[var(--light-text)] mt-1">
              Please try again later
            </p>
          </div>
        )}
        {/* REPORT DATA */}
        {report && !isLoading && (
          <div className="space-y-6">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Tasks Completed"
                value={report.summary.completedTasks}
                icon={<CheckCircle2 size={18} className="text-green-500" />}
                color="bg-green-500/15"
                subtext={`${report.summary.completionRate}% completion rate`}
              />
              <StatCard
                label="In Progress"
                value={report.summary.inProgressTasks}
                icon={<Clock size={18} className="text-blue-500" />}
                color="bg-blue-500/15"
              />
              <StatCard
                label="Overdue"
                value={report.summary.overdueTasks}
                icon={<AlertCircle size={18} className="text-red-500" />}
                color="bg-red-500/15"
              />
              <StatCard
                label="Velocity"
                value={`${report.summary.velocity}/wk`}
                icon={<Zap size={18} className="text-[var(--accent-color)]" />}
                color="bg-[var(--accent-color)]/15"
                subtext="Tasks per week"
              />
            </div>
            {/* CHARTS ROW 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* DAILY COMPLETION CHART */}
              <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={16} className="text-[var(--accent-color)]" />
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    Daily Task Completion
                  </h3>
                </div>
                {report.charts.dailyCompletion.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={report.charts.dailyCompletion}>
                      <defs>
                        <linearGradient
                          id="colorCompleted"
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
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "var(--light-text)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--bg)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        labelStyle={{ color: "var(--text-primary)" }}
                        formatter={(value: number) => [value, "Completed"]}
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="var(--accent-color)"
                        strokeWidth={2}
                        fill="url(#colorCompleted)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[220px]">
                    <TrendingUp
                      size={24}
                      className="text-[var(--light-text)] mb-2"
                    />
                    <p className="text-sm text-[var(--light-text)]">
                      No data for this period
                    </p>
                  </div>
                )}
              </div>
              {/* VELOCITY TREND CHART */}
              <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp
                    size={16}
                    className="text-[var(--accent-color)]"
                  />
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    Weekly Velocity Trend
                  </h3>
                </div>
                {report.charts.velocityTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={report.charts.velocityTrend}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="week"
                        tick={{ fontSize: 10, fill: "var(--light-text)" }}
                        axisLine={{ stroke: "var(--border)" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "var(--light-text)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--bg)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number) => [value, "Tasks"]}
                      />
                      <Bar
                        dataKey="completed"
                        fill="var(--accent-color)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[220px]">
                    <BarChart3
                      size={24}
                      className="text-[var(--light-text)] mb-2"
                    />
                    <p className="text-sm text-[var(--light-text)]">
                      No velocity data yet
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* CHARTS ROW 2 */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* PRIORITY DISTRIBUTION */}
              <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart size={16} className="text-[var(--accent-color)]" />
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    Priority Distribution
                  </h3>
                </div>
                {report.charts.priorityDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <RechartsPie>
                      <Pie
                        data={report.charts.priorityDistribution}
                        dataKey="count"
                        nameKey="priority"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {report.charts.priorityDistribution.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PRIORITY_COLORS[entry.priority] || "#888"}
                            />
                          )
                        )}
                      </Pie>
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: "11px" }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[180px]">
                    <Target
                      size={24}
                      className="text-[var(--light-text)] mb-2"
                    />
                    <p className="text-sm text-[var(--light-text)]">No data</p>
                  </div>
                )}
              </div>
              {/* PROJECT DISTRIBUTION */}
              <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Folder size={16} className="text-[var(--accent-color)]" />
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    Tasks by Project
                  </h3>
                </div>
                {report.charts.projectDistribution.length > 0 ? (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {report.charts.projectDistribution
                      .slice(0, 5)
                      .map((proj) => (
                        <div
                          key={proj.projectId || "unassigned"}
                          className="flex items-center justify-between p-2 rounded-lg bg-[var(--inside-card-bg)]"
                        >
                          <span className="text-sm text-[var(--text-primary)] truncate flex-1">
                            {proj.projectName}
                          </span>
                          <span className="text-sm font-medium text-[var(--accent-color)] ml-2">
                            {proj.tasksCompleted}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[180px]">
                    <Folder
                      size={24}
                      className="text-[var(--light-text)] mb-2"
                    />
                    <p className="text-sm text-[var(--light-text)]">
                      No project data
                    </p>
                  </div>
                )}
              </div>
              {/* PRODUCTIVITY INSIGHTS */}
              <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={16} className="text-[var(--accent-color)]" />
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    Productivity Insights
                  </h3>
                </div>
                <div className="space-y-4">
                  {/* MOST PRODUCTIVE DAY */}
                  <div className="p-3 rounded-lg bg-[var(--inside-card-bg)]">
                    <p className="text-xs text-[var(--light-text)] mb-1">
                      Most Productive Day
                    </p>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                      {report.productivity.mostProductiveDay || "N/A"}
                    </p>
                  </div>
                  {/* MOST PRODUCTIVE HOUR */}
                  <div className="p-3 rounded-lg bg-[var(--inside-card-bg)]">
                    <p className="text-xs text-[var(--light-text)] mb-1">
                      Peak Productivity Hour
                    </p>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                      {formatProductiveHour(
                        report.productivity.mostProductiveHour
                      )}
                    </p>
                  </div>
                  {/* HIGH PRIORITY COMPLETED */}
                  <div className="p-3 rounded-lg bg-red-500/10">
                    <p className="text-xs text-[var(--light-text)] mb-1">
                      High Priority Completed
                    </p>
                    <p className="text-lg font-semibold text-red-500">
                      {report.summary.highPriorityCompleted}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* FOCUS STATS */}
            <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
              <div className="flex items-center gap-2 mb-4">
                <Award size={16} className="text-[var(--accent-color)]" />
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  Focus Session Stats
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 rounded-lg bg-[var(--inside-card-bg)]">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {report.focusStats.totalSessions}
                  </p>
                  <p className="text-xs text-[var(--light-text)]">
                    Total Sessions
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-[var(--inside-card-bg)]">
                  <p className="text-2xl font-bold text-green-500">
                    {report.focusStats.completedSessions}
                  </p>
                  <p className="text-xs text-[var(--light-text)]">Completed</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-[var(--inside-card-bg)]">
                  <p className="text-2xl font-bold text-[var(--accent-color)]">
                    {formatReportDuration(report.focusStats.totalFocusTime)}
                  </p>
                  <p className="text-xs text-[var(--light-text)]">
                    Total Focus Time
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-[var(--inside-card-bg)]">
                  <p className="text-2xl font-bold text-blue-500">
                    {formatReportDuration(report.focusStats.avgSessionLength)}
                  </p>
                  <p className="text-xs text-[var(--light-text)]">
                    Avg Session
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-[var(--inside-card-bg)]">
                  <p className="text-2xl font-bold text-red-500">
                    {report.focusStats.totalPomodoros} 🍅
                  </p>
                  <p className="text-xs text-[var(--light-text)]">Pomodoros</p>
                </div>
              </div>
            </div>
            {/* DATE RANGE INFO */}
            <div className="text-center text-xs text-[var(--light-text)]">
              Report period:{" "}
              {new Date(report.dateRange.start).toLocaleDateString()} -{" "}
              {new Date(report.dateRange.end).toLocaleDateString()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsPage;
