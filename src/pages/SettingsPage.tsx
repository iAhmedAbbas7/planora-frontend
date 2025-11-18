// <== IMPORTS ==>
import { JSX } from "react";
import { useSearchParams } from "react-router-dom";
import Profile from "../components/settings/Profile";
import Account from "../components/settings/Account";
import Appearance from "../components/settings/Appearance";
import Notifications from "../components/settings/Notifications";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== SETTINGS PAGE COMPONENT ==>
const SettingsPage = (): JSX.Element => {
  // SEARCH PARAMS HOOK
  const [searchParams, setSearchParams] = useSearchParams();
  // GET TAB PARAM FROM URL (SINGLE SOURCE OF TRUTH)
  const tabParam = searchParams.get("tab") as
    | "Profile"
    | "Appearance"
    | "Notifications"
    | "Account"
    | null;
  // DERIVE ACTIVE TAB FROM URL PARAM
  const activeTab: "Profile" | "Appearance" | "Notifications" | "Account" =
    tabParam || "Profile";
  // HANDLE TAB CHANGE FUNCTION
  const handleTabChange = (
    tab: "Profile" | "Appearance" | "Notifications" | "Account"
  ): void => {
    // UPDATE URL PARAM (THIS WILL TRIGGER RE-RENDER WITH NEW TAB)
    setSearchParams({ tab });
  };
  // RETURNING THE SETTINGS PAGE COMPONENT
  return (
    // SETTINGS PAGE MAIN CONTAINER
    <div
      className="min-h-screen pb-0.5"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* PAGE HEADER */}
      <DashboardHeader
        title="Settings"
        subtitle="Manage your profile, preferences, and application settings"
        showSearch={false}
      />
      {/* TABS CONTAINER */}
      <div className="m-4 border border-[var(--border)] rounded-2xl p-2 bg-[var(--cards-bg)]">
        {/* TABS */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          {/* MAPPING THROUGH TABS */}
          {["Profile", "Appearance", "Notifications", "Account"].map((tab) => (
            // TAB BUTTON
            <button
              key={tab}
              onClick={() =>
                handleTabChange(
                  tab as "Profile" | "Appearance" | "Notifications" | "Account"
                )
              }
              className={`px-4 py-1.5 text-sm sm:text-base font-medium rounded-xl transition-all duration-200 flex-shrink-0 cursor-pointer ${
                activeTab === tab
                  ? "bg-[var(--inside-card-bg)] text-[var(--accent-color)] border border-[var(--accent-color)]"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] border border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* TAB CONTENT */}
      {/* PROFILE TAB */}
      {activeTab === "Profile" && <Profile />}
      {/* APPEARANCE TAB */}
      {activeTab === "Appearance" && <Appearance />}
      {/* NOTIFICATIONS TAB */}
      {activeTab === "Notifications" && <Notifications />}
      {/* ACCOUNT TAB */}
      {activeTab === "Account" && <Account />}
    </div>
  );
};

export default SettingsPage;
