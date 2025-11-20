// <== IMPORTS ==>
import { JSX } from "react";
import { Outlet } from "react-router-dom";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { useTokenMonitor } from "../hooks/useTokenMonitor";
import NetworkStatusWatcher from "../components/common/NetworkStatusWatcher";

// <== ROOT LAYOUT COMPONENT ==>
const RootLayout = (): JSX.Element => {
  // AUTH CHECK HOOK (CHECKS FOR OAUTH CALLBACKS AND PAGE REFRESHES)
  useAuthCheck();
  // TOKEN MONITORING HOOK (CHECKS TOKENS PERIODICALLY)
  useTokenMonitor();
  // RETURNING THE ROOT LAYOUT
  return (
    // ROOT LAYOUT CONTAINER
    <>
      {/* ROUTE OUTLET */}
      <Outlet />
      {/* NETWORK STATUS WATCHER */}
      <NetworkStatusWatcher />
    </>
  );
};

export default RootLayout;
