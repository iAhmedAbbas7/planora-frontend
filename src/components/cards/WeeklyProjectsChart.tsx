// <== IMPORTS ==>
import { JSX } from "react";
import { FolderPlus } from "lucide-react";
import { useDashboardStore } from "../../store/useDashboardStore";
import { RadialBarChart, RadialBar, PolarAngleAxis, Tooltip } from "recharts";

// <== WEEKLY PROJECTS CHART COMPONENT ==>
const WeeklyProjectsChart = (): JSX.Element => {
  // GET WEEKLY SUMMARY FROM DASHBOARD STORE
  const weeklySummary = useDashboardStore((state) => state.getWeeklySummary());
  // GET COMPLETED PROJECTS FROM DASHBOARD STORE
  const completedProjects = weeklySummary?.completedProjects || 0;
  // GET TARGET PROJECTS FROM DASHBOARD STORE
  const targetProjects = weeklySummary?.targetProjects || 0;
  // GET REMAINING PROJECTS
  const remaining = Math.max(targetProjects - completedProjects, 0);
  // CHECK IF NO PROJECTS
  const noProjects = completedProjects === 0 && targetProjects === 0;
  // GET CHART DATA WITH FILL COLOR
  const data = [
    {
      name: "Completed",
      value: completedProjects,
      fill: "var(--accent-color)",
    },
    { name: "Remaining", value: remaining, fill: "var(--weekly-circle)" },
  ];
  // RETURNING THE WEEKLY PROJECTS CHART COMPONENT
  return (
    // WEEKLY PROJECTS CHART MAIN CONTAINER
    <div className="flex flex-col bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] h-full w-full">
      {/* CARD HEADER */}
      <div>
        {/* CARD TITLE */}
        <p className="text-lg font-medium text-left px-2 py-1.5 text-[var(--text-primary)] border-b border-[var(--border)]">
          Weekly Projects Summary
        </p>
      </div>
      {/* CHART CONTAINER */}
      <div className="flex justify-center items-center p-2 h-[210px]">
        {/* CHECK IF NO PROJECTS */}
        {noProjects ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center h-full gap-3">
            {/* EMPTY STATE ICON */}
            <FolderPlus
              size={48}
              className="text-[var(--light-text)] opacity-50"
            />
            {/* EMPTY STATE TEXT */}
            <p className="text-[var(--light-text)] text-center">
              No projects added yet
            </p>
          </div>
        ) : (
          // RADIAL BAR CHART
          <RadialBarChart
            width={250}
            height={190}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={20}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            {/* POLAR ANGLE AXIS */}
            <PolarAngleAxis
              type="number"
              domain={[0, targetProjects || 10]}
              tick={false}
            />
            {/* RADIAL BAR */}
            <RadialBar
              cornerRadius={10}
              background={{ fill: "var(--inside-card-bg)" }}
              dataKey="value"
            />
            {/* TOOLTIP */}
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg)",
                border: "1px solid var(--border)",
                color: "var(--primary-text)",
                borderRadius: "8px",
                padding: "8px",
              }}
              itemStyle={{ color: "var(--primary-text)" }}
            />
          </RadialBarChart>
        )}
      </div>
      {/* SUMMARY TEXT */}
      {!noProjects && (
        <p className="mt-2 mb-3 text-sm text-[var(--light-text)] text-center">
          <span className="font-semibold text-[var(--accent-color)]">
            {completedProjects}
          </span>{" "}
          / {targetProjects} projects
        </p>
      )}
    </div>
  );
};

export default WeeklyProjectsChart;
