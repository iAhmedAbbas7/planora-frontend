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
                  <div className="h-8 sm:h-9 w-16 sm:w-20 bg-[var(--cards-bg)] rounded-md animate-pulse" />
                  <div className="h-8 sm:h-9 w-16 sm:w-20 bg-[var(--cards-bg)] rounded-md animate-pulse" />
                </div>
                {/* ADD PROJECT BUTTON SKELETON */}
                <div className="h-8 sm:h-9 w-24 sm:w-32 bg-[var(--cards-bg)] rounded-md animate-pulse" />
              </div>
            </div>
          </header>
          {/* PROJECTS GRID SKELETON (CARD VIEW) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className={`flex flex-col gap-3 sm:gap-4 rounded-xl p-3 sm:p-4 shadow-sm transition ${
                  item % 2 === 0
                    ? "bg-[var(--cards-bg)] border border-[var(--border)]"
                    : "bg-[var(--bg)] border border-[var(--border)]"
                }`}
              >
                {/* CARD HEADER SKELETON */}
                <header className="flex justify-between items-start gap-2">
                  <div className="h-5 sm:h-6 w-32 sm:w-40 bg-[var(--inside-card-bg)] rounded animate-pulse flex-1" />
                  <div className="h-5 w-5 bg-[var(--inside-card-bg)] rounded animate-pulse flex-shrink-0" />
                </header>
                {/* CARD INFO SECTION SKELETON - SINGLE COLUMN LAYOUT */}
                <section className="flex flex-col gap-3 text-sm">
                  {/* STATUS INFO SKELETON */}
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded animate-pulse flex-shrink-0" />
                    <div className="flex items-center gap-3 flex-1 justify-between">
                      <div className="h-3 w-14 sm:w-16 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                      <div className="h-5 w-16 sm:w-20 bg-[var(--inside-card-bg)] rounded-full animate-pulse" />
                    </div>
                  </div>
                  {/* INCHARGE INFO SKELETON */}
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded animate-pulse flex-shrink-0" />
                    <div className="flex items-center gap-3 flex-1 justify-between">
                      <div className="h-3 w-14 sm:w-16 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                      <div className="h-4 w-20 sm:w-24 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                    </div>
                  </div>
                  {/* ROLE INFO SKELETON */}
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded animate-pulse flex-shrink-0" />
                    <div className="flex items-center gap-3 flex-1 justify-between">
                      <div className="h-3 w-12 sm:w-14 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                      <div className="h-4 w-16 sm:w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                    </div>
                  </div>
                  {/* TASKS INFO SKELETON */}
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded animate-pulse flex-shrink-0" />
                    <div className="flex items-center gap-3 flex-1 justify-between">
                      <div className="h-3 w-12 sm:w-14 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                      <div className="h-4 w-12 sm:w-16 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                    </div>
                  </div>
                  {/* DEADLINE INFO SKELETON */}
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded animate-pulse flex-shrink-0" />
                    <div className="flex items-center gap-3 flex-1 justify-between">
                      <div className="h-3 w-16 sm:w-18 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                      <div className="h-4 w-20 sm:w-24 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                    </div>
                  </div>
                </section>
                {/* PROGRESS SECTION SKELETON */}
                <div className="mt-1">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3.5 w-3.5 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                      <div className="h-4 w-16 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-10 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  </div>
                  <div className="h-2 w-full bg-[var(--inside-card-bg)] rounded-full animate-pulse" />
                </div>
                {/* CARD FOOTER SKELETON */}
                <footer className="flex flex-col sm:flex-row gap-2 mt-2">
                  <div className="flex-1 h-8 sm:h-9 bg-[var(--inside-card-bg)] rounded-md animate-pulse" />
                  <div className="flex-1 h-8 sm:h-9 bg-[var(--inside-card-bg)] rounded-md animate-pulse" />
                </footer>
              </div>
            ))}
          </div>
          {/* PAGINATION SKELETON */}
          <footer className="flex justify-between items-center mt-6 flex-wrap gap-2">
            {/* PREVIOUS BUTTON SKELETON */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--cards-bg)] rounded-full animate-pulse" />
            {/* PAGE NUMBERS SKELETON */}
            <div className="flex gap-1 sm:gap-1.5">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--cards-bg)] rounded-full animate-pulse"
                />
              ))}
            </div>
            {/* NEXT BUTTON SKELETON */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--cards-bg)] rounded-full animate-pulse" />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSkeleton;

