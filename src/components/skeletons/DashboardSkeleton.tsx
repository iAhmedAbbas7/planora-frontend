// <== IMPORTS ==>
import { JSX } from "react";

// <== DASHBOARD SKELETON COMPONENT ==>
const DashboardSkeleton = (): JSX.Element => {
  // RETURNING THE DASHBOARD SKELETON COMPONENT
  return (
    // DASHBOARD SKELETON MAIN CONTAINER
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* DASHBOARD HEADER SKELETON */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="h-8 w-48 bg-[var(--cards-bg)] rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
        </div>
        {/* DASHBOARD CONTENT CONTAINER */}
        <div className="p-4 space-y-4">
          {/* ADD THINGS CARD SKELETON */}
          <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center justify-center p-4 border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)]"
                >
                  <div className="h-4 w-20 bg-[var(--bg)] rounded animate-pulse mb-2" />
                  <div className="h-8 w-12 bg-[var(--bg)] rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          {/* CARDS GRID SKELETON */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* PROGRESS TRENDS CARD SKELETON */}
            <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
              {/* CARD HEADER */}
              <div className="p-3 pt-1.5 pb-1.5 border-b border-[var(--border)]">
                <div className="h-6 w-48 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              </div>
              {/* CHART CONTAINER */}
              <div className="p-3 pb-1 h-[250px] flex items-center justify-center">
                <div className="w-full h-full bg-[var(--inside-card-bg)] rounded animate-pulse" />
              </div>
            </div>
            {/* WEEKLY PROJECTS CHART CARD SKELETON */}
            <div className="flex flex-col bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
              {/* CARD HEADER */}
              <div className="p-2 py-1.5 border-b border-[var(--border)]">
                <div className="h-6 w-40 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              </div>
              {/* CHART CONTAINER */}
              <div className="flex justify-center items-center p-2 h-[210px]">
                <div className="w-48 h-48 bg-[var(--inside-card-bg)] rounded-full animate-pulse" />
              </div>
              {/* SUMMARY TEXT */}
              <div className="mt-2 mb-3 flex justify-center">
                <div className="h-4 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              </div>
            </div>
            {/* ASSIGNED TASKS CARD SKELETON */}
            <div className="flex flex-col border border-[var(--border)] bg-[var(--cards-bg)] rounded-xl overflow-hidden">
              {/* CARD HEADER */}
              <div className="flex justify-between items-center border-b border-[var(--border)] px-4 py-1.5">
                <div className="h-6 w-24 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                <div className="h-4 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              </div>
              {/* PROJECT LIST CONTAINER */}
              <div className="grid grid-cols-1 gap-2 p-3">
                {/* ADD PROJECT BUTTON SKELETON */}
                <div className="h-10 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
                {/* PROJECT ITEMS SKELETON */}
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="border border-[var(--border)] flex items-center gap-4 px-3 py-1.5 rounded-lg"
                  >
                    <div className="w-9 h-9 bg-[var(--inside-card-bg)] rounded-full animate-pulse" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-4 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                      <div className="h-3 w-24 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* CHART AND NOTEPAD SECTION SKELETON */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* TASKS CREATED TODAY CARD SKELETON */}
            <div className="lg:col-span-2">
              <div className="flex flex-col justify-between p-4 pt-2.5 pb-3 border border-[var(--border)] rounded-2xl min-h-[261px] w-full bg-[var(--cards-bg)]">
                {/* CARD HEADER */}
                <div className="flex justify-between items-center mb-3">
                  <div className="h-6 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                  <div className="h-8 w-24 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
                </div>
                {/* TABLE CONTAINER */}
                <div className="overflow-x-auto flex-1">
                  {/* TABLE HEADER */}
                  <div className="grid grid-cols-4 gap-4 pb-2 border-b border-[var(--border)] mb-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-4 bg-[var(--inside-card-bg)] rounded animate-pulse"
                      />
                    ))}
                  </div>
                  {/* TABLE ROWS */}
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="grid grid-cols-4 gap-4 py-2 border-b border-[var(--border)]"
                    >
                      {[1, 2, 3, 4].map((cell) => (
                        <div
                          key={cell}
                          className="h-4 bg-[var(--inside-card-bg)] rounded animate-pulse"
                        />
                      ))}
                    </div>
                  ))}
                </div>
                {/* FOOTER */}
                <div className="flex justify-end mt-3">
                  <div className="h-4 w-24 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                </div>
              </div>
            </div>
            {/* NOTEPAD CARD SKELETON */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
                {/* CARD HEADER */}
                <div className="p-3 pt-1.5 pb-1.5 border-b border-[var(--border)]">
                  <div className="h-6 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
                </div>
                {/* NOTEPAD CONTENT */}
                <div className="p-4 min-h-[261px]">
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div
                        key={item}
                        className="h-4 bg-[var(--inside-card-bg)] rounded animate-pulse"
                        style={{ width: `${Math.random() * 40 + 60}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;

