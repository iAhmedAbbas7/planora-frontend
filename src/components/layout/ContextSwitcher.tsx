// <== IMPORTS ==>
import {
  ChevronDown,
  User,
  Building2,
  Check,
  Plus,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, JSX } from "react";
import { useContextStore } from "../../store/useContextStore";
import { useWorkspaces, Workspace } from "../../hooks/useWorkspace";

// <== CONTEXT SWITCHER PROPS ==>
type ContextSwitcherProps = {
  // <== IS COLLAPSED ==>
  isCollapsed?: boolean;
};

// <== CONTEXT SWITCHER COMPONENT ==>
const ContextSwitcher = ({
  isCollapsed = false,
}: ContextSwitcherProps): JSX.Element => {
  // DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement>(null);
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // WORKSPACES HOOK
  const { workspaces, isLoading } = useWorkspaces();
  // CONTEXT STORE
  const { activeContext, setPersonalContext, setWorkspaceContext } =
    useContextStore();
  // HANDLE CLICK OUTSIDE
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK IF CLICK IS OUTSIDE DROPDOWN
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // CLOSE DROPDOWN
        setIsOpen(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // CLEANUP: REMOVE EVENT LISTENER ON UNMOUNT
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // HANDLE PERSONAL CONTEXT
  const handlePersonalContext = (): void => {
    // SET PERSONAL CONTEXT
    setPersonalContext();
    // CLOSE DROPDOWN
    setIsOpen(false);
    // NAVIGATE TO DASHBOARD
    navigate("/dashboard");
  };
  // HANDLE WORKSPACE CONTEXT
  const handleWorkspaceContext = (workspace: Workspace): void => {
    // SET WORKSPACE CONTEXT
    setWorkspaceContext(workspace._id, workspace.name);
    // CLOSE DROPDOWN
    setIsOpen(false);
    // NAVIGATE TO WORKSPACE
    navigate(`/workspaces/${workspace._id}`);
  };
  // HANDLE CREATE WORKSPACE
  const handleCreateWorkspace = (): void => {
    // CLOSE DROPDOWN
    setIsOpen(false);
    // NAVIGATE TO WORKSPACES PAGE
    navigate("/workspaces?create=true");
  };
  // FILTER OUT PERSONAL WORKSPACES (TYPE === 'personal')
  const regularWorkspaces = workspaces?.filter(
    (w: Workspace & { type?: string }) => w.type !== "personal"
  );
  // GET DISPLAY NAME
  const getDisplayName = (): string => {
    // IF PERSONAL CONTEXT
    if (activeContext.type === "personal") {
      // RETURN PERSONAL DISPLAY NAME
      return "Personal";
    }
    // IF WORKSPACE CONTEXT
    return activeContext.workspaceName || "Workspace";
  };
  // GET DISPLAY ICON
  const getDisplayIcon = (): JSX.Element => {
    // IF PERSONAL CONTEXT
    if (activeContext.type === "personal") {
      // RETURN PERSONAL DISPLAY ICON
      return <User size={16} className="text-[var(--accent-color)]" />;
    }
    // IF WORKSPACE CONTEXT
    return <Building2 size={16} className="text-[var(--accent-color)]" />;
  };
  // RETURNING THE CONTEXT SWITCHER
  return (
    <div className="relative" ref={dropdownRef}>
      {/* CONTEXT SWITCHER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent-color)] transition cursor-pointer ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {/* LEFT SIDE - ICON AND TEXT */}
        <div className="flex items-center gap-2 min-w-0">
          {/* ICON */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent-color) 15%, transparent)",
            }}
          >
            {getDisplayIcon()}
          </div>
          {/* TEXT */}
          {!isCollapsed && (
            <span className="text-sm font-medium text-[var(--text-primary)] truncate">
              {getDisplayName()}
            </span>
          )}
        </div>
        {/* CHEVRON */}
        {!isCollapsed && (
          <ChevronDown
            size={16}
            className={`text-[var(--light-text)] transition flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>
      {/* DROPDOWN MENU */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-xl overflow-hidden ${
            isCollapsed ? "left-full ml-2 top-0 w-56" : "left-0 right-0 w-full"
          }`}
        >
          {/* PERSONAL OPTION */}
          <button
            onClick={handlePersonalContext}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
              activeContext.type === "personal"
                ? "text-[var(--accent-color)] bg-[var(--hover-bg)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            {/* ICON */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor:
                  activeContext.type === "personal"
                    ? "color-mix(in srgb, var(--accent-color) 15%, transparent)"
                    : "var(--inside-card-bg)",
              }}
            >
              <User
                size={16}
                className={
                  activeContext.type === "personal"
                    ? "text-[var(--accent-color)]"
                    : "text-[var(--light-text)]"
                }
              />
            </div>
            {/* TEXT */}
            <div className="flex-1 text-left">
              <div className="font-medium">Personal</div>
              <div className="text-xs text-[var(--light-text)]">
                Your personal workspace
              </div>
            </div>
            {/* CHECK ICON */}
            {activeContext.type === "personal" && (
              <Check size={16} className="text-[var(--accent-color)]" />
            )}
          </button>
          {/* DIVIDER */}
          {regularWorkspaces && regularWorkspaces.length > 0 && (
            <div className="border-t border-[var(--border)]" />
          )}
          {/* WORKSPACES LABEL */}
          {regularWorkspaces && regularWorkspaces.length > 0 && (
            <div className="px-3 py-1.5 text-xs font-semibold text-[var(--light-text)] uppercase tracking-wider">
              Workspaces
            </div>
          )}
          {/* WORKSPACES LIST */}
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-[var(--light-text)]">
              Loading...
            </div>
          ) : (
            regularWorkspaces?.map((workspace: Workspace) => (
              <button
                key={workspace._id}
                onClick={() => handleWorkspaceContext(workspace)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                  activeContext.type === "workspace" &&
                  activeContext.workspaceId === workspace._id
                    ? "text-[var(--accent-color)] bg-[var(--hover-bg)]"
                    : "text-[var(--text-primary)]"
                }`}
              >
                {/* ICON / AVATAR */}
                {workspace.avatar ? (
                  <img
                    src={workspace.avatar}
                    alt={workspace.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor:
                        activeContext.type === "workspace" &&
                        activeContext.workspaceId === workspace._id
                          ? "color-mix(in srgb, var(--accent-color) 15%, transparent)"
                          : "var(--inside-card-bg)",
                    }}
                  >
                    <Building2
                      size={16}
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
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium truncate">{workspace.name}</div>
                  <div className="text-xs text-[var(--light-text)]">
                    {workspace.memberCount || 1} member
                    {(workspace.memberCount || 1) !== 1 ? "s" : ""}
                  </div>
                </div>
                {/* CHECK ICON */}
                {activeContext.type === "workspace" &&
                  activeContext.workspaceId === workspace._id && (
                    <Check size={16} className="text-[var(--accent-color)]" />
                  )}
              </button>
            ))
          )}
          {/* CREATE WORKSPACE BUTTON */}
          <div className="border-t border-[var(--border)]">
            <button
              onClick={handleCreateWorkspace}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              {/* ICON */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                }}
              >
                <Plus size={16} className="text-[var(--accent-color)]" />
              </div>
              {/* TEXT */}
              <div className="flex-1 text-left">
                <div className="font-medium">Create Workspace</div>
                <div className="text-xs text-[var(--light-text)]">
                  Collaborate with your team
                </div>
              </div>
              {/* SPARKLES ICON */}
              <Sparkles size={14} className="text-[var(--accent-color)]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextSwitcher;
