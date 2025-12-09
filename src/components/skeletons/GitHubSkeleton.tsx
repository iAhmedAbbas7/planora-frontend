// <== IMPORTS ==>
import { JSX } from "react";

// <== REPOSITORY CARD SKELETON COMPONENT ==>
const RepoCardSkeleton = (): JSX.Element => {
  return (
    <div className="p-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {/* REPO NAME */}
            <div className="h-5 w-32 bg-[var(--light-text)]/10 rounded-md" />
            {/* BADGE */}
            <div className="h-5 w-16 bg-[var(--light-text)]/10 rounded-full" />
          </div>
          {/* FULL NAME */}
          <div className="h-3 w-40 bg-[var(--light-text)]/10 rounded" />
        </div>
      </div>
      {/* DESCRIPTION */}
      <div className="mb-3 min-h-[40px] space-y-1.5">
        <div className="h-3.5 w-full bg-[var(--light-text)]/10 rounded" />
        <div className="h-3.5 w-2/3 bg-[var(--light-text)]/10 rounded" />
      </div>
      {/* STATS */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[var(--light-text)]/10" />
          <div className="h-3 w-14 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="h-3 w-10 bg-[var(--light-text)]/10 rounded" />
        <div className="h-3 w-10 bg-[var(--light-text)]/10 rounded" />
      </div>
      {/* FOOTER */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
        <div className="h-3 w-16 bg-[var(--light-text)]/10 rounded" />
        <div className="h-3 w-24 bg-[var(--light-text)]/10 rounded" />
      </div>
    </div>
  );
};

// <== ACTIVITY ITEM SKELETON COMPONENT ==>
const ActivityItemSkeleton = (): JSX.Element => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg">
      {/* ICON */}
      <div className="w-8 h-8 bg-[var(--light-text)]/10 rounded-lg flex-shrink-0" />
      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-[var(--light-text)]/10 rounded w-3/4 mb-1.5" />
        <div className="h-3 bg-[var(--light-text)]/10 rounded w-full mb-1.5" />
        <div className="flex items-center gap-2">
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-12" />
        </div>
      </div>
    </div>
  );
};

// <== GITHUB SKELETON COMPONENT ==>
const GitHubSkeleton = (): JSX.Element => {
  // RETURNING THE GITHUB SKELETON COMPONENT
  return (
    <div className="space-y-4 animate-pulse">
      {/* TABS SKELETON */}
      <div className="flex items-center gap-1 p-1.5 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
        <div className="flex-1 h-10 bg-[var(--light-text)]/10 rounded-lg" />
        <div className="flex-1 h-10 bg-[var(--light-text)]/10 rounded-lg" />
        <div className="flex-1 h-10 bg-[var(--light-text)]/10 rounded-lg" />
      </div>
      {/* FILTERS AND SEARCH SKELETON */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
        {/* SEARCH */}
        <div className="relative flex-1 h-9 bg-[var(--light-text)]/10 rounded-lg" />
        {/* FILTER BUTTONS */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-[var(--light-text)]/10 rounded-lg" />
          <div className="h-9 w-24 bg-[var(--light-text)]/10 rounded-lg" />
        </div>
      </div>
      {/* REPOSITORIES GRID SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <RepoCardSkeleton key={i} />
        ))}
      </div>
      {/* PAGINATION SKELETON */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
        <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 bg-[var(--light-text)]/10 rounded-lg" />
          <div className="h-8 w-16 bg-[var(--light-text)]/10 rounded-lg" />
          <div className="h-8 w-16 bg-[var(--light-text)]/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

// <== GITHUB PAGE FULL SKELETON COMPONENT ==>
export const GitHubPageSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* PROFILE & ACTIONS SECTION SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[var(--cards-bg)] rounded-2xl border border-[var(--border)]">
        {/* PROFILE INFO */}
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="w-12 h-12 bg-[var(--light-text)]/10 rounded-full" />
          <div>
            {/* NAME WITH ICON */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-28 bg-[var(--light-text)]/10 rounded-md" />
              <div className="h-4 w-4 bg-[var(--light-text)]/10 rounded" />
            </div>
            {/* FOLLOWERS/FOLLOWING */}
            <div className="flex items-center gap-4">
              <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded" />
              <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded" />
            </div>
          </div>
        </div>
        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-[var(--light-text)]/10 rounded-lg" />
          <div className="h-9 w-9 bg-[var(--light-text)]/10 rounded-lg" />
        </div>
      </div>
      {/* STATS CARDS SKELETON */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="h-3 bg-[var(--light-text)]/10 rounded w-16 mb-2" />
                <div className="h-7 bg-[var(--light-text)]/10 rounded w-12 mb-2" />
                <div className="h-3 bg-[var(--light-text)]/10 rounded w-28" />
              </div>
              <div className="w-10 h-10 bg-[var(--light-text)]/10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      {/* MAIN CONTENT GRID SKELETON */}
      <div className="grid lg:grid-cols-4 gap-4">
        {/* REPOSITORIES SECTION */}
        <div className="lg:col-span-3 space-y-4">
          {/* TABS SKELETON */}
          <div className="flex items-center gap-1 p-1.5 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
            <div className="flex-1 h-10 bg-[var(--light-text)]/10 rounded-lg" />
            <div className="flex-1 h-10 bg-[var(--light-text)]/10 rounded-lg" />
            <div className="flex-1 h-10 bg-[var(--light-text)]/10 rounded-lg" />
          </div>
          {/* FILTERS AND SEARCH SKELETON */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
            <div className="relative flex-1 h-9 bg-[var(--light-text)]/10 rounded-lg" />
            <div className="flex items-center gap-2">
              <div className="h-9 w-24 bg-[var(--light-text)]/10 rounded-lg" />
              <div className="h-9 w-24 bg-[var(--light-text)]/10 rounded-lg" />
            </div>
          </div>
          {/* REPOSITORIES GRID SKELETON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RepoCardSkeleton key={i} />
            ))}
          </div>
          {/* PAGINATION SKELETON */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
            <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 bg-[var(--light-text)]/10 rounded-lg" />
              <div className="h-8 w-16 bg-[var(--light-text)]/10 rounded-lg" />
              <div className="h-8 w-16 bg-[var(--light-text)]/10 rounded-lg" />
            </div>
          </div>
        </div>
        {/* ACTIVITY SIDEBAR SKELETON */}
        <div className="lg:col-span-1 space-y-4">
          {/* MOBILE TOGGLE (HIDDEN ON DESKTOP) */}
          <div className="lg:hidden h-12 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]" />
          {/* ACTIVITY PANEL */}
          <div className="hidden lg:block bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
                <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded" />
              </div>
              <div className="w-5 h-5 bg-[var(--light-text)]/10 rounded" />
            </div>
            {/* ACTIVITY LIST */}
            <div className="p-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <ActivityItemSkeleton key={i} />
              ))}
            </div>
            {/* VIEW ALL LINK */}
            <div className="p-3 border-t border-[var(--border)]">
              <div className="h-3 w-28 bg-[var(--light-text)]/10 rounded mx-auto" />
            </div>
          </div>
          {/* TOP LANGUAGES SKELETON */}
          <div className="hidden lg:block bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
              <div className="h-4 w-24 bg-[var(--light-text)]/10 rounded" />
            </div>
            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-3.5 w-20 bg-[var(--light-text)]/10 rounded" />
                  <div className="h-3 w-14 bg-[var(--light-text)]/10 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubSkeleton;
