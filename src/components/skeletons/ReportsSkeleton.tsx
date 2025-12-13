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
    <div className="flex items-center gap-2 mb-3">
      <div className="w-5 h-5 bg-[var(--light-text)]/10 rounded animate-pulse" />
      <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded animate-pulse" />
    </div>
    {/* CONTENT */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-3 w-28 bg-[var(--light-text)]/10 rounded animate-pulse" />
        <div className="h-5 w-16 bg-[var(--light-text)]/10 rounded animate-pulse" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 bg-[var(--light-text)]/10 rounded animate-pulse" />
        <div className="h-5 w-14 bg-[var(--light-text)]/10 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

// <== REPORTS PAGE SKELETON ==>
export const ReportsSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-7 w-48 bg-[var(--light-text)]/10 rounded" />
        <div className="flex items-center gap-2">
          <div className="h-9 w-20 bg-[var(--light-text)]/10 rounded-lg" />
          <div className="h-9 w-20 bg-[var(--light-text)]/10 rounded-lg" />
          <div className="h-9 w-24 bg-[var(--light-text)]/10 rounded-lg" />
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
        <ChartSkeleton height={220} />
      </div>

      {/* SECOND ROW */}
      <div className="grid md:grid-cols-3 gap-6">
        <PieChartSkeleton />
        <PieChartSkeleton />
        <InsightCardSkeleton />
      </div>

      {/* VELOCITY CHART */}
      <ChartSkeleton height={180} />
    </div>
  );
};

// <== PROJECT REPORT SKELETON ==>
export const ProjectReportSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* PROJECT HEADER */}
      <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[var(--light-text)]/10 rounded-lg" />
          <div className="flex-1">
            <div className="h-5 w-48 bg-[var(--light-text)]/10 rounded mb-2" />
            <div className="h-3 w-32 bg-[var(--light-text)]/10 rounded" />
          </div>
          <div className="h-8 w-24 bg-[var(--light-text)]/10 rounded-lg" />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartSkeleton height={240} />
        <PieChartSkeleton />
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

