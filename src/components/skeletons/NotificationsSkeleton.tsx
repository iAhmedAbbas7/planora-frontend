// <== IMPORTS ==>
import { JSX } from "react";

// <== NOTIFICATIONS SKELETON COMPONENT ==>
const NotificationsSkeleton = (): JSX.Element => {
  // RETURNING THE NOTIFICATIONS SKELETON COMPONENT
  return (
    // NOTIFICATIONS MAIN CONTAINER SKELETON
    <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-8">
      {/* TITLE SECTION SKELETON */}
      <div>
        {/* TITLE SKELETON */}
        <div className="h-7 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse mb-2" />
        {/* DESCRIPTION SKELETON */}
        <div className="h-4 w-64 bg-[var(--inside-card-bg)] rounded animate-pulse" />
      </div>
      {/* TOGGLES SKELETON */}
      {[1, 2, 3].map((index) => (
        // TOGGLE CONTAINER SKELETON
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          {/* TOGGLE INFO SKELETON */}
          <div className="flex-1">
            {/* TOGGLE TITLE SKELETON */}
            <div className="h-5 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse mb-2" />
            {/* TOGGLE DESCRIPTION SKELETON */}
            <div className="h-4 w-64 bg-[var(--inside-card-bg)] rounded animate-pulse" />
          </div>
          {/* TOGGLE BUTTON SKELETON */}
          <div className="w-12 h-6 bg-[var(--inside-card-bg)] rounded-full animate-pulse" />
        </div>
      ))}
      {/* BUTTONS CONTAINER SKELETON */}
      <div className="pt-2 flex justify-end gap-3">
        {/* CANCEL BUTTON SKELETON */}
        <div className="h-10 w-24 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
        {/* SAVE BUTTON SKELETON */}
        <div className="h-10 w-32 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
      </div>
    </div>
  );
};

export default NotificationsSkeleton;
