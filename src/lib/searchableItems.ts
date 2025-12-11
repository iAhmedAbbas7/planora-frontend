// <== SEARCHABLE ITEMS REGISTRY ==>
import {
  LayoutDashboard,
  Folder,
  ListTodo,
  Settings,
  Trash,
  Github,
  Building2,
  Bell,
  User,
  Palette,
  Shield,
  Link2,
  Mail,
  Key,
  Monitor,
  Moon,
  Sun,
  UserX,
  Lock,
  QrCode,
  RefreshCw,
  BellRing,
  BellOff,
  Star,
  FolderGit2,
  CircleDot,
  GitPullRequest,
  PenLine,
  Camera,
  FileText,
  type LucideIcon,
} from "lucide-react";

// <== SEARCHABLE ITEM TYPE ==>
export type SearchableItem = {
  // <== ID ==>
  id: string;
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description?: string;
  // <== KEYWORDS ==>
  keywords: string[];
  // <== CATEGORY ==>
  category:
    | "navigation"
    | "settings"
    | "settings-profile"
    | "settings-appearance"
    | "settings-notifications"
    | "settings-account"
    | "settings-security"
    | "settings-integrations"
    | "action"
    | "github"
    | "workspace"
    | "task"
    | "project";
  // <== PATH ==>
  path: string;
  // <== ICON ==>
  icon: LucideIcon;
  // <== PARENT ==>
  parent?: string;
};

