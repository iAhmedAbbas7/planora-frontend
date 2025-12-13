// <== IMPORTS ==>
import { JSX } from "react";

// <== SESSION CARD SKELETON ==>
const SessionCardSkeleton = (): JSX.Element => (
  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-3 sm:p-4">
    {/* CARD HEADER */}
    <div className="flex items-start gap-3">
      {/* ICON */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[var(--light-text)]/10 rounded-lg flex-shrink-0" />
      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <div className="h-4 w-3/4 bg-[var(--light-text)]/10 rounded mb-1.5" />
        <div className="h-3 w-1/2 bg-[var(--light-text)]/10 rounded" />
      </div>
      {/* STATUS BADGE */}
      <div className="h-5 w-16 bg-[var(--light-text)]/10 rounded-full flex-shrink-0" />
    </div>
    {/* CARD STATS */}
    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 bg-[var(--light-text)]/10 rounded" />
        <div className="h-4 w-12 bg-[var(--light-text)]/10 rounded" />
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
        <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded" />
      </div>
      <div className="ml-auto">
        <div className="h-5 w-14 bg-[var(--light-text)]/10 rounded" />
      </div>
    </div>
  </div>
);

// <== STAT CARD SKELETON ==>
const StatCardSkeleton = (): JSX.Element => (
  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 bg-[var(--light-text)]/10 rounded-lg" />
    </div>
    <div className="h-7 w-16 bg-[var(--light-text)]/10 rounded mb-1.5" />
    <div className="h-3 w-24 bg-[var(--light-text)]/10 rounded" />
  </div>
);

// <== CHART SKELETON ==>
const ChartSkeleton = (): JSX.Element => (
  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
      <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded" />
    </div>
    <div className="h-[200px] flex items-end justify-between gap-2 px-4">
      {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-[var(--light-text)]/10 rounded-t"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
);

// <== FOCUS PAGE SKELETON ==>
const FocusSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* TABS SKELETON */}
      <div className="flex items-center gap-1 p-1 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] w-full sm:w-fit overflow-x-auto">
        <div className="flex-1 sm:flex-none h-10 w-full sm:w-32 bg-[var(--light-text)]/10 rounded-lg" />
        <div className="flex-1 sm:flex-none h-10 w-full sm:w-24 bg-[var(--light-text)]/10 rounded-lg" />
        <div className="flex-1 sm:flex-none h-10 w-full sm:w-28 bg-[var(--light-text)]/10 rounded-lg" />
      </div>
      {/* START SESSION FORM SKELETON */}
      <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4 sm:p-6">
        <div className="max-w-md mx-auto space-y-5 sm:space-y-6">
          {/* SESSION TITLE FIELD */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
              <div className="h-4 w-36 bg-[var(--light-text)]/10 rounded" />
            </div>
            <div className="h-12 bg-[var(--light-text)]/10 rounded-xl" />
          </div>
          {/* TASK SELECTOR FIELD */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
              <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded" />
            </div>
            <div className="h-12 bg-[var(--light-text)]/10 rounded-xl" />
          </div>
          {/* DURATION SELECTOR */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
              <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded" />
            </div>
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`h-10 bg-[var(--light-text)]/10 rounded-lg sm:flex-1 ${
                    i > 3 ? "hidden sm:block" : ""
                  }`}
                />
              ))}
            </div>
          </div>
          {/* POMODORO TOGGLE */}
          <div className="flex items-center justify-between p-4 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[var(--light-text)]/10 rounded" />
              <div>
                <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded mb-1" />
                <div className="h-3 w-36 bg-[var(--light-text)]/10 rounded" />
              </div>
            </div>
            <div className="w-12 h-6 bg-[var(--light-text)]/10 rounded-full" />
          </div>
          {/* START BUTTON */}
          <div className="h-14 bg-[var(--light-text)]/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

// <== HISTORY SKELETON ==>
export const FocusHistorySkeleton = (): JSX.Element => (
  <div className="space-y-4 animate-pulse">
    {/* SESSION COUNT */}
    <div className="flex items-center justify-between px-1">
      <div className="h-4 w-40 bg-[var(--light-text)]/10 rounded" />
    </div>
    {/* SESSION CARDS GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SessionCardSkeleton key={i} />
      ))}
    </div>
    {/* PAGINATION */}
    <div className="flex items-center justify-center gap-2 pt-2">
      <div className="w-9 h-9 bg-[var(--light-text)]/10 rounded-lg" />
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-8 h-8 bg-[var(--light-text)]/10 rounded-lg"
          />
        ))}
      </div>
      <div className="w-9 h-9 bg-[var(--light-text)]/10 rounded-lg" />
    </div>
  </div>
);

// <== STATS SKELETON ==>
export const FocusStatsSkeleton = (): JSX.Element => (
  <div className="space-y-6 animate-pulse">
    {/* PERIOD SELECTOR */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="h-6 w-36 bg-[var(--light-text)]/10 rounded" />
      <div className="flex items-center gap-1 p-1 bg-[var(--hover-bg)] rounded-lg w-fit">
        <div className="h-8 w-16 bg-[var(--light-text)]/10 rounded-md" />
        <div className="h-8 w-16 bg-[var(--light-text)]/10 rounded-md" />
        <div className="h-8 w-16 bg-[var(--light-text)]/10 rounded-md" />
      </div>
    </div>
    {/* SUMMARY CARDS */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {[1, 2, 3, 4].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    {/* CHARTS */}
    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
    {/* BREAKDOWN */}
    <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
      <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[var(--light-text)]/10 rounded" />
            <div>
              <div className="h-5 w-10 bg-[var(--light-text)]/10 rounded mb-1" />
              <div className="h-3 w-16 bg-[var(--light-text)]/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FocusSkeleton;
