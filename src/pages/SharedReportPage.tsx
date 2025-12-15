// <== IMPORTS ==>
import {
  User,
  Folder,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ListTodo,
  TrendingUp,
  Users,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Target,
} from "lucide-react";
import useTitle from "../hooks/useTitle";
import { useEffect, useState, JSX } from "react";
import LOGO_IMAGE from "../assets/images/LOGO.png";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSharedReport, ReportPeriod } from "../hooks/useReports";

// <== APP SIGNATURE PURPLE COLOR ==>
const ACCENT_PURPLE = "#8b5cf6";

// <== APP SIGNATURE PURPLE DARK COLOR ==>
const ACCENT_PURPLE_DARK = "#7c3aed";

// <== SHARED REPORT DATA TYPE ==>
type SharedReportData = {
  // <== TYPE ==>
  type: "personal" | "project" | "workspace";
  // <== USER ==>
  user?: { name: string; avatar?: string | null };
  // <== PROJECT ==>
  project?: { title: string; description: string; status: string };
  // <== WORKSPACE ==>
  workspace?: {
    // <== NAME ==>
    name: string;
    // <== DESCRIPTION ==>
    description: string;
    // <== MEMBER COUNT ==>
    memberCount: number;
    // <== PROJECT COUNT ==>
    projectCount: number;
  };
  // <== SUMMARY ==>
  summary: {
    // <== TOTAL TASKS ==>
    totalTasks: number;
    // <== COMPLETED TASKS ==>
    completedTasks: number;
    // <== IN PROGRESS TASKS ==>
    inProgressTasks: number;
    // <== PENDING TASKS ==>
    pendingTasks: number;
  };
  // <== PERIOD ==>
  period: ReportPeriod;
  // <== DATE RANGE ==>
  dateRange: {
    // <== START DATE ==>
    start: string;
    // <== END DATE ==>
    end: string;
  };
};

