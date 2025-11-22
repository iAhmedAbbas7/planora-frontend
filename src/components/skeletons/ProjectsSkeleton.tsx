// <== IMPORTS ==>
import { JSX } from "react";

// <== PROJECTS SKELETON COMPONENT ==>
const ProjectsSkeleton = (): JSX.Element => {
  // RETURNING THE PROJECTS SKELETON COMPONENT
  return (
    // PROJECTS SKELETON MAIN CONTAINER
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 p-4 pt-4 pb-3 rounded-xl">
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
      {/* PROJECTS LIST/CARDS SECTION SKELETON */}
      <div className="flex flex-col p-4 pt-0">
        <div className="p-4 border border-[var(--border)] rounded-2xl">
          {/* HEADER SKELETON */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* SEARCH CONTAINER SKELETON */}
            <div className="relative w-full sm:w-64">
              <div className="h-10 w-full bg-[var(--cards-bg)] rounded-xl animate-pulse" />
            </div>
            {/* ACTIONS CONTAINER SKELETON */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-3">
                {/* VIEW TOGGLE BUTTONS SKELETON */}
                <div className="flex gap-2">
                  <div className="h-10 w-20 bg-[var(--cards-bg)] rounded-xl animate-pulse" />
                  <div className="h-10 w-20 bg-[var(--cards-bg)] rounded-xl animate-pulse" />
                </div>
                {/* ADD PROJECT BUTTON SKELETON */}
                <div className="h-10 w-32 bg-[var(--cards-bg)] rounded-full animate-pulse" />
              </div>
            </div>
          </header>
          {/* PROJECTS GRID SKELETON (CARD VIEW) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className={`flex flex-col gap-3 rounded-xl p-4 shadow-sm transition ${
                  item % 2 === 0
                    ? "bg-[var(--cards-bg)] border border-[var(--border)]"
                    : "bg-[var(--bg)] border border-[var(--border)]"
                }`}
              >
                {/* CARD HEADER SKELETON */}
                <header className="flex justify-between items-center">
                  <div className="h-5 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  <div className="flex gap-2 justify-center items-center">
                    <div className="h-5 w-20 bg-[var(--inside-card-bg)] rounded-full animate-pulse" />
                    <div className="h-5 w-5 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  </div>
                </header>
                {/* CARD INFO SECTION SKELETON */}
                <section className="grid grid-cols-2 gap-3 text-sm">
                  {/* INCHARGE INFO SKELETON */}
                  <div>
                    <div className="h-3 w-16 bg-[var(--inside-card-bg)] rounded animate-pulse mb-1" />
                    <div className="h-4 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  </div>
                  {/* ROLE INFO SKELETON */}
                  <div>
                    <div className="h-3 w-12 bg-[var(--inside-card-bg)] rounded animate-pulse mb-1" />
                    <div className="h-4 w-16 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  </div>
                  {/* TASKS INFO SKELETON */}
                  <div>
                    <div className="h-3 w-14 bg-[var(--inside-card-bg)] rounded animate-pulse mb-1" />
                    <div className="h-4 w-12 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  </div>
                  {/* DEADLINE INFO SKELETON */}
                  <div>
                    <div className="h-3 w-16 bg-[var(--inside-card-bg)] rounded animate-pulse mb-1" />
                    <div className="h-4 w-24 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  </div>
                </section>
                {/* PROGRESS SECTION SKELETON */}
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <div className="h-4 w-16 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                    <div className="h-4 w-12 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  </div>
                  <div className="h-2 w-full bg-[var(--inside-card-bg)] rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          {/* PAGINATION SKELETON */}
          <div className="flex justify-between items-center mt-6 text-sm">
            <div className="h-4 w-32 bg-[var(--cards-bg)] rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-[var(--cards-bg)] rounded animate-pulse" />
              <div className="h-8 w-20 bg-[var(--cards-bg)] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSkeleton;

