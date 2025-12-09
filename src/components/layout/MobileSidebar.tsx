// <== IMPORTS ==>
import {
  LayoutDashboard,
  Folder,
  ListTodo,
  Settings,
  Trash,
  LogOut,
  Bell,
  X,
  Github,
  Building2,
} from "lucide-react";
import { useLogout } from "../../hooks/useAuth";
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
  // LOGOUT MUTATION
  const logoutMutation = useLogout();
  // HANDLE LOGOUT FUNCTION
  const handleLogout = (): void => {
    // CLOSE SIDEBAR
    closeSidebar();
    // CALL LOGOUT MUTATION
    logoutMutation.mutate();
  };
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
          <div className="flex items-center justify-between mb-6">
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
            {/* MENU SECTION */}
            <div className="mb-6 pt-3">
              {/* MENU LABEL */}
              <p className="text-xs font-semibold text-[var(--primary-text)] mb-1.5 uppercase tracking-widest">
                Menu
              </p>
              {/* MENU NAVIGATION */}
              <nav className="flex flex-col gap-1">
                {/* MAPPING THROUGH COLLECTION ITEMS */}
                {collection.map((item, index) => {
                  const Icon = item.icon;
                  // CHECK IF ITEM IS ACTIVE
                  const isActive = item.path && location.pathname === item.path;
                  // CHECK IF NOTIFICATIONS ITEM
                  if (item.name === "Notifications" && item.path) {
                    // RETURN NOTIFICATIONS ITEM WITH CUSTOM HANDLING
                    return (
                      <div key={index} className="relative">
                        <Link
                          to={item.path}
                          onClick={(e) => {
                            // PREVENT DEFAULT NAVIGATION
                            e.preventDefault();
                            // CALL CUSTOM ONCLICK HANDLER
                            item.onClick?.();
                          }}
                          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            isActive
                              ? "bg-[var(--bg)] text-[var(--accent-highlight-color)]"
                              : "text-[var(--sidebar-links-color)] hover:bg-[var(--accent-hover-color)] hover:text-white"
                          }`}
                        >
                          {/* MENU ITEM ICON CONTAINER */}
                          <div className="flex justify-center w-8">
                            <Icon className="h-5 w-5" strokeWidth={2.5} />
                          </div>
                          {/* MENU ITEM TEXT */}
                          <span className="ml-2 transition-all duration-200">
                            {item.name}
                          </span>
                        </Link>
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
                      className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[var(--bg)] text-[var(--accent-highlight-color)]"
                          : "text-[var(--sidebar-links-color)] hover:bg-[var(--accent-hover-color)] hover:text-white"
                      }`}
                    >
                      {/* MENU ITEM ICON CONTAINER */}
                      <div className="flex justify-center w-8">
                        <Icon className="h-5 w-5" strokeWidth={2.5} />
                      </div>
                      {/* MENU ITEM TEXT */}
                      <span className="ml-2 transition-all duration-200">
                        {item.name}
                      </span>
                    </Link>
                  ) : (
                    // MENU ITEM BUTTON (NO PATH)
                    <div key={index} className="relative">
                      <button
                        onClick={() => {
                          item.onClick?.();
                          closeSidebar();
                        }}
                        className="sidebar-item flex items-center w-full px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer text-[var(--sidebar-links-color)] hover:bg-[var(--accent-hover-color)] hover:text-[var(--primary-text)] transition-all"
                      >
{/* MENU ITEM ICON CONTAINER */}
                      <div className="flex justify-center w-8">
                        <Icon className="h-5 w-5" strokeWidth={2.5} />
                      </div>
                      {/* MENU ITEM TEXT */}
                      <span className="ml-2 transition-all duration-200">
                        {item.name}
                      </span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
          {/* GENERAL SECTION */}
          <div>
            {/* GENERAL LABEL */}
            <p className="text-xs font-semibold text-[var(--primary-text)] mb-1.5 uppercase tracking-widest">
              General
            </p>
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
                      className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-[var(--sidebar-links-color)] cursor-pointer hover:bg-[var(--accent-hover-color)] hover:text-white transition-all"
                    >
                      {/* LOGOUT ICON CONTAINER */}
                      <div className="flex justify-center w-8">
                        <Icon className="h-5 w-5" strokeWidth={2.5} />
                      </div>
                        {/* LOGOUT TEXT */}
                        <span className="ml-2 transition-all duration-200">
                          {item.name}
                        </span>
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
                      className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        location.pathname === item.path
                          ? "bg-[var(--bg)] text-[var(--accent-highlight-color)]"
                          : "text-[var(--sidebar-links-color)] hover:bg-[var(--accent-hover-color)] hover:text-white"
                      }`}
                    >
                      {/* GENERAL ITEM ICON CONTAINER */}
                      <div className="flex justify-center w-8">
                        <Icon className="h-5 w-5" strokeWidth={2.5} />
                      </div>
                      {/* GENERAL ITEM TEXT */}
                      <span className="ml-2 transition-all duration-200">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
