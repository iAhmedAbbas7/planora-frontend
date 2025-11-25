// <== IMPORTS ==>
import { JSX } from "react";

// <== PROFILE SKELETON COMPONENT ==>
const ProfileSkeleton = (): JSX.Element => {
  // RETURNING THE PROFILE SKELETON COMPONENT
  return (
    // FORM CONTAINER SKELETON
    <div className="m-4 border border-[var(--border)] rounded-2xl p-6 space-y-6 bg-[var(--cards-bg)]">
      {/* TITLE SECTION SKELETON */}
      <div>
        {/* TITLE SKELETON */}
        <div className="h-7 w-24 bg-[var(--inside-card-bg)] rounded animate-pulse mb-2" />
        {/* DESCRIPTION SKELETON */}
        <div className="h-4 w-80 bg-[var(--inside-card-bg)] rounded animate-pulse" />
      </div>
      {/* PROFILE PHOTO SECTION SKELETON */}
      <div className="flex items-center gap-4">
        {/* PROFILE PIC SKELETON */}
        <div className="w-24 h-24 rounded-full bg-[var(--inside-card-bg)] border-4 border-[var(--border)] animate-pulse" />
        {/* CIRCULAR ACTION BUTTONS SKELETON (NEXT TO PROFILE PICTURE) */}
        <div className="flex gap-2">
          {/* CHANGE PICTURE BUTTON SKELETON */}
          <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] animate-pulse shadow-md" />
          {/* DELETE PICTURE BUTTON SKELETON */}
          <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] animate-pulse shadow-md" />
        </div>
      </div>
      {/* DETAILS GRID SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* FULL NAME INPUT SKELETON */}
        <div className="flex flex-col gap-1">
          {/* LABEL SKELETON */}
          <div className="h-4 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
          {/* INPUT SKELETON */}
          <div className="h-10 w-full bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
        </div>
        {/* PROFESSION INPUT SKELETON */}
        <div className="flex flex-col gap-1">
          {/* LABEL SKELETON */}
          <div className="h-4 w-24 bg-[var(--inside-card-bg)] rounded animate-pulse" />
          {/* INPUT SKELETON */}
          <div className="h-10 w-full bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
        </div>
      </div>
      {/* BIO TEXTAREA SKELETON */}
      <div className="flex flex-col gap-1">
        {/* LABEL SKELETON */}
        <div className="h-4 w-12 bg-[var(--inside-card-bg)] rounded animate-pulse mb-1" />
        {/* TEXTAREA SKELETON */}
        <div className="h-32 w-full bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
      </div>
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

export default ProfileSkeleton;

