// <== IMPORTS ==>
import {
  LayoutDashboard,
  Folder,
  ListTodo,
  Settings,
  Trash,
  LogOut,
  ChevronLeft,
  Bell,
  ChevronRight,
  Github,
  Building2,
} from "lucide-react";
import { useLogout } from "../../hooks/useAuth";
import LOGO_IMAGE from "../../assets/images/LOGO.png";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useState, useEffect, JSX, ComponentType } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationsDropdown from "../notifications/NotificationsDropdown";

// <== SIDEBAR PROPS TYPE INTERFACE ==>
type SidebarProps = {
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

// <== SIDEBAR COMPONENT ==>
const Sidebar = ({ setIsOpen }: SidebarProps): JSX.Element => {
  // SIDEBAR STORE
  const { isOpen, closeSidebar } = useSidebarStore();
  // LOCATION HOOK
  const location = useLocation();
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // COLLAPSED STATE
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  // NOTIFICATIONS OPEN STATE
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState<boolean>(false);
  // IS MOBILE STATE
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  // SYNC SIDEBAR OPEN STATE WITH PARENT (FOR FUTURE API INTEGRATION)
  useEffect(() => {
    // SYNC PARENT STATE WITH STORE STATE
    if (typeof setIsOpen === "function") {
      setIsOpen(isOpen);
    }
  }, [isOpen, setIsOpen]);
  // HANDLE NOTIFICATIONS CLICK FUNCTION
  const handleNotificationsClick = (): void => {
    // CHECK IF MOBILE (SCREEN WIDTH < 768px)
    const isMobile = window.innerWidth < 768;
    // IF MOBILE, NAVIGATE TO NOTIFICATIONS PAGE
    if (isMobile) {
      // CLOSE NOTIFICATIONS PANEL IF OPEN
      setIsNotificationsOpen(false);
      // CLOSE SIDEBAR
      closeSidebar();
      // NAVIGATE TO NOTIFICATIONS PAGE
      navigate("/notifications");
    } else {
      // IF DESKTOP, CHECK IF ALREADY ON NOTIFICATIONS PAGE
      if (location.pathname === "/notifications") {
        // IF ON NOTIFICATIONS PAGE, CLOSE PANEL IF OPEN
        setIsNotificationsOpen(false);
      } else {
        // IF NOT ON NOTIFICATIONS PAGE, TOGGLE NOTIFICATIONS DROPDOWN
        if (isNotificationsOpen) {
          // CLOSE NOTIFICATIONS PANEL
          setIsNotificationsOpen(false);
        } else {
          // OPEN NOTIFICATIONS PANEL
          setIsNotificationsOpen(true);
        }
      }
    }
  };
  // MENU ITEMS ARRAY
  const collection: MenuItem[] = [
    { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/projects", name: "Projects", icon: Folder },
    { path: "/tasks", name: "Tasks", icon: ListTodo },
    { path: "/workspaces", name: "Workspaces", icon: Building2 },
    { path: "/github", name: "GitHub", icon: Github },
    { path: "/trash", name: "Trash", icon: Trash },
    {
      path: "/notifications",
      name: "Notifications",
      icon: Bell,
      onClick: handleNotificationsClick,
    },
  ];
  // GENERAL ITEMS ARRAY
  const general: MenuItem[] = [
    { path: "/settings", name: "Settings", icon: Settings },
    { path: "/logout", name: "Logout", icon: LogOut },
  ];
  // CLOSE SIDEBAR ON ROUTE CHANGE EFFECT
  useEffect(() => {
    // CLOSE SIDEBAR WHEN LOCATION CHANGES
    closeSidebar();
  }, [location.pathname, closeSidebar]);
  // TRACK MOBILE STATE AND CLOSE NOTIFICATIONS PANEL WHEN SIDEBAR CLOSES
  useEffect(() => {
    // HANDLE WINDOW RESIZE
    const handleResize = (): void => {
      // GET WINDOW INNER WIDTH
      const mobile = window.innerWidth < 768;
      // SET IS MOBILE STATE
      setIsMobile(mobile);
      // IF RESIZING TO MOBILE, CLOSE NOTIFICATIONS PANEL
      if (mobile) {
        // CLOSE NOTIFICATIONS PANEL
        setIsNotificationsOpen(false);
      }
    };
    // HANDLE SIDEBAR CLOSE
    const handleSidebarStateChange = (): void => {
      // IF MOBILE AND SIDEBAR CLOSES, CLOSE NOTIFICATIONS PANEL
      if (isMobile && !isOpen) {
        // CLOSE NOTIFICATIONS PANEL
        setIsNotificationsOpen(false);
      }
    };
    // CALL HANDLERS IMMEDIATELY
    handleResize();
    // CALL HANDLER FOR SIDEBAR STATE CHANGE IMMEDIATELY
    handleSidebarStateChange();
    // ADD WINDOW RESIZE LISTENER
    window.addEventListener("resize", handleResize);
    // CLEANUP
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, isMobile]);
  // LOGOUT MUTATION
  const logoutMutation = useLogout();
  // HANDLE LOGOUT FUNCTION
  const handleLogout = (): void => {
    // CLOSE SIDEBAR
    closeSidebar();
    // CALL LOGOUT MUTATION
    logoutMutation.mutate();
  };
  // RETURNING THE SIDEBAR COMPONENT
  return (
    // SIDEBAR MAIN CONTAINER (DESKTOP ONLY)
    <>
      {/* SIDEBAR CONTAINER (DESKTOP ONLY) */}
      <div
        style={{ backgroundColor: "var(--accent-soft-bg)" }}
        className={`hidden md:flex md:sticky top-0 left-0 h-screen shadow-md flex-col justify-between transition-transform duration-300 z-50 text-[var(--sidebar-links-color)] w-64 ${
          isCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        {/* COLLAPSE/EXPAND BUTTON - ALWAYS VISIBLE AT EDGE */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-violet-100 hover:bg-gray-200 cursor-pointer transition-all absolute top-5 z-10 ${
            isCollapsed ? "right-0 translate-x-1/2" : "right-0 translate-x-1/2"
          }`}
        >
          {/* COLLAPSE/EXPAND ICON */}
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-black" strokeWidth={2.5} />
          ) : (
            <ChevronLeft className="h-4 w-4 text-black" strokeWidth={2.5} />
          )}
        </button>
        {/* SIDEBAR CONTENT CONTAINER */}
        <div className="flex flex-col justify-between h-full p-4">
          {/* LOGO AND CONTROLS CONTAINER */}
          <div
            className={`flex items-center mb-6 transition-all duration-300 ${
              isCollapsed ? "justify-center w-full" : "justify-between"
            }`}
          >
            {/* LOGO CONTAINER */}
            <div
              className={`flex items-center transition-all duration-300 ${
                isCollapsed ? "justify-center w-full" : "justify-start gap-2"
              }`}
            >
              {/* LOGO IMAGE */}
              <img
                src={LOGO_IMAGE}
                alt="PlanOra Logo"
                className="w-10 h-10 transition-all duration-300"
              />
              {/* LOGO TEXT */}
              {!isCollapsed && (
                <p className="font-medium text-xl text-white whitespace-nowrap">
                  PlanOra
                </p>
              )}
            </div>
          </div>
          {/* MENU CONTAINER */}
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* MENU SECTION */}
            <div className="mb-6 pt-3">
              {/* MENU LABEL */}
              {!isCollapsed && (
                <p className="text-xs font-semibold text-[var(--primary-text)] mb-1.5 uppercase tracking-widest">
                  Menu
                </p>
              )}
              {/* MENU NAVIGATION */}
              <nav className="flex flex-col gap-1">
                {/* MAPPING THROUGH COLLECTION ITEMS */}
                {collection.map((item, index) => {
                  const Icon = item.icon;
                  // CHECK IF ITEM IS ACTIVE
                  const isActive = item.path && location.pathname === item.path;
                  // MENU ITEM CONTENT
                  const content = (
                    <>
                      {/* MENU ITEM ICON */}
                      {isCollapsed ? (
                        <Icon className="h-7 w-7" strokeWidth={2} />
                      ) : (
                        <>
                          {/* MENU ITEM ICON CONTAINER */}
                          <div className="flex justify-center w-8">
                            <Icon className="h-5 w-5" strokeWidth={2.5} />
                          </div>
                          {/* MENU ITEM TEXT */}
                          <span className="ml-2 transition-all duration-200">
                            {item.name}
                          </span>
                        </>
                      )}
                    </>
                  );
                  // CHECK IF NOTIFICATIONS ITEM
                  if (item.name === "Notifications" && item.path) {
                    // RETURN NOTIFICATIONS ITEM WITH CUSTOM HANDLING
                    return (
                      <div key={index} className="relative">
                        <button
                          data-notification-tab="true"
                          onClick={(e) => {
                            // PREVENT DEFAULT NAVIGATION
                            e.preventDefault();
                            // STOP PROPAGATION TO PREVENT CLICK-OUTSIDE HANDLER
                            e.stopPropagation();
                            // CALL CUSTOM ONCLICK HANDLER
                            handleNotificationsClick();
                          }}
                          className={`flex items-center w-full py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                            isCollapsed ? "justify-center px-0" : "px-3"
                          } ${
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
                      className={`flex items-center py-1.5 rounded-md text-sm font-medium transition-all ${
                        isCollapsed ? "justify-center px-0" : "px-3"
                      } ${
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
                          // DON'T CLOSE SIDEBAR FOR NOTIFICATIONS
                          if (item.name !== "Notifications") {
                            closeSidebar();
                          }
                        }}
                        className={`sidebar-item flex items-center w-full py-1.5 rounded-md text-sm font-medium cursor-pointer text-[var(--sidebar-links-color)] hover:bg-[var(--accent-hover-color)] hover:text-[var(--primary-text)] transition-all ${
                          isCollapsed ? "justify-center px-0" : "px-3"
                        }`}
                      >
                        {content}
                      </button>
                    </div>
                  );
                })}
              </nav>
            </div>
            {/* GENERAL SECTION */}
            <div>
              {/* GENERAL LABEL */}
              {!isCollapsed && (
                <p className="text-xs font-semibold text-[var(--primary-text)] mb-1.5 uppercase tracking-widest">
                  General
                </p>
              )}
              {/* GENERAL NAVIGATION */}
              <nav className="flex flex-col gap-0.5">
                {/* MAPPING THROUGH GENERAL ITEMS */}
                {general.map((item) => {
                  const Icon = item.icon;
                  // CHECK IF ITEM IS LOGOUT
                  if (item.name === "Logout") {
                    return (
                      // LOGOUT BUTTON
                      <button
                        key={item.name}
                        onClick={() => {
                          handleLogout();
                        }}
                        className={`flex items-center py-1.5 rounded-md text-sm font-medium text-[var(--sidebar-links-color)] cursor-pointer hover:bg-[var(--accent-hover-color)] hover:text-white transition-all ${
                          isCollapsed ? "justify-center px-0" : "px-3"
                        }`}
                      >
                        {/* LOGOUT ICON */}
                        {isCollapsed ? (
                          <Icon className="h-7 w-7" strokeWidth={2} />
                        ) : (
                          <>
                            {/* LOGOUT ICON CONTAINER */}
                            <div className="flex justify-center w-8">
                              <Icon className="h-5 w-5" strokeWidth={2.5} />
                            </div>
                            {/* LOGOUT TEXT */}
                            <span className="ml-2 transition-all duration-200">
                              {item.name}
                            </span>
                          </>
                        )}
                      </button>
                    );
                  }
                  // RETURN GENERAL ITEM LINK
                  return (
                    // GENERAL ITEM LINK
                    <Link
                      key={item.path}
                      to={item.path!}
                      onClick={closeSidebar}
                      className={`flex items-center py-1.5 rounded-md text-sm font-medium transition-all ${
                        isCollapsed ? "justify-center px-0" : "px-3"
                      } ${
                        location.pathname === item.path
                          ? "bg-[var(--bg)] text-[var(--accent-highlight-color)]"
                          : "text-[var(--sidebar-links-color)] hover:bg-[var(--accent-hover-color)] hover:text-white"
                      }`}
                    >
                      {/* GENERAL ITEM ICON */}
                      {isCollapsed ? (
                        <Icon className="h-7 w-7" strokeWidth={2} />
                      ) : (
                        <>
                          {/* GENERAL ITEM ICON CONTAINER */}
                          <div className="flex justify-center w-8">
                            <Icon className="h-5 w-5" strokeWidth={2.5} />
                          </div>
                          {/* GENERAL ITEM TEXT */}
                          <span className="ml-2 transition-all duration-200">
                            {item.name}
                          </span>
                        </>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* NOTIFICATIONS DROPDOWN - ONLY SHOW ON DESKTOP */}
      {isNotificationsOpen && !isMobile && (
        <NotificationsDropdown
          collapsed={isCollapsed}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
