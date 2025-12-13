// <== IMPORTS ==>
import { JSX } from "react";

// <== STAT CARD SKELETON ==>
const StatCardSkeleton = (): JSX.Element => (
  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
    <div className="flex items-center gap-3">
      {/* ICON */}
      <div className="w-10 h-10 bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
      {/* CONTENT */}
      <div className="flex-1">
        <div className="h-6 w-16 bg-[var(--light-text)]/10 rounded mb-1 animate-pulse" />
        <div className="h-3 w-24 bg-[var(--light-text)]/10 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

// <== CHART SKELETON ==>
const ChartSkeleton = ({ height = 200 }: { height?: number }): JSX.Element => (
  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
    {/* HEADER */}
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded animate-pulse" />
      <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded animate-pulse" />
    </div>
    {/* CHART AREA */}
    <div
      className="flex items-end justify-between gap-2 px-4"
      style={{ height: `${height}px` }}
    >
      {[40, 65, 45, 80, 55, 70, 50, 60, 75, 45].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-[var(--light-text)]/10 rounded-t animate-pulse"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
);

// <== PIE CHART SKELETON ==>
const PieChartSkeleton = (): JSX.Element => (
  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
    {/* HEADER */}
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded animate-pulse" />
      <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded animate-pulse" />
    </div>
    {/* PIE CHART */}
    <div className="flex items-center justify-center py-4">
      <div className="w-32 h-32 rounded-full bg-[var(--light-text)]/10 animate-pulse" />
    </div>
    {/* LEGEND */}
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--light-text)]/10 animate-pulse" />
          <div className="h-3 w-14 bg-[var(--light-text)]/10 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

// <== INSIGHT CARD SKELETON ==>
const InsightCardSkeleton = (): JSX.Element => (
  <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
    {/* HEADER */}
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded animate-pulse" />
      <div className="h-4 w-36 bg-[var(--light-text)]/10 rounded animate-pulse" />
    </div>
    {/* CONTENT - 3 INSIGHT BOXES */}
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-3 rounded-lg bg-[var(--inside-card-bg)]"
        >
          <div className="h-3 w-28 bg-[var(--light-text)]/10 rounded mb-2 animate-pulse" />
          <div className="h-5 w-20 bg-[var(--light-text)]/10 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

// <== REPORTS PAGE SKELETON ==>
export const ReportsSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* CHARTS ROW 1 - DAILY COMPLETION & VELOCITY */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartSkeleton height={220} />
        <ChartSkeleton height={220} />
      </div>

      {/* CHARTS ROW 2 - PIE CHARTS & INSIGHTS */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* PRIORITY DISTRIBUTION */}
        <PieChartSkeleton />
        {/* PROJECT DISTRIBUTION - LIST STYLE */}
        <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
            <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-[var(--inside-card-bg)]"
              >
                <div className="h-4 w-24 bg-[var(--light-text)]/10 rounded" />
                <div className="h-4 w-8 bg-[var(--light-text)]/10 rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* PRODUCTIVITY INSIGHTS */}
        <InsightCardSkeleton />
      </div>

      {/* FOCUS SESSION STATS */}
      <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="text-center p-3 rounded-lg bg-[var(--inside-card-bg)]"
            >
              <div className="h-7 w-12 bg-[var(--light-text)]/10 rounded mx-auto mb-1" />
              <div className="h-3 w-16 bg-[var(--light-text)]/10 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* DATE RANGE */}
      <div className="flex justify-center">
        <div className="h-3 w-56 bg-[var(--light-text)]/10 rounded" />
      </div>
    </div>
  );
};

// <== PROJECT REPORT SKELETON ==>
export const ProjectReportSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* PROJECT INFO HEADER */}
      <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* PROJECT TITLE & DESCRIPTION */}
          <div className="flex-1">
            <div className="h-6 w-48 bg-[var(--light-text)]/10 rounded mb-2" />
            <div className="h-4 w-64 bg-[var(--light-text)]/10 rounded" />
          </div>
          {/* STATUS & DUE DATE */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 bg-[var(--light-text)]/10 rounded-full" />
            <div className="h-4 w-24 bg-[var(--light-text)]/10 rounded" />
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* PROGRESS BAR */}
      <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
            <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded" />
          </div>
          <div className="h-5 w-12 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="w-full h-3 bg-[var(--light-text)]/10 rounded-full" />
        <div className="h-3 w-32 bg-[var(--light-text)]/10 rounded mt-2" />
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartSkeleton height={220} />
        <ChartSkeleton height={220} />
      </div>

      {/* CHARTS ROW 2 - PIE CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <PieChartSkeleton />
        <PieChartSkeleton />
      </div>

      {/* DATE RANGE */}
      <div className="flex justify-center">
        <div className="h-3 w-56 bg-[var(--light-text)]/10 rounded" />
      </div>
    </div>
  );
};

// <== WORKSPACE REPORT SKELETON ==>
export const WorkspaceReportSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* WORKSPACE INFO HEADER */}
      <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* WORKSPACE NAME & DESCRIPTION */}
          <div className="flex-1">
            <div className="h-6 w-44 bg-[var(--light-text)]/10 rounded mb-2" />
            <div className="h-4 w-56 bg-[var(--light-text)]/10 rounded" />
          </div>
          {/* VISIBILITY, MEMBERS, PROJECTS */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-16 bg-[var(--light-text)]/10 rounded-full" />
            <div className="h-4 w-20 bg-[var(--light-text)]/10 rounded" />
            <div className="h-4 w-20 bg-[var(--light-text)]/10 rounded" />
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* CHARTS ROW */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartSkeleton height={220} />
        <PieChartSkeleton />
      </div>

      {/* MEMBER CONTRIBUTIONS */}
      <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 w-36 bg-[var(--light-text)]/10 rounded" />
        </div>
        {/* MEMBER ROWS */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--inside-card-bg)]"
            >
              {/* RANK */}
              <div className="w-6 h-6 rounded-full bg-[var(--light-text)]/10" />
              {/* AVATAR */}
              <div className="w-8 h-8 rounded-full bg-[var(--light-text)]/10" />
              {/* NAME */}
              <div className="flex-1">
                <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded mb-1" />
                <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded" />
              </div>
              {/* STATS */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="h-4 w-8 bg-[var(--light-text)]/10 rounded mb-1" />
                  <div className="h-3 w-10 bg-[var(--light-text)]/10 rounded" />
                </div>
                <div className="text-right">
                  <div className="h-4 w-6 bg-[var(--light-text)]/10 rounded mb-1" />
                  <div className="h-3 w-8 bg-[var(--light-text)]/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DATE RANGE */}
      <div className="flex justify-center">
        <div className="h-3 w-56 bg-[var(--light-text)]/10 rounded" />
      </div>
    </div>
  );
};

// <== OVERVIEW SKELETON ==>
export const ReportsOverviewSkeleton = (): JSX.Element => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4"
        >
          <div className="h-8 w-12 bg-[var(--light-text)]/10 rounded mb-2" />
          <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded" />
        </div>
      ))}
    </div>
  );
};

export default ReportsSkeleton;

