// <== IMPORTS ==>
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, JSX } from "react";
import { Plus, ClipboardList, Folder, Timer } from "lucide-react";

// <== QUICK ACTIONS PROPS ==>
type QuickActionsProps = {
  // <== ON CREATE TASK ==>
  onCreateTask?: () => void;
  // <== ON CREATE PROJECT ==>
  onCreateProject?: () => void;
  // <== ON START TIMER ==>
  onStartTimer?: () => void;
};

// <== QUICK ACTIONS COMPONENT ==>
const QuickActions = ({
  onCreateTask,
  onCreateProject,
  onStartTimer,
}: QuickActionsProps): JSX.Element => {
  // DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement>(null);
  // NAVIGATE HOOK
  const navigate = useNavigate();
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
  // HANDLE CREATE TASK
  const handleCreateTask = (): void => {
    // CLOSE DROPDOWN
    setIsOpen(false);
    // IF CALLBACK PROVIDED, USE IT
    if (onCreateTask) {
      // CALL CALLBACK FUNCTION
      onCreateTask();
    } else {
      // NAVIGATE TO TASKS PAGE WITH CREATE PARAM
      navigate("/tasks?create=true");
    }
  };
  // HANDLE CREATE PROJECT
  const handleCreateProject = (): void => {
    // CLOSE DROPDOWN
    setIsOpen(false);
    // IF CALLBACK PROVIDED, USE IT
    if (onCreateProject) {
      // CALL CALLBACK FUNCTION
      onCreateProject();
    } else {
      // NAVIGATE TO PROJECTS PAGE WITH CREATE PARAM
      navigate("/projects?create=true");
    }
  };
  // HANDLE START TIMER
  const handleStartTimer = (): void => {
    // CLOSE DROPDOWN
    setIsOpen(false);
    // IF CALLBACK PROVIDED, USE IT
    if (onStartTimer) {
      // CALL CALLBACK FUNCTION
      onStartTimer();
    } else {
      // NAVIGATE TO TASKS PAGE (TIMER IS THERE)
      navigate("/tasks");
    }
  };
  // QUICK ACTION ITEMS
  const quickActionItems: {
    id: string;
    label: string;
    description: string;
    icon: React.ElementType;
    onClick: () => void;
    shortcut: string;
  }[] = [
    // NEW TASK ACTION
    {
      id: "task",
      label: "New Task",
      description: "Create a new task",
      icon: ClipboardList,
      onClick: handleCreateTask,
      shortcut: "⌘+N",
    },
    // NEW PROJECT ACTION
    {
      id: "project",
      label: "New Project",
      description: "Start a new project",
      icon: Folder,
      onClick: handleCreateProject,
      shortcut: "⌘+P",
    },
    // START TIMER ACTION
    {
      id: "timer",
      label: "Start Timer",
      description: "Track your time",
      icon: Timer,
      onClick: handleStartTimer,
      shortcut: "⌘+T",
    },
  ];
  // RETURN QUICK ACTIONS COMPONENT
  return (
    <div className="relative" ref={dropdownRef}>
      {/* QUICK ACTIONS BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full transition cursor-pointer text-[var(--light-text)] hover:text-[var(--primary-text)] hover:bg-[var(--hover-bg)]"
        title="Quick actions"
      >
        <Plus className="h-6 w-6" style={{ color: "var(--icon)" }} />
      </button>
      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden z-50">
          {/* HEADER */}
          <div className="px-3 py-2 border-b border-[var(--border)]">
            <p className="text-xs font-semibold text-[var(--light-text)] uppercase tracking-wider">
              Quick Actions
            </p>
          </div>
          {/* ACTION ITEMS */}
          <div className="py-1">
            {quickActionItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer text-[var(--text-primary)]"
                >
                  {/* ICON */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                    }}
                  >
                    <Icon size={16} className="text-[var(--accent-color)]" />
                  </div>
                  {/* TEXT */}
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-[var(--light-text)]">
                      {item.description}
                    </div>
                  </div>
                  {/* SHORTCUT */}
                  <span className="text-xs text-[var(--light-text)] bg-[var(--inside-card-bg)] px-1.5 py-0.5 rounded">
                    {item.shortcut}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
