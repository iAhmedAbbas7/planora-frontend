// <== IMPORTS ==>
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Circle,
  Timer,
  Command as CommandIcon,
  X,
  Folder,
  Building2,
  Github,
  Lock,
  Globe,
} from "lucide-react";
import {
  useGitHubStatus,
  useGitHubRepositories,
  GitHubRepository,
} from "../../hooks/useGitHub";
import {
  getAllStaticSearchableItems,
  searchItems,
  getCategoryDisplayName,
  SearchableItem,
} from "../../lib/searchableItems";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { useTasks, Task } from "../../hooks/useTasks";
import { useProjects, Project } from "../../hooks/useProjects";
import { useWorkspaces, Workspace } from "../../hooks/useWorkspace";
import { JSX, useEffect, useState, useCallback, useMemo } from "react";
import { useCommandPaletteStore } from "../../store/useCommandPaletteStore";

// <== UNIFIED SEARCH RESULT TYPE ==>
type UnifiedSearchResult = {
  // <== ID ==>
  id: string;
  // <== TITLE ==>
  title: string;
  // <== SUBTITLE ==>
  subtitle?: string;
  // <== CATEGORY ==>
  category: string;
  // <== ICON ==>
  icon: JSX.Element;
  // <== PATH ==>
  path?: string;
  // <== ACTION ==>
  action?: () => void;
  // <== EXTRA DATA ==>
  extra?: Record<string, unknown>;
};

