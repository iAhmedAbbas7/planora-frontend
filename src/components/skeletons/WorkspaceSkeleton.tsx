// <== IMPORTS ==>
import { JSX } from "react";

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
