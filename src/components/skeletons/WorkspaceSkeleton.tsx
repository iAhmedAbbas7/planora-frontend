// <== IMPORTS ==>
import { JSX } from "react";

// <== DORA METRIC CARD SKELETON ==>
export const DORAMetricCardSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* ICON */}
          <div className="w-9 h-9 rounded-lg bg-[var(--light-text)]/10" />
          <div>
            {/* TITLE */}
            <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded mb-1" />
            {/* DESCRIPTION */}
            <div className="h-3 w-40 bg-[var(--light-text)]/10 rounded" />
          </div>
        </div>
        {/* RATING BADGE */}
        <div className="h-5 w-14 bg-[var(--light-text)]/10 rounded-full" />
      </div>
      {/* VALUE */}
      <div className="flex items-end justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <div className="h-7 w-16 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 w-4 bg-[var(--light-text)]/10 rounded" />
        </div>
      </div>
      {/* MINI CHART (FAKE WAVE SHAPE) */}
      <div className="h-12 relative overflow-hidden rounded">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--light-text)]/5 to-transparent" />
        <svg
          className="w-full h-full"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0,35 Q10,30 20,32 T40,28 T60,25 T80,20 T100,15 L100,40 L0,40 Z"
            fill="var(--light-text)"
            fillOpacity="0.08"
          />
          <path
            d="M0,35 Q10,30 20,32 T40,28 T60,25 T80,20 T100,15"
            fill="none"
            stroke="var(--light-text)"
            strokeOpacity="0.15"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

// <== DORA METRICS DASHBOARD SKELETON ==>
export const DORAMetricsDashboardSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-6 w-48 bg-[var(--light-text)]/10 rounded mb-2" />
          <div className="h-4 w-72 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="h-9 w-24 bg-[var(--light-text)]/10 rounded-lg" />
      </div>
      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DORAMetricCardSkeleton />
        <DORAMetricCardSkeleton />
        <DORAMetricCardSkeleton />
        <DORAMetricCardSkeleton />
      </div>
      {/* BENCHMARK GUIDE */}
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 w-36 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3 bg-[var(--hover-bg)] rounded-lg">
              <div className="h-5 w-16 bg-[var(--light-text)]/10 rounded mb-2" />
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-[var(--light-text)]/10 rounded" />
                <div className="h-3 w-full bg-[var(--light-text)]/10 rounded" />
                <div className="h-3 w-full bg-[var(--light-text)]/10 rounded" />
                <div className="h-3 w-3/4 bg-[var(--light-text)]/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// <== SPRINT PREDICTION CARD SKELETON ==>
