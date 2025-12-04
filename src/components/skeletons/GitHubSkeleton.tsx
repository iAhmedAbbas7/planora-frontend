// <== IMPORTS ==>
import { JSX } from "react";

// <== GITHUB SKELETON COMPONENT ==>
const GitHubSkeleton = (): JSX.Element => {
  // RETURNING THE GITHUB SKELETON COMPONENT
  return (
    // GITHUB SKELETON MAIN CONTAINER
    <div className="m-4 space-y-4 animate-pulse">
      {/* HEADER SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-[var(--cards-bg)] rounded-2xl border border-[var(--border)]">
        <div className="flex items-center gap-3">
          {/* AVATAR SKELETON */}
          <div className="w-12 h-12 bg-[var(--inside-card-bg)] rounded-full"></div>
          <div>
            {/* NAME SKELETON */}
            <div className="h-5 w-32 bg-[var(--inside-card-bg)] rounded-md mb-2"></div>
            {/* STATS SKELETON */}
            <div className="h-4 w-48 bg-[var(--inside-card-bg)] rounded-md"></div>
          </div>
        </div>
        {/* FILTERS SKELETON */}
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-[var(--inside-card-bg)] rounded-lg"></div>
          <div className="h-10 w-28 bg-[var(--inside-card-bg)] rounded-lg"></div>
        </div>
      </div>
      {/* SEARCH SKELETON */}
      <div className="h-12 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]"></div>
      {/* REPOSITORIES GRID SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* REPOSITORY CARD SKELETONS */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] space-y-3"
          >
            {/* REPO NAME SKELETON */}
            <div className="h-5 w-3/4 bg-[var(--inside-card-bg)] rounded-md"></div>
            {/* REPO DESCRIPTION SKELETON */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-[var(--inside-card-bg)] rounded-md"></div>
              <div className="h-4 w-2/3 bg-[var(--inside-card-bg)] rounded-md"></div>
            </div>
            {/* REPO STATS SKELETON */}
            <div className="flex items-center gap-4 pt-2">
              <div className="h-4 w-16 bg-[var(--inside-card-bg)] rounded-md"></div>
              <div className="h-4 w-16 bg-[var(--inside-card-bg)] rounded-md"></div>
              <div className="h-4 w-16 bg-[var(--inside-card-bg)] rounded-md"></div>
            </div>
            {/* REPO FOOTER SKELETON */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
              <div className="h-4 w-20 bg-[var(--inside-card-bg)] rounded-md"></div>
              <div className="h-4 w-24 bg-[var(--inside-card-bg)] rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitHubSkeleton;
