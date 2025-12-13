// <== IMPORTS ==>
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BarChart3,
  CheckCircle,
  Clock,
  Target,
  AlertTriangle,
  TrendingUp,
  Percent,
  ListTodo,
} from "lucide-react";
import { useState, JSX } from "react";
import { useProjectReport, ReportPeriod } from "../../hooks/useReports";

// <== PROJECT REPORT TAB PROPS TYPE ==>
type ProjectReportTabProps = {
  // <== PROJECT ID ==>
  projectId: string;
};

// <== STATUS COLORS ==>
const STATUS_COLORS: { [key: string]: string } = {
  // COMPLETED STATUS COLOR
  completed: "#22c55e",
  // IN PROGRESS STATUS COLOR
  "in progress": "#3b82f6",
  // PENDING STATUS COLOR
  pending: "#f59e0b",
  // TO DO STATUS COLOR
  "to do": "#6b7280",
};

// <== PRIORITY COLORS ==>
const PRIORITY_COLORS: { [key: string]: string } = {
  // HIGH PRIORITY COLOR
  high: "#ef4444",
  // MEDIUM PRIORITY COLOR
  medium: "#f59e0b",
  // LOW PRIORITY COLOR
  low: "#22c55e",
};

// <== CUSTOM TOOLTIP COMPONENT ==>
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}): JSX.Element | null => {
  // IF NOT ACTIVE OR NO PAYLOAD, RETURN NULL
  if (!active || !payload || payload.length === 0) return null;
  // RETURN TOOLTIP
  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2 shadow-lg">
      {/* DATE LABEL */}
      <p className="text-xs text-[var(--light-text)] mb-1">{label}</p>
      {/* PAYLOAD VALUES */}
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-[var(--text-primary)]">
          <span className="font-medium">{entry.name}:</span> {entry.value}
        </p>
      ))}
    </div>
  );
};

// <== PROJECT REPORT TAB COMPONENT ==>
const ProjectReportTab = ({
  projectId,
}: ProjectReportTabProps): JSX.Element => {
  // PERIOD STATE
  const [period, setPeriod] = useState<ReportPeriod>("month");
  // FETCH PROJECT REPORT
  const {
    data: report,
    isLoading,
    isError,
  } = useProjectReport(projectId, period);
  // LOADING STATE
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {/* PERIOD SELECTOR SKELETON */}
        <div className="flex justify-end">
          <div className="h-8 w-48 bg-[var(--inside-card-bg)] rounded-lg" />
        </div>
        {/* STAT CARDS SKELETON */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[var(--inside-card-bg)] rounded-lg p-3">
              <div className="h-4 w-20 bg-[var(--light-text)]/10 rounded mb-2" />
              <div className="h-6 w-12 bg-[var(--light-text)]/10 rounded" />
            </div>
          ))}
        </div>
        {/* CHART SKELETON */}
        <div className="bg-[var(--inside-card-bg)] rounded-lg p-3 h-48" />
      </div>
    );
  }
  // ERROR STATE
  if (isError || !report) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <AlertTriangle
          size={48}
          className="text-[var(--light-text)] opacity-50"
        />
        <p className="text-[var(--light-text)] font-medium">
          Failed to load report
        </p>
        <p className="text-sm text-[var(--light-text)] text-center">
          Unable to fetch project report data.
        </p>
      </div>
    );
  }
  // DESTRUCTURE REPORT DATA
  const { summary, charts } = report;
  // STATUS DISTRIBUTION CHART DATA
  const statusChartData = charts.statusDistribution.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    color: STATUS_COLORS[item.status] || "#6b7280",
  }));
  // PRIORITY DISTRIBUTION CHART DATA
  const priorityChartData = charts.priorityDistribution.map((item) => ({
    name: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
    value: item.count,
    color: PRIORITY_COLORS[item.priority] || "#6b7280",
  }));
  // COMPLETION TREND CHART DATA
  const completionTrendData = charts.completionTrend.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    completed: item.completed,
  }));
  // RETURNING THE PROJECT REPORT TAB COMPONENT
  return (
    <div className="space-y-4">
      {/* PERIOD SELECTOR */}
      <div className="flex justify-end">
        <div className="flex items-center gap-1 p-1 bg-[var(--inside-card-bg)] rounded-lg">
          {(["week", "month", "quarter"] as const).map((p) => (
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
      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 gap-3">
        {/* TOTAL TASKS */}
        <div className="bg-[var(--inside-card-bg)] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <ListTodo size={14} className="text-[var(--accent-color)]" />
            <span className="text-xs text-[var(--light-text)]">Total</span>
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            {summary.totalTasks}
          </p>
        </div>
        {/* COMPLETED */}
        <div className="bg-[var(--inside-card-bg)] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={14} className="text-green-500" />
            <span className="text-xs text-[var(--light-text)]">Completed</span>
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            {summary.completedTasks}
          </p>
        </div>
        {/* IN PROGRESS */}
        <div className="bg-[var(--inside-card-bg)] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-blue-500" />
            <span className="text-xs text-[var(--light-text)]">
              In Progress
            </span>
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            {summary.inProgressTasks}
          </p>
        </div>
        {/* OVERDUE */}
        <div className="bg-[var(--inside-card-bg)] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-xs text-[var(--light-text)]">Overdue</span>
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            {summary.overdueTasks}
          </p>
        </div>
      </div>
      {/* PROGRESS BAR */}
      <div className="bg-[var(--inside-card-bg)] rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Percent size={14} className="text-[var(--accent-color)]" />
            <span className="text-xs text-[var(--light-text)]">Progress</span>
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {summary.progressPercentage}%
          </span>
        </div>
        {/* PROGRESS BAR */}
        <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent-color)] rounded-full transition-all duration-300"
            style={{ width: `${summary.progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-[var(--light-text)] mt-1">
          {summary.remainingTasks} tasks remaining
        </p>
      </div>
      {/* COMPLETION TREND CHART */}
      {completionTrendData.length > 0 && (
        <div className="bg-[var(--inside-card-bg)] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-[var(--accent-color)]" />
            <span className="text-xs font-medium text-[var(--text-primary)]">
              Completion Trend
            </span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={completionTrendData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
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
                tick={{ fontSize: 9, fill: "var(--light-text)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "var(--light-text)" }}
                axisLine={false}
                tickLine={false}
                width={20}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="var(--accent-color)"
                strokeWidth={2}
                fill="url(#colorCompleted)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* STATUS DISTRIBUTION */}
      {statusChartData.length > 0 && (
        <div className="bg-[var(--inside-card-bg)] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} className="text-[var(--accent-color)]" />
            <span className="text-xs font-medium text-[var(--text-primary)]">
              Status Distribution
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* PRIORITY DISTRIBUTION */}
      {priorityChartData.length > 0 && (
        <div className="bg-[var(--inside-card-bg)] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={14} className="text-[var(--accent-color)]" />
            <span className="text-xs font-medium text-[var(--text-primary)]">
              Priority Distribution
            </span>
          </div>
          <div className="space-y-2">
            {priorityChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-[var(--text-primary)] flex-1">
                  {item.name}
                </span>
                <span className="text-xs font-medium text-[var(--light-text)]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* EMPTY STATE */}
      {summary.totalTasks === 0 && (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <BarChart3
            size={48}
            className="text-[var(--light-text)] opacity-50"
          />
          <p className="text-[var(--light-text)] font-medium">No data yet</p>
          <p className="text-sm text-[var(--light-text)] text-center">
            Add tasks to see project analytics.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectReportTab;
