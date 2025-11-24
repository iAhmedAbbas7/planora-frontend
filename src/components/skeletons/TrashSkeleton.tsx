// <== IMPORTS ==>
import { JSX } from "react";

// <== TRASH SKELETON COMPONENT ==>
const TrashSkeleton = (): JSX.Element => {
  // RETURNING THE TRASH SKELETON COMPONENT
  return (
    // TRASH SKELETON MAIN CONTAINER
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
      {/* TRASH SECTION SKELETON */}
      <div className="p-4">
        <div className="p-4 rounded-2xl flex flex-col w-full bg-[var(--bg)] border border-[var(--border)]">
          {/* TOP CONTROLS HEADER SKELETON */}
          <header className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
            {/* SEARCH CONTAINER SKELETON */}
            <div className="relative w-full sm:w-72">
              <div className="h-10 w-full bg-[var(--cards-bg)] rounded-xl animate-pulse" />
            </div>
            {/* BULK ACTIONS CONTAINER SKELETON */}
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
              <div className="h-10 w-28 bg-[var(--cards-bg)] rounded-xl animate-pulse" />
              <div className="h-10 w-36 bg-[var(--cards-bg)] rounded-xl animate-pulse" />
              <div className="h-10 w-24 bg-[var(--cards-bg)] rounded-xl animate-pulse" />
            </div>
          </header>
          {/* TABS CONTAINER SKELETON */}
          <div className="flex justify-between items-center border-b border-[var(--border)] mb-4">
            <div className="flex gap-6">
              <div className="h-6 w-16 bg-[var(--cards-bg)] rounded animate-pulse" />
              <div className="h-6 w-20 bg-[var(--cards-bg)] rounded animate-pulse" />
            </div>
          </div>
          {/* TABLE CONTAINER SKELETON */}
          <div className="overflow-x-auto bg-[var(--bg)] rounded-xl border border-[var(--border)] shadow-sm">
            {/* TABLE HEADER SKELETON */}
            <div className="bg-[var(--cards-bg)] p-3 border-b border-[var(--border)]">
              <div className="grid grid-cols-5 gap-4">
                <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                <div className="h-4 w-24 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                <div className="h-4 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                <div className="h-4 w-28 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                <div className="h-4 w-16 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              </div>
            </div>
            {/* TABLE ROWS SKELETON */}
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className={`grid grid-cols-5 gap-4 p-3 rounded ${
                    item % 2 === 0
                      ? "bg-[var(--bg)]"
                      : "bg-[var(--cards-bg)]"
                  }`}
                >
                  <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  <div className="h-4 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  <div className="h-4 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  <div className="h-6 w-24 bg-[var(--inside-card-bg)] rounded-full animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-6 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                    <div className="h-6 w-6 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashSkeleton;