export const SprintPredictionCardSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--light-text)]/10" />
          <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 bg-[var(--light-text)]/10 rounded-full" />
          <div className="w-7 h-7 bg-[var(--light-text)]/10 rounded-lg" />
        </div>
      </div>
      {/* PREDICTED DATE */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-[var(--light-text)]/10 rounded" />
          <div className="h-3 w-28 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="h-6 w-36 bg-[var(--light-text)]/10 rounded mb-1" />
        <div className="h-3 w-24 bg-[var(--light-text)]/10 rounded" />
      </div>
      {/* STATS */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-[var(--hover-bg)] rounded-lg p-2 sm:p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-[var(--light-text)]/10 rounded" />
            <div className="h-3 w-14 bg-[var(--light-text)]/10 rounded" />
          </div>
          <div className="h-5 w-20 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="bg-[var(--hover-bg)] rounded-lg p-2 sm:p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-[var(--light-text)]/10 rounded" />
            <div className="h-3 w-14 bg-[var(--light-text)]/10 rounded" />
          </div>
          <div className="h-5 w-16 bg-[var(--light-text)]/10 rounded" />
        </div>
      </div>
      {/* RISK FACTORS */}
      <div className="mb-3">
        <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded mb-2" />
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 bg-[var(--light-text)]/10 rounded mt-0.5" />
            <div className="h-3 w-full bg-[var(--light-text)]/10 rounded" />
          </div>
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 bg-[var(--light-text)]/10 rounded mt-0.5" />
            <div className="h-3 w-3/4 bg-[var(--light-text)]/10 rounded" />
          </div>
        </div>
      </div>
      {/* RECOMMENDATIONS */}
      <div>
        <div className="h-3 w-28 bg-[var(--light-text)]/10 rounded mb-2" />
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 bg-[var(--light-text)]/10 rounded mt-0.5" />
            <div className="h-3 w-full bg-[var(--light-text)]/10 rounded" />
          </div>
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 bg-[var(--light-text)]/10 rounded mt-0.5" />
            <div className="h-3 w-5/6 bg-[var(--light-text)]/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

// <== CODE REVIEW INSIGHTS CARD SKELETON ==>
export const CodeReviewInsightsCardSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--light-text)]/10" />
          <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 bg-[var(--light-text)]/10 rounded-full" />
          <div className="w-7 h-7 bg-[var(--light-text)]/10 rounded-lg" />
        </div>
      </div>
      {/* PR STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[var(--hover-bg)] rounded-lg p-2 sm:p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-[var(--light-text)]/10 rounded" />
              <div className="h-3 w-10 bg-[var(--light-text)]/10 rounded" />
            </div>
            <div className="h-5 w-8 bg-[var(--light-text)]/10 rounded" />
          </div>
        ))}
      </div>
      {/* INSIGHTS */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-[var(--hover-bg)] rounded-lg">
          <div className="w-6 h-6 bg-[var(--light-text)]/10 rounded-lg flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 w-24 bg-[var(--light-text)]/10 rounded mb-1" />
            <div className="h-3 w-full bg-[var(--light-text)]/10 rounded" />
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-[var(--hover-bg)] rounded-lg">
          <div className="w-6 h-6 bg-[var(--light-text)]/10 rounded-lg flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded mb-1" />
            <div className="h-3 w-5/6 bg-[var(--light-text)]/10 rounded" />
          </div>
        </div>
      </div>
      {/* SUGGESTIONS */}
      <div className="mt-4 pt-3 border-t border-[var(--border)]">
        <div className="h-3 w-24 bg-[var(--light-text)]/10 rounded mb-2" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--light-text)]/10 rounded" />
            <div className="h-3 w-full bg-[var(--light-text)]/10 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--light-text)]/10 rounded" />
            <div className="h-3 w-4/5 bg-[var(--light-text)]/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

// <== AI COPILOT TAB SKELETON ==>
export const AICopilotSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[var(--light-text)]/10" />
            <div>
              <div className="h-5 w-28 bg-[var(--light-text)]/10 rounded mb-1" />
              <div className="h-3 w-44 bg-[var(--light-text)]/10 rounded" />
            </div>
          </div>
        </div>
      </div>
      {/* QUICK ACTIONS */}
      <div className="flex flex-wrap gap-2">
        <div className="h-9 w-36 bg-[var(--light-text)]/10 rounded-lg" />
        <div className="h-9 w-40 bg-[var(--light-text)]/10 rounded-lg" />
      </div>
      {/* INSIGHTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SprintPredictionCardSkeleton />
        <CodeReviewInsightsCardSkeleton />
      </div>
    </div>
  );
};

// <== PRESENCE INDICATOR SKELETON ==>
export const PresenceIndicatorSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 w-24 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--light-text)]/10" />
          <div className="h-3 w-10 bg-[var(--light-text)]/10 rounded" />
        </div>
      </div>
      {/* STATS */}
      <div className="flex items-center gap-4 mb-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--light-text)]/10" />
          <div className="h-3 w-14 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--light-text)]/10" />
          <div className="h-3 w-12 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--light-text)]/10" />
          <div className="h-3 w-12 bg-[var(--light-text)]/10 rounded" />
        </div>
      </div>
      {/* MEMBER LIST */}
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[var(--light-text)]/10" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--cards-bg)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[var(--light-text)]/10" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-4 w-24 bg-[var(--light-text)]/10 rounded mb-1" />
              <div className="h-3 w-16 bg-[var(--light-text)]/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// <== ACTIVITY STREAM SKELETON ==>
export const ActivityStreamSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl overflow-hidden animate-pulse">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--light-text)]/10" />
          <div className="h-3 w-10 bg-[var(--light-text)]/10 rounded" />
        </div>
      </div>
      {/* ACTIVITY LIST */}
      <div className="divide-y divide-[var(--border)]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3 p-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--light-text)]/10 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-3/4 bg-[var(--light-text)]/10 rounded mb-1" />
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-[var(--light-text)]/10 rounded" />
                <div className="h-3 w-14 bg-[var(--light-text)]/10 rounded" />
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-[var(--light-text)]/10 flex-shrink-0" />
          </div>
        ))}
      </div>
      {/* MESSAGE INPUT */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--hover-bg)]/30">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-9 bg-[var(--light-text)]/10 rounded-lg" />
          <div className="w-9 h-9 bg-[var(--light-text)]/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

