// <== IMPORTS ==>
import { JSX } from "react";
import { AxiosError } from "axios";
import useTitle from "../hooks/useTitle";
import { useTasks } from "../hooks/useTasks";
import TasksOverview from "../components/cards/TasksOverview";
import ViewsCombined from "../components/tasks/ViewsCombined";
import DashboardHeader from "../components/layout/DashboardHeader";
import TasksSkeleton from "../components/skeletons/TasksSkeleton";

// <== TASKS PAGE COMPONENT ==>
const TasksPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Tasks");
  // GET TASKS DATA FROM HOOK
  const { isLoading, isError, tasksError } = useTasks();
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    return <TasksSkeleton />;
  }
  // IF ERROR, SHOW ERROR MESSAGE
  if (isError && tasksError) {
    // GET AXIOS ERROR
    const axiosError = tasksError as AxiosError<{ message?: string }>;
    // GET ERROR MESSAGE
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
            Error loading tasks data
          </p>
          <p className="text-sm text-[var(--light-text)]">{errorMessage}</p>
        </div>
      </div>
    );
  }
  // RETURNING THE TASKS PAGE COMPONENT
  return (
    // TASKS PAGE MAIN CONTAINER
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* PAGE HEADER */}
      <DashboardHeader
        title="Tasks"
        subtitle="Create, track, and manage all your tasks easily"
      />
      {/* TASKS OVERVIEW SECTION */}
      <TasksOverview />
      {/* VIEWS COMBINED SECTION */}
      <div className="flex w-full gap-4 p-4 pt-0 pb-0">
        <ViewsCombined />
      </div>
    </div>
  );
};

export default TasksPage;
