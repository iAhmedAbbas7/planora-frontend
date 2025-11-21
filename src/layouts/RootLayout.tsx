// <== IMPORTS ==>
import { JSX, useLayoutEffect } from "react";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { Outlet, useLocation } from "react-router-dom";
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
    // GET HTML ELEMENT
    const htmlElement = document.documentElement;
    // GET BODY ELEMENT
    const bodyElement = document.body;
    // ADD CLASS TO DISABLE SMOOTH SCROLL IMMEDIATELY (BEFORE ANY SCROLL OPERATION)
    htmlElement.classList.add("no-smooth-scroll");
    // SET SCROLL POSITION USING window.scrollTo FOR MAXIMUM COMPATIBILITY
    if (window.scrollTo) {
      // SET SCROLL POSITION USING window.scrollTo FOR MAXIMUM COMPATIBILITY
      window.scrollTo(0, 0);
    }
    // SET SCROLL POSITION USING HTML ELEMENT PROPERTIES FOR FALLBACK
    htmlElement.scrollTop = 0;
    // SET SCROLL POSITION USING HTML ELEMENT PROPERTIES FOR FALLBACK
    htmlElement.scrollLeft = 0;
    // SET SCROLL POSITION USING BODY ELEMENT PROPERTIES FOR FALLBACK
    bodyElement.scrollTop = 0;
    // SET SCROLL POSITION USING BODY ELEMENT PROPERTIES FOR FALLBACK
    bodyElement.scrollLeft = 0;
    // FORCE LAYOUT RECALCULATION USING HTML ELEMENT PROPERTIES FOR FALLBACK
    void htmlElement.offsetHeight;
    // REMOVE CLASS AFTER MICROTASK
    setTimeout(() => {
      // REMOVE CLASS AFTER MICROTASK
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
