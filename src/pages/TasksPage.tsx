// <== IMPORTS ==>
import { JSX } from "react";
import TasksOverview from "../components/cards/TasksOverview";
import ViewsCombined from "../components/tasks/ViewsCombined";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== TASKS PAGE COMPONENT ==>
const TasksPage = (): JSX.Element => {
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
        showSearch={false}
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
