// <== IMPORTS ==>
import { JSX } from "react";

// <== TASKS SKELETON COMPONENT ==>
const TasksSkeleton = (): JSX.Element => {
  // RETURNING THE TASKS SKELETON COMPONENT
  return (
    // TASKS SKELETON MAIN CONTAINER
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* PAGE HEADER SKELETON */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="h-8 w-32 bg-[var(--cards-bg)] rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-64 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
      </div>
      {/* OVERVIEW SECTION SKELETON */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 p-4 pt-4 pb-3 rounded-xl">
        {/* STATS CARDS SKELETON */}
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3 border rounded-xl bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] border-[var(--border)] animate-pulse"
          >
            {/* ICON SKELETON */}
            <div className="h-6 w-6 sm:h-7 sm:w-7 bg-[var(--inside-card-bg)] rounded-full flex-shrink-0" />
            {/* STAT INFO SKELETON */}
            <div className="flex flex-col min-w-0 flex-1 gap-2">
              {/* COUNT SKELETON */}
              <div className="h-6 sm:h-7 w-12 bg-[var(--inside-card-bg)] rounded" />
              {/* NAME SKELETON */}
              <div className="h-3 sm:h-4 w-20 bg-[var(--inside-card-bg)] rounded" />
            </div>
          </div>
        ))}
      </div>
      {/* TASKS LIST/BOARD SECTION SKELETON */}
      <div className="flex w-full gap-4 p-4 pt-0 pb-0">
        <div className="p-4 rounded-2xl flex flex-col w-full border border-[var(--border)]">
          {/* HEADER SKELETON */}
          <header className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
            {/* SEARCH CONTAINER SKELETON */}
            <div className="relative w-full sm:w-64">
              <div className="h-10 w-full bg-[var(--cards-bg)] rounded-xl animate-pulse" />
            </div>
            {/* ACTIONS CONTAINER SKELETON */}
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-3">
              {/* VIEW TOGGLE BUTTONS SKELETON */}
              <div className="flex gap-2">
                <div className="h-10 w-20 bg-[var(--cards-bg)] rounded-xl animate-pulse" />
                <div className="h-10 w-20 bg-[var(--cards-bg)] rounded-xl animate-pulse" />
              </div>
              {/* ADD TASK BUTTON SKELETON */}
              <div className="h-10 w-32 bg-[var(--cards-bg)] rounded-full animate-pulse" />
            </div>
          </header>
          {/* BOARD VIEW SKELETON */}
          <main className="overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start relative">
              {/* COLUMN SKELETONS */}
              {["To Do", "In Progress", "Completed"].map((index) => (
                <div
                  key={index}
                  className="bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] rounded-xl shadow-sm p-4 flex flex-col animate-pulse"
                >
                  {/* COLUMN HEADER SKELETON */}
                  <div className="flex items-center justify-between mb-3">
                    {/* COLUMN TITLE CONTAINER SKELETON */}
                    <div className="flex items-center gap-2">
                      {/* STATUS DOT SKELETON */}
                      <div className="w-3 h-3 rounded-full bg-[var(--inside-card-bg)]" />
                      {/* COLUMN TITLE SKELETON */}
                      <div className="h-5 w-20 bg-[var(--inside-card-bg)] rounded" />
                    </div>
                    {/* CHECKBOX SKELETON */}
                    <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded" />
                  </div>
                  {/* TASK CARDS SKELETON */}
                  <div className="flex flex-col gap-3 flex-1 min-h-[100px]">
                    {[1, 2].map((task) => (
                      <div
                        key={task}
                        className="bg-[var(--inside-card-bg)] rounded-lg shadow-sm border border-[var(--border)] p-3 border-l-4 border-l-[var(--inside-card-bg)]"
                      >
                        {/* TASK TITLE SKELETON */}
                        <div className="h-4 w-3/4 bg-[var(--bg)] rounded mb-2" />
                        {/* TASK DESCRIPTION SKELETON */}
                        <div className="h-3 w-full bg-[var(--bg)] rounded mb-2" />
                        {/* TASK METADATA SKELETON */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-4 w-16 bg-[var(--bg)] rounded-full" />
                          <div className="h-4 w-16 bg-[var(--bg)] rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TasksSkeleton;