// <== HUDDLE BUTTON SKELETON ==>
export const HuddleButtonSkeleton = (): JSX.Element => {
  return (
    <div className="flex items-center gap-3 w-full p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-[var(--light-text)]/10" />
      <div className="flex-1">
        <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded mb-1" />
        <div className="h-3 w-36 bg-[var(--light-text)]/10 rounded" />
      </div>
      <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
    </div>
  );
};

// <== LIVE TAB SKELETON ==>
export const LiveTabSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-5 w-44 bg-[var(--light-text)]/10 rounded mb-2" />
          <div className="h-4 w-64 bg-[var(--light-text)]/10 rounded" />
        </div>
        {/* COMPACT PRESENCE */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--light-text)]/10" />
            <div className="h-3 w-14 bg-[var(--light-text)]/10 rounded" />
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[var(--light-text)]/10 border-2 border-[var(--bg)]" />
              <div className="w-8 h-8 rounded-full bg-[var(--light-text)]/10 border-2 border-[var(--bg)]" />
            </div>
          </div>
          <div className="h-8 w-20 bg-[var(--light-text)]/10 rounded-lg" />
        </div>
      </div>
      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PRESENCE PANEL */}
        <div className="lg:col-span-1">
          <PresenceIndicatorSkeleton />
        </div>
        {/* ACTIVITY STREAM */}
        <div className="lg:col-span-2">
          <ActivityStreamSkeleton />
        </div>
      </div>
      {/* QUICK HUDDLE CARD */}
      <HuddleButtonSkeleton />
    </div>
  );
};

// <== CODE LINKING TASK CARD SKELETON ==>
export const CodeLinkingTaskCardSkeleton = (): JSX.Element => {
  return (
    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--cards-bg)] animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-16 bg-[var(--hover-bg)] rounded" />
            <div className="h-5 w-20 bg-[var(--hover-bg)] rounded-full" />
          </div>
          <div className="h-4 w-3/4 bg-[var(--hover-bg)] rounded" />
        </div>
        <div className="w-2 h-2 rounded-full bg-[var(--hover-bg)] mt-2" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-3 w-8 bg-[var(--hover-bg)] rounded" />
          <div className="h-3 w-6 bg-[var(--hover-bg)] rounded" />
        </div>
        <div className="h-3 w-16 bg-[var(--hover-bg)] rounded" />
      </div>
    </div>
  );
};

// <== CODE LINKING PANEL SKELETON ==>
export const CodeLinkingPanelSkeleton = (): JSX.Element => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-pulse">
      {/* TASKS LIST */}
      <div className="flex flex-col min-h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 bg-[var(--hover-bg)] rounded" />
          {/* REFRESH ICON SKELETON */}
          <div className="h-7 w-7 bg-[var(--hover-bg)] rounded-lg" />
        </div>
        <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-[var(--border)]">
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-[var(--hover-bg)] mx-auto mb-3" />
            <div className="h-4 w-48 bg-[var(--hover-bg)] rounded mx-auto" />
          </div>
        </div>
      </div>
      {/* TASK DETAILS */}
      <div className="border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] p-4 min-h-[400px] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--hover-bg)] mx-auto mb-3" />
            <div className="h-4 w-28 bg-[var(--hover-bg)] rounded mx-auto mb-1" />
            <div className="h-3 w-48 bg-[var(--hover-bg)] rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

// <== SKELETON CARD COMPONENT (FOR WORKSPACES LIST) ==>
const SkeletonCard = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-5 animate-pulse">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AVATAR SKELETON */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--hover-bg)]" />
          <div>
            {/* NAME SKELETON */}
            <div className="h-5 w-32 bg-[var(--hover-bg)] rounded mb-1.5" />
            {/* VISIBILITY SKELETON */}
            <div className="h-3 w-20 bg-[var(--hover-bg)] rounded" />
          </div>
        </div>
        {/* ROLE BADGE SKELETON */}
        <div className="h-6 w-16 bg-[var(--hover-bg)] rounded-full" />
      </div>
      {/* DESCRIPTION SKELETON */}
      <div className="space-y-2 mb-3 sm:mb-4">
        <div className="h-3 w-full bg-[var(--hover-bg)] rounded" />
        <div className="h-3 w-3/4 bg-[var(--hover-bg)] rounded" />
      </div>
      {/* STATS SKELETON */}
      <div className="flex items-center gap-4">
        <div className="h-4 w-24 bg-[var(--hover-bg)] rounded" />
        <div className="h-4 w-20 bg-[var(--hover-bg)] rounded" />
      </div>
      {/* OWNER SKELETON */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[var(--hover-bg)]" />
          <div className="h-3 w-28 bg-[var(--hover-bg)] rounded" />
        </div>
      </div>
    </div>
  );
};

