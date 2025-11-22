// <== IMPORTS ==>
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { JSX } from "react";
import { CheckSquare2 } from "lucide-react";

// <== PROGRESS TRENDS COMPONENT ==>
const ProgressTrends = (): JSX.Element => {
  // MOCK DATA FOR TASKS COMPLETED PER MONTH (NO API)
  const tasksCompletedData = [
    { week: "Jan", completed: 0 },
    { week: "Feb", completed: 0 },
    { week: "Mar", completed: 0 },
    { week: "Apr", completed: 0 },
    { week: "May", completed: 0 },
    { week: "Jun", completed: 0 },
  ];
  // CHECK IF HAS COMPLETED TASKS
  const hasCompletedTasks =
    tasksCompletedData.length > 0 &&
    tasksCompletedData.some((t) => t.completed > 0);
  // RETURNING THE PROGRESS TRENDS COMPONENT
  return (
    // PROGRESS TRENDS MAIN CONTAINER
    <div className="bg-[var(--cards-bg)] border rounded-xl border-[var(--border)] flex flex-col h-full w-full">
      {/* CARD HEADER */}
      <div className="p-3 pt-1.5 pb-1.5 border-b border-[var(--border)]">
        {/* CARD TITLE */}
        <p className="text-lg font-medium">Tasks Completed Per Month</p>
      </div>
      {/* CHART CONTAINER */}
      <div className="p-3 pb-1 h-[250px] flex items-center justify-center">
        {/* CHECK IF HAS COMPLETED TASKS */}
        {hasCompletedTasks ? (
          // CHART CONTAINER
          <ResponsiveContainer width="100%" height="100%">
            {/* BAR CHART */}
            <BarChart
              data={tasksCompletedData}
              barCategoryGap="15%"
              margin={{ top: 10, right: 10, left: -22, bottom: 10 }}
              className="pl-0"
            >
              {/* X AXIS */}
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--light-text)", fontSize: 14 }}
              />
              {/* Y AXIS */}
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--light-text)", fontSize: 14 }}
                allowDecimals={false}
              />
              {/* TOOLTIP */}
              <Tooltip
                cursor={{ fill: "var(--accent-hover)", opacity: 0.2 }}
                contentStyle={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--primary-text)",
                }}
                itemStyle={{ color: "var(--primary-text)" }}
              />
              {/* BAR */}
              <Bar
                dataKey="completed"
                radius={[4, 4, 0, 0]}
                fill="var(--accent-color)"
              >
                {/* LABEL LIST */}
                <LabelList
                  dataKey="completed"
                  position="top"
                  fill="var(--accent-color)"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center h-full gap-3">
            {/* EMPTY STATE ICON */}
            <CheckSquare2
              size={48}
              className="text-[var(--light-text)] opacity-50"
            />
            {/* EMPTY STATE TEXT */}
            <p className="text-[var(--light-text)] text-center">
              No tasks completed yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTrends;
