// <== IMPORTS ==>
import { JSX, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { useTokenMonitor } from "../hooks/useTokenMonitor";
import ScrollToTop from "../components/common/ScrollToTop";
import NetworkStatusWatcher from "../components/common/NetworkStatusWatcher";

// <== ROOT LAYOUT COMPONENT ==>
const RootLayout = (): JSX.Element => {
  // GET CURRENT LOCATION
  const { pathname } = useLocation();
  
  // AUTH CHECK HOOK (CHECKS FOR OAUTH CALLBACKS AND PAGE REFRESHES)
  useAuthCheck();
  // TOKEN MONITORING HOOK (CHECKS TOKENS PERIODICALLY)
  useTokenMonitor();
  
  // IMMEDIATELY RESET SCROLL POSITION ON ROUTE CHANGE (BEFORE ANY RENDERING)
  useLayoutEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // ADD CLASS TO DISABLE SMOOTH SCROLL IMMEDIATELY
    htmlElement.classList.add("no-smooth-scroll");
    
    // SET SCROLL POSITION SYNCHRONOUSLY (BEFORE RENDER)
    window.scrollTo(0, 0);
    htmlElement.scrollTop = 0;
    htmlElement.scrollLeft = 0;
    bodyElement.scrollTop = 0;
    bodyElement.scrollLeft = 0;
    
    // FORCE LAYOUT RECALCULATION
    void htmlElement.offsetHeight;
    
    // REMOVE CLASS AFTER MICROTASK
    setTimeout(() => {
      htmlElement.classList.remove("no-smooth-scroll");
    }, 0);
  }, [pathname]);
  
  // RETURNING THE ROOT LAYOUT
  return (
    // ROOT LAYOUT CONTAINER
    <>
      {/* SCROLL TO TOP ON ROUTE CHANGE (ADDITIONAL SAFEGUARD) */}
      <ScrollToTop />
      {/* ROUTE OUTLET */}
      <Outlet />
      {/* NETWORK STATUS WATCHER */}
      <NetworkStatusWatcher />
    </>
  );
};

export default RootLayout;