// <== STAT CARD SKELETON (FOR WORKSPACE DETAIL) ==>
const StatCardSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-3 sm:p-5 animate-pulse">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[var(--hover-bg)]" />
        <div>
          <div className="h-6 sm:h-7 w-8 bg-[var(--hover-bg)] rounded mb-1" />
          <div className="h-3 sm:h-4 w-16 sm:w-20 bg-[var(--hover-bg)] rounded" />
        </div>
      </div>
    </div>
  );
};

// <== WORKSPACE SKELETON COMPONENT (FOR LIST PAGE) ==>
const WorkspaceSkeleton = (): JSX.Element => {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* HEADER SKELETON */}
      <div className="p-4 md:p-6 pb-0">
        <div className="flex items-center justify-between mb-2">
          <div className="h-8 w-40 bg-[var(--hover-bg)] rounded animate-pulse" />
          <div className="h-9 w-32 bg-[var(--hover-bg)] rounded-lg animate-pulse" />
        </div>
        <div className="h-4 w-72 bg-[var(--hover-bg)] rounded animate-pulse mb-6" />
      </div>
      {/* CONTENT */}
      <div className="p-4 md:p-6">
        {/* HEADER ROW SKELETON */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-36 bg-[var(--hover-bg)] rounded animate-pulse" />
          <div className="h-9 w-36 bg-[var(--hover-bg)] rounded-lg animate-pulse" />
        </div>
        {/* CARDS GRID SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

// <== DX SCORE CARD SKELETON ==>
const DXScoreCardSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="h-4 w-20 bg-[var(--light-text)]/10 rounded mb-2" />
          <div className="flex items-baseline gap-2">
            <div className="h-10 w-16 bg-[var(--light-text)]/10 rounded" />
            <div className="h-4 w-8 bg-[var(--light-text)]/10 rounded" />
          </div>
        </div>
        <div className="h-6 w-20 bg-[var(--light-text)]/10 rounded-full" />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
        <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded" />
              <div className="h-3 w-8 bg-[var(--light-text)]/10 rounded" />
            </div>
            <div className="h-2 bg-[var(--light-text)]/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

// <== RADAR CHART SKELETON ==>
const RadarChartSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
        <div className="h-4 w-40 bg-[var(--light-text)]/10 rounded" />
      </div>
      <div className="h-64 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border-2 border-dashed border-[var(--light-text)]/10 relative">
          <div className="absolute inset-4 rounded-full border border-[var(--light-text)]/5" />
          <div className="absolute inset-8 rounded-full border border-[var(--light-text)]/5" />
          <div className="absolute inset-12 rounded-full border border-[var(--light-text)]/5" />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, var(--light-text) 0%, transparent 25%, transparent 75%, var(--light-text) 100%)",
              opacity: 0.05,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// <== RECOMMENDATIONS SKELETON ==>
const RecommendationsSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
        <div className="h-4 w-36 bg-[var(--light-text)]/10 rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 rounded-lg bg-[var(--hover-bg)]/30 border border-[var(--border)]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--light-text)]/10 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded" />
                  <div className="h-4 w-12 bg-[var(--light-text)]/10 rounded" />
                </div>
                <div className="h-3 w-full bg-[var(--light-text)]/10 rounded mb-1" />
                <div className="h-3 w-3/4 bg-[var(--light-text)]/10 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// <== LEADERBOARD SKELETON ==>
const LeaderboardSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 w-24 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--hover-bg)]/30">
            <div className="w-8 h-8 rounded-full bg-[var(--light-text)]/10" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-[var(--light-text)]/10" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-[var(--light-text)]/10 rounded mb-1" />
                  <div className="h-3 w-32 bg-[var(--light-text)]/10 rounded" />
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-6 w-12 bg-[var(--light-text)]/10 rounded mb-1" />
              <div className="h-3 w-8 bg-[var(--light-text)]/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// <== ACHIEVEMENTS SKELETON ==>
const AchievementsSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 w-24 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="h-3 w-16 bg-[var(--light-text)]/10 rounded" />
      </div>
      <div className="mb-4">
        <div className="h-3 w-16 bg-[var(--light-text)]/10 rounded mb-3" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-12 h-12 rounded-xl bg-[var(--light-text)]/10" />
          ))}
        </div>
      </div>
      <div>
        <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded mb-3" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-12 h-12 rounded-xl bg-[var(--light-text)]/10" />
          ))}
        </div>
      </div>
    </div>
  );
};

// <== DX SCORE TAB SKELETON ==>
export const DXScoreTabSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-[var(--light-text)]/10 rounded" />
            <div className="h-5 w-44 bg-[var(--light-text)]/10 rounded" />
          </div>
          <div className="h-4 w-56 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PERIOD DROPDOWN SKELETON */}
          <div className="h-8 sm:h-9 w-20 sm:w-28 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg" />
          {/* SYNC BUTTON SKELETON */}
          <div className="h-8 sm:h-9 w-10 sm:w-16 bg-[var(--accent-color)]/30 rounded-lg" />
        </div>
      </div>
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <DXScoreCardSkeleton />
        <RadarChartSkeleton />
        <RecommendationsSkeleton />
      </div>
      {/* STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--light-text)]/10" />
              <div className="h-3 w-8 bg-[var(--light-text)]/10 rounded" />
            </div>
            <div className="h-7 w-12 bg-[var(--light-text)]/10 rounded mb-1" />
            <div className="h-3 w-16 bg-[var(--light-text)]/10 rounded" />
          </div>
        ))}
      </div>
      {/* ACTIVITY TREND */}
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="h-48 relative">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--light-text)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--light-text)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path
              d="M0,35 Q10,30 20,28 T40,22 T60,18 T80,15 T100,12 L100,40 L0,40 Z"
              fill="url(#areaGradient)"
            />
            <path
              d="M0,35 Q10,30 20,28 T40,22 T60,18 T80,15 T100,12"
              fill="none"
              stroke="var(--light-text)"
              strokeOpacity="0.15"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
      {/* LEADERBOARD AND ACHIEVEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeaderboardSkeleton />
        <AchievementsSkeleton />
      </div>
    </div>
  );
};

// <== WORKSPACE DETAIL SKELETON COMPONENT ==>
export const WorkspaceDetailSkeleton = (): JSX.Element => {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* HEADER SKELETON */}
      <div className="p-4 md:p-6 pb-0">
        <div className="flex items-center justify-between mb-2">
          <div className="h-8 w-40 bg-[var(--hover-bg)] rounded animate-pulse" />
        </div>
        <div className="h-4 w-48 bg-[var(--hover-bg)] rounded animate-pulse mb-6" />
      </div>
      {/* WORKSPACE HEADER SKELETON */}
      <div className="p-4 md:p-6 border-b border-[var(--border)]">
        {/* BACK BUTTON */}
        <div className="h-4 w-32 bg-[var(--hover-bg)] rounded animate-pulse mb-4" />
        <div className="flex items-start gap-4">
          {/* AVATAR */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[var(--hover-bg)] animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            {/* TITLE ROW */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <div className="h-6 sm:h-7 w-40 bg-[var(--hover-bg)] rounded animate-pulse" />
              <div className="h-5 w-5 bg-[var(--hover-bg)] rounded animate-pulse" />
              <div className="h-6 w-16 bg-[var(--hover-bg)] rounded-full animate-pulse" />
            </div>
            {/* DESCRIPTION */}
            <div className="h-4 w-64 bg-[var(--hover-bg)] rounded animate-pulse mb-2" />
            {/* STATS */}
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-[var(--hover-bg)] rounded animate-pulse" />
              <div className="h-4 w-16 bg-[var(--hover-bg)] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      {/* TABS SKELETON */}
      <div className="border-b border-[var(--border)]">
        <div className="flex gap-4 px-4 md:px-6 py-3">
          <div className="h-5 w-20 bg-[var(--hover-bg)] rounded animate-pulse" />
          <div className="h-5 w-24 bg-[var(--hover-bg)] rounded animate-pulse" />
          <div className="h-5 w-16 bg-[var(--hover-bg)] rounded animate-pulse" />
        </div>
      </div>
      {/* CONTENT SKELETON */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSkeleton;
