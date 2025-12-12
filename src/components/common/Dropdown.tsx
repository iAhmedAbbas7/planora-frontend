// <== IMPORTS ==>
import {
  User,
  Settings,
  LogOut,
  Palette,
  Building2,
  Check,
  Plus,
  ChevronRight,
  ChevronDown,
  ClipboardList,
  Folder,
  Timer,
} from "lucide-react";
import { JSX, useState } from "react";
import { toast } from "../../lib/toast";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/useAuthStore";
import { useContextStore } from "../../store/useContextStore";
import { useWorkspaces, Workspace } from "../../hooks/useWorkspace";
import { useCommandPaletteStore } from "../../store/useCommandPaletteStore";

// <== DROPDOWN PROPS ==>
type DropdownProps = {
  // <== ON CLOSE FUNCTION ==>
  onClose?: () => void;
};

// <== DROPDOWN COMPONENT ==>
const Dropdown = ({ onClose }: DropdownProps): JSX.Element => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // AUTH STORE
  const { user } = useAuthStore();
  // CONTEXT STORE
  const { activeContext, setPersonalContext, setWorkspaceContext } =
    useContextStore();
  // WORKSPACES HOOK
  const { workspaces, isLoading } = useWorkspaces();
  // LOGOUT MUTATION
  const logoutMutation = useLogout();
  // QUICK ACTIONS EXPANDED STATE
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(false);
  // CONTEXT SWITCHER EXPANDED STATE
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  // FILTER OUT PERSONAL WORKSPACES
  const regularWorkspaces = workspaces?.filter(
    (w: Workspace & { type?: string }) => w.type !== "personal"
  );
  // DROPDOWN ITEMS ARRAY
  const items: {
    name: string;
    icon: React.ElementType;
    onClick: () => void;
  }[] = [
    // MY PROFILE ITEM
    {
      name: "My Profile",
      icon: User,
      onClick: () => {
        navigate("/settings?tab=Profile");
        onClose?.();
      },
    },
    // SETTINGS ITEM
    {
      name: "Settings",
      icon: Settings,
      onClick: () => {
        navigate("/settings?tab=Profile");
        onClose?.();
      },
    },
    // THEME ITEM
    {
      name: "Theme",
      icon: Palette,
      onClick: () => {
        navigate("/settings?tab=Appearance");
        onClose?.();
      },
    },
  ];
  // HANDLE LOGOUT FUNCTION
  const handleLogout = (): void => {
    // CALL LOGOUT MUTATION
    logoutMutation.mutate();
    // CLOSE DROPDOWN
    onClose?.();
  };
  // HANDLE PERSONAL CONTEXT
  const handlePersonalContext = (): void => {
    // SET PERSONAL CONTEXT
    setPersonalContext();
    // NAVIGATE TO DASHBOARD
    navigate("/dashboard");
    // CLOSE DROPDOWN
    onClose?.();
  };
  // HANDLE WORKSPACE CONTEXT
  const handleWorkspaceContext = (workspace: Workspace): void => {
    // SET WORKSPACE CONTEXT
    setWorkspaceContext(workspace._id, workspace.name);
    // NAVIGATE TO WORKSPACE
    navigate(`/workspaces/${workspace._id}`);
    // CLOSE DROPDOWN
    onClose?.();
  };
  // HANDLE CREATE WORKSPACE
  const handleCreateWorkspace = (): void => {
    // NAVIGATE TO WORKSPACES PAGE WITH CREATE PARAM
    navigate("/workspaces?create=true");
    // CLOSE DROPDOWN
    onClose?.();
  };
  // COMMAND PALETTE STORE
  const { openCommandPalette, setSearchQuery, setCurrentPage } =
    useCommandPaletteStore();
  // DETECT OS FOR SHORTCUT KEY
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  // GET SHORTCUT PREFIX
  const shortcutPrefix = isMac ? "⌘" : "Ctrl";
  // QUICK ACTIONS FOR MOBILE
  const quickActions = [
    // NEW TASK ACTION
    {
      id: "task",
      label: "New Task",
      description: "Create a new task",
      icon: ClipboardList,
      shortcut: `${shortcutPrefix}+N`,
      onClick: () => {
        setSearchQuery("");
        setCurrentPage("create-task");
        openCommandPalette();
        onClose?.();
      },
    },
    // NEW PROJECT ACTION
    {
      id: "project",
      label: "New Project",
      description: "Start a new project",
      icon: Folder,
      shortcut: `${shortcutPrefix}+P`,
      onClick: () => {
        navigate("/projects?create=true");
        onClose?.();
      },
    },
    // START TIMER ACTION
    {
      id: "timer",
      label: "Start Timer",
      description: "Track your time",
      icon: Timer,
      shortcut: `${shortcutPrefix}+T`,
      onClick: () => {
        navigate("/tasks");
        toast.info("Select a task to start timer");
        onClose?.();
      },
    },
  ];
  // RETURNING THE DROPDOWN COMPONENT
  return (
    // DROPDOWN MAIN CONTAINER
    <div className="w-64 sm:w-72 z-[60] bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden max-h-[80vh] overflow-y-auto">
      {/* DROPDOWN HEADER */}
      <header className="flex items-center gap-2.5 p-2.5 border-b border-[var(--border)]">
        {/* USER AVATAR */}
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <span className="bg-[var(--accent-color)] w-9 h-9 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 overflow-hidden aspect-square text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </span>
        )}
        {/* USER INFO CONTAINER */}
        <div className="flex flex-col min-w-0 flex-1">
          {/* USER NAME */}
          <p className="font-medium text-sm truncate">{user?.name || "User"}</p>
          {/* USER EMAIL */}
          <p className="text-[var(--light-text)] text-xs truncate">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </header>
      {/* CONTEXT SECTION - COLLAPSIBLE */}
      <div className="border-b border-[var(--border)]">
        {/* EXPAND/COLLAPSE HEADER */}
        <button
          onClick={() => setIsContextExpanded(!isContextExpanded)}
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-[var(--hover-bg)] transition cursor-pointer"
        >
          <span className="text-xs font-semibold text-[var(--light-text)] uppercase tracking-wider">
            Switch Context
          </span>
          <ChevronDown
            size={16}
            className={`text-[var(--light-text)] transition-transform duration-200 ${
              isContextExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
        {/* EXPANDABLE CONTENT */}
        {isContextExpanded && (
          <div className="pb-2 px-2">
            {/* PERSONAL OPTION */}
            <button
              onClick={handlePersonalContext}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                activeContext.type === "personal" ? "bg-[var(--hover-bg)]" : ""
              }`}
            >
              {/* ICON */}
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor:
                    activeContext.type === "personal"
                      ? "color-mix(in srgb, var(--accent-color) 15%, transparent)"
                      : "var(--inside-card-bg)",
                }}
              >
                <User
                  size={12}
                  className={
                    activeContext.type === "personal"
                      ? "text-[var(--accent-color)]"
                      : "text-[var(--light-text)]"
                  }
                />
              </div>
              {/* TEXT */}
              <span
                className={`text-sm flex-1 text-left ${
                  activeContext.type === "personal"
                    ? "text-[var(--accent-color)] font-medium"
                    : "text-[var(--text-primary)]"
                }`}
              >
                Personal
              </span>
              {/* CHECK */}
              {activeContext.type === "personal" && (
                <Check size={12} className="text-[var(--accent-color)]" />
              )}
            </button>
            {/* WORKSPACES */}
            {isLoading ? (
              <div className="px-2 py-2 text-xs text-[var(--light-text)]">
                Loading...
              </div>
            ) : (
              regularWorkspaces?.slice(0, 3).map((workspace: Workspace) => (
                <button
                  key={workspace._id}
                  onClick={() => handleWorkspaceContext(workspace)}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer mt-0.5 ${
                    activeContext.type === "workspace" &&
                    activeContext.workspaceId === workspace._id
                      ? "bg-[var(--hover-bg)]"
                      : ""
                  }`}
                >
                  {/* ICON */}
                  {workspace.avatar ? (
                    <img
                      src={workspace.avatar}
                      alt={workspace.name}
                      className="w-6 h-6 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor:
                          activeContext.type === "workspace" &&
                          activeContext.workspaceId === workspace._id
                            ? "color-mix(in srgb, var(--accent-color) 15%, transparent)"
                            : "var(--inside-card-bg)",
                      }}
                    >
                      <Building2
                        size={12}
                        className={
                          activeContext.type === "workspace" &&
                          activeContext.workspaceId === workspace._id
                            ? "text-[var(--accent-color)]"
                            : "text-[var(--light-text)]"
                        }
                      />
                    </div>
                  )}
                  {/* TEXT */}
                  <span
                    className={`text-sm flex-1 text-left truncate ${
                      activeContext.type === "workspace" &&
                      activeContext.workspaceId === workspace._id
                        ? "text-[var(--accent-color)] font-medium"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {workspace.name}
                  </span>
                  {/* CHECK */}
                  {activeContext.type === "workspace" &&
                    activeContext.workspaceId === workspace._id && (
                      <Check size={12} className="text-[var(--accent-color)]" />
                    )}
                </button>
              ))
            )}
            {/* VIEW ALL / CREATE */}
            <div className="flex items-center gap-1 mt-1">
              {regularWorkspaces && regularWorkspaces.length > 3 && (
                <button
                  onClick={() => {
                    navigate("/workspaces");
                    onClose?.();
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded-lg transition cursor-pointer"
                >
                  View all
                  <ChevronRight size={10} />
                </button>
              )}
              <button
                onClick={handleCreateWorkspace}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded-lg transition cursor-pointer"
              >
                <Plus size={10} />
                New workspace
              </button>
            </div>
          </div>
        )}
      </div>
      {/* QUICK ACTIONS - COLLAPSIBLE */}
      <div className="border-b border-[var(--border)]">
        {/* EXPAND/COLLAPSE HEADER */}
        <button
          onClick={() => setIsQuickActionsExpanded(!isQuickActionsExpanded)}
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-[var(--hover-bg)] transition cursor-pointer"
        >
          <span className="text-xs font-semibold text-[var(--light-text)] uppercase tracking-wider">
            Quick Actions
          </span>
          <ChevronDown
            size={16}
            className={`text-[var(--light-text)] transition-transform duration-200 ${
              isQuickActionsExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
        {/* EXPANDABLE CONTENT */}
        {isQuickActionsExpanded && (
          <div className="pb-2 px-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer text-[var(--text-primary)]"
                >
                  {/* ICON */}
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                    }}
                  >
                    <Icon size={12} className="text-[var(--accent-color)]" />
                  </div>
                  {/* TEXT */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-sm truncate">
                      {action.label}
                    </div>
                  </div>
                  {/* SHORTCUT */}
                  <span className="text-[10px] text-[var(--light-text)] bg-[var(--inside-card-bg)] px-1.5 py-0.5 rounded flex-shrink-0">
                    {action.shortcut}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {/* DROPDOWN MENU ITEMS */}
      <main className="p-1.5">
        {/* MAPPING THROUGH ITEMS */}
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            // MENU ITEM BUTTON
            <button
              key={index}
              onClick={item.onClick}
              className="flex w-full items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer text-sm text-[var(--text-primary)]"
            >
              {/* MENU ITEM ICON */}
              <Icon
                size={14}
                className="text-[var(--light-text)] flex-shrink-0"
              />
              {/* MENU ITEM TEXT */}
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </main>
      {/* DROPDOWN FOOTER */}
      <footer className="border-t border-[var(--border)] p-1.5">
        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer text-sm"
        >
          {/* LOGOUT ICON */}
          <LogOut size={14} className="flex-shrink-0" />
          {/* LOGOUT TEXT */}
          <span>Logout</span>
        </button>
      </footer>
    </div>
  );
};

export default Dropdown;
