// <== IMPORTS ==>
import Dropdown from "../common/Dropdown";
import { useTheme } from "../../hooks/useTheme";
import { useEffect, useRef, useState, JSX } from "react";
import { Sun, Moon, Menu, Search, User } from "lucide-react";
import { useSidebarStore } from "../../store/useSidebarStore";

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
      {/* RIGHT SECTION - SEARCH, THEME, USER */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* SEARCH CONTAINER */}
        {showSearch && (
          <div
            className="hidden sm:flex items-center px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: "var(--chip-bg)" }}
          >
            {/* SEARCH ICON */}
            <Search
              className="h-4 w-4 mr-2"
              style={{ color: "var(--text-secondary)" }}
            />
            {/* SEARCH INPUT */}
            <input
              type="text"
              placeholder="Search anything"
              className="bg-transparent outline-none text-sm w-40"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        )}
        {/* THEME TOGGLE BUTTON */}
        <div className="hidden sm:block">
          <button
            className="relative p-2 rounded-full transition cursor-pointer text-[var(--light-text)] hover:text-[var(--primary-text)]"
            style={{ backgroundColor: "transparent" }}
            onClick={() => {
              setTheme(isDark ? "light" : "dark");
            }}
          >
            {/* THEME ICON */}
            {isDark ? (
              <Sun className="h-5 w-5" style={{ color: "var(--icon)" }} />
            ) : (
              <Moon className="h-5 w-5" style={{ color: "var(--icon)" }} />
            )}
          </button>
        </div>
        {/* USER DROPDOWN CONTAINER */}
        <div className="relative" ref={dropdownRef}>
          {/* USER BUTTON */}
          <button
            className="p-2 rounded-full flex items-center justify-center cursor-pointer transition text-[var(--light-text)] hover:text-[var(--primary-text)]"
            style={{ backgroundColor: "var(--chip-bg)" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* USER ICON */}
            <User className="h-5 w-5" style={{ color: "var(--icon)" }} />
          </button>
          {/* DROPDOWN MENU */}
          {isOpen && (
            <div className="absolute top-10 right-0 w-56 sm:w-64">
              <Dropdown />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
