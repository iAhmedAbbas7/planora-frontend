// <== IMPORTS ==>
import {
  ArrowLeft,
  LayoutDashboard,
  ListTodo,
  Code2,
  Calendar,
  Settings,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  GitBranch,
  ExternalLink,
  Flag,
  Target,
  TrendingUp,
  Plus,
  Trash2,
  Star,
  CircleDot,
  User,
  CalendarDays,
  Info,
  ChevronRight,
  Search,
  ChevronDown,
  Check,
  X,
  Globe,
  GitCommit,
  GitPullRequest,
  FileCode,
} from "lucide-react";
import {
  useProjectById,
  useRemoveLinkedRepository,
  useSetPrimaryRepository,
} from "../hooks/useProjects";
import useTitle from "../hooks/useTitle";
import { useTasks, Task } from "../hooks/useTasks";
import { useParams, useNavigate, Link } from "react-router-dom";
import { JSX, useState, useMemo, useRef, useEffect } from "react";
import DashboardHeader from "../components/layout/DashboardHeader";
import ConfirmationModal from "../components/common/ConfirmationModal";

// <== TAB TYPE ==>
type TabType = "overview" | "tasks" | "code" | "timeline" | "settings";

// <== TAB CONFIG ==>
const TABS: { id: TabType; label: string; icon: JSX.Element }[] = [
  // OVERVIEW TAB
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  // TASKS TAB
  { id: "tasks", label: "Tasks", icon: <ListTodo size={16} /> },
  // CODE TAB
  { id: "code", label: "Code", icon: <Code2 size={16} /> },
  // TIMELINE TAB
  { id: "timeline", label: "Timeline", icon: <Calendar size={16} /> },
  // SETTINGS TAB
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
];

// <== STATUS CONFIG ==>
const STATUS_CONFIG: Record<
  string,
  { icon: JSX.Element; color: string; bg: string }
> = {
  // TO DO STATUS
  "to do": {
    icon: <Circle size={14} />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  // IN PROGRESS STATUS
  "in progress": {
    icon: <Clock size={14} />,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  // COMPLETED STATUS
  completed: {
    icon: <CheckCircle2 size={14} />,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
};

// <== PRIORITY CONFIG ==>
const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  // HIGH PRIORITY
  high: { color: "text-red-500", bg: "bg-red-500/10" },
  // MEDIUM PRIORITY
  medium: { color: "text-yellow-500", bg: "bg-yellow-500/10" },
  // LOW PRIORITY
  low: { color: "text-green-500", bg: "bg-green-500/10" },
};

// <== STAT CARD SKELETON ==>
const StatCardSkeleton = (): JSX.Element => (
  // STAT CARD SKELETON
  <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)] flex items-center gap-3 sm:block animate-pulse">
    {/* ICON SKELETON */}
    <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-[var(--hover-bg)] sm:mb-2" />
    <div className="flex-1 sm:flex-none">
      {/* VALUE SKELETON */}
      <div className="h-7 w-10 bg-[var(--hover-bg)] rounded mb-1" />
      {/* LABEL SKELETON */}
      <div className="h-3 w-16 bg-[var(--hover-bg)] rounded" />
    </div>
  </div>
);

// <== PROJECT INFO ROW SKELETON ==>
const InfoRowSkeleton = (): JSX.Element => (
  // PROJECT INFO ROW SKELETON
  <div className="flex items-center gap-3">
    {/* ICON SKELETON */}
    <div className="w-4 h-4 rounded bg-[var(--hover-bg)] flex-shrink-0" />
    <div className="flex items-center gap-3 flex-1 justify-between">
      {/* LABEL SKELETON */}
      <div className="h-3.5 w-16 bg-[var(--hover-bg)] rounded" />
      {/* VALUE SKELETON */}
      <div className="h-4 w-20 bg-[var(--hover-bg)] rounded" />
    </div>
  </div>
);

// <== TASK ITEM SKELETON ==>
const TaskItemSkeleton = (): JSX.Element => (
  // TASK ITEM SKELETON
  <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-[var(--hover-bg)] animate-pulse">
    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
      {/* STATUS ICON SKELETON */}
      <div className="w-3.5 h-3.5 rounded-full bg-[var(--border)]" />
      {/* TITLE SKELETON */}
      <div className="h-3.5 w-2/3 bg-[var(--border)] rounded" />
    </div>
    {/* PRIORITY BADGE SKELETON */}
    <div className="h-5 w-14 bg-[var(--border)] rounded ml-2" />
  </div>
);