// <== NAVIGATION ITEMS ==>
export const NAVIGATION_ITEMS: SearchableItem[] = [
  // <== DASHBOARD ITEM ==>
  {
    id: "nav-dashboard",
    title: "Dashboard",
    description: "View your dashboard and overview",
    keywords: ["home", "overview", "main", "dashboard"],
    category: "navigation",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  // <== PROJECTS ITEM ==>
  {
    id: "nav-projects",
    title: "Projects",
    description: "Manage your projects",
    keywords: ["project", "projects", "manage", "folders"],
    category: "navigation",
    path: "/projects",
    icon: Folder,
  },
  // <== TASKS ITEM ==>
  {
    id: "nav-tasks",
    title: "Tasks",
    description: "View and manage your tasks",
    keywords: ["task", "tasks", "todo", "checklist", "to-do"],
    category: "navigation",
    path: "/tasks",
    icon: ListTodo,
  },
  // <== WORKSPACES ITEM ==>
  {
    id: "nav-workspaces",
    title: "Workspaces",
    description: "Collaborate in team workspaces",
    keywords: ["workspace", "team", "collaborate", "organization"],
    category: "navigation",
    path: "/workspaces",
    icon: Building2,
  },
  // <== GITHUB ITEM ==>
  {
    id: "nav-github",
    title: "GitHub",
    description: "GitHub integration and repositories",
    keywords: ["github", "git", "repository", "repo", "code"],
    category: "navigation",
    path: "/github",
    icon: Github,
  },
  // <== TRASH ITEM ==>
  {
    id: "nav-trash",
    title: "Trash",
    description: "View deleted items",
    keywords: ["trash", "deleted", "remove", "bin", "recycle"],
    category: "navigation",
    path: "/trash",
    icon: Trash,
  },
  // <== SETTINGS ITEM ==>
  {
    id: "nav-settings",
    title: "Settings",
    description: "Manage your account settings",
    keywords: ["settings", "preferences", "config", "options"],
    category: "navigation",
    path: "/settings",
    icon: Settings,
  },
  // <== NOTIFICATIONS ITEM ==>
  {
    id: "nav-notifications",
    title: "Notifications",
    description: "View your notifications",
    keywords: ["notifications", "alerts", "messages"],
    category: "navigation",
    path: "/notifications",
    icon: Bell,
  },
];

// <== SETTINGS TABS ==>
export const SETTINGS_TABS: SearchableItem[] = [
  // <== PROFILE ITEM ==>
  {
    id: "settings-profile",
    title: "Profile Settings",
    description: "Manage your profile information",
    keywords: ["profile", "name", "avatar", "bio", "personal info"],
    category: "settings",
    path: "/settings?tab=Profile",
    icon: User,
    parent: "nav-settings",
  },
  // <== APPEARANCE ITEM ==>
  {
    id: "settings-appearance",
    title: "Appearance Settings",
    description: "Customize theme and colors",
    keywords: [
      "appearance",
      "theme",
      "dark mode",
      "light mode",
      "color",
      "accent",
    ],
    category: "settings",
    path: "/settings?tab=Appearance",
    icon: Palette,
    parent: "nav-settings",
  },
  // <== NOTIFICATIONS ITEM ==>
  {
    id: "settings-notifications",
    title: "Notification Settings",
    description: "Configure notification preferences",
    keywords: ["notifications", "alerts", "email", "push", "preferences"],
    category: "settings",
    path: "/settings?tab=Notifications",
    icon: Bell,
    parent: "nav-settings",
  },
  // <== ACCOUNT ITEM ==>
  {
    id: "settings-account",
    title: "Account Settings",
    description: "Manage your account details",
    keywords: ["account", "email", "password", "delete account"],
    category: "settings",
    path: "/settings?tab=Account",
    icon: Settings,
    parent: "nav-settings",
  },
  // <== SECURITY ITEM ==>
  {
    id: "settings-security",
    title: "Security Settings",
    description: "Manage security and authentication",
    keywords: [
      "security",
      "2fa",
      "two-factor",
      "authentication",
      "sessions",
      "password",
    ],
    category: "settings",
    path: "/settings?tab=Security",
    icon: Shield,
    parent: "nav-settings",
  },
  // <== INTEGRATIONS ITEM ==>
  {
    id: "settings-integrations",
    title: "Integrations",
    description: "Connect third-party services",
    keywords: ["integrations", "github", "connect", "link", "oauth"],
    category: "settings",
    path: "/settings?tab=Integrations",
    icon: Link2,
    parent: "nav-settings",
  },
];

// <== SETTINGS SUB-ITEMS (PROFILE) ==>
export const SETTINGS_PROFILE_ITEMS: SearchableItem[] = [
  // <== EDIT NAME ITEM ==>
  {
    id: "profile-edit-name",
    title: "Edit Profile Name",
    description: "Change your display name",
    keywords: ["name", "display name", "change name", "edit name"],
    category: "settings-profile",
    path: "/settings?tab=Profile",
    icon: PenLine,
    parent: "settings-profile",
  },
  // <== AVATAR ITEM ==>
  {
    id: "profile-avatar",
    title: "Profile Picture",
    description: "Upload or change your profile picture",
    keywords: ["avatar", "profile picture", "photo", "image", "upload"],
    category: "settings-profile",
    path: "/settings?tab=Profile",
    icon: Camera,
    parent: "settings-profile",
  },
  // <== BIO ITEM ==>
  {
    id: "profile-bio",
    title: "Profile Bio",
    description: "Update your bio description",
    keywords: ["bio", "about", "description", "about me"],
    category: "settings-profile",
    path: "/settings?tab=Profile",
    icon: FileText,
    parent: "settings-profile",
  },
];

// <== SETTINGS SUB-ITEMS (APPEARANCE) ==>
export const SETTINGS_APPEARANCE_ITEMS: SearchableItem[] = [
  // <== DARK MODE ITEM ==>
  {
    id: "appearance-dark-mode",
    title: "Dark Mode",
    description: "Switch to dark theme",
    keywords: ["dark mode", "dark theme", "night mode"],
    category: "settings-appearance",
    path: "/settings?tab=Appearance",
    icon: Moon,
    parent: "settings-appearance",
  },
  // <== LIGHT MODE ITEM ==>
  {
    id: "appearance-light-mode",
    title: "Light Mode",
    description: "Switch to light theme",
    keywords: ["light mode", "light theme", "day mode"],
    category: "settings-appearance",
    path: "/settings?tab=Appearance",
    icon: Sun,
    parent: "settings-appearance",
  },
  // <== ACCENT COLOR ITEM ==>
  {
    id: "appearance-accent-color",
    title: "Accent Color",
    description: "Change accent color (Violet, Pink, Blue, Green)",
    keywords: [
      "accent",
      "color",
      "violet",
      "pink",
      "blue",
      "green",
      "theme color",
    ],
    category: "settings-appearance",
    path: "/settings?tab=Appearance",
    icon: Palette,
    parent: "settings-appearance",
  },
];

// <== SETTINGS SUB-ITEMS (NOTIFICATIONS) ==>
export const SETTINGS_NOTIFICATIONS_ITEMS: SearchableItem[] = [
  // <== EMAIL NOTIFICATIONS ITEM ==>
  {
    id: "notifications-email",
    title: "Email Notifications",
    description: "Configure email notification preferences",
    keywords: ["email notifications", "email alerts", "mail notifications"],
    category: "settings-notifications",
    path: "/settings?tab=Notifications",
    icon: Mail,
    parent: "settings-notifications",
  },
  // <== PUSH NOTIFICATIONS ITEM ==>
  {
    id: "notifications-push",
    title: "Push Notifications",
    description: "Enable or disable push notifications",
    keywords: [
      "push notifications",
      "browser notifications",
      "desktop notifications",
    ],
    category: "settings-notifications",
    path: "/settings?tab=Notifications",
    icon: BellRing,
    parent: "settings-notifications",
  },
  // <== MUTE NOTIFICATIONS ITEM ==>
  {
    id: "notifications-mute",
    title: "Mute Notifications",
    description: "Mute all notifications",
    keywords: [
      "mute",
      "silence",
      "disable notifications",
      "turn off notifications",
    ],
    category: "settings-notifications",
    path: "/settings?tab=Notifications",
    icon: BellOff,
    parent: "settings-notifications",
  },
];

// <== SETTINGS SUB-ITEMS (ACCOUNT) ==>
export const SETTINGS_ACCOUNT_ITEMS: SearchableItem[] = [
  // <== CHANGE EMAIL ITEM ==>
  {
    id: "account-change-email",
    title: "Change Email",
    description: "Update your email address",
    keywords: ["change email", "update email", "email address"],
    category: "settings-account",
    path: "/settings?tab=Account",
    icon: Mail,
    parent: "settings-account",
  },
  // <== RECOVERY EMAIL ITEM ==>
  {
    id: "account-recovery-email",
    title: "Recovery Email",
    description: "Set up a recovery email address",
    keywords: ["recovery email", "backup email", "secondary email"],
    category: "settings-account",
    path: "/settings?tab=Account",
    icon: RefreshCw,
    parent: "settings-account",
  },
  // <== DELETE ACCOUNT ITEM ==>
  {
    id: "account-delete",
    title: "Delete Account",
    description: "Permanently delete your account",
    keywords: ["delete account", "remove account", "close account"],
    category: "settings-account",
    path: "/settings?tab=Account",
    icon: UserX,
    parent: "settings-account",
  },
];

// <== SETTINGS SUB-ITEMS (SECURITY) ==>
export const SETTINGS_SECURITY_ITEMS: SearchableItem[] = [
  // <== CHANGE PASSWORD ITEM ==>
  {
    id: "security-change-password",
    title: "Change Password",
    description: "Update your account password",
    keywords: ["change password", "update password", "new password"],
    category: "settings-security",
    path: "/settings?tab=Security",
    icon: Key,
    parent: "settings-security",
  },
  // <== TWO-FACTOR AUTHENTICATION ITEM ==>
  {
    id: "security-2fa",
    title: "Two-Factor Authentication",
    description: "Enable or manage 2FA for extra security",
    keywords: [
      "2fa",
      "two-factor",
      "two factor",
      "authentication",
      "mfa",
      "authenticator",
    ],
    category: "settings-security",
    path: "/settings?tab=Security",
    icon: QrCode,
    parent: "settings-security",
  },
  // <== ACTIVE SESSIONS ITEM ==>
  {
    id: "security-sessions",
    title: "Active Sessions",
    description: "View and manage active login sessions",
    keywords: ["sessions", "active sessions", "devices", "logged in"],
    category: "settings-security",
    path: "/settings?tab=Security",
    icon: Monitor,
    parent: "settings-security",
  },
  // <== BACKUP CODES ITEM ==>
  {
    id: "security-backup-codes",
    title: "Backup Codes",
    description: "View or regenerate backup codes for 2FA",
    keywords: ["backup codes", "recovery codes", "2fa backup"],
    category: "settings-security",
    path: "/settings?tab=Security",
    icon: Lock,
    parent: "settings-security",
  },
];

// <== SETTINGS SUB-ITEMS (INTEGRATIONS) ==>
export const SETTINGS_INTEGRATIONS_ITEMS: SearchableItem[] = [
  // <== CONNECT GITHUB ITEM ==>
  {
    id: "integrations-github",
    title: "Connect GitHub",
    description: "Link your GitHub account",
    keywords: ["github", "connect github", "link github", "github integration"],
    category: "settings-integrations",
    path: "/settings?tab=Integrations",
    icon: Github,
    parent: "settings-integrations",
  },
  // <== DISCONNECT INTEGRATIONS ITEM ==>
  {
    id: "integrations-disconnect",
    title: "Disconnect Integrations",
    description: "Remove linked accounts",
    keywords: ["disconnect", "unlink", "remove integration"],
    category: "settings-integrations",
    path: "/settings?tab=Integrations",
    icon: Link2,
    parent: "settings-integrations",
  },
];

// <== QUICK ACTIONS ==>
export const QUICK_ACTIONS: SearchableItem[] = [
  // <== CREATE NEW TASK ITEM ==>
  {
    id: "action-new-task",
    title: "Create New Task",
    description: "Add a new task to a project",
    keywords: ["create task", "new task", "add task"],
    category: "action",
    path: "/tasks",
    icon: ListTodo,
  },
  // <== CREATE NEW PROJECT ITEM ==>
  {
    id: "action-new-project",
    title: "Create New Project",
    description: "Start a new project",
    keywords: ["create project", "new project", "add project"],
    category: "action",
    path: "/projects",
    icon: Folder,
  },
  // <== CREATE NEW WORKSPACE ITEM ==>
  {
    id: "action-new-workspace",
    title: "Create New Workspace",
    description: "Create a team workspace",
    keywords: ["create workspace", "new workspace", "add workspace"],
    category: "action",
    path: "/workspaces",
    icon: Building2,
  },
];

// <== GITHUB SUB-PAGES ==>
export const GITHUB_PAGES: SearchableItem[] = [
  // <== GITHUB REPOSITORIES ITEM ==>
  {
    id: "github-repos",
    title: "GitHub Repositories",
    description: "Browse your GitHub repositories",
    keywords: ["repositories", "repos", "github repos"],
    category: "github",
    path: "/github",
    icon: FolderGit2,
    parent: "nav-github",
  },
  // <== GITHUB PROFILE ITEM ==>
  {
    id: "github-profile",
    title: "GitHub Profile",
    description: "View your GitHub profile",
    keywords: ["github profile", "profile", "user profile"],
    category: "github",
    path: "/github/profile",
    icon: User,
    parent: "nav-github",
  },
  // <== GITHUB STARRED REPOSITORIES ITEM ==>
  {
    id: "github-starred",
    title: "Starred Repositories",
    description: "View repositories you've starred",
    keywords: ["starred", "stars", "favorite repos"],
    category: "github",
    path: "/github",
    icon: Star,
    parent: "nav-github",
  },
  // <== GITHUB ISSUES ITEM ==>
  {
    id: "github-issues",
    title: "GitHub Issues",
    description: "View and manage issues",
    keywords: ["issues", "bugs", "github issues"],
    category: "github",
    path: "/github",
    icon: CircleDot,
    parent: "nav-github",
  },
  // <== GITHUB PULL REQUESTS ITEM ==>
  {
    id: "github-pull-requests",
    title: "Pull Requests",
    description: "View and manage pull requests",
    keywords: ["pull requests", "prs", "merge requests"],
    category: "github",
    path: "/github",
    icon: GitPullRequest,
    parent: "nav-github",
  },
];

// <== GET ALL STATIC SEARCHABLE ITEMS ==>
export const getAllStaticSearchableItems = (): SearchableItem[] => {
  // RETURN ALL STATIC SEARCHABLE ITEMS
  return [
    ...NAVIGATION_ITEMS,
    ...SETTINGS_TABS,
    ...SETTINGS_PROFILE_ITEMS,
    ...SETTINGS_APPEARANCE_ITEMS,
    ...SETTINGS_NOTIFICATIONS_ITEMS,
    ...SETTINGS_ACCOUNT_ITEMS,
    ...SETTINGS_SECURITY_ITEMS,
    ...SETTINGS_INTEGRATIONS_ITEMS,
    ...QUICK_ACTIONS,
    ...GITHUB_PAGES,
  ];
};

// <== SEARCH FUNCTION ==>
export const searchItems = (
  query: string,
  items: SearchableItem[]
): SearchableItem[] => {
  // IF NO QUERY, RETURN EMPTY ARRAY
  if (!query.trim()) return [];
  // NORMALIZE QUERY
  const normalizedQuery = query.toLowerCase().trim();
  // FILTER AND SCORE ITEMS
  const scoredItems = items
    .map((item) => {
      // INITIAL SCORE
      let score = 0;
      // EXACT TITLE MATCH (HIGHEST SCORE)
      if (item.title.toLowerCase() === normalizedQuery) {
        // SET SCORE TO 100
        score += 100;
      }
      // TITLE STARTS WITH QUERY
      else if (item.title.toLowerCase().startsWith(normalizedQuery)) {
        // SET SCORE TO 80
        score += 80;
      }
      // TITLE CONTAINS QUERY
      else if (item.title.toLowerCase().includes(normalizedQuery)) {
        // SET SCORE TO 60
        score += 60;
      }
      // DESCRIPTION MATCH
      if (item.description?.toLowerCase().includes(normalizedQuery)) {
        // SET SCORE TO 30
        score += 30;
      }
      // KEYWORD MATCHES
      item.keywords.forEach((keyword) => {
        // EXACT KEYWORD MATCH (HIGHEST SCORE)
        if (keyword.toLowerCase() === normalizedQuery) {
          // SET SCORE TO 50
          score += 50;
        } else if (keyword.toLowerCase().includes(normalizedQuery)) {
          // SET SCORE TO 20
          score += 20;
        }
      });
      // RETURN ITEM AND SCORE
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  // RETURN FILTERED AND SORTED ITEMS
  return scoredItems.map(({ item }) => item);
};

// <== GROUP ITEMS BY CATEGORY ==>
export const groupItemsByCategory = (
  items: SearchableItem[]
): Record<string, SearchableItem[]> => {
  // CREATE GROUPS OBJECT
  const groups: Record<string, SearchableItem[]> = {};
  // LOOP THROUGH ITEMS
  items.forEach((item) => {
    // SIMPLIFY CATEGORY FOR GROUPING
    let groupKey = item.category;
    // SIMPLIFY SETTINGS SUB-CATEGORIES
    if (groupKey.startsWith("settings-")) {
      // SET GROUP KEY TO SETTINGS
      groupKey = "settings";
    }
    // IF GROUP KEY DOES NOT EXIST, CREATE IT
    if (!groups[groupKey]) {
      // CREATE GROUP
      groups[groupKey] = [];
    }
    // ADD ITEM TO GROUP
    groups[groupKey].push(item);
  });
  // RETURN GROUPS
  return groups;
};

// <== GET CATEGORY DISPLAY NAME ==>
export const getCategoryDisplayName = (category: string): string => {
  // DISPLAY NAMES FOR CATEGORIES
  const displayNames: Record<string, string> = {
    navigation: "Navigation",
    settings: "Settings",
    action: "Quick Actions",
    github: "GitHub",
    workspace: "Workspaces",
    task: "Tasks",
    project: "Projects",
  };
  // RETURN DISPLAY NAME OR CATEGORY
  return displayNames[category] || category;
};
