// <== IMPORTS ==>
import Dropdown from "../common/Dropdown";
import QuickActions from "./QuickActions";
import { CommandBarTrigger } from "../command";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { Sun, Moon, Menu, User } from "lucide-react";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useEffect, useRef, useState, JSX, useMemo } from "react";
import GitHubNotificationsDropdown from "../github/GitHubNotificationsDropdown";

// <== DASHBOARD HEADER PROPS TYPE INTERFACE ==>
type Props = {
  // <== TITLE ==>
  title: string;
  // <== SUBTITLE ==>
  subtitle: string;
  // <== SHOW SEARCH ==>
  showSearch?: boolean;
  // <== ON TOGGLE SIDEBAR FUNCTION ==>
  onToggleSidebar?: () => void;
};

// <== DASHBOARD HEADER COMPONENT ==>
const DashboardHeader = ({
  title,
  subtitle,
  showSearch = true,
}: Props): JSX.Element => {
  // DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // SIDEBAR STORE
  const { toggleSidebar } = useSidebarStore();
  // THEME CONTEXT
  const { setTheme, isDark } = useTheme();
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // LOCATION
  const location = useLocation();
  // CHECK IF ON GITHUB PAGE
  const isGitHubPage = useMemo(() => {
    // CHECK IF LOCATION PATHNAME STARTS WITH /GITHUB
    return location.pathname.startsWith("/github");
  }, [location.pathname]);
  // HANDLE CLICK OUTSIDE EFFECT
  useEffect(() => {
    // HANDLE CLICK OUTSIDE FUNCTION
    const handleClickOutside = (e: MouseEvent): void => {
      // CHECK IF CLICK IS OUTSIDE DROPDOWN
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        // CLOSE DROPDOWN
        setIsOpen(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // RETURNING THE DASHBOARD HEADER COMPONENT
  return (
    // HEADER MAIN CONTAINER
    <header
      className="sticky top-0 z-40 m-0 p-4 pt-2 pb-2 flex justify-between items-center backdrop-blur-[var(--blur)] bg-[var(--glass-bg)] border-b border-[var(--border)]"
      style={{
        backgroundColor: "var(--surface)",
        color: "var(--text-primary)",
      }}
    >
      {/* LEFT SECTION - HAMBURGER AND TITLE */}
      <div className="flex items-center gap-3">
        {/* HAMBURGER BUTTON (MOBILE ONLY) */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer"
        >
          {/* MENU ICON */}
          <Menu className="h-7 w-7" strokeWidth={2.5} />
        </button>
        {/* TITLE CONTAINER */}
        <div>
          {/* PAGE TITLE */}
          <p
            className="text-xl sm:text-2xl font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </p>
          {/* PAGE SUBTITLE */}
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      {/* RIGHT SECTION - SEARCH, QUICK ACTIONS, THEME, USER */}
      <div className="flex items-center gap-1">
        {/* COMMAND PALETTE TRIGGER - ICON ONLY */}
        {showSearch && <CommandBarTrigger variant="button" />}
        {/* QUICK ACTIONS - HIDDEN ON SMALL DEVICES */}
        <div className="hidden sm:block">
          <QuickActions />
        </div>
        {/* GITHUB NOTIFICATIONS - ONLY ON GITHUB PAGES */}
        {isGitHubPage && (
          <div className="hidden sm:block">
            <GitHubNotificationsDropdown />
          </div>
        )}
        {/* THEME TOGGLE BUTTON - HIDDEN ON SMALL DEVICES */}
        <button
          className="hidden sm:block p-2.5 rounded-full transition cursor-pointer text-[var(--light-text)] hover:text-[var(--primary-text)] hover:bg-[var(--hover-bg)]"
          onClick={() => {
            setTheme(isDark ? "light" : "dark");
          }}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {/* THEME ICON */}
          {isDark ? (
            <Sun className="h-6 w-6" style={{ color: "var(--icon)" }} />
          ) : (
            <Moon className="h-6 w-6" style={{ color: "var(--icon)" }} />
          )}
        </button>
        {/* USER DROPDOWN CONTAINER */}
        <div className="relative" ref={dropdownRef}>
          {/* USER BUTTON */}
          <button
            className="p-2.5 rounded-full flex items-center justify-center cursor-pointer transition text-[var(--light-text)] hover:text-[var(--primary-text)] hover:bg-[var(--hover-bg)]"
            onClick={() => setIsOpen(!isOpen)}
            title="Account menu"
          >
            {/* USER ICON */}
            <User className="h-6 w-6" style={{ color: "var(--icon)" }} />
          </button>
          {/* DROPDOWN MENU */}
          {isOpen && (
            <div className="absolute top-12 right-0">
              <Dropdown onClose={() => setIsOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
