// <== IMPORTS ==>
import { useLocation } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";

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
      // FORCE IMMEDIATE SYNCHRONOUS LAYOUT RECALCULATION USING HTML ELEMENT PROPERTIES FOR FALLBACK
      void htmlElement.offsetHeight;
      // FORCE IMMEDIATE SYNCHRONOUS LAYOUT RECALCULATION USING BODY ELEMENT PROPERTIES FOR FALLBACK
      void bodyElement.offsetHeight;
      // REMOVE CLASS AFTER MICROTASK
      setTimeout(() => {
        // REMOVE CLASS AFTER MICROTASK
        htmlElement.classList.remove("no-smooth-scroll");
      }, 0);
      // UPDATE PREVIOUS PATHNAME REF
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);
  // RETURN NULL (THIS COMPONENT DOESN'T RENDER ANYTHING)
  return null;
};

export default ScrollToTop;
