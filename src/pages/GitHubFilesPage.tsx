// <== IMPORTS ==>
import {
  ArrowLeft,
  GitBranch,
  Download,
  Copy,
  ExternalLink,
  FileCode,
  Sparkles,
  ChevronDown,
  Check,
  RefreshCw,
  FolderTree,
  PanelLeftClose,
  PanelLeft,
  Loader2,
  AlertCircle,
  FilePlus,
  FileEdit,
  Trash2,
} from "lucide-react";
import {
  useGitHubStatus,
  useRepositoryDetails,
  useRepositoryTree,
  useFileContent,
  useRepositoryBranches,
  FileContent,
} from "../hooks/useGitHub";
import CodeEditor, {
  FileContentSkeleton,
  EditorToolbar,
} from "../components/github/CodeEditor";
import {
  type EditorSettings,
  defaultEditorSettings,
} from "../components/github/editorConfig";
import {
  CreateFileModal,
  EditFileModal,
  DeleteFileModal,
} from "../components/github/FileCRUDModals";
import { toast } from "@/lib/toast";
import useTitle from "../hooks/useTitle";
import FileTree from "../components/github/FileTree";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";
import AIExplainerPanel from "../components/github/AIExplainerPanel";
import { JSX, useState, useEffect, useRef, useCallback } from "react";

// <== LOCAL STORAGE KEY FOR EDITOR SETTINGS ==>
const EDITOR_SETTINGS_KEY = "planora-editor-settings";

// <== LOAD EDITOR SETTINGS FROM LOCAL STORAGE ==>
const loadEditorSettings = (): EditorSettings => {
  try {
    // GET FROM LOCAL STORAGE
    const stored = localStorage.getItem(EDITOR_SETTINGS_KEY);
    // CHECK IF STORED
    if (stored) {
      // PARSE AND RETURN
      return { ...defaultEditorSettings, ...JSON.parse(stored) };
    }
  } catch {
    // IGNORE ERRORS
  }
  // RETURN DEFAULT SETTINGS
  return defaultEditorSettings;
};

