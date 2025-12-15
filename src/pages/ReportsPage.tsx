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
  User,
  ChevronDown,
  Percent,
  ListTodo,
  Building2,
  Users,
  Check,
  Download,
  Share2,
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
  useProjectReport,
  useWorkspaceReport,
  ReportPeriod,
  formatReportDuration,
  formatProductiveHour,
} from "../hooks/useReports";
import {
  ReportsSkeleton,
  ProjectReportSkeleton,
  WorkspaceReportSkeleton,
} from "../components/skeletons/ReportsSkeleton";
import { useState, JSX } from "react";
import useTitle from "../hooks/useTitle";
import { useProjects } from "../hooks/useProjects";
import { useWorkspaces } from "../hooks/useWorkspace";
import DashboardHeader from "../components/layout/DashboardHeader";
import { ExportModal, ShareReportModal } from "../components/reports";

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

// <== STATUS COLORS ==>
const STATUS_COLORS: Record<string, string> = {
  // COMPLETED STATUS COLOR
  completed: "#22c55e",
  // IN PROGRESS STATUS COLOR
  "in progress": "#3b82f6",
  // PENDING STATUS COLOR
  pending: "#f59e0b",
  // TO DO STATUS COLOR
  "to do": "#6b7280",
};

// <== REPORT TAB TYPE ==>
type ReportTab = "personal" | "project" | "workspace";

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
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<ReportTab>("personal");
  // PERIOD STATE
  const [period, setPeriod] = useState<ReportPeriod>("month");
  // SELECTED PROJECT STATE
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  // PROJECT DROPDOWN STATE
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  // SELECTED WORKSPACE STATE
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  // WORKSPACE DROPDOWN STATE
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  // EXPORT MODAL STATE
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  // SHARE MODAL STATE
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // FETCH PERSONAL REPORT
  const { data: report, isLoading, isError } = usePersonalReport(period);
  // FETCH PROJECTS
  const { projects } = useProjects();
  // FETCH WORKSPACES
  const { workspaces } = useWorkspaces();
  // FETCH PROJECT REPORT
  const {
    data: projectReport,
    isLoading: isProjectReportLoading,
    isError: isProjectReportError,
  } = useProjectReport(selectedProjectId, period);
  // FETCH WORKSPACE REPORT
  const {
    data: workspaceReport,
    isLoading: isWorkspaceReportLoading,
    isError: isWorkspaceReportError,
  } = useWorkspaceReport(selectedWorkspaceId, period);
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
        {/* TABS AND PERIOD SELECTOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* TABS */}
          <div className="flex items-center gap-1 p-1 bg-[var(--hover-bg)] rounded-lg">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "personal"
                  ? "bg-[var(--accent-color)] text-white"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              <User size={16} />
              Personal
            </button>
            <button
              onClick={() => setActiveTab("project")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "project"
                  ? "bg-[var(--accent-color)] text-white"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Folder size={16} />
              Project
            </button>
            <button
              onClick={() => setActiveTab("workspace")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "workspace"
                  ? "bg-[var(--accent-color)] text-white"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Building2 size={16} />
              Workspace
            </button>
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
          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            {/* EXPORT BUTTON */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              disabled={
                (activeTab === "personal" && !report) ||
                (activeTab === "project" && !projectReport) ||
                (activeTab === "workspace" && !workspaceReport)
              }
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--cards-bg)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent-color)]/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export to Excel"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
            {/* SHARE BUTTON */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              disabled={
                (activeTab === "personal" && !report) ||
                (activeTab === "project" && !projectReport) ||
                (activeTab === "workspace" && !workspaceReport)
              }
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Share Report"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
        {/* PERSONAL REPORT TAB */}
        {activeTab === "personal" && (
          <>
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
                    icon={
                      <Zap size={18} className="text-[var(--accent-color)]" />
                    }
                    color="bg-[var(--accent-color)]/15"
                    subtext="Tasks per week"
                  />
                </div>
                {/* CHARTS ROW 1 */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* DAILY COMPLETION CHART */}
                  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
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
                      <PieChart
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
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
                                  fill={
                                    PRIORITY_COLORS[entry.priority] || "#888"
                                  }
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
                        <p className="text-sm text-[var(--light-text)]">
                          No data
                        </p>
                      </div>
                    )}
                  </div>
                  {/* PROJECT DISTRIBUTION */}
                  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Folder
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
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
                      <Lightbulb
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
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
                      <p className="text-xs text-[var(--light-text)]">
                        Completed
                      </p>
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
                        {formatReportDuration(
                          report.focusStats.avgSessionLength
                        )}
                      </p>
                      <p className="text-xs text-[var(--light-text)]">
                        Avg Session
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[var(--inside-card-bg)]">
                      <p className="text-2xl font-bold text-red-500">
                        {report.focusStats.totalPomodoros} 🍅
                      </p>
                      <p className="text-xs text-[var(--light-text)]">
                        Pomodoros
                      </p>
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
          </>
        )}
        {/* PROJECT REPORT TAB */}
        {activeTab === "project" && (
          <>
            {/* PROJECT SELECTOR */}
            <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Folder size={20} className="text-[var(--accent-color)]" />
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Project Report
                  </h2>
                </div>
                {/* PROJECT DROPDOWN */}
                <div className="relative flex-1 max-w-xs">
                  <button
                    onClick={() =>
                      setIsProjectDropdownOpen(!isProjectDropdownOpen)
                    }
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] hover:border-[var(--accent-color)]/50 transition"
                  >
                    <Folder
                      size={16}
                      className={
                        selectedProjectId
                          ? "text-[var(--accent-color)]"
                          : "text-[var(--light-text)]"
                      }
                    />
                    <span className="flex-1 truncate text-left">
                      {selectedProjectId
                        ? projects?.find((p) => p._id === selectedProjectId)
                            ?.title || "Select a project"
                        : "Select a project"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[var(--light-text)] transition-transform ${
                        isProjectDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {/* DROPDOWN MENU */}
                  {isProjectDropdownOpen && (
                    <>
                      {/* BACKDROP TO CLOSE DROPDOWN */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProjectDropdownOpen(false)}
                      />
                      {/* DROPDOWN CONTENT */}
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto py-1">
                        {projects && projects.length > 0 ? (
                          projects.map((project) => (
                            <button
                              key={project._id}
                              onClick={() => {
                                setSelectedProjectId(project._id);
                                setIsProjectDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                            >
                              <Folder
                                size={16}
                                className={
                                  selectedProjectId === project._id
                                    ? "text-[var(--accent-color)]"
                                    : "text-[var(--light-text)]"
                                }
                              />
                              <span className="flex-1 text-left truncate">
                                {project.title}
                              </span>
                              {selectedProjectId === project._id && (
                                <Check
                                  size={14}
                                  className="text-[var(--accent-color)]"
                                />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-[var(--light-text)]">
                            No projects available
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* NO PROJECT SELECTED */}
            {!selectedProjectId && (
              <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-8 text-center">
                <Folder
                  size={48}
                  className="mx-auto text-[var(--light-text)] mb-3"
                />
                <p className="text-[var(--text-primary)] font-medium">
                  Select a project
                </p>
                <p className="text-sm text-[var(--light-text)] mt-1">
                  Choose a project from the dropdown to view its report
                </p>
              </div>
            )}
            {/* PROJECT REPORT LOADING */}
            {selectedProjectId && isProjectReportLoading && (
              <ProjectReportSkeleton />
            )}
            {/* PROJECT REPORT ERROR */}
            {selectedProjectId && isProjectReportError && (
              <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-8 text-center">
                <AlertCircle size={40} className="mx-auto text-red-500 mb-3" />
                <p className="text-[var(--text-primary)] font-medium">
                  Failed to load project report
                </p>
                <p className="text-sm text-[var(--light-text)] mt-1">
                  Please try again later
                </p>
              </div>
            )}
            {/* PROJECT REPORT DATA */}
            {selectedProjectId && projectReport && !isProjectReportLoading && (
              <div className="space-y-6">
                {/* PROJECT INFO HEADER */}
                <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        {projectReport.project.title}
                      </h3>
                      {projectReport.project.description && (
                        <p className="text-sm text-[var(--light-text)] mt-1 line-clamp-2">
                          {projectReport.project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {/* STATUS BADGE */}
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-color)]/15 text-[var(--accent-color)]">
                        {projectReport.project.status}
                      </span>
                      {/* DUE DATE */}
                      {projectReport.project.dueDate && (
                        <span className="flex items-center gap-1 text-xs text-[var(--light-text)]">
                          <Calendar size={12} />
                          {new Date(
                            projectReport.project.dueDate
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    label="Total Tasks"
                    value={projectReport.summary.totalTasks}
                    icon={
                      <ListTodo
                        size={18}
                        className="text-[var(--accent-color)]"
                      />
                    }
                    color="bg-[var(--accent-color)]/15"
                  />
                  <StatCard
                    label="Completed"
                    value={projectReport.summary.completedTasks}
                    icon={<CheckCircle2 size={18} className="text-green-500" />}
                    color="bg-green-500/15"
                  />
                  <StatCard
                    label="In Progress"
                    value={projectReport.summary.inProgressTasks}
                    icon={<Clock size={18} className="text-blue-500" />}
                    color="bg-blue-500/15"
                  />
                  <StatCard
                    label="Overdue"
                    value={projectReport.summary.overdueTasks}
                    icon={<AlertCircle size={18} className="text-red-500" />}
                    color="bg-red-500/15"
                  />
                </div>
                {/* PROGRESS BAR */}
                <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Percent
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        Project Progress
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[var(--accent-color)]">
                      {projectReport.summary.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent-color)] rounded-full transition-all duration-500"
                      style={{
                        width: `${projectReport.summary.progressPercentage}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-[var(--light-text)] mt-2">
                    {projectReport.summary.remainingTasks} tasks remaining
                  </p>
                </div>
                {/* CHARTS ROW */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* COMPLETION TREND */}
                  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <h3 className="text-sm font-medium text-[var(--text-primary)]">
                        Completion Trend
                      </h3>
                    </div>
                    {projectReport.charts.completionTrend.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={projectReport.charts.completionTrend}>
                          <defs>
                            <linearGradient
                              id="colorProjectCompleted"
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
                            fill="url(#colorProjectCompleted)"
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
                          No completion data yet
                        </p>
                      </div>
                    )}
                  </div>
                  {/* BURNDOWN CHART */}
                  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <h3 className="text-sm font-medium text-[var(--text-primary)]">
                        Tasks Created vs Completed
                      </h3>
                    </div>
                    {projectReport.charts.burndownData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={projectReport.charts.burndownData}>
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
                          />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                          <Bar
                            dataKey="created"
                            name="Created"
                            fill="var(--accent-color)"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="completed"
                            name="Completed"
                            fill="#22c55e"
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
                          No burndown data yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {/* SECOND ROW */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* STATUS DISTRIBUTION */}
                  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <PieChart
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <h3 className="text-sm font-medium text-[var(--text-primary)]">
                        Status Distribution
                      </h3>
                    </div>
                    {projectReport.charts.statusDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsPie>
                          <Pie
                            data={projectReport.charts.statusDistribution}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            label={({ name, percent }) =>
                              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                          >
                            {projectReport.charts.statusDistribution.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={STATUS_COLORS[entry.status] || "#888"}
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
                      <div className="flex flex-col items-center justify-center h-[200px]">
                        <Target
                          size={24}
                          className="text-[var(--light-text)] mb-2"
                        />
                        <p className="text-sm text-[var(--light-text)]">
                          No data
                        </p>
                      </div>
                    )}
                  </div>
                  {/* PRIORITY DISTRIBUTION */}
                  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Target
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <h3 className="text-sm font-medium text-[var(--text-primary)]">
                        Priority Distribution
                      </h3>
                    </div>
                    {projectReport.charts.priorityDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsPie>
                          <Pie
                            data={projectReport.charts.priorityDistribution}
                            dataKey="count"
                            nameKey="priority"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            label={({ name, percent }) =>
                              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                          >
                            {projectReport.charts.priorityDistribution.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    PRIORITY_COLORS[entry.priority] || "#888"
                                  }
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
                      <div className="flex flex-col items-center justify-center h-[200px]">
                        <Target
                          size={24}
                          className="text-[var(--light-text)] mb-2"
                        />
                        <p className="text-sm text-[var(--light-text)]">
                          No data
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {/* DATE RANGE INFO */}
                <div className="text-center text-xs text-[var(--light-text)]">
                  Report period:{" "}
                  {new Date(projectReport.dateRange.start).toLocaleDateString()}{" "}
                  - {new Date(projectReport.dateRange.end).toLocaleDateString()}
                </div>
              </div>
            )}
          </>
        )}
        {/* WORKSPACE REPORT TAB */}
        {activeTab === "workspace" && (
          <>
            {/* WORKSPACE SELECTOR */}
            <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Building2 size={20} className="text-[var(--accent-color)]" />
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Workspace Report
                  </h2>
                </div>
                {/* WORKSPACE DROPDOWN */}
                <div className="relative flex-1 max-w-xs">
                  <button
                    onClick={() =>
                      setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)
                    }
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] hover:border-[var(--accent-color)]/50 transition"
                  >
                    <Building2
                      size={16}
                      className={
                        selectedWorkspaceId
                          ? "text-[var(--accent-color)]"
                          : "text-[var(--light-text)]"
                      }
                    />
                    <span className="flex-1 truncate text-left">
                      {selectedWorkspaceId
                        ? workspaces?.find((w) => w._id === selectedWorkspaceId)
                            ?.name || "Select a workspace"
                        : "Select a workspace"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[var(--light-text)] transition-transform ${
                        isWorkspaceDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {/* DROPDOWN MENU */}
                  {isWorkspaceDropdownOpen && (
                    <>
                      {/* BACKDROP TO CLOSE DROPDOWN */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsWorkspaceDropdownOpen(false)}
                      />
                      {/* DROPDOWN CONTENT */}
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto py-1">
                        {workspaces && workspaces.length > 0 ? (
                          workspaces.map((workspace) => (
                            <button
                              key={workspace._id}
                              onClick={() => {
                                setSelectedWorkspaceId(workspace._id);
                                setIsWorkspaceDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                            >
                              <Building2
                                size={16}
                                className={
                                  selectedWorkspaceId === workspace._id
                                    ? "text-[var(--accent-color)]"
                                    : "text-[var(--light-text)]"
                                }
                              />
                              <span className="flex-1 text-left truncate">
                                {workspace.name}
                              </span>
                              {selectedWorkspaceId === workspace._id && (
                                <Check
                                  size={14}
                                  className="text-[var(--accent-color)]"
                                />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-[var(--light-text)]">
                            No workspaces available
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* NO WORKSPACE SELECTED */}
            {!selectedWorkspaceId && (
              <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-8 text-center">
                <Building2
                  size={48}
                  className="mx-auto text-[var(--light-text)] mb-3"
                />
                <p className="text-[var(--text-primary)] font-medium">
                  Select a workspace
                </p>
                <p className="text-sm text-[var(--light-text)] mt-1">
                  Choose a workspace from the dropdown to view team analytics
                </p>
              </div>
            )}
            {/* WORKSPACE REPORT LOADING */}
            {selectedWorkspaceId && isWorkspaceReportLoading && (
              <WorkspaceReportSkeleton />
            )}
            {/* WORKSPACE REPORT ERROR */}
            {selectedWorkspaceId && isWorkspaceReportError && (
              <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-8 text-center">
                <AlertCircle size={40} className="mx-auto text-red-500 mb-3" />
                <p className="text-[var(--text-primary)] font-medium">
                  Failed to load workspace report
                </p>
                <p className="text-sm text-[var(--light-text)] mt-1">
                  Please try again later
                </p>
              </div>
            )}
            {/* WORKSPACE REPORT DATA */}
            {selectedWorkspaceId &&
              workspaceReport &&
              !isWorkspaceReportLoading && (
                <div className="space-y-6">
                  {/* WORKSPACE INFO HEADER */}
                  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          {workspaceReport.workspace.name}
                        </h3>
                        {workspaceReport.workspace.description && (
                          <p className="text-sm text-[var(--light-text)] mt-1 line-clamp-2">
                            {workspaceReport.workspace.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {/* VISIBILITY BADGE */}
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-color)]/15 text-[var(--accent-color)]">
                          {workspaceReport.workspace.visibility}
                        </span>
                        {/* MEMBER COUNT */}
                        <span className="flex items-center gap-1 text-xs text-[var(--light-text)]">
                          <Users size={12} />
                          {workspaceReport.workspace.memberCount} members
                        </span>
                        {/* PROJECT COUNT */}
                        <span className="flex items-center gap-1 text-xs text-[var(--light-text)]">
                          <Folder size={12} />
                          {workspaceReport.workspace.projectCount} projects
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* SUMMARY CARDS */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      label="Total Tasks"
                      value={workspaceReport.summary.totalTasks}
                      icon={
                        <ListTodo
                          size={18}
                          className="text-[var(--accent-color)]"
                        />
                      }
                      color="bg-[var(--accent-color)]/15"
                    />
                    <StatCard
                      label="Completed"
                      value={workspaceReport.summary.completedTasks}
                      icon={
                        <CheckCircle2 size={18} className="text-green-500" />
                      }
                      color="bg-green-500/15"
                      subtext={`${workspaceReport.summary.completionRate}% rate`}
                    />
                    <StatCard
                      label="In Progress"
                      value={workspaceReport.summary.inProgressTasks}
                      icon={<Clock size={18} className="text-blue-500" />}
                      color="bg-blue-500/15"
                    />
                    <StatCard
                      label="Team Velocity"
                      value={`${workspaceReport.summary.teamVelocity}/wk`}
                      icon={
                        <Zap size={18} className="text-[var(--accent-color)]" />
                      }
                      color="bg-[var(--accent-color)]/15"
                      subtext="Tasks per week"
                    />
                  </div>
                  {/* CHARTS ROW */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* WEEKLY VELOCITY TREND */}
                    <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp
                          size={16}
                          className="text-[var(--accent-color)]"
                        />
                        <h3 className="text-sm font-medium text-[var(--text-primary)]">
                          Team Velocity Trend
                        </h3>
                      </div>
                      {workspaceReport.charts.weeklyVelocity.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart
                            data={workspaceReport.charts.weeklyVelocity}
                          >
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
                    {/* PROJECT STATUS DISTRIBUTION */}
                    <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <PieChart
                          size={16}
                          className="text-[var(--accent-color)]"
                        />
                        <h3 className="text-sm font-medium text-[var(--text-primary)]">
                          Project Status
                        </h3>
                      </div>
                      {workspaceReport.charts.projectStatus.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                          <RechartsPie>
                            <Pie
                              data={workspaceReport.charts.projectStatus}
                              dataKey="count"
                              nameKey="status"
                              cx="50%"
                              cy="50%"
                              outerRadius={70}
                              label={({ name, percent }) =>
                                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                              }
                              labelLine={false}
                            >
                              {workspaceReport.charts.projectStatus.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={STATUS_COLORS[entry.status] || "#888"}
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
                        <div className="flex flex-col items-center justify-center h-[220px]">
                          <Target
                            size={24}
                            className="text-[var(--light-text)] mb-2"
                          />
                          <p className="text-sm text-[var(--light-text)]">
                            No data
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* MEMBER CONTRIBUTIONS */}
                  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Users size={16} className="text-[var(--accent-color)]" />
                      <h3 className="text-sm font-medium text-[var(--text-primary)]">
                        Member Contributions
                      </h3>
                    </div>
                    {workspaceReport.members.length > 0 ? (
                      <div className="space-y-3">
                        {workspaceReport.members.map((member, index) => (
                          <div
                            key={member.memberId}
                            className="flex items-center gap-3 p-3 rounded-lg bg-[var(--inside-card-bg)]"
                          >
                            {/* RANK */}
                            <div className="w-6 h-6 rounded-full bg-[var(--accent-color)]/15 flex items-center justify-center text-xs font-medium text-[var(--accent-color)]">
                              {index + 1}
                            </div>
                            {/* AVATAR */}
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.fullName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[var(--accent-color)]/20 flex items-center justify-center">
                                <User
                                  size={14}
                                  className="text-[var(--accent-color)]"
                                />
                              </div>
                            )}
                            {/* NAME */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                {member.fullName || member.username}
                              </p>
                              <p className="text-xs text-[var(--light-text)]">
                                @{member.username}
                              </p>
                            </div>
                            {/* STATS */}
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm font-bold text-[var(--accent-color)]">
                                  {member.tasksCompleted}
                                </p>
                                <p className="text-xs text-[var(--light-text)]">
                                  tasks
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-red-500">
                                  {member.highPriority}
                                </p>
                                <p className="text-xs text-[var(--light-text)]">
                                  high
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[150px]">
                        <Users
                          size={24}
                          className="text-[var(--light-text)] mb-2"
                        />
                        <p className="text-sm text-[var(--light-text)]">
                          No contributions in this period
                        </p>
                      </div>
                    )}
                  </div>
                  {/* DATE RANGE INFO */}
                  <div className="text-center text-xs text-[var(--light-text)]">
                    Report period:{" "}
                    {new Date(
                      workspaceReport.dateRange.start
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      workspaceReport.dateRange.end
                    ).toLocaleDateString()}
                  </div>
                </div>
              )}
          </>
        )}
      </main>
      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        reportType={activeTab}
        period={period}
        projectId={selectedProjectId || undefined}
        projectName={projects?.find((p) => p._id === selectedProjectId)?.title}
        workspaceId={selectedWorkspaceId || undefined}
        workspaceName={
          workspaces?.find((w) => w._id === selectedWorkspaceId)?.name
        }
      />
      {/* SHARE MODAL */}
      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        reportType={activeTab}
        period={period}
        projectId={selectedProjectId || undefined}
        projectName={projects?.find((p) => p._id === selectedProjectId)?.title}
        workspaceId={selectedWorkspaceId || undefined}
        workspaceName={
          workspaces?.find((w) => w._id === selectedWorkspaceId)?.name
        }
      />
    </div>
  );
};

export default ReportsPage;