// <== DASHBOARD SKELETON ==>
const DashboardSkeleton = (): JSX.Element => (
  // DASHBOARD SKELETON
  <div className="space-y-4 sm:space-y-6 animate-pulse">
    {/* STATS GRID SKELETON */}
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
    {/* PROJECT INFO AND PROGRESS SKELETON */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
      {/* PROJECT INFO SKELETON */}
      <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
        {/* HEADER SKELETON */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-4 h-4 rounded bg-[var(--hover-bg)]" />
          <div className="h-4 w-28 bg-[var(--hover-bg)] rounded" />
        </div>
        {/* INFO ROWS SKELETON */}
        <div className="space-y-3 sm:space-y-4">
          <InfoRowSkeleton />
          <InfoRowSkeleton />
          <InfoRowSkeleton />
          <InfoRowSkeleton />
        </div>
        {/* DESCRIPTION SKELETON */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--border)]">
          <div className="h-3 w-full bg-[var(--hover-bg)] rounded mb-2" />
          <div className="h-3 w-3/4 bg-[var(--hover-bg)] rounded" />
        </div>
      </div>
      {/* PROGRESS SKELETON */}
      <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
        {/* HEADER SKELETON */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-4 h-4 rounded bg-[var(--hover-bg)]" />
          <div className="h-4 w-20 bg-[var(--hover-bg)] rounded" />
        </div>
        {/* CIRCULAR PROGRESS SKELETON */}
        <div className="flex items-center justify-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full border-8 border-[var(--hover-bg)]" />
        </div>
        {/* PROGRESS BAR SKELETON */}
        <div className="mt-4 sm:mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-3 w-24 bg-[var(--hover-bg)] rounded" />
            <div className="h-3 w-8 bg-[var(--hover-bg)] rounded" />
          </div>
          <div className="h-1.5 sm:h-2 bg-[var(--hover-bg)] rounded-full" />
        </div>
      </div>
    </div>
    {/* RECENT TASKS SKELETON */}
    <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
      {/* HEADER SKELETON */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[var(--hover-bg)]" />
          <div className="h-4 w-24 bg-[var(--hover-bg)] rounded" />
        </div>
        <div className="h-7 w-20 bg-[var(--hover-bg)] rounded-lg" />
      </div>
      {/* TASK ITEMS SKELETON */}
      <div className="space-y-2">
        <TaskItemSkeleton />
        <TaskItemSkeleton />
        <TaskItemSkeleton />
        <TaskItemSkeleton />
        <TaskItemSkeleton />
      </div>
    </div>
  </div>
);

// <== PROJECT DASHBOARD PAGE COMPONENT ==>
const ProjectDashboardPage = (): JSX.Element => {
  // GET PROJECT ID FROM URL PARAMS
  const { id: projectId } = useParams<{ id: string }>();
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  // TASK SEARCH QUERY STATE
  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  // TASK STATUS FILTER STATE
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("all");
  // TASK PRIORITY FILTER STATE
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<string>("all");
  // STATUS DROPDOWN OPEN STATE
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  // PRIORITY DROPDOWN OPEN STATE
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  // STATUS DROPDOWN REF
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  // PRIORITY DROPDOWN REF
  const priorityDropdownRef = useRef<HTMLDivElement>(null);
  // UNLINK CONFIRMATION MODAL STATE
  const [unlinkConfirmation, setUnlinkConfirmation] = useState<{
    isOpen: boolean;
    repoId: number | null;
    repoName: string;
  }>({
    isOpen: false,
    repoId: null,
    repoName: "",
  });
  // FETCH PROJECT DATA
  const {
    data: project,
    isLoading,
    isError,
  } = useProjectById(projectId || null);
  // FETCH TASKS FOR THIS PROJECT
  const { tasks } = useTasks();
  // REMOVE LINKED REPOSITORY MUTATION
  const removeRepoMutation = useRemoveLinkedRepository();
  // SET PRIMARY REPOSITORY MUTATION
  const setPrimaryMutation = useSetPrimaryRepository();
  // SET PAGE TITLE
  useTitle(`PlanOra - ${project?.title || "Project Dashboard"}`);
  // GET PROJECT TASKS
  const projectTasks = useMemo(() => {
    // CHECK IF TASKS OR PROJECT ID IS NOT AVAILABLE
    if (!tasks || !projectId) return [];
    // FILTER TASKS BY PROJECT ID
    return tasks.filter((task) => {
      // GET TASK PROJECT ID
      const taskProjectId =
        typeof task.projectId === "object" && task.projectId !== null
          ? (task.projectId as { _id: string })._id
          : task.projectId;
      // CHECK IF TASK PROJECT ID IS THE SAME AS THE PROJECT ID
      return taskProjectId === projectId;
    });
  }, [tasks, projectId]);
  // CALCULATE TASK STATS
  const taskStats = useMemo(() => {
    // GET TOTAL TASKS
    const total = projectTasks.length;
    // GET COMPLETED TASKS
    const completed = projectTasks.filter(
      (t) => t.status === "completed"
    ).length;
    // GET IN PROGRESS TASKS
    const inProgress = projectTasks.filter(
      (t) => t.status === "in progress"
    ).length;
    // GET TO DO TASKS
    const todo = projectTasks.filter((t) => t.status === "to do").length;
    // GET OVERDUE TASKS
    const overdue = projectTasks.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "completed"
    ).length;
    // GET PROGRESS
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    // RETURN TASK STATS
    return { total, completed, inProgress, todo, overdue, progress };
  }, [projectTasks]);
  // FILTERED TASKS FOR TASKS TAB
  const filteredProjectTasks = useMemo(() => {
    // FILTER TASKS BY SEARCH QUERY, STATUS, AND PRIORITY
    return projectTasks.filter((task) => {
      // CHECK IF TASK TITLE OR DESCRIPTION INCLUDES THE SEARCH QUERY
      const matchesSearch =
        taskSearchQuery === "" ||
        task.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(taskSearchQuery.toLowerCase());
      // CHECK IF TASK STATUS IS THE SAME AS THE STATUS FILTER
      const matchesStatus =
        taskStatusFilter === "all" || task.status === taskStatusFilter;
      // CHECK IF TASK PRIORITY IS THE SAME AS THE PRIORITY FILTER
      const matchesPriority =
        taskPriorityFilter === "all" || task.priority === taskPriorityFilter;
      // RETURN IF TASK MATCHES SEARCH QUERY, STATUS, AND PRIORITY
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [projectTasks, taskSearchQuery, taskStatusFilter, taskPriorityFilter]);
  // CLICK OUTSIDE HANDLER FOR STATUS AND PRIORITY DROPDOWNS
  useEffect(() => {
    // CLICK OUTSIDE HANDLER FOR STATUS AND PRIORITY DROPDOWNS
    const handleClickOutside = (e: MouseEvent) => {
      // CHECK IF STATUS DROPDOWN REF IS PROVIDED AND THE CLICK IS NOT INSIDE THE STATUS DROPDOWN
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      ) {
        // CLOSE THE STATUS DROPDOWN
        setIsStatusDropdownOpen(false);
      }
      // CHECK IF PRIORITY DROPDOWN REF IS PROVIDED AND THE CLICK IS NOT INSIDE THE PRIORITY DROPDOWN
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(e.target as Node)
      ) {
        // CLOSE THE PRIORITY DROPDOWN
        setIsPriorityDropdownOpen(false);
      }
    };
    // ADD EVENT LISTENER FOR CLICK OUTSIDE
    document.addEventListener("mousedown", handleClickOutside);
    // CLEANUP: REMOVE EVENT LISTENER ON UNMOUNT
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // GROUP TASKS BY DUE DATE FOR TIMELINE
  const tasksByDate = useMemo(() => {
    // GROUP TASKS BY DUE DATE
    const grouped: Record<string, Task[]> = {};
    // LOOP THROUGH PROJECT TASKS
    projectTasks.forEach((task) => {
      // CHECK IF TASK HAS A DUE DATE
      if (task.dueDate) {
        // GET THE DATE KEY
        const dateKey = new Date(task.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        // CHECK IF DATE KEY EXISTS IN GROUPED TASKS OBJECT
        if (!grouped[dateKey]) {
          // CREATE EMPTY ARRAY FOR DATE KEY
          grouped[dateKey] = [];
        }
        // PUSH TASK TO GROUPED TASKS OBJECT
        grouped[dateKey].push(task);
      }
    });
    // RETURN GROUPED TASKS OBJECT
    return grouped;
  }, [projectTasks]);
  // GET SORTED DATES FOR TIMELINE
  const sortedDates = useMemo(() => {
    // SORT DATES BY TIME
    return Object.keys(tasksByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }, [tasksByDate]);
  // GET ALL REPOSITORIES (USE LINKED REPOSITORIES OR LEGACY GITHUB REPO)
  const allRepositories = useMemo(() => {
    // CHECK IF PROJECT IS AVAILABLE
    if (!project) return [];
    // CHECK IF PROJECT HAS LINKED REPOSITORIES
    if (project.linkedRepositories && project.linkedRepositories.length > 0) {
      // RETURN LINKED REPOSITORIES
      return project.linkedRepositories;
    }
    // CHECK IF PROJECT HAS GITHUB REPO
    if (project.githubRepo && project.githubRepo.fullName) {
      // RETURN GITHUB REPO
      return [{ ...project.githubRepo, isPrimary: true }];
    }
    // RETURN EMPTY ARRAY
    return [];
  }, [project]);
  // CHECK IF LOADING
  if (isLoading) {
    // RETURN LOADING STATE
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
      >
        {/* HEADER SKELETON */}
        <DashboardHeader title="" subtitle="Project Dashboard" />
        {/* MAIN CONTENT SKELETON */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* BACK BUTTON SKELETON */}
          <div className="flex items-center gap-2 mb-4 animate-pulse">
            <div className="w-4 h-4 bg-[var(--hover-bg)] rounded" />
            <div className="h-3.5 w-28 bg-[var(--hover-bg)] rounded" />
          </div>
          {/* TABS SKELETON */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex items-center gap-1 p-1 bg-[var(--hover-bg)] rounded-lg w-fit min-w-full sm:min-w-0 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg flex-1 sm:flex-none ${
                    i === 1 ? "bg-[var(--border)]" : ""
                  }`}
                >
                  <div className="w-4 h-4 rounded bg-[var(--border)]" />
                  <div className="hidden sm:block h-3.5 w-16 bg-[var(--border)] rounded" />
                </div>
              ))}
            </div>
          </div>
          {/* DASHBOARD CONTENT SKELETON */}
          <DashboardSkeleton />
        </main>
      </div>
    );
  }
  // CHECK IF ERROR OR PROJECT IS NOT AVAILABLE
  if (isError || !project) {
    // RETURN ERROR STATE
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="text-center">
          <AlertTriangle
            size={48}
            className="mx-auto mb-4 text-[var(--light-text)]"
          />
          <p className="text-lg font-medium text-[var(--text-primary)] mb-2">
            Project not found
          </p>
          <p className="text-sm text-[var(--light-text)] mb-4">
            The project you're looking for doesn't exist or you don't have
            access.
          </p>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 rounded-lg bg-[var(--accent-color)] text-white text-sm font-medium hover:opacity-90 transition"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }
  // RENDER OVERVIEW TAB
  const renderOverviewTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
        {/* TOTAL TASKS */}
        <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)] flex items-center gap-3 sm:block">
          <div className="p-2 rounded-lg bg-blue-500/10 w-fit sm:mb-2">
            <Target size={18} className="sm:w-4 sm:h-4 text-blue-500" />
          </div>
          <div className="flex-1 sm:flex-none">
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {taskStats.total}
            </p>
            <p className="text-xs text-[var(--light-text)]">Total Tasks</p>
          </div>
        </div>
        {/* COMPLETED */}
        <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)] flex items-center gap-3 sm:block">
          <div className="p-2 rounded-lg bg-green-500/10 w-fit sm:mb-2">
            <CheckCircle2 size={18} className="sm:w-4 sm:h-4 text-green-500" />
          </div>
          <div className="flex-1 sm:flex-none">
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {taskStats.completed}
            </p>
            <p className="text-xs text-[var(--light-text)]">Completed</p>
          </div>
        </div>
        {/* IN PROGRESS */}
        <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)] flex items-center gap-3 sm:block">
          <div className="p-2 rounded-lg bg-yellow-500/10 w-fit sm:mb-2">
            <Clock size={18} className="sm:w-4 sm:h-4 text-yellow-500" />
          </div>
          <div className="flex-1 sm:flex-none">
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {taskStats.inProgress}
            </p>
            <p className="text-xs text-[var(--light-text)]">In Progress</p>
          </div>
        </div>
        {/* TO DO */}
        <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)] flex items-center gap-3 sm:block">
          <div className="p-2 rounded-lg bg-blue-500/10 w-fit sm:mb-2">
            <Circle size={18} className="sm:w-4 sm:h-4 text-blue-500" />
          </div>
          <div className="flex-1 sm:flex-none">
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {taskStats.todo}
            </p>
            <p className="text-xs text-[var(--light-text)]">To Do</p>
          </div>
        </div>
        {/* OVERDUE */}
        <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 border border-[var(--border)] flex items-center gap-3 sm:block">
          <div className="p-2 rounded-lg bg-red-500/10 w-fit sm:mb-2">
            <AlertTriangle size={18} className="sm:w-4 sm:h-4 text-red-500" />
          </div>
          <div className="flex-1 sm:flex-none">
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {taskStats.overdue}
            </p>
            <p className="text-xs text-[var(--light-text)]">Overdue</p>
          </div>
        </div>
      </div>
      {/* PROJECT INFO AND PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* PROJECT INFO */}
        <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
          <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] mb-3 sm:mb-4 flex items-center gap-2">
            <Info size={16} className="text-[var(--accent-color)]" />
            Project Details
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {/* STATUS */}
            <div className="flex items-center gap-3">
              <CircleDot
                size={16}
                className="text-[var(--accent-color)] flex-shrink-0"
              />
              <div className="flex items-center gap-3 flex-1 justify-between">
                <span className="text-xs sm:text-sm text-[var(--light-text)] font-medium">
                  Status
                </span>
                <span
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium ${
                    STATUS_CONFIG[project.status?.toLowerCase() || "to do"]
                      ?.bg || "bg-gray-500/10"
                  } ${
                    STATUS_CONFIG[project.status?.toLowerCase() || "to do"]
                      ?.color || "text-gray-500"
                  }`}
                >
                  {project.status || "To Do"}
                </span>
              </div>
            </div>
            {/* IN CHARGE */}
            {project.inChargeName && (
              <div className="flex items-center gap-3">
                <User
                  size={16}
                  className="text-[var(--accent-color)] flex-shrink-0"
                />
                <div className="flex items-center gap-3 flex-1 justify-between">
                  <span className="text-xs sm:text-sm text-[var(--light-text)] font-medium">
                    In Charge
                  </span>
                  <span className="text-xs sm:text-sm text-[var(--text-primary)] font-medium truncate max-w-[120px] sm:max-w-none">
                    {project.inChargeName}
                  </span>
                </div>
              </div>
            )}
            {/* DUE DATE */}
            {project.dueDate && (
              <div className="flex items-center gap-3">
                <Calendar
                  size={16}
                  className="text-[var(--accent-color)] flex-shrink-0"
                />
                <div className="flex items-center gap-3 flex-1 justify-between">
                  <span className="text-xs sm:text-sm text-[var(--light-text)] font-medium">
                    Due Date
                  </span>
                  <span className="text-xs sm:text-sm text-[var(--text-primary)] font-medium">
                    {new Date(project.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}
            {/* CREATED AT */}
            {project.createdAt && (
              <div className="flex items-center gap-3">
                <CalendarDays
                  size={16}
                  className="text-[var(--accent-color)] flex-shrink-0"
                />
                <div className="flex items-center gap-3 flex-1 justify-between">
                  <span className="text-xs sm:text-sm text-[var(--light-text)] font-medium">
                    Created
                  </span>
                  <span className="text-xs sm:text-sm text-[var(--text-primary)] font-medium">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* DESCRIPTION */}
          {project.description && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--border)]">
              <p className="text-xs sm:text-sm text-[var(--light-text)] leading-relaxed">
                {project.description}
              </p>
            </div>
          )}
        </div>
        {/* PROGRESS */}
        <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
          <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] mb-3 sm:mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[var(--accent-color)]" />
            Progress
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
              {/* CIRCULAR PROGRESS */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="var(--accent-color)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${taskStats.progress * 2.83} 283`}
                />
              </svg>
              {/* PERCENTAGE */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  {taskStats.progress}%
                </span>
                <span className="text-[10px] sm:text-xs text-[var(--light-text)]">
                  Complete
                </span>
              </div>
            </div>
          </div>
          {/* PROGRESS BAR */}
          <div className="mt-4 sm:mt-6">
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-[var(--light-text)] mb-2">
              <span>
                {taskStats.completed} of {taskStats.total} tasks
              </span>
              <span>{taskStats.progress}%</span>
            </div>
            <div className="h-1.5 sm:h-2 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-color)] rounded-full transition-all duration-500"
                style={{ width: `${taskStats.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* RECENT TASKS */}
      <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <ListTodo size={16} className="text-[var(--accent-color)]" />
            Recent Tasks
          </h3>
          <button
            onClick={() => setActiveTab("tasks")}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium text-[var(--accent-color)] border border-[var(--border)] hover:bg-[var(--accent-color)] hover:text-white transition cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
        {projectTasks.length > 0 ? (
          <div className="space-y-2">
            {projectTasks.slice(0, 5).map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-[var(--hover-bg)] hover:bg-[var(--border)] transition"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <span
                    className={
                      STATUS_CONFIG[task.status]?.color || "text-gray-500"
                    }
                  >
                    {STATUS_CONFIG[task.status]?.icon || <Circle size={14} />}
                  </span>
                  <span className="text-xs sm:text-sm text-[var(--text-primary)] truncate">
                    {task.title}
                  </span>
                </div>
                <span
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium flex-shrink-0 ml-2 uppercase ${
                    PRIORITY_CONFIG[task.priority || "medium"]?.bg ||
                    "bg-gray-500/10"
                  } ${
                    PRIORITY_CONFIG[task.priority || "medium"]?.color ||
                    "text-gray-500"
                  }`}
                >
                  {task.priority || "Medium"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <ListTodo
              size={28}
              className="sm:w-8 sm:h-8 mx-auto mb-2 text-[var(--light-text)]"
            />
            <p className="text-xs sm:text-sm text-[var(--light-text)]">
              No tasks yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
  // RENDER TASKS TAB
  const renderTasksTab = () => (
    <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
      {/* HEADER */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <ListTodo size={16} className="text-[var(--accent-color)]" />
            All Tasks ({projectTasks.length})
          </h3>
          <Link
            to={`/tasks?projectId=${projectId}`}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium text-[var(--accent-color)] border border-[var(--border)] hover:bg-[var(--accent-color)] hover:text-white transition"
          >
            <span>Open in Tasks</span>
            <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={taskSearchQuery}
              onChange={(e) => setTaskSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:border-[var(--accent-color)] transition"
            />
            {taskSearchQuery && (
              <button
                onClick={() => setTaskSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--light-text)] hover:text-[var(--text-primary)] transition cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* STATUS DROPDOWN */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsStatusDropdownOpen(!isStatusDropdownOpen);
                setIsPriorityDropdownOpen(false);
              }}
              className={`w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2 text-xs sm:text-sm rounded-lg border transition cursor-pointer ${
                isStatusDropdownOpen
                  ? "border-[var(--accent-color)]"
                  : "border-[var(--border)] hover:border-[var(--accent-color)]"
              } ${
                taskStatusFilter !== "all"
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--light-text)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Circle size={14} />
                <span className="capitalize">
                  {taskStatusFilter === "all" ? "All Status" : taskStatusFilter}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`transition ${
                  isStatusDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute z-20 top-full left-0 mt-1 w-full sm:w-44 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg py-1">
                {/* ALL STATUS */}
                <button
                  type="button"
                  onClick={() => {
                    setTaskStatusFilter("all");
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                    taskStatusFilter === "all"
                      ? "text-[var(--accent-color)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  <Circle size={14} className="text-[var(--light-text)]" />
                  <span className="flex-1 text-left">All Status</span>
                  {taskStatusFilter === "all" && (
                    <Check size={14} className="text-[var(--accent-color)]" />
                  )}
                </button>
                {/* STATUS OPTIONS */}
                {[
                  { value: "to do", icon: Circle, color: "text-blue-500" },
                  {
                    value: "in progress",
                    icon: Clock,
                    color: "text-yellow-500",
                  },
                  {
                    value: "completed",
                    icon: CheckCircle2,
                    color: "text-green-500",
                  },
                ].map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setTaskStatusFilter(option.value);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                        taskStatusFilter === option.value
                          ? "text-[var(--accent-color)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      <IconComponent
                        size={14}
                        className={
                          taskStatusFilter === option.value
                            ? "text-[var(--accent-color)]"
                            : option.color
                        }
                      />
                      <span className="flex-1 text-left capitalize">
                        {option.value}
                      </span>
                      {taskStatusFilter === option.value && (
                        <Check
                          size={14}
                          className="text-[var(--accent-color)]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* PRIORITY DROPDOWN */}
          <div className="relative" ref={priorityDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
                setIsStatusDropdownOpen(false);
              }}
              className={`w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2 text-xs sm:text-sm rounded-lg border transition cursor-pointer ${
                isPriorityDropdownOpen
                  ? "border-[var(--accent-color)]"
                  : "border-[var(--border)] hover:border-[var(--accent-color)]"
              } ${
                taskPriorityFilter !== "all"
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--light-text)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Flag size={14} />
                <span className="capitalize">
                  {taskPriorityFilter === "all"
                    ? "All Priority"
                    : taskPriorityFilter}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`transition ${
                  isPriorityDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isPriorityDropdownOpen && (
              <div className="absolute z-20 top-full left-0 mt-1 w-full sm:w-44 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg py-1">
                {/* ALL PRIORITY */}
                <button
                  type="button"
                  onClick={() => {
                    setTaskPriorityFilter("all");
                    setIsPriorityDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                    taskPriorityFilter === "all"
                      ? "text-[var(--accent-color)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  <Flag size={14} className="text-[var(--light-text)]" />
                  <span className="flex-1 text-left">All Priority</span>
                  {taskPriorityFilter === "all" && (
                    <Check size={14} className="text-[var(--accent-color)]" />
                  )}
                </button>
                {/* PRIORITY OPTIONS */}
                {[
                  { value: "high", icon: Flag, color: "text-red-500" },
                  { value: "medium", icon: Flag, color: "text-yellow-500" },
                  { value: "low", icon: Flag, color: "text-green-500" },
                ].map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setTaskPriorityFilter(option.value);
                        setIsPriorityDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                        taskPriorityFilter === option.value
                          ? "text-[var(--accent-color)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      <IconComponent
                        size={14}
                        className={
                          taskPriorityFilter === option.value
                            ? "text-[var(--accent-color)]"
                            : option.color
                        }
                      />
                      <span className="flex-1 text-left capitalize">
                        {option.value}
                      </span>
                      {taskPriorityFilter === option.value && (
                        <Check
                          size={14}
                          className="text-[var(--accent-color)]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* ACTIVE FILTERS INDICATOR */}
        {(taskSearchQuery ||
          taskStatusFilter !== "all" ||
          taskPriorityFilter !== "all") && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
            <span className="text-[10px] sm:text-xs text-[var(--light-text)]">
              Showing {filteredProjectTasks.length} of {projectTasks.length}{" "}
              tasks
            </span>
            <button
              onClick={() => {
                setTaskSearchQuery("");
                setTaskStatusFilter("all");
                setTaskPriorityFilter("all");
              }}
              className="text-[10px] sm:text-xs text-[var(--accent-color)] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      {/* TASK LIST */}
      {filteredProjectTasks.length > 0 ? (
        <div className="divide-y divide-[var(--border)]">
          {filteredProjectTasks.map((task) => (
            <div
              key={task._id}
              className="p-3 sm:p-4 hover:bg-[var(--hover-bg)] transition"
            >
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                  <span
                    className={`mt-0.5 flex-shrink-0 ${
                      STATUS_CONFIG[task.status]?.color || "text-gray-500"
                    }`}
                  >
                    {STATUS_CONFIG[task.status]?.icon || <Circle size={14} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] truncate">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[10px] sm:text-xs text-[var(--light-text)] mt-0.5 sm:mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium uppercase ${
                      PRIORITY_CONFIG[task.priority || "medium"]?.bg ||
                      "bg-gray-500/10"
                    } ${
                      PRIORITY_CONFIG[task.priority || "medium"]?.color ||
                      "text-gray-500"
                    }`}
                  >
                    {task.priority || "Medium"}
                  </span>
                  {task.dueDate && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-[var(--light-text)]">
                      <Calendar size={12} />
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          {projectTasks.length === 0 ? (
            // NO TASKS AT ALL
            <>
              <ListTodo
                size={40}
                className="sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-[var(--light-text)]"
              />
              <p className="text-xs sm:text-sm text-[var(--light-text)]">
                No tasks in this project yet
              </p>
              <Link
                to={`/tasks?projectId=${projectId}`}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--accent-color)] border border-[var(--border)] hover:bg-[var(--accent-color)] hover:text-white transition"
              >
                <Plus size={14} />
                Create a task
              </Link>
            </>
          ) : (
            // NO RESULTS FROM FILTERS
            <>
              <Search
                size={40}
                className="sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-[var(--light-text)]"
              />
              <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                No tasks match your filters
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--light-text)] mt-1">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setTaskSearchQuery("");
                  setTaskStatusFilter("all");
                  setTaskPriorityFilter("all");
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--accent-color)] border border-[var(--border)] hover:bg-[var(--accent-color)] hover:text-white transition cursor-pointer"
              >
                <X size={14} />
                Clear filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
  // RENDER CODE TAB
  const renderCodeTab = () => (
    <div className="space-y-3 sm:space-y-4">
      {/* HEADER */}
      <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Code2 size={16} className="text-[var(--accent-color)]" />
            Linked Repositories ({allRepositories.length})
          </h3>
          <Link
            to="/github"
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-[var(--accent-color)] text-white hover:opacity-90 transition"
          >
            <Plus size={14} />
            Add Repository
          </Link>
        </div>
      </div>
      {/* CHECK IF THERE ARE ANY REPOSITORIES */}
      {allRepositories.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {allRepositories.map((repo) => (
            <div
              key={repo.repoId}
              className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)] hover:border-[var(--accent-color)]/50 transition-all duration-200"
            >
              {/* REPO HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {/* REPO NAME */}
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-sm sm:text-base text-[var(--text-primary)] hover:text-[var(--accent-color)] transition truncate"
                    >
                      {repo.name}
                    </a>
                    {/* PRIMARY BADGE */}
                    {repo.isPrimary && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--accent-color) 15%, var(--cards-bg))",
                          color: "var(--accent-color)",
                        }}
                      >
                        <Star size={10} />
                        Primary
                      </span>
                    )}
                    {/* VISIBILITY BADGE */}
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, #22c55e 15%, var(--cards-bg))",
                        color: "var(--accent-green-500)",
                      }}
                    >
                      <Globe size={10} />
                      Public
                    </span>
                  </div>
                  {/* FULL NAME */}
                  <p className="text-xs text-[var(--light-text)] truncate">
                    {repo.fullName}
                  </p>
                </div>
                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  {/* SET AS PRIMARY BUTTON */}
                  {!repo.isPrimary && allRepositories.length > 1 && (
                    <button
                      onClick={() => {
                        if (projectId) {
                          setPrimaryMutation.mutate({
                            projectId,
                            repoId: repo.repoId,
                          });
                        }
                      }}
                      disabled={setPrimaryMutation.isPending}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition disabled:opacity-50 cursor-pointer"
                      title="Set as primary"
                    >
                      <Star size={12} />
                      <span className="hidden sm:inline">Set Primary</span>
                    </button>
                  )}
                  {/* VIEW ON GITHUB BUTTON */}
                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--border)] transition"
                    title="View on GitHub"
                  >
                    <ExternalLink size={12} />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                  {/* UNLINK BUTTON */}
                  <button
                    onClick={() => {
                      setUnlinkConfirmation({
                        isOpen: true,
                        repoId: repo.repoId,
                        repoName: repo.fullName,
                      });
                    }}
                    disabled={removeRepoMutation.isPending}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition disabled:opacity-50 cursor-pointer"
                    title="Unlink repository"
                  >
                    <Trash2 size={12} />
                    <span className="hidden sm:inline">Unlink</span>
                  </button>
                </div>
              </div>
              {/* REPO STATS */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[var(--light-text)] mb-3 sm:mb-4">
                <span className="flex items-center gap-1.5">
                  <GitBranch size={14} className="text-[var(--accent-color)]" />
                  {repo.defaultBranch || "main"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  Linked{" "}
                  {new Date(repo.linkedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              {/* QUICK LINKS */}
              <div className="pt-3 sm:pt-4 border-t border-[var(--border)]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <Link
                    to={`/github/${repo.owner}/${repo.name}`}
                    className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-lg bg-[var(--hover-bg)] hover:bg-[var(--border)] hover:text-[var(--accent-color)] transition group"
                  >
                    <FileCode
                      size={16}
                      className="text-[var(--light-text)] group-hover:text-[var(--accent-color)] transition"
                    />
                    <span className="text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition">
                      Files
                    </span>
                  </Link>
                  <Link
                    to={`/github/${repo.owner}/${repo.name}/commits`}
                    className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-lg bg-[var(--hover-bg)] hover:bg-[var(--border)] hover:text-[var(--accent-color)] transition group"
                  >
                    <GitCommit
                      size={16}
                      className="text-[var(--light-text)] group-hover:text-[var(--accent-color)] transition"
                    />
                    <span className="text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition">
                      Commits
                    </span>
                  </Link>
                  <Link
                    to={`/github/${repo.owner}/${repo.name}/pulls`}
                    className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-lg bg-[var(--hover-bg)] hover:bg-[var(--border)] hover:text-[var(--accent-color)] transition group"
                  >
                    <GitPullRequest
                      size={16}
                      className="text-[var(--light-text)] group-hover:text-[var(--accent-color)] transition"
                    />
                    <span className="text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition">
                      PRs
                    </span>
                  </Link>
                  <Link
                    to={`/github/${repo.owner}/${repo.name}/issues`}
                    className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-lg bg-[var(--hover-bg)] hover:bg-[var(--border)] hover:text-[var(--accent-color)] transition group"
                  >
                    <CircleDot
                      size={16}
                      className="text-[var(--light-text)] group-hover:text-[var(--accent-color)] transition"
                    />
                    <span className="text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition">
                      Issues
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--cards-bg)] rounded-xl p-4 sm:p-6 lg:p-8 border border-[var(--border)]">
          <div className="text-center py-6 sm:py-8">
            <GitBranch
              size={40}
              className="sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-[var(--light-text)]"
            />
            <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] mb-1 sm:mb-2">
              No repository linked
            </p>
            <p className="text-xs sm:text-sm text-[var(--light-text)] mb-3 sm:mb-4">
              Link a GitHub repository to see code-related information here.
            </p>
            <Link
              to="/github"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[var(--accent-color)] text-white text-xs sm:text-sm font-medium hover:opacity-90 transition"
            >
              <Plus size={14} />
              Link Repository
            </Link>
          </div>
        </div>
      )}
    </div>
  );
  // RENDER TIMELINE TAB
  const renderTimelineTab = () => {
    return (
      <div className="space-y-3 sm:space-y-4">
        {/* HEADER */}
        <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Calendar size={16} className="text-[var(--accent-color)]" />
              Task Timeline
            </h3>
            <div className="flex items-center gap-2 text-xs text-[var(--light-text)]">
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-color)]" />
                {sortedDates.length} milestone
                {sortedDates.length !== 1 ? "s" : ""}
              </span>
              <span className="text-[var(--border)]">•</span>
              <span>
                {projectTasks.filter((t) => t.dueDate).length} scheduled task
                {projectTasks.filter((t) => t.dueDate).length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
        {/* TIMELINE CONTENT */}
        <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
          {sortedDates.length > 0 ? (
            <div className="relative">
              {/* TIMELINE LINE */}
              <div className="absolute left-2.5 sm:left-3 top-2 bottom-2 w-0.5 bg-[var(--border)]" />
              {/* TIMELINE ITEMS */}
              <div className="space-y-4 sm:space-y-6">
                {sortedDates.map((date, index) => (
                  <div key={date} className="relative pl-8 sm:pl-10">
                    {/* DOT */}
                    <div className="absolute left-0 sm:left-0.5 top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[var(--accent-color)] border-2 border-[var(--cards-bg)] flex items-center justify-center">
                      <span className="text-[8px] sm:text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                    {/* DATE HEADER */}
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                        {date}
                      </p>
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--accent-color)]/10 text-[var(--accent-color)]">
                        {tasksByDate[date].length} task
                        {tasksByDate[date].length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {/* TASKS */}
                    <div className="space-y-1.5 sm:space-y-2">
                      {tasksByDate[date].map((task) => (
                        <div
                          key={task._id}
                          className="flex items-center justify-between gap-2 p-2 sm:p-3 rounded-lg bg-[var(--hover-bg)] hover:bg-[var(--border)] transition group"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <span
                              className={`flex-shrink-0 ${
                                STATUS_CONFIG[task.status]?.color ||
                                "text-gray-500"
                              }`}
                            >
                              {STATUS_CONFIG[task.status]?.icon || (
                                <Circle size={12} />
                              )}
                            </span>
                            <span className="text-xs sm:text-sm text-[var(--text-primary)] truncate">
                              {task.title}
                            </span>
                          </div>
                          <span
                            className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium flex-shrink-0 uppercase ${
                              PRIORITY_CONFIG[task.priority || "medium"]?.bg ||
                              "bg-gray-500/10"
                            } ${
                              PRIORITY_CONFIG[task.priority || "medium"]
                                ?.color || "text-gray-500"
                            }`}
                          >
                            {task.priority || "Medium"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 lg:py-12">
              <Calendar
                size={40}
                className="sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-[var(--light-text)]"
              />
              <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] mb-1">
                No scheduled tasks
              </p>
              <p className="text-xs sm:text-sm text-[var(--light-text)]">
                Tasks with due dates will appear here in chronological order
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };
  // RENDER SETTINGS TAB
  const renderSettingsTab = () => (
    <div className="space-y-3 sm:space-y-4">
      {/* HEADER */}
      <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
        <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Settings size={16} className="text-[var(--accent-color)]" />
          Project Settings
        </h3>
      </div>
      {/* PROJECT INFO SECTION */}
      <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
        <h4 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mb-3 sm:mb-4 flex items-center gap-2">
          <Info size={14} className="text-[var(--accent-color)]" />
          Project Information
        </h4>
        <div className="space-y-3 sm:space-y-4">
          {/* PROJECT NAME */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[var(--light-text)] mb-1.5 sm:mb-2">
              Project Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]">
                <Target size={14} className="sm:w-4 sm:h-4" />
              </div>
              <input
                type="text"
                value={project.title}
                readOnly
                className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-[var(--hover-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition"
              />
            </div>
          </div>
          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[var(--light-text)] mb-1.5 sm:mb-2">
              Description
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-[var(--light-text)]">
                <Info size={14} className="sm:w-4 sm:h-4" />
              </div>
              <textarea
                value={project.description || "No description provided"}
                readOnly
                rows={3}
                className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-[var(--hover-bg)] text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--accent-color)] transition"
              />
            </div>
          </div>
          {/* STATUS & PRIORITY ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* STATUS */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[var(--light-text)] mb-1.5 sm:mb-2">
                Status
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]">
                  <CircleDot size={14} className="sm:w-4 sm:h-4" />
                </div>
                <input
                  type="text"
                  value={project.status || "To Do"}
                  readOnly
                  className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-[var(--hover-bg)] text-[var(--text-primary)] capitalize focus:outline-none focus:border-[var(--accent-color)] transition"
                />
              </div>
            </div>
            {/* IN CHARGE */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[var(--light-text)] mb-1.5 sm:mb-2">
                In Charge
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]">
                  <User size={14} className="sm:w-4 sm:h-4" />
                </div>
                <input
                  type="text"
                  value={project.inChargeName || "Not assigned"}
                  readOnly
                  className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-[var(--hover-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition"
                />
              </div>
            </div>
          </div>
          {/* DUE DATE & CREATED AT ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* DUE DATE */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[var(--light-text)] mb-1.5 sm:mb-2">
                Due Date
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]">
                  <Calendar size={14} className="sm:w-4 sm:h-4" />
                </div>
                <input
                  type="text"
                  value={
                    project.dueDate
                      ? new Date(project.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No due date"
                  }
                  readOnly
                  className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-[var(--hover-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition"
                />
              </div>
            </div>
            {/* CREATED AT */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[var(--light-text)] mb-1.5 sm:mb-2">
                Created
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]">
                  <CalendarDays size={14} className="sm:w-4 sm:h-4" />
                </div>
                <input
                  type="text"
                  value={
                    project.createdAt
                      ? new Date(project.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "Unknown"
                  }
                  readOnly
                  className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-[var(--hover-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* GITHUB INTEGRATION SECTION */}
      <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
        <h4 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mb-3 sm:mb-4 flex items-center gap-2">
          <GitBranch size={14} className="text-[var(--accent-color)]" />
          GitHub Integration
        </h4>
        {allRepositories.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {allRepositories.map((repo) => (
              <div
                key={repo.repoId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-2.5 sm:p-3 rounded-lg bg-[var(--hover-bg)]"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-[var(--accent-color)]/10 flex-shrink-0">
                    <GitBranch
                      size={14}
                      className="sm:w-4 sm:h-4 text-[var(--accent-color)]"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] truncate">
                      {repo.fullName}
                    </p>
                    <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
                      {repo.defaultBranch || "main"} • Linked{" "}
                      {new Date(repo.linkedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-8 sm:ml-0">
                  {repo.isPrimary && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-[var(--accent-color)]/10 text-[var(--accent-color)]">
                      Primary
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-500/10 text-green-500">
                    Connected
                  </span>
                </div>
              </div>
            ))}
            <Link
              to="/github"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[var(--accent-color)] hover:underline mt-2"
            >
              <Plus size={12} />
              Manage repositories
            </Link>
          </div>
        ) : (
          <div className="p-3 sm:p-4 rounded-lg bg-[var(--hover-bg)] text-center">
            <GitBranch
              size={28}
              className="sm:w-8 sm:h-8 mx-auto mb-2 text-[var(--light-text)]"
            />
            <p className="text-xs sm:text-sm text-[var(--light-text)] mb-2">
              No repository linked to this project
            </p>
            <Link
              to="/github"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--accent-color)] hover:underline"
            >
              <Plus size={12} />
              Link a repository
            </Link>
          </div>
        )}
      </div>
      {/* QUICK STATS SECTION */}
      <div className="bg-[var(--cards-bg)] rounded-xl p-3 sm:p-4 lg:p-6 border border-[var(--border)]">
        <h4 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mb-3 sm:mb-4 flex items-center gap-2">
          <TrendingUp size={14} className="text-[var(--accent-color)]" />
          Project Statistics
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="p-2.5 sm:p-3 rounded-lg bg-[var(--hover-bg)] text-center">
            <p className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              {taskStats.total}
            </p>
            <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
              Total Tasks
            </p>
          </div>
          <div className="p-2.5 sm:p-3 rounded-lg bg-[var(--hover-bg)] text-center">
            <p className="text-lg sm:text-xl font-bold text-green-500">
              {taskStats.completed}
            </p>
            <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
              Completed
            </p>
          </div>
          <div className="p-2.5 sm:p-3 rounded-lg bg-[var(--hover-bg)] text-center">
            <p className="text-lg sm:text-xl font-bold text-yellow-500">
              {taskStats.inProgress}
            </p>
            <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
              In Progress
            </p>
          </div>
          <div className="p-2.5 sm:p-3 rounded-lg bg-[var(--hover-bg)] text-center">
            <p className="text-lg sm:text-xl font-bold text-[var(--accent-color)]">
              {taskStats.progress}%
            </p>
            <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
              Progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  // RETURN PROJECT DASHBOARD PAGE
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
    >
      {/* HEADER */}
      <DashboardHeader title={project.title} subtitle="Project Dashboard" />
      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition mb-4"
        >
          <ArrowLeft size={18} />
          <span>Back to Projects</span>
        </button>
        {/* TABS */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex items-center gap-1 p-1 bg-[var(--hover-bg)] rounded-lg w-fit min-w-full sm:min-w-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition flex-1 sm:flex-none whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* TAB CONTENT */}
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "tasks" && renderTasksTab()}
        {activeTab === "code" && renderCodeTab()}
        {activeTab === "timeline" && renderTimelineTab()}
        {activeTab === "settings" && renderSettingsTab()}
      </main>
      {/* UNLINK REPOSITORY CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={unlinkConfirmation.isOpen}
        onClose={() =>
          setUnlinkConfirmation({
            isOpen: false,
            repoId: null,
            repoName: "",
          })
        }
        onConfirm={() => {
          if (projectId && unlinkConfirmation.repoId !== null) {
            removeRepoMutation.mutate({
              projectId,
              repoId: unlinkConfirmation.repoId,
            });
          }
        }}
        title="Unlink Repository"
        message={`Are you sure you want to unlink "${unlinkConfirmation.repoName}" from this project? This action cannot be undone.`}
        type="warning"
        confirmText="Unlink"
        cancelText="Cancel"
        showCancel={true}
      />
    </div>
  );
};

export default ProjectDashboardPage;
