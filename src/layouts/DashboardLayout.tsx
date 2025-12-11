// <== IMPORTS ==>
import { JSX } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { CommandPalette } from "../components/command";
import MobileSidebar from "../components/layout/MobileSidebar";
import SessionExpiredModal from "../components/common/SessionExpiredModal";

// <== DASHBOARD LAYOUT COMPONENT ==>
const DashboardLayout = (): JSX.Element => {
  // RETURNING THE DASHBOARD LAYOUT COMPONENT
  return (
    // DASHBOARD LAYOUT MAIN CONTAINER
    <div className="min-h-screen flex">
      {/* DESKTOP SIDEBAR COMPONENT */}
      <Sidebar setIsOpen={() => {}} />
      {/* MOBILE SIDEBAR COMPONENT */}
      <MobileSidebar setIsOpen={() => {}} />
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 bg-gray-50 w-full">
        <Outlet />
      </main>
      {/* SESSION EXPIRED MODAL (ONLY ON PROTECTED ROUTES) */}
      <SessionExpiredModal />
      {/* GLOBAL COMMAND PALETTE (CTRL+K / CMD+K) */}
      <CommandPalette />
    </div>
  );
};

export default DashboardLayout;