// <== SAVE EDITOR SETTINGS TO LOCAL STORAGE ==>
const saveEditorSettings = (settings: EditorSettings): void => {
  try {
    // SAVE TO LOCAL STORAGE
    localStorage.setItem(EDITOR_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // IGNORE ERRORS
  }
};

// <== BRANCH SELECTOR COMPONENT ==>
const BranchSelector = ({
  owner,
  repo,
  currentBranch,
  onSelectBranch,
}: {
  owner: string;
  repo: string;
  currentBranch: string;
  onSelectBranch: (branch: string) => void;
}): JSX.Element => {
  // DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState(false);
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement>(null);
  // GET BRANCHES
  const { branches, isLoading } = useRepositoryBranches(owner, repo, true);
  // HANDLE OUTSIDE CLICK
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK IF CLICK IS OUTSIDE
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
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // RETURN BRANCH SELECTOR
  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
      >
        <GitBranch size={14} className="text-[var(--accent-color)]" />
        <span className="max-w-[100px] truncate">{currentBranch}</span>
        <ChevronDown
          size={12}
          className={`transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[160px] max-h-[200px] overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 py-4 px-3">
              <Loader2
                size={16}
                className="animate-spin text-[var(--accent-color)]"
              />
              <span className="text-xs text-[var(--light-text)]">
                Loading branches...
              </span>
            </div>
          ) : (
            branches.map((branch) => (
              <button
                key={branch.name}
                onClick={() => {
                  onSelectBranch(branch.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                  currentBranch === branch.name
                    ? "text-[var(--accent-color)]"
                    : "text-[var(--text-primary)]"
                }`}
              >
                <GitBranch size={12} />
                <span className="flex-1 text-left truncate">{branch.name}</span>
                {currentBranch === branch.name && (
                  <Check size={12} className="text-[var(--accent-color)]" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// <== FILE HEADER COMPONENT ==>
const FileHeader = ({
  file,
  onCopy,
  onDownload,
  onExplain,
  onEdit,
  onDelete,
}: {
  file: FileContent | undefined;
  onCopy: () => void;
  onDownload: () => void;
  onExplain: () => void;
  onEdit: () => void;
  onDelete: () => void;
}): JSX.Element | null => {
  // IF NO FILE, RETURN NULL
  if (!file) return null;
  // FORMAT FILE SIZE
  const formatSize = (bytes: number): string => {
    // CHECK IF FILE SIZE IS LESS THAN 1024 BYTES
    if (bytes < 1024) return `${bytes} B`;
    // CHECK IF FILE SIZE IS LESS THAN 1024 * 1024 BYTES
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    // RETURN FILE SIZE IN MB
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  // RETURN FILE HEADER
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-[var(--inside-card-bg)] border-b border-[var(--border)]">
      <div className="flex items-center gap-2 min-w-0">
        <FileCode
          size={16}
          className="text-[var(--accent-color)] flex-shrink-0"
        />
        <span className="text-sm font-medium text-[var(--text-primary)] truncate">
          {file.name}
        </span>
        <span className="text-xs text-[var(--light-text)] flex-shrink-0 hidden sm:inline">
          {formatSize(file.size)}
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded hidden sm:inline"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent-color) 15%, transparent)",
            color: "var(--accent-color)",
          }}
        >
          {file.language}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-md text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          title="Edit file"
        >
          <FileEdit size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md text-[var(--light-text)] hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
          title="Delete file"
        >
          <Trash2 size={14} />
        </button>
        <div className="w-px h-4 bg-[var(--border)] mx-0.5" />
        <button
          onClick={onExplain}
          className="p-1.5 rounded-md text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          title="AI Explain Code"
        >
          <Sparkles size={14} />
        </button>
        <button
          onClick={onCopy}
          className="p-1.5 rounded-md text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          title="Copy code"
        >
          <Copy size={14} />
        </button>
        <button
          onClick={onDownload}
          className="p-1.5 rounded-md text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          title="Download file"
        >
          <Download size={14} />
        </button>
        {file.htmlUrl && (
          <a
            href={file.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition"
            title="View on GitHub"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

// <== GITHUB FILES PAGE COMPONENT ==>
const GitHubFilesPage = (): JSX.Element => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // GET PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // SET PAGE TITLE
  useTitle(`PlanOra - Files - ${owner}/${repo}`);
  // GITHUB STATUS HOOK
  const { status, isLoading: isStatusLoading } = useGitHubStatus();
  // REPOSITORY DETAILS HOOK
  const { repository, isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || "",
    status?.isConnected ?? false
  );
  // SELECTED BRANCH STATE
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  // SELECTED FILE PATH STATE
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  // SIDEBAR VISIBLE STATE
  const [sidebarVisible, setSidebarVisible] = useState(true);
  // AI EXPLAINER PANEL STATE
  const [showAIExplainer, setShowAIExplainer] = useState(false);
  // EDITOR SETTINGS STATE (WITH LOCAL STORAGE PERSISTENCE)
  const [editorSettings, setEditorSettings] =
    useState<EditorSettings>(loadEditorSettings);
  // HANDLE EDITOR SETTINGS CHANGE
  const handleEditorSettingsChange = useCallback((settings: EditorSettings) => {
    // UPDATE STATE
    setEditorSettings(settings);
    // SAVE TO LOCAL STORAGE
    saveEditorSettings(settings);
  }, []);
  // CREATE FILE MODAL STATE
  const [showCreateFileModal, setShowCreateFileModal] = useState(false);
  // EDIT FILE MODAL STATE
  const [showEditFileModal, setShowEditFileModal] = useState(false);
  // DELETE FILE MODAL STATE
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  // DELETE ITEM STATE (FOR BOTH FILES AND FOLDERS)
  const [deleteItemInfo, setDeleteItemInfo] = useState<{
    path: string;
    name: string;
    type: "file" | "dir";
    sha: string;
  } | null>(null);
  // SET DEFAULT BRANCH WHEN REPO LOADS
  useEffect(() => {
    // CHECK IF DEFAULT BRANCH IS SET AND NO BRANCH IS SELECTED
    if (repository?.defaultBranch && !selectedBranch) {
      // SET DEFAULT BRANCH
      setSelectedBranch(repository.defaultBranch);
    }
  }, [repository, selectedBranch]);
  // GET REPOSITORY TREE
  const {
    tree,
    isLoading: isTreeLoading,
    refetch: refetchTree,
  } = useRepositoryTree(
    owner || "",
    repo || "",
    selectedBranch || undefined,
    true,
    status?.isConnected && !!selectedBranch
  );
  // FILE CONTENT HOOK
  const {
    file,
    isLoading: isFileLoading,
    refetch: refetchFile,
  } = useFileContent(
    owner || "",
    repo || "",
    selectedFilePath || "",
    selectedBranch || undefined,
    status?.isConnected && !!selectedFilePath
  );
  // HANDLE SELECT FILE
  const handleSelectFile = (path: string) => {
    // SET SELECTED FILE PATH
    setSelectedFilePath(path);
  };
  // HANDLE COPY CODE
  const handleCopyCode = () => {
    // CHECK IF FILE CONTENT IS SET
    if (file?.content) {
      // COPY FILE CONTENT TO CLIPBOARD
      navigator.clipboard.writeText(file.content);
      // SHOW SUCCESS TOAST
      toast.success("Code copied to clipboard!");
    }
  };
  // HANDLE DOWNLOAD FILE
  const handleDownloadFile = () => {
    // CHECK IF FILE DOWNLOAD URL IS SET
    if (file?.downloadUrl) {
      // OPEN FILE DOWNLOAD URL IN NEW TAB
      window.open(file.downloadUrl, "_blank");
    } else if (file?.content) {
      // CREATE BLOB FROM FILE CONTENT
      const blob = new Blob([file.content], { type: "text/plain" });
      // CREATE OBJECT URL FROM BLOB
      const url = URL.createObjectURL(blob);
      // CREATE DOWNLOAD LINK
      const a = document.createElement("a");
      // SET DOWNLOAD LINK HREF
      a.href = url;
      // SET DOWNLOAD LINK DOWNLOAD NAME
      a.download = file.name;
      // CLICK DOWNLOAD LINK
      a.click();
      // REVOKE OBJECT URL
      URL.revokeObjectURL(url);
      // SHOW SUCCESS TOAST
      toast.success("File downloaded successfully!");
    }
  };
  // LOADING STATE (STATUS OR REPO)
  if (isStatusLoading || isRepoLoading) {
    return (
      <div
        className="min-h-screen pb-0.5 flex flex-col"
        style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
      >
        <DashboardHeader
          title="File Explorer"
          subtitle="Loading repository..."
          showSearch={false}
        />
        <div className="flex-1 flex flex-col m-4 gap-4">
          {/* TOP BAR SKELETON */}
          <div className="p-3 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg animate-pulse"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--light-text) 10%, transparent)",
                }}
              />
              <div className="h-1 w-px bg-[var(--border)]" />
              <div
                className="h-5 w-32 rounded animate-pulse"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--light-text) 15%, transparent)",
                }}
              />
              <div
                className="h-7 w-24 rounded-lg animate-pulse"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--light-text) 10%, transparent)",
                }}
              />
            </div>
          </div>
          {/* MAIN CONTENT SKELETON */}
          <div className="flex-1 flex gap-4 min-h-[400px]">
            {/* SIDEBAR SKELETON */}
            <div className="hidden lg:flex flex-col w-72 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="px-3 py-2 border-b border-[var(--border)]">
                <div
                  className="h-4 w-16 rounded animate-pulse"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--light-text) 15%, transparent)",
                  }}
                />
              </div>
              <div className="p-2 space-y-1">
                {[60, 45, 70, 50, 30, 65, 40, 55].map((w, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5">
                    <div
                      className="w-4 h-4 rounded animate-pulse"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--light-text) 10%, transparent)",
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                    <div
                      className="h-3 rounded animate-pulse"
                      style={{
                        width: `${w}%`,
                        backgroundColor:
                          "color-mix(in srgb, var(--light-text) 15%, transparent)",
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* EDITOR SKELETON */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                }}
              >
                <Loader2
                  size={32}
                  className="animate-spin text-[var(--accent-color)]"
                />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                Loading Repository
              </p>
              <p className="text-xs text-[var(--light-text)]">
                Fetching file structure...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // NOT CONNECTED STATE
  if (!status?.isConnected) {
    return (
      <div
        className="min-h-screen pb-0.5"
        style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
      >
        <DashboardHeader
          title="Files"
          subtitle="Connect your GitHub account"
          showSearch={false}
        />
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <AlertCircle size={48} className="text-[var(--light-text)] mb-4" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            GitHub Not Connected
          </h2>
          <p className="text-sm text-[var(--light-text)] text-center mb-4">
            Connect your GitHub account to browse repository files.
          </p>
          <Link
            to="/settings?tab=Integrations"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition"
          >
            Connect GitHub
          </Link>
        </div>
      </div>
    );
  }
  // RETURN GITHUB FILES PAGE
  return (
    <div
      className="min-h-screen pb-0.5 flex flex-col"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
    >
      {/* PAGE HEADER */}
      <DashboardHeader
        title="File Explorer"
        subtitle={`${owner}/${repo}`}
        showSearch={false}
      />
      {/* CONTENT */}
      <div className="flex-1 flex flex-col m-4 gap-4 overflow-hidden">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
          {/* LEFT - NAVIGATION */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/github/${owner}/${repo}`)}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              title="Back to repository"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="h-6 w-px bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <FolderTree size={18} className="text-[var(--accent-color)]" />
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {repository?.name || repo}
              </span>
            </div>
            {selectedBranch && (
              <BranchSelector
                owner={owner || ""}
                repo={repo || ""}
                currentBranch={selectedBranch}
                onSelectBranch={(branch) => {
                  setSelectedBranch(branch);
                  setSelectedFilePath(null);
                }}
              />
            )}
          </div>
          {/* RIGHT - ACTIONS */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setSidebarVisible(!sidebarVisible)}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer lg:hidden"
              title={sidebarVisible ? "Hide file tree" : "Show file tree"}
            >
              {sidebarVisible ? (
                <PanelLeftClose size={18} />
              ) : (
                <PanelLeft size={18} />
              )}
            </button>
            <button
              onClick={() => {
                refetchTree();
                if (selectedFilePath) refetchFile();
              }}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={() => setShowCreateFileModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
              title="Create new file or folder"
            >
              <FilePlus size={14} />
              <span className="hidden sm:inline">New</span>
            </button>
            {repository?.htmlUrl && (
              <a
                href={repository.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">View on GitHub</span>
              </a>
            )}
          </div>
        </div>
        {/* MAIN CONTENT - SPLIT VIEW */}
        <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
          {/* FILE TREE SIDEBAR */}
          <div
            className={`${
              sidebarVisible ? "flex" : "hidden"
            } lg:flex flex-col w-full sm:w-64 lg:w-72 flex-shrink-0 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] overflow-hidden`}
          >
            {/* SIDEBAR HEADER */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
              <span className="text-xs font-medium text-[var(--text-primary)]">
                Files
              </span>
              <span className="text-xs text-[var(--light-text)]">
                {tree?.tree?.length || 0} items
              </span>
            </div>
            {/* FILE TREE */}
            <FileTree
              treeData={tree}
              isLoading={isTreeLoading}
              selectedPath={selectedFilePath}
              onSelectFile={handleSelectFile}
              onDeleteItem={(path, name, type, sha) => {
                setDeleteItemInfo({ path, name, type, sha });
                setShowDeleteFileModal(true);
              }}
              className="flex-1 p-2"
            />
          </div>
          {/* CODE EDITOR AREA */}
          <div className="flex-1 flex flex-col bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] overflow-hidden min-w-0">
            {selectedFilePath ? (
              <>
                {/* FILE HEADER */}
                <FileHeader
                  file={file}
                  onCopy={handleCopyCode}
                  onDownload={handleDownloadFile}
                  onExplain={() => setShowAIExplainer(true)}
                  onEdit={() => setShowEditFileModal(true)}
                  onDelete={() => {
                    setDeleteItemInfo(null);
                    setShowDeleteFileModal(true);
                  }}
                />
                {/* EDITOR TOOLBAR */}
                <EditorToolbar
                  settings={editorSettings}
                  onSettingsChange={handleEditorSettingsChange}
                />
                {/* EDITOR */}
                <div className="flex-1 overflow-hidden relative">
                  {isFileLoading ? (
                    <FileContentSkeleton className="h-full" />
                  ) : file ? (
                    <CodeEditor
                      value={file.content}
                      language={file.language}
                      readOnly={true}
                      height="100%"
                      settings={editorSettings}
                      className="h-full border-0 rounded-none"
                    />
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--light-text) 10%, transparent)",
                        }}
                      >
                        <AlertCircle
                          size={28}
                          className="text-[var(--light-text)]"
                        />
                      </div>
                      <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                        Failed to Load File
                      </p>
                      <p className="text-xs text-[var(--light-text)] max-w-xs">
                        Unable to fetch the file content. The file may be too
                        large or binary.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // EMPTY STATE
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                  }}
                >
                  <FileCode size={32} className="text-[var(--accent-color)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Select a file to view
                </h3>
                <p className="text-sm text-[var(--light-text)] max-w-md">
                  Choose a file from the tree on the left to view its contents.
                  You can browse through folders and view code files.
                </p>
              </div>
            )}
          </div>
        </div>
        {/* BREADCRUMB / PATH */}
        {selectedFilePath && (
          <div className="flex items-center gap-1 px-3 py-2 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] text-xs text-[var(--light-text)] overflow-x-auto">
            <span className="text-[var(--text-primary)] font-medium flex-shrink-0">
              {repository?.name}
            </span>
            {selectedFilePath.split("/").map((part, index, arr) => (
              <span
                key={index}
                className="flex items-center gap-1 flex-shrink-0"
              >
                <span>/</span>
                <span
                  className={
                    index === arr.length - 1
                      ? "text-[var(--accent-color)] font-medium"
                      : ""
                  }
                >
                  {part}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
      {/* AI EXPLAINER PANEL */}
      <AIExplainerPanel
        isOpen={showAIExplainer}
        onClose={() => setShowAIExplainer(false)}
        code={file?.content || ""}
        language={file?.language}
        fileName={file?.name}
      />
      {/* CREATE FILE MODAL */}
      <CreateFileModal
        isOpen={showCreateFileModal}
        onClose={() => setShowCreateFileModal(false)}
        owner={owner || ""}
        repo={repo || ""}
        branch={selectedBranch}
        currentPath={
          selectedFilePath
            ? selectedFilePath.split("/").slice(0, -1).join("/")
            : ""
        }
        treeData={tree}
        onSuccess={(path) => {
          setSelectedFilePath(path);
          refetchTree();
        }}
      />
      {/* EDIT FILE MODAL */}
      {file && (
        <EditFileModal
          isOpen={showEditFileModal}
          onClose={() => setShowEditFileModal(false)}
          owner={owner || ""}
          repo={repo || ""}
          branch={selectedBranch}
          filePath={selectedFilePath || ""}
          fileName={file.name}
          fileContent={file.content}
          fileSha={file.sha}
          fileLanguage={file.language}
          onSuccess={() => {
            refetchFile();
          }}
        />
      )}
      {/* DELETE FILE MODAL */}
      {(deleteItemInfo || file) && (
        <DeleteFileModal
          isOpen={showDeleteFileModal}
          onClose={() => {
            setShowDeleteFileModal(false);
            setDeleteItemInfo(null);
          }}
          owner={owner || ""}
          repo={repo || ""}
          branch={selectedBranch}
          filePath={deleteItemInfo?.path || selectedFilePath || ""}
          fileName={deleteItemInfo?.name || file?.name || ""}
          fileSha={deleteItemInfo?.sha || file?.sha || ""}
          isFolder={deleteItemInfo?.type === "dir"}
          treeData={tree}
          onSuccess={() => {
            if (
              deleteItemInfo?.path === selectedFilePath ||
              deleteItemInfo?.type === "dir"
            ) {
              setSelectedFilePath(null);
            }
            setDeleteItemInfo(null);
            refetchTree();
          }}
        />
      )}
    </div>
  );
};

export default GitHubFilesPage;
