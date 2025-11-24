// <== IMPORTS ==>
import { JSX } from "react";

// <== NOTIFICATIONS SKELETON COMPONENT ==>
const NotificationsSkeleton = (): JSX.Element => {
  // RETURNING THE NOTIFICATIONS SKELETON COMPONENT
  return (
    // NOTIFICATIONS SKELETON MAIN CONTAINER
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* PAGE HEADER SKELETON */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="h-8 w-32 bg-[var(--cards-bg)] rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-64 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
      </div>
      {/* NOTIFICATIONS CONTENT CONTAINER SKELETON */}
      <div className="p-4">
        {/* NOTIFICATIONS CARD SKELETON */}
        <div className="border border-[var(--border)] rounded-2xl bg-[var(--cards-bg)] overflow-hidden">
          {/* HEADER SECTION SKELETON */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 py-4 border-b border-[var(--border)] bg-[var(--cards-bg)]">
            {/* HEADER LEFT SKELETON */}
            <div className="flex items-center gap-3">
              {/* BELL ICON SKELETON */}
              <div className="h-6 w-6 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              {/* TITLE SKELETON */}
              <div className="h-6 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              {/* UNREAD COUNT BADGE SKELETON */}
              <div className="h-6 w-6 bg-[var(--inside-card-bg)] rounded-full animate-pulse" />
            </div>
            {/* HEADER RIGHT - ACTIONS SKELETON */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* MARK ALL AS READ BUTTON SKELETON */}
              <div className="h-9 w-28 sm:w-32 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
              {/* REFRESH BUTTON SKELETON */}
              <div className="h-9 w-24 sm:w-28 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
            </div>
          </div>
          {/* FILTER TABS SKELETON */}
          <div className="flex gap-2 px-4 sm:px-6 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
            {/* ALL TAB SKELETON */}
            <div className="h-9 w-16 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
            {/* UNREAD TAB SKELETON */}
            <div className="h-9 w-24 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
            {/* READ TAB SKELETON */}
            <div className="h-9 w-20 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
          </div>
          {/* NOTIFICATIONS LIST SKELETON */}
          <div className="p-4 sm:p-6">
            {/* SELECT ALL CHECKBOX SKELETON */}
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)] mb-3">
              {/* CHECKBOX SKELETON */}
              <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              {/* LABEL SKELETON */}
              <div className="h-4 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
            </div>
            {/* NOTIFICATION ITEMS SKELETON */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className={`p-4 rounded-lg border ${
                    item % 2 === 0
                      ? "bg-[var(--cards-bg)] border-[var(--border)]"
                      : "bg-[var(--bg)] border-[var(--border)]"
                  }`}
                >
                  {/* NOTIFICATION CONTENT SKELETON */}
                  <div className="flex items-start gap-4">
                    {/* SELECT CHECKBOX SKELETON */}
                    <div className="h-4 w-4 bg-[var(--inside-card-bg)] rounded mt-1 animate-pulse" />
                    {/* NOTIFICATION ICON SKELETON */}
                    <div className="h-5 w-5 bg-[var(--inside-card-bg)] rounded mt-0.5 animate-pulse flex-shrink-0" />
                    {/* NOTIFICATION DETAILS SKELETON */}
                    <div className="flex-1 min-w-0">
                      {/* NOTIFICATION HEADER SKELETON */}
                      <div className="flex items-start justify-between gap-3">
                        {/* NOTIFICATION TEXT SKELETON */}
                        <div className="flex-1">
                          {/* NOTIFICATION TITLE SKELETON */}
                          <div className="h-5 w-3/4 bg-[var(--inside-card-bg)] rounded mb-1 animate-pulse" />
                          {/* NOTIFICATION MESSAGE SKELETON */}
                          <div className="h-4 w-full bg-[var(--inside-card-bg)] rounded mb-2 animate-pulse" />
                          {/* NOTIFICATION DATE SKELETON */}
                          <div className="h-3 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                        </div>
                        {/* NOTIFICATION ACTIONS SKELETON */}
                        <div className="flex items-center gap-1">
                          {/* MARK AS READ BUTTON SKELETON (SHOW FOR SOME ITEMS) */}
                          {item % 2 !== 0 && (
                            <div className="h-8 w-8 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
                          )}
                          {/* DELETE BUTTON SKELETON */}
                          <div className="h-8 w-8 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* FOOTER SKELETON */}
          <div className="border-t border-[var(--border)] bg-[var(--bg)] px-4 sm:px-6 py-3">
            {/* FOOTER CONTENT SKELETON */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              {/* TOTAL NOTIFICATIONS COUNT SKELETON */}
              <div className="h-4 w-48 bg-[var(--cards-bg)] rounded animate-pulse" />
              {/* STATS SKELETON */}
              <div className="flex gap-4">
                {/* UNREAD COUNT SKELETON */}
                <div className="h-4 w-20 bg-[var(--cards-bg)] rounded animate-pulse" />
                {/* READ COUNT SKELETON */}
                <div className="h-4 w-20 bg-[var(--cards-bg)] rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSkeleton;

