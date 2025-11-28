// <== IMPORTS ==>
import { JSX } from "react";

// <== SECURITY SKELETON COMPONENT ==>
const SecuritySkeleton = (): JSX.Element => {
  // RETURNING THE SECURITY SKELETON COMPONENT
  return (
    // SECURITY MAIN CONTAINER SKELETON
    <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-6 shadow-sm">
      {/* HEADER SECTION SKELETON */}
      <div>
        {/* TITLE SKELETON */}
        <div className="h-7 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse mb-2" />
        {/* DESCRIPTION SKELETON */}
        <div className="h-4 w-96 bg-[var(--inside-card-bg)] rounded animate-pulse" />
      </div>
      {/* STATUS SECTION SKELETON */}
      <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
        <div className="flex items-center gap-3">
          {/* SHIELD ICON SKELETON */}
          <div className="w-6 h-6 bg-[var(--inside-card-bg)] rounded animate-pulse" />
          <div className="flex-1">
            {/* STATUS TEXT SKELETON */}
            <div className="h-5 w-64 bg-[var(--inside-card-bg)] rounded animate-pulse mb-2" />
            {/* BACKUP CODES COUNT SKELETON */}
            <div className="h-4 w-48 bg-[var(--inside-card-bg)] rounded animate-pulse" />
          </div>
        </div>
      </div>
      {/* ENABLE 2FA SECTION SKELETON (DISABLED STATE) */}
      <div className="space-y-6">
        {/* SECTION TITLE SKELETON */}
        <div>
          {/* TITLE SKELETON */}
          <div className="h-6 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse mb-2" />
          {/* DESCRIPTION SKELETON */}
          <div className="h-4 w-80 bg-[var(--inside-card-bg)] rounded animate-pulse" />
        </div>
        {/* INFO BOX SKELETON */}
        <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
          <div className="h-4 w-full bg-[var(--inside-card-bg)] rounded mb-2 animate-pulse" />
          <div className="h-4 w-3/4 bg-[var(--inside-card-bg)] rounded animate-pulse" />
        </div>
        {/* STEP INDICATOR SKELETON */}
        <div className="flex items-center gap-2 text-sm">
          {/* STEP NUMBER CIRCLE SKELETON */}
          <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] animate-pulse" />
          {/* STEP TEXT SKELETON */}
          <div className="h-5 w-40 bg-[var(--inside-card-bg)] rounded animate-pulse" />
        </div>
        {/* BUTTON SKELETON */}
        <div className="h-10 w-48 sm:w-auto bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
      </div>
    </div>
  );
};

export default SecuritySkeleton;
