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
      <div
        className="sticky top-0 z-40 m-0 p-4 pt-2 pb-2 flex justify-between items-center backdrop-blur-[var(--blur)] bg-[var(--glass-bg)] border-b border-[var(--border)]"
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--text-primary)",
        }}
      >
        {/* LEFT SECTION - TITLE */}
        <div className="flex items-center gap-3">
          {/* TITLE CONTAINER */}
          <div>
            {/* PAGE TITLE SKELETON */}
            <div className="h-6 sm:h-8 w-24 bg-[var(--cards-bg)] rounded-lg animate-pulse mb-1" />
            {/* PAGE SUBTITLE SKELETON */}
            <div className="h-3 sm:h-4 w-64 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
          </div>
        </div>
        {/* RIGHT SECTION - ACTIONS SKELETON */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-9 w-9 bg-[var(--cards-bg)] rounded-full animate-pulse" />
        </div>
      </div>
      {/* OVERVIEW SECTION SKELETON */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 p-4 pt-4 pb-3 rounded-xl">
        {/* STATS CARDS SKELETON */}
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3 border rounded-xl bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] border-[var(--border)]"
          >
            {/* ICON SKELETON */}
            <div className="h-6 w-6 sm:h-7 sm:w-7 bg-[var(--inside-card-bg)] rounded animate-pulse flex-shrink-0" />
            {/* STAT INFO SKELETON */}
            <div className="flex flex-col min-w-0 flex-1 gap-2">
              {/* COUNT SKELETON */}
              <div className="h-6 sm:h-7 w-12 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              {/* NAME SKELETON */}
              <div className="h-3 sm:h-4 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      {/* VIEWS COMBINED SECTION SKELETON */}
      <div className="flex w-full gap-4 p-4 pt-0 pb-0">
        <div className="p-4 rounded-2xl flex flex-col w-full border border-[var(--border)]">
          {/* HEADER SKELETON */}
          <header className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
            {/* SEARCH CONTAINER SKELETON */}
            <div className="relative w-full sm:w-64">
              <div className="h-10 w-full bg-[var(--cards-bg)] rounded-xl animate-pulse" />
            </div>
            {/* ACTIONS CONTAINER SKELETON */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-3">
                {/* VIEW TOGGLE BUTTONS SKELETON */}
                <div className="flex gap-2">
                  <div className="h-8 sm:h-9 w-16 sm:w-20 bg-[var(--cards-bg)] rounded-md animate-pulse" />
                  <div className="h-8 sm:h-9 w-16 sm:w-20 bg-[var(--cards-bg)] rounded-md animate-pulse" />
                </div>
                {/* ADD TASK BUTTON SKELETON */}
                <div className="h-8 sm:h-9 w-24 sm:w-32 bg-[var(--cards-bg)] rounded-md animate-pulse" />
              </div>
            </div>
          </header>
          {/* BOARD VIEW SKELETON */}
          <main className="overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch relative w-full">
              {/* COLUMN SKELETONS */}
              {["To Do", "In Progress", "Completed"].map((index) => (
                <div
                  key={index}
                  className="bg-[var(--cards-bg)] backdrop-blur-[var(--blur)] rounded-xl shadow-sm p-4 sm:p-5 flex flex-col border border-[var(--border)] h-full"
                >
                  {/* COLUMN HEADER SKELETON */}
                  <div className="flex items-center justify-between mb-4">
                    {/* COLUMN TITLE CONTAINER SKELETON */}
                    <div className="flex items-center gap-2">
                      {/* STATUS DOT SKELETON */}
                      <div className="w-3 h-3 rounded-full bg-[var(--inside-card-bg)] animate-pulse" />
                      {/* COLUMN TITLE SKELETON */}
                      <div className="h-5 w-24 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                    </div>
                    {/* COLLAPSE/EXPAND BUTTON SKELETON */}
                    <div className="h-5 w-5 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  </div>
                  {/* SECTION SEARCH BAR SKELETON */}
                  <div className="relative mb-3">
                    <div className="h-8 w-full bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
                  </div>
                  {/* TASK CARDS SKELETON */}
                  <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-[100px]">
                    {[1, 2].map((task) => (
                      <div
                        key={task}
                        className="bg-[var(--inside-card-bg)] rounded-xl shadow-sm border border-[var(--border)] p-3 sm:p-4"
                      >
                        {/* COLLAPSED STATE SKELETON */}
                        <div className="flex items-center justify-between gap-3">
                          {/* LEFT SIDE: CHECKBOX AND TITLE */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {/* CHECKBOX SKELETON */}
                            <div className="h-4 w-4 bg-[var(--bg)] rounded border border-[var(--border)] flex-shrink-0 animate-pulse" />
                            {/* TITLE SKELETON */}
                            <div className="h-4 w-3/4 bg-[var(--bg)] rounded animate-pulse" />
                          </div>
                          {/* RIGHT SIDE: EXPAND BUTTON */}
                          <div className="h-5 w-5 bg-[var(--bg)] rounded animate-pulse flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* ADD TASK BUTTON SKELETON */}
                  <div className="mt-4 w-full h-10 bg-[var(--inside-card-bg)] border border-dashed border-[var(--border)] rounded-lg animate-pulse" />
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
