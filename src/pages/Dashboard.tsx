// <== IMPORTS ==>
import { JSX } from "react";
import { AxiosError } from "axios";
import useTitle from "../hooks/useTitle";
import Notepad from "../components/cards/Notepad";
import { useDashboard } from "../hooks/useDashboard";
import AddThings from "../components/cards/AddThings";
import AssignedTasks from "../components/cards/AssignedTasks";
import ProgressTrends from "../components/cards/ProgressTrends";
import DashboardHeader from "../components/layout/DashboardHeader";
import TasksCreatedToday from "../components/cards/TasksCreatedToday";
import WeeklyProjectsChart from "../components/cards/WeeklyProjectsChart";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";

// <== DASHBOARD PAGE COMPONENT ==>
const Dashboard = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Dashboard");
  // FETCH DASHBOARD DATA (DATA IS STORED IN STORE VIA useDashboard HOOK)
  const { isLoading, isError, error } = useDashboard();
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  // IF ERROR, SHOW ERROR MESSAGE
  if (isError && error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError?.response?.data?.message ||
      axiosError?.message ||
      "Unknown error";
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text-primary)",
        }}
      >
        <div className="text-center">
          <p className="text-lg font-medium text-red-500 mb-2">
            Error loading dashboard data
          </p>
          <p className="text-sm text-[var(--light-text)]">{errorMessage}</p>
        </div>
      </div>
    );
  }
  // RETURNING THE DASHBOARD PAGE COMPONENT
  return (
    // DASHBOARD MAIN CONTAINER
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* DASHBOARD HEADER */}
        <DashboardHeader
          title="Dashboard"
          subtitle="Monitor all of your projects and tasks here"
        />
        {/* DASHBOARD CONTENT CONTAINER */}
        <div className="p-4 space-y-4">
          {/* ADD THINGS CARD */}
          <AddThings />
          {/* CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {/* PROGRESS TRENDS CARD */}
            <div className="w-full flex">
              <ProgressTrends />
            </div>
            {/* WEEKLY PROJECTS CHART CARD */}
            <div className="w-full flex">
              <WeeklyProjectsChart />
            </div>
            {/* ASSIGNED TASKS CARD */}
            <div className="w-full md:col-span-2 lg:col-span-1 flex">
              <AssignedTasks />
            </div>
          </div>
          {/* CHART AND NOTEPAD SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            {/* TASKS CREATED TODAY CARD */}
            <div className="lg:col-span-2 flex">
              <TasksCreatedToday />
            </div>
            {/* NOTEPAD CARD */}
            <div className="lg:col-span-1 flex">
              <Notepad />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
