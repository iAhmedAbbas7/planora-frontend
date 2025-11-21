// <== IMPORTS ==>
import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// <== SCROLL TO TOP COMPONENT ==>
const ScrollToTop = (): null => {
  // GET CURRENT LOCATION
  const { pathname } = useLocation();
  // TRACK PREVIOUS PATHNAME TO DETECT ROUTE CHANGES
  const prevPathnameRef = useRef<string>(pathname);

  // SCROLL TO TOP ON ROUTE CHANGE (BEFORE BROWSER PAINTS)
  useLayoutEffect(() => {
    // ONLY SCROLL IF PATHNAME ACTUALLY CHANGED
    if (prevPathnameRef.current !== pathname) {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      
      // ADD CLASS TO DISABLE SMOOTH SCROLL IMMEDIATELY (BEFORE ANY SCROLL OPERATION)
      htmlElement.classList.add("no-smooth-scroll");
      
      // SET SCROLL POSITION USING MULTIPLE METHODS FOR MAXIMUM COMPATIBILITY
      // DO THIS SYNCHRONOUSLY TO PREVENT ANY VISIBLE SCROLLING
      if (window.scrollTo) {
        window.scrollTo(0, 0);
      }
      htmlElement.scrollTop = 0;
      htmlElement.scrollLeft = 0;
      bodyElement.scrollTop = 0;
      bodyElement.scrollLeft = 0;
      
      // FORCE IMMEDIATE SYNCHRONOUS LAYOUT RECALCULATION
      // THIS ENSURES THE SCROLL POSITION IS APPLIED BEFORE ANY RENDERING
      void htmlElement.offsetHeight;
      void bodyElement.offsetHeight;
      
      // REMOVE CLASS AFTER A MICROTASK TO RESTORE SMOOTH SCROLL FOR OTHER OPERATIONS
      // USE setTimeout WITH 0 DELAY TO ENSURE IT HAPPENS AFTER CURRENT EXECUTION
      setTimeout(() => {
        htmlElement.classList.remove("no-smooth-scroll");
      }, 0);
      
      // UPDATE PREVIOUS PATHNAME
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  // RETURN NULL (THIS COMPONENT DOESN'T RENDER ANYTHING)
  return null;
};

export default ScrollToTop;