// <== COMMAND PALETTE COMPONENT ==>
const CommandPalette = (): JSX.Element | null => {
  // COMMAND PALETTE STORE HOOKS
  const { isOpen, closeCommandPalette, setSearchQuery } =
    useCommandPaletteStore();
  // NAVIGATION HOOK
  const navigate = useNavigate();
  // TASKS HOOK
  const { tasks } = useTasks();
  // PROJECTS HOOK
  const { projects } = useProjects();
  // WORKSPACES HOOK
  const { workspaces } = useWorkspaces();
  // GITHUB STATUS HOOK
  const { status: githubStatus } = useGitHubStatus();
  // GITHUB REPOSITORIES HOOK
  const { repositories: githubRepos } = useGitHubRepositories(
    1,
    20,
    "all",
    "updated",
    githubStatus?.isConnected ?? false
  );
  // LOCAL STATE
  const [inputValue, setInputValue] = useState<string>("");
  // STATIC SEARCHABLE ITEMS
  const staticItems = useMemo(() => getAllStaticSearchableItems(), []);
  // REGISTER GLOBAL KEYBOARD SHORTCUT (CTRL+K / CMD+K)
  useHotkeys(
    "mod+k",
    (e) => {
      // PREVENT DEFAULT
      e.preventDefault();
      // TOGGLE COMMAND PALETTE
      useCommandPaletteStore.getState().toggleCommandPalette();
    },
    {
      // ENABLE IN INPUT FIELDS
      enableOnFormTags: true,
      // PREVENT DEFAULT
      preventDefault: true,
    }
  );
  // REGISTER DASHBOARD SHORTCUT
  useHotkeys("mod+1", () => navigate("/dashboard"), { enableOnFormTags: true });
  // REGISTER PROJECTS SHORTCUT
  useHotkeys("mod+2", () => navigate("/projects"), { enableOnFormTags: true });
  // REGISTER TASKS SHORTCUT
  useHotkeys("mod+3", () => navigate("/tasks"), { enableOnFormTags: true });
  // REGISTER GITHUB SHORTCUT
  useHotkeys("mod+4", () => navigate("/github"), { enableOnFormTags: true });
  // REGISTER WORKSPACES SHORTCUT
  useHotkeys("mod+5", () => navigate("/workspaces"), {
    enableOnFormTags: true,
  });
  // RESET INPUT VALUE WHEN CLOSING
  useEffect(() => {
    // RESET INPUT VALUE WHEN CLOSING
    if (!isOpen) {
      // RESET INPUT VALUE
      setInputValue("");
      // RESET SEARCH QUERY
      setSearchQuery("");
    }
  }, [isOpen, setSearchQuery]);
  // HANDLE ESCAPE KEY
  useEffect(() => {
    // HANDLE ESCAPE KEY
    const handleEscape = (e: KeyboardEvent): void => {
      // CHECK IF ESCAPE KEY IS PRESSED AND COMMAND PALETTE IS OPEN
      if (e.key === "Escape" && isOpen) {
        // CLOSE COMMAND PALETTE
        closeCommandPalette();
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("keydown", handleEscape);
    // CLEANUP
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeCommandPalette]);
  // PREVENT BODY SCROLL WHEN OPEN
  useEffect(() => {
    // PREVENT BODY SCROLL WHEN OPEN
    if (isOpen) {
      // SET BODY OVERFLOW TO HIDDEN
      document.body.style.overflow = "hidden";
      // SET BODY OVERFLOW TO UNSET
    } else {
      document.body.style.overflow = "unset";
    }
    // CLEANUP
    return () => {
      // SET BODY OVERFLOW TO UNSET
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  // FORMAT TASK STATUS ICON
  const getStatusIcon = useCallback((status: string): JSX.Element => {
    // FORMAT TASK STATUS ICON
    switch (status?.toLowerCase()) {
      // COMPLETED STATUS
      case "completed":
        return <CheckCircle2 size={16} className="text-green-500" />;
      // IN PROGRESS STATUS
      case "in progress":
        return <Timer size={16} className="text-blue-500" />;
      // DEFAULT STATUS
      default:
        return <Circle size={16} className="text-gray-400" />;
    }
  }, []);
  // CONVERT STATIC ITEMS TO UNIFIED FORMAT
  const convertStaticItem = useCallback(
    (item: SearchableItem): UnifiedSearchResult => {
      // GET ICON COMPONENT
      const IconComponent = item.icon;
      // RETURN UNIFIED SEARCH RESULT
      return {
        id: item.id,
        title: item.title,
        subtitle: item.description,
        category: item.category.startsWith("settings-")
          ? "settings"
          : item.category,
        icon: (
          <IconComponent size={18} className="text-[var(--accent-color)]" />
        ),
        path: item.path,
        action: () => {
          navigate(item.path);
          closeCommandPalette();
        },
      };
    },
    [navigate, closeCommandPalette]
  );
  // BUILD SEARCH RESULTS
  const searchResults = useMemo((): UnifiedSearchResult[] => {
    // BUILD SEARCH RESULTS
    const results: UnifiedSearchResult[] = [];
    // GET QUERY
    const query = inputValue.toLowerCase().trim();
    // SEARCH STATIC ITEMS
    const matchedStaticItems = query
      ? searchItems(query, staticItems)
      : staticItems.filter(
          (item) => item.category === "navigation" || item.category === "action"
        );
    // ADD STATIC ITEMS (LIMITED)
    const staticResults = matchedStaticItems
      .slice(0, query ? 15 : 10)
      .map(convertStaticItem);
    results.push(...staticResults);
    // SEARCH TASKS
    if (tasks && tasks.length > 0) {
      // GET MATCHED TASKS
      const matchedTasks = tasks
        .filter(
          (task: Task) =>
            !query ||
            task.title.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query)
        )
        .slice(0, 5);
      // ADD MATCHED TASKS TO RESULTS
      matchedTasks.forEach((task: Task) => {
        // ADD TASK TO RESULTS
        results.push({
          id: `task-${task._id}`,
          title: task.title,
          subtitle:
            task.description?.substring(0, 60) || `Status: ${task.status}`,
          category: "task",
          icon: getStatusIcon(task.status),
          extra: { status: task.status },
          action: () => {
            navigate("/tasks");
            closeCommandPalette();
          },
        });
      });
    }
    // SEARCH PROJECTS
    if (projects && projects.length > 0) {
      // GET MATCHED PROJECTS
      const matchedProjects = projects
        .filter(
          (project: Project) =>
            !query ||
            project.title.toLowerCase().includes(query) ||
            project.description?.toLowerCase().includes(query)
        )
        .slice(0, 5);
      // ADD MATCHED PROJECTS TO RESULTS
      matchedProjects.forEach((project: Project) => {
        // ADD PROJECT TO RESULTS
        results.push({
          id: `project-${project._id}`,
          title: project.title,
          subtitle: project.description?.substring(0, 60) || "No description",
          category: "project",
          icon: <Folder size={18} className="text-[var(--accent-color)]" />,
          action: () => {
            navigate(`/projects/${project._id}`);
            closeCommandPalette();
          },
        });
      });
    }
    // SEARCH WORKSPACES
    if (workspaces && workspaces.length > 0) {
      // GET MATCHED WORKSPACES
      const matchedWorkspaces = workspaces
        .filter(
          (workspace: Workspace) =>
            !query ||
            workspace.name.toLowerCase().includes(query) ||
            workspace.description?.toLowerCase().includes(query)
        )
        .slice(0, 5);
      // ADD MATCHED WORKSPACES TO RESULTS
      matchedWorkspaces.forEach((workspace: Workspace) => {
        // ADD WORKSPACE TO RESULTS
        results.push({
          id: `workspace-${workspace._id}`,
          title: workspace.name,
          subtitle:
            workspace.description || `${workspace.memberCount || 1} members`,
          category: "workspace",
          icon: <Building2 size={18} className="text-[var(--accent-color)]" />,
          extra: { visibility: workspace.visibility },
          action: () => {
            navigate(`/workspaces/${workspace._id}`);
            closeCommandPalette();
          },
        });
      });
    }
    // SEARCH GITHUB REPOS
    if (githubStatus?.isConnected && githubRepos && githubRepos.length > 0) {
      // GET MATCHED GITHUB REPOS
      const matchedRepos = githubRepos
        .filter(
          (repo: GitHubRepository) =>
            !query ||
            repo.name.toLowerCase().includes(query) ||
            repo.fullName.toLowerCase().includes(query) ||
            repo.description?.toLowerCase().includes(query)
        )
        .slice(0, 5);
      // ADD MATCHED GITHUB REPOS TO RESULTS
      matchedRepos.forEach((repo: GitHubRepository) => {
        // ADD GITHUB REPO TO RESULTS
        results.push({
          id: `repo-${repo.id}`,
          title: repo.name,
          subtitle: repo.description?.substring(0, 60) || repo.fullName,
          category: "github-repo",
          icon: repo.private ? (
            <Lock size={18} className="text-yellow-500" />
          ) : (
            <Github size={18} className="text-[var(--accent-color)]" />
          ),
          extra: { language: repo.language, stars: repo.stars },
          action: () => {
            navigate(`/github/${repo.fullName}`);
            closeCommandPalette();
          },
        });
      });
    }
    // RETURN RESULTS
    return results;
  }, [
    inputValue,
    staticItems,
    tasks,
    projects,
    workspaces,
    githubStatus,
    githubRepos,
    convertStaticItem,
    getStatusIcon,
    navigate,
    closeCommandPalette,
  ]);
  // GROUP RESULTS BY CATEGORY
  const groupedResults = useMemo(() => {
    // GROUP RESULTS BY CATEGORY
    const groups: Record<string, UnifiedSearchResult[]> = {};
    // ADD RESULT TO GROUP
    searchResults.forEach((result) => {
      // GET CATEGORY
      const key = result.category;
      // ADD RESULT TO GROUP
      if (!groups[key]) {
        // ADD CATEGORY TO GROUPS
        groups[key] = [];
      }
      // ADD RESULT TO GROUP
      groups[key].push(result);
    });
    // RETURN GROUPS
    return groups;
  }, [searchResults]);
  // HANDLE SELECT
  const handleSelect = useCallback(
    (result: UnifiedSearchResult): void => {
      // CHECK IF ACTION IS PROVIDED
      if (result.action) {
        // EXECUTE ACTION
        result.action();
      } else if (result.path) {
        // NAVIGATE TO PATH
        navigate(result.path);
        // CLOSE COMMAND PALETTE
        closeCommandPalette();
      }
    },
    [navigate, closeCommandPalette]
  );
  // HANDLE INPUT CHANGE
  const handleInputChange = useCallback(
    (value: string): void => {
      // SET INPUT VALUE
      setInputValue(value);
      // SET SEARCH QUERY
      setSearchQuery(value);
    },
    [setSearchQuery]
  );
  // HANDLE BACKDROP CLICK
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      // CHECK IF BACKDROP IS CLICKED
      if (e.target === e.currentTarget) {
        // CLOSE COMMAND PALETTE
        closeCommandPalette();
      }
    },
    [closeCommandPalette]
  );
  // GET CATEGORY DISPLAY NAME
  const getDisplayName = (category: string): string => {
    // GET CATEGORY DISPLAY NAME
    const names: Record<string, string> = {
      navigation: "Navigation",
      settings: "Settings",
      action: "Quick Actions",
      task: "Tasks",
      project: "Projects",
      workspace: "Workspaces",
      github: "GitHub",
      "github-repo": "GitHub Repositories",
    };
    return names[category] || getCategoryDisplayName(category);
  };

  // <== RENDER EXTRA INFO ==>
  const renderExtra = (result: UnifiedSearchResult): JSX.Element | null => {
    // CHECK IF EXTRA IS PROVIDED
    if (!result.extra) return null;
    // TASK STATUS
    if (result.extra.status) {
      // RETURN TASK STATUS
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--inside-card-bg)] text-[var(--light-text)] group-data-[selected=true]:bg-white/20 group-data-[selected=true]:text-white capitalize">
          {String(result.extra.status)}
        </span>
      );
    }
    // WORKSPACE VISIBILITY
    if (result.extra.visibility) {
      // RETURN WORKSPACE VISIBILITY
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--inside-card-bg)] text-[var(--light-text)] group-data-[selected=true]:bg-white/20 group-data-[selected=true]:text-white flex items-center gap-1">
          {result.extra.visibility === "private" ? (
            <Lock size={10} />
          ) : (
            <Globe size={10} />
          )}
          {String(result.extra.visibility)}
        </span>
      );
    }
    // GITHUB REPO INFO
    if (result.extra.language || result.extra.stars !== undefined) {
      // GET LANGUAGE
      const language = result.extra.language
        ? String(result.extra.language)
        : null;
      // GET STARS
      const stars =
        result.extra.stars !== undefined ? Number(result.extra.stars) : null;
      // RETURN GITHUB REPO INFO
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--inside-card-bg)] text-[var(--light-text)] group-data-[selected=true]:bg-white/20 group-data-[selected=true]:text-white">
          {language && <span>{language}</span>}
          {language && stars !== null && <span> · </span>}
          {stars !== null && <span>★ {stars}</span>}
        </span>
      );
    }
    // RETURN NULL
    return null;
  };
  // CHECK IF COMMAND PALETTE IS OPEN
  if (!isOpen) return null;
  // ORDER OF GROUPS
  const groupOrder = [
    "action",
    "navigation",
    "settings",
    "task",
    "project",
    "workspace",
    "github",
    "github-repo",
  ];
  // RETURN COMMAND PALETTE COMPONENT
  return (
    // BACKDROP
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[12vh] p-4"
      onClick={handleBackdropClick}
    >
      {/* COMMAND CONTAINER */}
      <Command
        className="w-full max-w-[680px] bg-[var(--bg)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden animate-scaleIn"
        loop
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          {/* SEARCH ICON */}
          <Search
            size={20}
            className="text-[var(--light-text)] flex-shrink-0"
          />
          {/* INPUT */}
          <Command.Input
            autoFocus
            value={inputValue}
            onValueChange={handleInputChange}
            placeholder="Search tasks, projects, settings, repos..."
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--light-text)] outline-none text-sm"
          />
          {/* SHORTCUT BADGE */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--light-text)]">
            <kbd className="px-1.5 py-0.5 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded text-[10px] font-medium">
              ESC
            </kbd>
          </div>
          {/* CLOSE BUTTON */}
          <button
            onClick={closeCommandPalette}
            className="p-1 hover:bg-[var(--hover-bg)] rounded-md transition-colors"
          >
            <X size={16} className="text-[var(--light-text)]" />
          </button>
        </div>
        {/* RESULTS LIST */}
        <Command.List className="max-h-[420px] overflow-y-auto p-2">
          {/* EMPTY STATE */}
          <Command.Empty className="py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center">
                <Search size={24} className="text-[var(--light-text)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  No results found
                </p>
                <p className="text-xs text-[var(--light-text)] mt-1">
                  Try searching for tasks, projects, settings, or repos
                </p>
              </div>
            </div>
          </Command.Empty>
          {/* RENDER GROUPS IN ORDER */}
          {groupOrder.map((categoryKey) => {
            // GET ITEMS
            const items = groupedResults[categoryKey];
            // CHECK IF ITEMS ARE PROVIDED
            if (!items || items.length === 0) return null;
            // RETURN GROUP
            return (
              <Command.Group
                key={categoryKey}
                heading={
                  <span className="text-xs font-semibold text-[var(--light-text)] uppercase tracking-wider px-2 py-1 block">
                    {getDisplayName(categoryKey)}
                  </span>
                }
              >
                {items.map((result) => (
                  <Command.Item
                    key={result.id}
                    value={`${result.category} ${result.title} ${
                      result.subtitle || ""
                    }`}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-[var(--text-primary)] data-[selected=true]:bg-[var(--accent-color)] data-[selected=true]:text-white transition-colors group"
                  >
                    {/* ICON */}
                    <span className="flex-shrink-0 [&_svg]:transition-colors group-data-[selected=true]:[&_svg]:text-white">
                      {result.icon}
                    </span>
                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="text-xs text-[var(--light-text)] group-data-[selected=true]:text-white/70 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                    {/* EXTRA INFO */}
                    {renderExtra(result)}
                    {/* ARROW */}
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-data-[selected=true]:opacity-100 transition-opacity flex-shrink-0"
                    />
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
        </Command.List>
        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border)] bg-[var(--inside-card-bg)]">
          {/* LEFT SIDE - HINTS */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-[var(--light-text)]">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded text-[10px]">
                ↑↓
              </kbd>
              <span className="hidden sm:inline">Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded text-[10px]">
                ↵
              </kbd>
              <span className="hidden sm:inline">Select</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded text-[10px]">
                ⌘1-5
              </kbd>
              <span>Quick Nav</span>
            </div>
          </div>
          {/* RIGHT SIDE - BRANDING */}
          <div className="flex items-center gap-2 text-xs text-[var(--light-text)]">
            <CommandIcon size={12} />
            <span>PlanOra</span>
          </div>
        </div>
      </Command>
    </div>
  );
};

export default CommandPalette;