// <== SKELETON COMPONENT ==>
const SharedReportSkeleton = (): JSX.Element => (
  // RETURNING THE SHARED REPORT SKELETON COMPONENT
  <div className="min-h-screen bg-[#0a0a1a]">
    {/* ANIMATED GRADIENT BACKGROUND */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl animate-pulse"
        style={{
          background: `linear-gradient(to bottom right, ${ACCENT_PURPLE}20, transparent)`,
        }}
      />
      <div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl animate-pulse"
        style={{
          background: `linear-gradient(to top left, ${ACCENT_PURPLE}20, transparent)`,
        }}
      />
    </div>
    {/* CONTENT */}
    <div className="relative z-10 flex flex-col min-h-screen">
      {/* HEADER SKELETON */}
      <header className="border-b border-white/5 backdrop-blur-xl bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* LOGO SKELETON */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-6 w-24 bg-white/10 rounded-lg animate-pulse hidden sm:block" />
          </div>
          {/* CTA SKELETON */}
          <div className="h-10 w-28 sm:w-36 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </header>
      {/* MAIN SKELETON */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-5">
        {/* REPORT HEADER SKELETON */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            {/* AVATAR/ICON SKELETON */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 animate-pulse" />
            {/* TITLE SKELETON */}
            <div className="flex-1 space-y-3">
              <div className="h-7 sm:h-8 w-48 sm:w-72 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
              <div className="flex flex-wrap gap-3">
                <div className="h-7 w-24 bg-white/10 rounded-full animate-pulse" />
                <div className="h-5 w-36 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
            {/* COMPLETION SKELETON */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/10 animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                <div className="h-5 w-12 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        {/* STATS GRID SKELETON */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-3 sm:h-4 w-16 sm:w-20 bg-white/10 rounded animate-pulse" />
                  <div className="h-7 sm:h-8 w-10 sm:w-12 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        {/* PROGRESS SECTION SKELETON */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6">
          <div className="h-5 sm:h-6 w-36 sm:w-40 bg-white/10 rounded animate-pulse mb-5" />
          <div className="h-5 sm:h-6 w-full bg-white/10 rounded-full animate-pulse mb-4" />
          <div className="flex flex-wrap gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10 animate-pulse" />
                <div className="h-4 w-20 sm:w-24 bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        {/* CTA SKELETON */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8">
          <div className="text-center space-y-4">
            <div className="h-6 w-20 bg-white/10 rounded-full mx-auto animate-pulse" />
            <div className="h-7 sm:h-8 w-56 sm:w-64 bg-white/10 rounded-lg mx-auto animate-pulse" />
            <div className="h-4 sm:h-5 w-72 sm:w-96 max-w-full bg-white/10 rounded mx-auto animate-pulse" />
            <div className="h-11 sm:h-12 w-36 sm:w-40 bg-white/10 rounded-xl mx-auto animate-pulse mt-4" />
          </div>
        </div>
      </main>
      {/* FOOTER SKELETON */}
      <footer className="border-t border-white/5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  </div>
);

// <== STAT CARD COMPONENT ==>
const StatCard = ({
  label,
  value,
  icon,
  gradient,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: JSX.Element;
  gradient: string;
  delay?: number;
}): JSX.Element => (
  // RETURNING THE STAT CARD COMPONENT
  <div
    className="group bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 hover:scale-[1.02]"
    style={{
      animationDelay: `${delay}ms`,
      boxShadow: "0 0 0 0 transparent",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = `0 10px 40px -10px ${ACCENT_PURPLE}30`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
    }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs sm:text-sm font-medium text-white/50 mb-1">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {value}
        </p>
      </div>
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
    </div>
  </div>
);

// <== CIRCULAR PROGRESS COMPONENT ==>
const CircularProgress = ({
  percentage,
  size = 80,
}: {
  percentage: number;
  size?: number;
}): JSX.Element => {
  // SET STROKE WIDTH
  const strokeWidth = 6;
  // SET RADIUS
  const radius = (size - strokeWidth) / 2;
  // SET CIRCUMFERENCE
  const circumference = radius * 2 * Math.PI;
  // SET OFFSET
  const offset = circumference - (percentage / 100) * circumference;
  // RETURNING THE CIRCULAR PROGRESS COMPONENT
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* BACKGROUND CIRCLE */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* PROGRESS CIRCLE */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ACCENT_PURPLE}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg sm:text-xl font-bold text-white">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

// <== SHARED REPORT PAGE COMPONENT ==>
const SharedReportPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Shared Report");
  // GET SHARE TOKEN FROM URL
  const { shareToken } = useParams<{ shareToken: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // REPORT DATA STATE
  const [reportData, setReportData] = useState<SharedReportData | null>(null);
  // LOADING STATE
  const [isLoading, setIsLoading] = useState(true);
  // ERROR STATE
  const [error, setError] = useState<string | null>(null);
  // FETCH REPORT DATA ON MOUNT
  useEffect(() => {
    // ASYNC FUNCTION TO FETCH REPORT
    const loadReport = async () => {
      // IF NO SHARE TOKEN, RETURN
      if (!shareToken) {
        // SET ERROR
        setError("Invalid share link");
        // SET LOADING FALSE
        setIsLoading(false);
        // RETURN FROM FUNCTION
        return;
      }
      // TRY TO FETCH REPORT DATA
      try {
        // FETCH REPORT DATA
        const data = await fetchSharedReport(shareToken);
        // SET REPORT DATA
        setReportData(data as SharedReportData);
      } catch (err) {
        // SET ERROR
        console.error("Failed to load shared report:", err);
        // SET ERROR
        setError("This report is no longer available or has expired.");
        // SET LOADING FALSE
      } finally {
        // SET LOADING FALSE
        setIsLoading(false);
      }
    };
    // CALL FETCH FUNCTION
    loadReport();
  }, [shareToken]);
  // GET PERIOD LABEL
  const getPeriodLabel = (period: ReportPeriod) => {
    // SWITCH ON PERIOD
    switch (period) {
      // CASE WEEK
      case "week":
        // RETURN LAST 7 DAYS
        return "Last 7 Days";
      // CASE MONTH
      case "month":
        // RETURN LAST MONTH
        return "Last Month";
      // CASE QUARTER
      case "quarter":
        // RETURN LAST QUARTER
        return "Last Quarter";
      // CASE YEAR
      case "year":
        // RETURN LAST YEAR
        return "Last Year";
      // DEFAULT CASE
      default:
        // RETURN CUSTOM PERIOD
        return "Custom Period";
    }
  };
  // FORMAT DATE
  const formatDate = (dateString: string) => {
    // RETURN FORMATTED DATE
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  // CALCULATE COMPLETION RATE
  const getCompletionRate = () => {
    // IF NO REPORT DATA, RETURN 0
    if (!reportData) return 0;
    // CALCULATE TOTAL TASKS
    const total =
      reportData.summary.completedTasks +
      reportData.summary.inProgressTasks +
      reportData.summary.pendingTasks;
    // IF TOTAL TASKS IS 0, RETURN 0
    if (total === 0) return 0;
    // CALCULATE COMPLETION RATE
    return Math.round((reportData.summary.completedTasks / total) * 100);
  };
  // GET USER DISPLAY NAME
  const getUserDisplayName = () => {
    // IF NO USER NAME OR USER NAME IS UNKNOWN, RETURN NULL
    if (!reportData?.user?.name || reportData.user.name === "Unknown") {
      // RETURN NULL
      return null;
    }
    // RETURN USER NAME
    return reportData.user.name;
  };
  // GET REPORT ICON OR AVATAR
  const getReportIconOrAvatar = () => {
    // IF NO REPORT DATA, RETURN NULL
    if (!reportData) return null;
    // IF REPORT TYPE IS PERSONAL
    if (reportData.type === "personal") {
      // IF USER AVATAR IS AVAILABLE
      if (reportData.user?.avatar) {
        // RETURN USER AVATAR
        return (
          <img
            src={reportData.user.avatar}
            alt={reportData.user.name || "User"}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover"
          />
        );
      }
      // RETURN USER ICON
      return (
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_PURPLE_DARK})`,
          }}
        >
          <User size={28} className="text-white" />
        </div>
      );
    }
    // IF REPORT TYPE IS PROJECT
    if (reportData.type === "project") {
      // RETURN PROJECT ICON
      return (
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_PURPLE_DARK})`,
          }}
        >
          <Folder size={28} className="text-white" />
        </div>
      );
    }
    // IF REPORT TYPE IS WORKSPACE
    return (
      // RETURN WORKSPACE ICON
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_PURPLE_DARK})`,
        }}
      >
        <Building2 size={28} className="text-white" />
      </div>
    );
  };
  // GET REPORT TITLE
  const getReportTitle = () => {
    // IF NO REPORT DATA, RETURN SHARED REPORT
    if (!reportData) return "Shared Report";
    // SWITCH ON REPORT TYPE
    switch (reportData.type) {
      // CASE PERSONAL
      case "personal": {
        // GET USER DISPLAY NAME
        const userName = getUserDisplayName();
        // RETURN USER'S PRODUCTIVITY REPORT
        return userName
          ? `${userName}'s Productivity Report`
          : "Personal Productivity Report";
      }
      // CASE PROJECT
      case "project":
        // RETURN PROJECT TITLE
        return reportData.project?.title
          ? `${reportData.project.title}`
          : "Project Report";
      // CASE WORKSPACE
      case "workspace":
        // RETURN WORKSPACE NAME
        return reportData.workspace?.name
          ? `${reportData.workspace.name}`
          : "Team Report";
      // DEFAULT CASE
      default:
        // RETURN SHARED REPORT
        return "Shared Report";
    }
  };
  // GET REPORT SUBTITLE
  const getReportSubtitle = () => {
    // IF NO REPORT DATA, RETURN EMPTY STRING
    if (!reportData) return "";
    // SWITCH ON REPORT TYPE
    switch (reportData.type) {
      // CASE PERSONAL
      case "personal":
        // RETURN INDIVIDUAL PERFORMANCE OVERVIEW
        return "Individual Performance Overview";
      // CASE PROJECT
      case "project":
        // RETURN PROJECT PROGRESS & ANALYTICS
        return "Project Progress & Analytics";
      // CASE WORKSPACE
      case "workspace":
        // RETURN TEAM PERFORMANCE DASHBOARD
        return "Team Performance Dashboard";
      // DEFAULT CASE
      default:
        // RETURN EMPTY STRING
        return "";
    }
  };
  // IF LOADING STATE IS TRUE, RETURN SHARED REPORT SKELETON
  if (isLoading) {
    // RETURN SHARED REPORT SKELETON
    return <SharedReportSkeleton />;
  }
  // IF ERROR STATE IS TRUE OR NO REPORT DATA, RETURN ERROR COMPONENT
  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
        {/* ANIMATED GRADIENT BACKGROUND */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-600/10 via-transparent to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-md w-full">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <AlertTriangle size={36} className="text-red-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Report Unavailable
          </h1>
          <p className="text-white/60 mb-8 leading-relaxed text-sm sm:text-base">
            {error || "This report could not be found or has expired."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            style={{
              background: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_PURPLE_DARK})`,
            }}
          >
            Go to PlanOra
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }
  // RETURN SHARED REPORT PAGE
  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col">
      {/* ANIMATED GRADIENT BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl"
          style={{
            background: `linear-gradient(to bottom right, ${ACCENT_PURPLE}15, transparent)`,
          }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl"
          style={{
            background: `linear-gradient(to top left, ${ACCENT_PURPLE}15, transparent)`,
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
          style={{
            background: `linear-gradient(to right, ${ACCENT_PURPLE}05, transparent, ${ACCENT_PURPLE}05)`,
          }}
        />
      </div>
      {/* CONTENT */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* HEADER */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-white/[0.02] sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
            {/* LOGO */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={LOGO_IMAGE}
                alt="PlanOra"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl"
              />
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight hidden sm:block">
                PlanOra
              </span>
            </div>
            {/* CTA BUTTON */}
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_PURPLE_DARK})`,
                boxShadow: `0 4px 20px -5px ${ACCENT_PURPLE}50`,
              }}
            >
              <Sparkles size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Try PlanOra Free</span>
              <span className="sm:hidden">Try Free</span>
            </button>
          </div>
        </header>
        {/* MAIN CONTENT */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-5">
          {/* REPORT HEADER */}
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-8 hover:border-white/15 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center gap-5">
              {/* AVATAR/ICON */}
              <div className="flex-shrink-0">{getReportIconOrAvatar()}</div>
              {/* TITLE AND META */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight break-words">
                  {getReportTitle()}
                </h1>
                <p className="text-white/40 text-sm mb-2 sm:mb-3">
                  {getReportSubtitle()}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {/* PERIOD BADGE */}
                  <div
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium"
                    style={{
                      background: `${ACCENT_PURPLE}20`,
                      border: `1px solid ${ACCENT_PURPLE}30`,
                      color: ACCENT_PURPLE,
                    }}
                  >
                    <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>{getPeriodLabel(reportData.period)}</span>
                  </div>
                  {/* DATE RANGE */}
                  <div className="flex items-center gap-1.5 text-white/50 text-xs sm:text-sm">
                    <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>
                      {formatDate(reportData.dateRange.start)} —{" "}
                      {formatDate(reportData.dateRange.end)}
                    </span>
                  </div>
                </div>
              </div>
              {/* COMPLETION RATE */}
              <div className="flex items-center gap-3 sm:gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-6">
                <CircularProgress percentage={getCompletionRate()} size={70} />
                <div>
                  <p className="text-xs sm:text-sm text-white/40">Completion</p>
                  <p className="text-base sm:text-lg font-semibold text-white">
                    Rate
                  </p>
                </div>
              </div>
            </div>
            {/* DESCRIPTION */}
            {reportData.type === "project" &&
              reportData.project?.description && (
                <div className="mt-5 pt-5 border-t border-white/10">
                  <p className="text-white/60 text-sm leading-relaxed">
                    {reportData.project.description}
                  </p>
                </div>
              )}
            {reportData.type === "workspace" &&
              reportData.workspace?.description && (
                <div className="mt-5 pt-5 border-t border-white/10">
                  <p className="text-white/60 text-sm leading-relaxed">
                    {reportData.workspace.description}
                  </p>
                </div>
              )}
          </div>
          {/* STATS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              label="Total Tasks"
              value={reportData.summary.totalTasks}
              icon={
                <ListTodo
                  size={20}
                  className="text-white sm:w-[22px] sm:h-[22px]"
                />
              }
              gradient="bg-gradient-to-br from-violet-500 to-violet-700"
              delay={0}
            />
            <StatCard
              label="Completed"
              value={reportData.summary.completedTasks}
              icon={
                <CheckCircle2
                  size={20}
                  className="text-white sm:w-[22px] sm:h-[22px]"
                />
              }
              gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
              delay={100}
            />
            <StatCard
              label="In Progress"
              value={reportData.summary.inProgressTasks}
              icon={
                <TrendingUp
                  size={20}
                  className="text-white sm:w-[22px] sm:h-[22px]"
                />
              }
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              delay={200}
            />
            <StatCard
              label="Pending"
              value={reportData.summary.pendingTasks}
              icon={
                <AlertCircle
                  size={20}
                  className="text-white sm:w-[22px] sm:h-[22px]"
                />
              }
              gradient="bg-gradient-to-br from-amber-500 to-amber-600"
              delay={300}
            />
          </div>
          {/* WORKSPACE SPECIFIC STATS */}
          {reportData.type === "workspace" && reportData.workspace && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StatCard
                label="Team Members"
                value={reportData.workspace.memberCount}
                icon={
                  <Users
                    size={20}
                    className="text-white sm:w-[22px] sm:h-[22px]"
                  />
                }
                gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
                delay={400}
              />
              <StatCard
                label="Projects"
                value={reportData.workspace.projectCount}
                icon={
                  <Folder
                    size={20}
                    className="text-white sm:w-[22px] sm:h-[22px]"
                  />
                }
                gradient="bg-gradient-to-br from-cyan-500 to-cyan-600"
                delay={500}
              />
            </div>
          )}
          {/* TASK DISTRIBUTION */}
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6 hover:border-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-5">
              <Target
                size={18}
                style={{ color: ACCENT_PURPLE }}
                className="sm:w-5 sm:h-5"
              />
              <h2 className="text-base sm:text-lg font-semibold text-white">
                Task Distribution
              </h2>
            </div>
            {/* PROGRESS BAR */}
            <div className="relative h-5 sm:h-6 rounded-full bg-white/5 overflow-hidden mb-5">
              {/* SEGMENTS */}
              <div className="absolute inset-0 flex">
                {/* COMPLETED */}
                {reportData.summary.completedTasks > 0 && (
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                    style={{
                      width: `${
                        (reportData.summary.completedTasks /
                          reportData.summary.totalTasks) *
                        100
                      }%`,
                    }}
                  />
                )}
                {/* IN PROGRESS */}
                {reportData.summary.inProgressTasks > 0 && (
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000"
                    style={{
                      width: `${
                        (reportData.summary.inProgressTasks /
                          reportData.summary.totalTasks) *
                        100
                      }%`,
                    }}
                  />
                )}
                {/* PENDING */}
                {reportData.summary.pendingTasks > 0 && (
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000"
                    style={{
                      width: `${
                        (reportData.summary.pendingTasks /
                          reportData.summary.totalTasks) *
                        100
                      }%`,
                    }}
                  />
                )}
              </div>
              {/* SHINE EFFECT */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-shimmer" />
            </div>
            {/* LEGEND */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                <span className="text-xs sm:text-sm text-white/70">
                  Completed{" "}
                  <span className="text-white font-medium">
                    ({reportData.summary.completedTasks})
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
                <span className="text-xs sm:text-sm text-white/70">
                  In Progress{" "}
                  <span className="text-white font-medium">
                    ({reportData.summary.inProgressTasks})
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
                <span className="text-xs sm:text-sm text-white/70">
                  Pending{" "}
                  <span className="text-white font-medium">
                    ({reportData.summary.pendingTasks})
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* CTA SECTION */}
          <div
            className="relative overflow-hidden rounded-2xl p-6 sm:p-8 lg:p-10"
            style={{
              background: `linear-gradient(135deg, ${ACCENT_PURPLE}15, ${ACCENT_PURPLE}10)`,
              border: `1px solid ${ACCENT_PURPLE}25`,
            }}
          >
            {/* DECORATIVE ELEMENTS */}
            <div
              className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-3xl"
              style={{ background: `${ACCENT_PURPLE}15` }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-3xl"
              style={{ background: `${ACCENT_PURPLE}10` }}
            />
            {/* CONTENT */}
            <div className="relative text-center">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                style={{
                  background: `${ACCENT_PURPLE}25`,
                  border: `1px solid ${ACCENT_PURPLE}35`,
                  color: ACCENT_PURPLE,
                }}
              >
                <Sparkles size={12} />
                100% Free
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
                Track Your Own Productivity
              </h2>
              <p className="text-white/60 mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed text-sm sm:text-base">
                Get detailed insights into your tasks, projects, and focus
                sessions. Boost your productivity with powerful analytics.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_PURPLE_DARK})`,
                  boxShadow: `0 8px 30px -5px ${ACCENT_PURPLE}40`,
                }}
              >
                Get Started Free
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </main>
        {/* FOOTER */}
        <footer className="border-t border-white/5 mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              {/* LOGO */}
              <div className="flex items-center gap-2">
                <img
                  src={LOGO_IMAGE}
                  alt="PlanOra"
                  className="w-7 h-7 sm:w-8 sm:h-8"
                />
                <span className="text-white/40 text-xs sm:text-sm">
                  Developer Productivity Platform
                </span>
              </div>
              {/* COPYRIGHT */}
              <p className="text-white/30 text-xs sm:text-sm">
                © {new Date().getFullYear()} PlanOra. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SharedReportPage;
