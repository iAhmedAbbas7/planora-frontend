// <== IMPORTS ==>
import { JSX } from "react";
import { Outlet } from "react-router-dom";
import { useTokenMonitor } from "../hooks/useTokenMonitor";
import SessionExpiredModal from "../components/common/SessionExpiredModal";
import NetworkStatusWatcher from "../components/common/NetworkStatusWatcher";

// <== ROOT LAYOUT COMPONENT ==>
const RootLayout = (): JSX.Element => {
  // TOKEN MONITORING HOOK (CHECKS TOKENS PERIODICALLY)
  useTokenMonitor();
  // RETURNING THE ROOT LAYOUT
  return (
    // ROOT LAYOUT CONTAINER
    <>
      {/* ROUTE OUTLET */}
      <Outlet />
      {/* SESSION EXPIRED MODAL */}
      <SessionExpiredModal />
      {/* NETWORK STATUS WATCHER */}
      <NetworkStatusWatcher />
    </>
  );
};

export default RootLayout;
