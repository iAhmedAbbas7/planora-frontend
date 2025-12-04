// <== IMPORTS ==>
import { JSX } from "react";

// <== INTEGRATIONS SKELETON COMPONENT ==>
const IntegrationsSkeleton = (): JSX.Element => {
  // RETURNING THE INTEGRATIONS SKELETON COMPONENT
  return (
    // INTEGRATIONS SKELETON MAIN CONTAINER
    <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-6 shadow-sm animate-pulse">
      {/* HEADER SECTION SKELETON */}
      <div>
        {/* TITLE SKELETON */}
        <div className="h-7 w-40 bg-[var(--inside-card-bg)] rounded-md mb-2"></div>
        {/* DESCRIPTION SKELETON */}
        <div className="h-4 w-72 bg-[var(--inside-card-bg)] rounded-md"></div>
      </div>
      {/* GITHUB SECTION SKELETON */}
      <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
        {/* GITHUB HEADER SKELETON */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* GITHUB ICON SKELETON */}
            <div className="w-10 h-10 bg-[var(--hover-bg)] rounded-lg"></div>
            <div>
              {/* GITHUB TITLE SKELETON */}
              <div className="h-5 w-24 bg-[var(--hover-bg)] rounded-md mb-2"></div>
              {/* GITHUB DESCRIPTION SKELETON */}
              <div className="h-4 w-48 bg-[var(--hover-bg)] rounded-md"></div>
            </div>
          </div>
          {/* STATUS BADGE SKELETON */}
          <div className="h-8 w-28 bg-[var(--hover-bg)] rounded-full"></div>
        </div>
        {/* GITHUB CONTENT SKELETON */}
        <div className="space-y-3">
          {/* PROFILE ROW SKELETON */}
          <div className="flex items-center gap-3 p-3 bg-[var(--cards-bg)] rounded-lg">
            {/* AVATAR SKELETON */}
            <div className="w-12 h-12 bg-[var(--hover-bg)] rounded-full"></div>
            <div className="flex-1">
              {/* USERNAME SKELETON */}
              <div className="h-5 w-32 bg-[var(--hover-bg)] rounded-md mb-2"></div>
              {/* STATS SKELETON */}
              <div className="h-4 w-48 bg-[var(--hover-bg)] rounded-md"></div>
            </div>
          </div>
          {/* ACTION BUTTONS SKELETON */}
          <div className="flex gap-3 pt-3">
            <div className="h-10 w-32 bg-[var(--hover-bg)] rounded-lg"></div>
            <div className="h-10 w-32 bg-[var(--hover-bg)] rounded-lg"></div>
          </div>
        </div>
      </div>
      {/* AI SECTION SKELETON */}
      <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
        {/* AI HEADER SKELETON */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* AI ICON SKELETON */}
            <div className="w-10 h-10 bg-[var(--hover-bg)] rounded-lg"></div>
            <div>
              {/* AI TITLE SKELETON */}
              <div className="h-5 w-32 bg-[var(--hover-bg)] rounded-md mb-2"></div>
              {/* AI DESCRIPTION SKELETON */}
              <div className="h-4 w-56 bg-[var(--hover-bg)] rounded-md"></div>
            </div>
          </div>
          {/* STATUS BADGE SKELETON */}
          <div className="h-8 w-24 bg-[var(--hover-bg)] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSkeleton;
