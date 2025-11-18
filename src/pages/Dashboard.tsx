// <== IMPORTS ==>
import { JSX } from "react";
import Notepad from "../components/cards/Notepad";
import AddThings from "../components/cards/AddThings";
import AssignedTasks from "../components/cards/AssignedTasks";
import ProgressTrends from "../components/cards/ProgressTrends";
import DashboardHeader from "../components/layout/DashboardHeader";
import TasksCreatedToday from "../components/cards/TasksCreatedToday";
import WeeklyProjectsChart from "../components/cards/WeeklyProjectsChart";

// <== DASHBOARD PAGE COMPONENT ==>
const Dashboard = (): JSX.Element => {
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
          showSearch={false}
        />
        {/* DASHBOARD CONTENT CONTAINER */}
        <div className="p-4 space-y-4">
          {/* ADD THINGS CARD */}
          <AddThings />
          {/* CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* PROGRESS TRENDS CARD */}
            <ProgressTrends />
            {/* WEEKLY PROJECTS CHART CARD */}
            <WeeklyProjectsChart />
            {/* ASSIGNED TASKS CARD */}
            <AssignedTasks />
          </div>
          {/* CHART AND NOTEPAD SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* TASKS CREATED TODAY CARD */}
            <div className="lg:col-span-2">
              <TasksCreatedToday />
            </div>
            {/* NOTEPAD CARD */}
            <div className="lg:col-span-1">
              <Notepad />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
