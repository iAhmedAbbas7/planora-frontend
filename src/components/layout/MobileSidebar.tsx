// <== IMPORTS ==>
import {
  House,
  Folder,
  ListTodo,
  Settings,
  Trash,
  Bell,
  X,
  Github,
  Building2,
  GitBranch,
  Target,
  BarChart3,
  Crosshair,
} from "lucide-react";
import LOGO_IMAGE from "../../assets/images/LOGO.png";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useState, useEffect, JSX, ComponentType } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// <== MOBILE SIDEBAR PROPS TYPE INTERFACE ==>
type MobileSidebarProps = {
  // <== SET OPEN FUNCTION ==>
  setIsOpen: (value: boolean) => void;
};
// <== MENU ITEM TYPE INTERFACE ==>
type MenuItem = {
  // <== NAME ==>
  name: string;
  // <== ICON ==>
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  // <== PATH ==>
  path?: string;
  // <== ON CLICK FUNCTION ==>
  onClick?: () => void;
};

// <== MOBILE SIDEBAR COMPONENT ==>
const MobileSidebar = ({ setIsOpen }: MobileSidebarProps): JSX.Element => {
  // SIDEBAR STORE
  const { isOpen, closeSidebar } = useSidebarStore();
  // LOCATION HOOK
  const location = useLocation();
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // NOTIFICATIONS OPEN STATE (FOR FUTURE API INTEGRATION)
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState<boolean>(false);
  // SYNC SIDEBAR OPEN STATE WITH PARENT (FOR FUTURE API INTEGRATION)
  useEffect(() => {
    // SYNC PARENT STATE WITH STORE STATE
    if (typeof setIsOpen === "function") {
      setIsOpen(isOpen);
    }
  }, [isOpen, setIsOpen]);
  // HANDLE NOTIFICATIONS STATE FOR FUTURE API INTEGRATION
  useEffect(() => {
    // RESET NOTIFICATIONS STATE WHEN SIDEBAR CLOSES
    if (!isOpen && isNotificationsOpen) {
      // RESET NOTIFICATIONS STATE
      setIsNotificationsOpen(false);
    }
  }, [isOpen, isNotificationsOpen, setIsNotificationsOpen]);
  // HANDLE NOTIFICATIONS CLICK FUNCTION
  const handleNotificationsClick = (): void => {
    // CLOSE SIDEBAR IF OPEN
    closeSidebar();
    // NAVIGATE TO NOTIFICATIONS PAGE
    navigate("/notifications");
    // UPDATE NOTIFICATIONS STATE
    setIsNotificationsOpen((prev) => !prev);
  };
  // MENU ITEMS ARRAY (ALL ITEMS COMBINED - MATCHING DESKTOP SIDEBAR)
  const menuItems: MenuItem[] = [
    { path: "/dashboard", name: "Dashboard", icon: House },
    { path: "/projects", name: "Projects", icon: Folder },
    { path: "/tasks", name: "Tasks", icon: ListTodo },
    { path: "/goals", name: "Goals", icon: Crosshair },
    { path: "/dependencies", name: "Dependencies", icon: GitBranch },
    { path: "/focus", name: "Focus", icon: Target },
    { path: "/reports", name: "Reports", icon: BarChart3 },
    { path: "/workspaces", name: "Workspaces", icon: Building2 },
    { path: "/github", name: "GitHub", icon: Github },
    { path: "/trash", name: "Trash", icon: Trash },
    {
      path: "/notifications",
      name: "Notifications",
      icon: Bell,
      onClick: handleNotificationsClick,
    },
    { path: "/settings", name: "Settings", icon: Settings },
  ];
  // CLOSE SIDEBAR ON ROUTE CHANGE EFFECT
  useEffect(() => {
    // CLOSE SIDEBAR WHEN LOCATION CHANGES
    closeSidebar();
  }, [location.pathname, closeSidebar]);
  // RETURNING THE MOBILE SIDEBAR COMPONENT
  return (
    // MOBILE SIDEBAR MAIN CONTAINER
    <>
      {/* OVERLAY FOR MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[var(--black-overlay)] z-[50] md:hidden"
          onClick={closeSidebar}
        />
      )}
      {/* MOBILE SIDEBAR CONTAINER */}
      <div
        style={{ backgroundColor: "var(--accent-soft-bg)" }}
        className={`fixed top-0 left-0 h-screen shadow-md flex flex-col justify-between transition-transform duration-300 z-50 text-[var(--sidebar-links-color)] w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        {/* SIDEBAR CONTENT CONTAINER */}
        <div className="flex flex-col justify-between h-full p-4">
          {/* LOGO AND CONTROLS CONTAINER */}
          <div className="flex items-center justify-between mb-4">
            {/* LOGO CONTAINER */}
            <div className="flex items-center gap-2">
              {/* LOGO IMAGE */}
              <img
                src={LOGO_IMAGE}
                alt="PlanOra Logo"
                className="w-10 h-10 transition-all duration-300"
              />
              {/* LOGO TEXT */}
              <p className="font-medium text-xl text-white whitespace-nowrap">
                PlanOra
              </p>
            </div>
            {/* CLOSE BUTTON */}
            <button
              className="p-2 rounded-md hover:bg-[var(--accent-color)] cursor-pointer"
              onClick={closeSidebar}
            >
              {/* CLOSE ICON */}
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
          {/* MENU CONTAINER */}
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* NAVIGATION */}
            <nav className="flex flex-col gap-1">
              {/* MAPPING THROUGH MENU ITEMS */}
              {menuItems.map((item, index) => {
                // GET ICON FROM ITEM
                const Icon = item.icon;
                // CHECK IF ITEM IS ACTIVE
                const isActive = item.path && location.pathname === item.path;
                // MENU ITEM CONTENT
                const content = (
                  <>
                    {/* MENU ITEM ICON CONTAINER */}
                    <div className="flex justify-center w-8">
                      <Icon
                        className="h-[1.375rem] w-[1.375rem]"
                        strokeWidth={2.5}
                      />
                    </div>
                    {/* MENU ITEM TEXT */}
                    <span className="ml-2 text-[0.9375rem] transition-all duration-200">
                      {item.name}
                    </span>
                  </>
                );
                // CHECK IF NOTIFICATIONS ITEM
                if (item.name === "Notifications" && item.path) {
                  // RETURN NOTIFICATIONS ITEM WITH CUSTOM HANDLING
                  return (
                    <div key={index} className="relative">
                      <button
                        onClick={(e) => {
                          // PREVENT DEFAULT
                          e.preventDefault();
                          // CALL CUSTOM ONCLICK HANDLER
                          item.onClick?.();
                        }}
                        className={`flex items-center w-full px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                          isActive
                            ? "bg-[var(--bg)] text-[var(--accent-highlight-color)]"
                            : "text-[var(--sidebar-links-color)] hover:bg-[var(--accent-hover-color)] hover:text-white"
                        }`}
                      >
                        {content}
                      </button>
                    </div>
                  );
                }
                // RETURN MENU ITEM WITH PATH
                return item.path ? (
                  // MENU ITEM LINK
                  <Link
                    key={index}
                    to={item.path}
                    onClick={closeSidebar}
                    className={`flex items-center px-3 py-1.5 rounded-md font-medium transition-all ${
                      isActive
                        ? "bg-[var(--bg)] text-[var(--accent-highlight-color)]"
                        : "text-[var(--sidebar-links-color)] hover:bg-[var(--accent-hover-color)] hover:text-white"
                    }`}
                  >
                    {content}
                  </Link>
                ) : (
                  // MENU ITEM BUTTON (NO PATH)
                  <div key={index} className="relative">
                    <button
                      onClick={() => {
                        item.onClick?.();
                        closeSidebar();
                      }}
                      className="sidebar-item flex items-center w-full px-3 py-1.5 rounded-md font-medium cursor-pointer text-[var(--sidebar-links-color)] hover:bg-[var(--accent-hover-color)] hover:text-[var(--primary-text)] transition-all"
                    >
                      {content}
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
