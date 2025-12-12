// <== IMPORTS ==>
import { JSX } from "react";

// <== DEPENDENCY SKELETON COMPONENT ==>
const DependencySkeleton = (): JSX.Element => {
  // RETURNING THE DEPENDENCY SKELETON COMPONENT
  return (
    // DEPENDENCY SKELETON MAIN CONTAINER
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* PAGE HEADER SKELETON */}
      <div
        className="sticky top-0 z-40 m-0 p-4 pt-2 pb-2 flex justify-between items-center backdrop-blur-[var(--blur)] bg-[var(--glass-bg)] border-b border-[var(--border)]"
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--text-primary)",
        }}
      >
        {/* LEFT SECTION - TITLE */}
        <div className="flex items-center gap-3">
          <div>
            {/* PAGE TITLE SKELETON */}
            <div className="h-6 sm:h-8 w-40 bg-[var(--cards-bg)] rounded-lg animate-pulse mb-1" />
            {/* PAGE SUBTITLE SKELETON */}
            <div className="h-3 sm:h-4 w-72 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
          </div>
        </div>
        {/* RIGHT SECTION - ACTIONS SKELETON */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-9 w-9 bg-[var(--cards-bg)] rounded-full animate-pulse" />
        </div>
      </div>
      {/* CONTENT SECTION */}
      <div className="p-4">
        {/* TOP BAR SKELETON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          {/* LEFT SIDE INFO SKELETON */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
            <div>
              <div className="h-4 w-32 bg-[var(--cards-bg)] rounded animate-pulse mb-1" />
              <div className="h-3 w-48 bg-[var(--cards-bg)] rounded animate-pulse" />
            </div>
          </div>
          {/* RIGHT SIDE DROPDOWN SKELETON */}
          <div className="h-10 w-36 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
        </div>

        {/* GRAPH CONTAINER SKELETON */}
        <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
          {/* GRAPH HEADER BAR SKELETON */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-[var(--border)]">
            {/* LEFT - TITLE SKELETON */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              <div className="h-4 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              <div className="h-4 w-16 bg-[var(--inside-card-bg)] rounded animate-pulse" />
            </div>
            {/* RIGHT - STATS SKELETON */}
            <div className="flex flex-wrap items-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--inside-card-bg)] animate-pulse" />
                  <div className="h-3 w-16 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          {/* GRAPH AREA SKELETON */}
          <div className="h-[500px] relative p-4">
            {/* FAKE NODES */}
            <div className="absolute top-8 left-8">
              <div className="w-40 h-20 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
            </div>
            <div className="absolute top-8 left-60">
              <div className="w-40 h-20 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
            </div>
            <div className="absolute top-8 right-8">
              <div className="w-40 h-20 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
            </div>
            <div className="absolute top-40 left-20">
              <div className="w-40 h-20 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
            </div>
            <div className="absolute top-40 left-72">
              <div className="w-40 h-20 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
            </div>
            <div className="absolute bottom-20 left-8">
              <div className="w-40 h-20 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
            </div>
            <div className="absolute bottom-20 left-60">
              <div className="w-40 h-20 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
            </div>
            {/* FAKE EDGES - LINES */}
            <div className="absolute top-[88px] left-[168px] w-16 h-0.5 bg-[var(--inside-card-bg)] animate-pulse" />
            <div className="absolute top-[88px] left-[400px] w-24 h-0.5 bg-[var(--inside-card-bg)] animate-pulse" />
            <div className="absolute top-[120px] left-[100px] w-0.5 h-16 bg-[var(--inside-card-bg)] animate-pulse" />
            <div className="absolute top-[120px] left-[340px] w-0.5 h-16 bg-[var(--inside-card-bg)] animate-pulse" />
            {/* CONTROLS SKELETON - BOTTOM LEFT */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <div className="h-8 w-24 bg-[var(--bg)] border border-[var(--border)] rounded-lg animate-pulse" />
              <div className="h-8 w-20 bg-[var(--bg)] border border-[var(--border)] rounded-lg animate-pulse" />
            </div>
            {/* CONTROLS SKELETON - BOTTOM RIGHT */}
            <div className="absolute bottom-4 right-4">
              <div className="h-32 w-24 bg-[var(--bg)] border border-[var(--border)] rounded-lg animate-pulse" />
            </div>
            {/* MINIMAP SKELETON */}
            <div className="absolute bottom-40 right-4">
              <div className="h-24 w-32 bg-[var(--bg)] border border-[var(--border)] rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
        {/* TIPS SECTION SKELETON */}
        <div className="mt-4 p-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded animate-pulse" />
            <div className="h-4 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-3 h-3 mt-0.5 rounded bg-[var(--inside-card-bg)] animate-pulse shrink-0" />
                <div className="h-3 w-full bg-[var(--inside-card-bg)] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DependencySkeleton;
