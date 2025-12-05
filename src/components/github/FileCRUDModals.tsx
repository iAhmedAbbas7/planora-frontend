// <== IMPORTS ==>
import {
  X,
  FilePlus,
  FileEdit,
  Trash2,
  Loader2,
  AlertTriangle,
  FileCode,
  Check,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  File,
} from "lucide-react";
import {
  useCreateFile,
  useUpdateFile,
  useDeleteFile,
  CreateFileInput,
  UpdateFileInput,
} from "../../hooks/useGitHub";
import { toast } from "@/lib/toast";
import CodeEditor, { EditorToolbar } from "./CodeEditor";
import { useState, useEffect, JSX, useCallback, useMemo } from "react";
import { type EditorSettings, defaultEditorSettings } from "./editorConfig";

// <== LOCAL STORAGE KEY FOR EDITOR SETTINGS ==>
const EDITOR_SETTINGS_KEY = "planora-editor-settings";

// <== LOAD EDITOR SETTINGS FROM LOCAL STORAGE ==>
const loadEditorSettings = (): EditorSettings => {
  // TRY TO GET FROM LOCAL STORAGE
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

// <== BUILD FOLDER TREE FROM FLAT LIST ==>
type FolderNode = {
  // <== NAME ==>
  name: string;
  // <== PATH ==>
  path: string;
  // <== CHILDREN ==>
  children: FolderNode[];
};

const buildFolderTree = (
  items: { path: string; type: string }[]
): FolderNode[] => {
  // ROOT NODES
  const root: FolderNode[] = [];
  // PATH MAP
  const pathMap = new Map<string, FolderNode>();
  // FILTER DIRECTORIES (type === "tree" in GitHub API)
  const dirs = items
    // FILTER BY TYPE
    .filter((item) => item.type === "tree")
    .sort((a, b) => a.path.localeCompare(b.path));
  // BUILD TREE
  dirs.forEach((item) => {
    // SPLIT PATH INTO PARTS
    const parts = item.path.split("/");
    // GET NAME
    const name = parts[parts.length - 1];
    // CREATE NODE
    const node: FolderNode = { name, path: item.path, children: [] };
    // ADD TO PATH MAP
    pathMap.set(item.path, node);
    // FIND PARENT
    if (parts.length === 1) {
      // ROOT LEVEL FOLDER
      root.push(node);
    } else {
      // FIND PARENT PATH
      const parentPath = parts.slice(0, -1).join("/");
      // FIND PARENT NODE
      const parent = pathMap.get(parentPath);
      // CHECK IF PARENT EXISTS
      if (parent) {
        // ADD NODE TO PARENT CHILDREN
        parent.children.push(node);
      } else {
        // PARENT NOT FOUND, ADD TO ROOT
        root.push(node);
      }
    }
  });
  return root;
};

// <== FOLDER SELECTOR COMPONENT ==>
type FolderSelectorProps = {
  // <== TREE DATA ==>
  treeData?: { tree: { path: string; type: string }[] };
  // <== SELECTED PATH ==>
  selectedPath: string;
  // <== ON SELECT PATH ==>
  onSelectPath: (path: string) => void;
};

const FolderSelector = ({
  treeData,
  selectedPath,
  onSelectPath,
}: FolderSelectorProps): JSX.Element => {
  // DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState(false);
  // EXPANDED FOLDERS STATE
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set([""])
  );
  // BUILD FOLDER TREE
  const folderTree = useMemo(() => {
    // CHECK IF TREE DATA EXISTS
    if (!treeData?.tree) return [];
    // BUILD FOLDER TREE
    return buildFolderTree(treeData.tree);
  }, [treeData]);
  // TOGGLE FOLDER
  const toggleFolder = (e: React.MouseEvent, path: string) => {
    // STOP PROPAGATION
    e.stopPropagation();
    // SET EXPANDED FOLDERS
    setExpandedFolders((prev) => {
      // CREATE NEW SET
      const next = new Set(prev);
      // CHECK IF PATH IS ALREADY EXPANDED
      if (next.has(path)) {
        // DELETE PATH FROM SET
        next.delete(path);
      } else {
        // ADD PATH TO SET
        next.add(path);
      }
      // RETURN NEW SET
      return next;
    });
  };
  // SELECT FOLDER
  const handleSelectFolder = (path: string) => {
    // SELECT PATH
    onSelectPath(path);
    // CLOSE DROPDOWN
    setIsOpen(false);
  };
  // RENDER FOLDER NODE
  const renderFolderNode = (
    node: FolderNode,
    depth: number = 0
  ): JSX.Element => {
    // IS EXPANDED
    const isExpanded = expandedFolders.has(node.path);
    // IS SELECTED
    const isSelected = selectedPath === node.path;
    // HAS CHILDREN
    const hasChildren = node.children.length > 0;
    // RETURN FOLDER NODE
    return (
      <div key={node.path}>
        <div
          className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-xs rounded-md transition cursor-pointer ${
            isSelected
              ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
              : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => handleSelectFolder(node.path)}
        >
          {hasChildren ? (
            <span
              className="w-4 h-4 flex items-center justify-center flex-shrink-0"
              onClick={(e) => toggleFolder(e, node.path)}
            >
              {isExpanded ? (
                <ChevronDown size={12} className="text-[var(--light-text)]" />
              ) : (
                <ChevronRight size={12} className="text-[var(--light-text)]" />
              )}
            </span>
          ) : (
            <span className="w-4 h-4 flex-shrink-0" />
          )}
          {isExpanded && hasChildren ? (
            <FolderOpen size={14} className="text-yellow-500 flex-shrink-0" />
          ) : (
            <Folder size={14} className="text-yellow-500 flex-shrink-0" />
          )}
          <span className="truncate flex-1">{node.name}</span>
          {isSelected && (
            <Check
              size={12}
              className="text-[var(--accent-color)] flex-shrink-0"
            />
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => renderFolderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  // GET DISPLAY PATH
  const displayPath = selectedPath || "Root (/)";
  // RETURN FOLDER SELECTOR
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Folder size={14} className="text-yellow-500 flex-shrink-0" />
          <span className="truncate">{displayPath}</span>
        </div>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full max-h-[200px] overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
          {/* ROOT OPTION */}
          <div
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-xs rounded-md transition cursor-pointer mx-1 ${
              selectedPath === ""
                ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
            }`}
            style={{ width: "calc(100% - 8px)" }}
            onClick={() => handleSelectFolder("")}
          >
            <span className="w-4 h-4 flex-shrink-0" />
            <Folder size={14} className="text-yellow-500 flex-shrink-0" />
            <span className="flex-1">Root (/)</span>
            {selectedPath === "" && (
              <Check
                size={12}
                className="text-[var(--accent-color)] flex-shrink-0"
              />
            )}
          </div>
          {/* FOLDER TREE */}
          <div className="px-1">
            {folderTree.map((node) => renderFolderNode(node, 0))}
          </div>
          {folderTree.length === 0 && (
            <div className="px-3 py-2 text-xs text-[var(--light-text)] text-center">
              No folders in repository
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// <== CREATE FILE/FOLDER MODAL PROPS ==>
type CreateFileModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== BRANCH ==>
  branch: string;
  // <== CURRENT PATH ==>
  currentPath?: string;
  // <== TREE DATA ==>
  treeData?: { tree: { path: string; type: string }[] };
  // <== ON SUCCESS ==>
  onSuccess?: (path: string) => void;
};

// <== CREATE FILE/FOLDER MODAL COMPONENT ==>
export const CreateFileModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  branch,
  currentPath = "",
  treeData,
  onSuccess,
}: CreateFileModalProps): JSX.Element | null => {
  // MODE STATE (FILE OR FOLDER)
  const [mode, setMode] = useState<"file" | "folder">("file");
  // NAME STATE
  const [name, setName] = useState("");
  // CONTENT STATE
  const [content, setContent] = useState("");
  // COMMIT MESSAGE STATE
  const [commitMessage, setCommitMessage] = useState("");
  // SELECTED FOLDER STATE
  const [selectedFolder, setSelectedFolder] = useState(currentPath);
  // CREATE FILE MUTATION
  const createFile = useCreateFile();
  // EDITOR SETTINGS (LOADED FROM LOCAL STORAGE)
  const [editorSettings, setEditorSettings] =
    useState<EditorSettings>(loadEditorSettings);
  // HANDLE EDITOR SETTINGS CHANGE
  const handleEditorSettingsChange = useCallback((settings: EditorSettings) => {
    // SET EDITOR SETTINGS
    setEditorSettings(settings);
    // SAVE TO LOCAL STORAGE
    saveEditorSettings(settings);
  }, []);
  // RESET FORM ON OPEN
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // SET MODE TO FILE
      setMode("file");
      // SET NAME TO EMPTY
      setName("");
      // SET CONTENT TO EMPTY
      setContent("");
      // SET COMMIT MESSAGE TO EMPTY
      setCommitMessage("");
      // SET SELECTED FOLDER TO CURRENT PATH
      setSelectedFolder(currentPath);
      // RELOAD SETTINGS FROM LOCAL STORAGE
      setEditorSettings(loadEditorSettings());
    }
  }, [isOpen, currentPath]);
  // PREVENT BODY SCROLL
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      // SET BODY STYLE TO DEFAULT
      document.body.style.overflow = "";
    }
    // CLEANUP FUNCTION
    return () => {
      // SET BODY STYLE TO DEFAULT
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // GET FILE LANGUAGE FROM NAME
  const getLanguageFromFileName = (fileName: string): string => {
    // GET FILE EXTENSION
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    // LANGUAGE MAP
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cs: "csharp",
      cpp: "cpp",
      c: "c",
      go: "go",
      rs: "rust",
      rb: "ruby",
      php: "php",
      swift: "swift",
      kt: "kotlin",
      html: "html",
      css: "css",
      scss: "scss",
      json: "json",
      xml: "xml",
      yaml: "yaml",
      yml: "yaml",
      md: "markdown",
      sql: "sql",
      sh: "shell",
      bash: "shell",
    };
    // RETURN LANGUAGE OR PLAINTEXT
    return languageMap[ext] || "plaintext";
  };
  // HANDLE CREATE
  const handleCreate = () => {
    // CHECK IF NAME IS EMPTY
    if (!name.trim()) {
      // SHOW ERROR TOAST
      toast.error(`Please enter a ${mode} name`);
      // RETURN
      return;
    }
    // CHECK IF COMMIT MESSAGE IS EMPTY
    if (!commitMessage.trim()) {
      // SHOW ERROR TOAST
      toast.error("Please enter a commit message");
      // RETURN
      return;
    }
    // BUILD FULL PATH
    let fullPath = selectedFolder ? `${selectedFolder}/${name}` : name;
    // FOR FOLDER, CREATE A .gitkeep FILE
    if (mode === "folder") {
      // ADD .gitkeep TO FOLDER PATH
      fullPath = `${fullPath}/.gitkeep`;
    }
    // CREATE CREATE FILE INPUT
    const input: CreateFileInput = {
      owner,
      repo,
      path: fullPath,
      content: mode === "folder" ? "" : content,
      message: commitMessage,
      branch,
    };
    // CREATE FILE USING MUTATION
    createFile.mutate(input, {
      // <== ON SUCCESS ==>
      onSuccess: () => {
        // GET SUCCESS PATH
        const successPath =
          mode === "folder" ? fullPath.replace("/.gitkeep", "") : fullPath;
        // SHOW SUCCESS TOAST
        toast.success(
          `${
            mode === "folder" ? "Folder" : "File"
          } "${name}" created successfully!`
        );
        // CLOSE MODAL
        onClose();
        // CALL ON SUCCESS CALLBACK
        onSuccess?.(successPath);
      },
      // <== ON ERROR ==>
      onError: (error) => {
        // SHOW ERROR TOAST
        toast.error(
          error.response?.data?.message || `Failed to create ${mode}`
        );
      },
    });
  };
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN MODAL
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full overflow-hidden flex flex-col ${
          mode === "file" ? "max-w-3xl max-h-[90vh]" : "max-w-md"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              {mode === "file" ? (
                <FilePlus size={20} className="text-[var(--accent-color)]" />
              ) : (
                <FolderPlus size={20} className="text-[var(--accent-color)]" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Create New {mode === "file" ? "File" : "Folder"}
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                In: {selectedFolder || "Root (/)"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* MODE SELECTOR */}
          <div className="flex gap-2 p-1 bg-[var(--inside-card-bg)] rounded-lg">
            <button
              onClick={() => setMode("file")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition cursor-pointer ${
                mode === "file"
                  ? "bg-[var(--accent-color)] text-white"
                  : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              <File size={14} />
              File
            </button>
            <button
              onClick={() => setMode("folder")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition cursor-pointer ${
                mode === "folder"
                  ? "bg-[var(--accent-color)] text-white"
                  : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              <Folder size={14} />
              Folder
            </button>
          </div>
          {/* FOLDER SELECTOR */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Location
            </label>
            <FolderSelector
              treeData={treeData}
              selectedPath={selectedFolder}
              onSelectPath={setSelectedFolder}
            />
          </div>
          {/* NAME INPUT */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              {mode === "file" ? "File" : "Folder"} Name{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={mode === "file" ? "example.ts" : "my-folder"}
                className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
              />
            </div>
            {selectedFolder && (
              <p className="text-xs text-[var(--light-text)]">
                Full path: {selectedFolder}/{name || "..."}
              </p>
            )}
          </div>
          {/* FILE CONTENT (ONLY FOR FILE MODE) */}
          {mode === "file" && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                File Content
              </label>
              {/* EDITOR TOOLBAR */}
              <EditorToolbar
                settings={editorSettings}
                onSettingsChange={handleEditorSettingsChange}
                className="rounded-t-lg border border-b-0 border-[var(--border)]"
              />
              <div className="h-[250px] rounded-b-lg border border-[var(--border)]">
                <CodeEditor
                  value={content}
                  onChange={(val) => setContent(val)}
                  language={getLanguageFromFileName(name)}
                  readOnly={false}
                  height="100%"
                  settings={editorSettings}
                  className="h-full border-0 rounded-none"
                />
              </div>
            </div>
          )}
          {/* COMMIT MESSAGE */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Commit Message <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder={`Create ${
                name || (mode === "file" ? "new file" : "new folder")
              }`}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
            />
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={
              createFile.isPending || !name.trim() || !commitMessage.trim()
            }
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createFile.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                {mode === "file" ? (
                  <FilePlus size={16} />
                ) : (
                  <FolderPlus size={16} />
                )}
                Create {mode === "file" ? "File" : "Folder"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// <== EDIT FILE MODAL PROPS ==>
type EditFileModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== BRANCH ==>
  branch: string;
  // <== FILE PATH ==>
  filePath: string;
  // <== FILE NAME ==>
  fileName: string;
  // <== FILE CONTENT ==>
  fileContent: string;
  // <== FILE SHA ==>
  fileSha: string;
  // <== FILE LANGUAGE ==>
  fileLanguage?: string;
  // <== ON SUCCESS ==>
  onSuccess?: () => void;
};

// <== EDIT FILE MODAL COMPONENT ==>
export const EditFileModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  branch,
  filePath,
  fileName,
  fileContent,
  fileSha,
  fileLanguage = "plaintext",
  onSuccess,
}: EditFileModalProps): JSX.Element | null => {
  // CONTENT STATE
  const [content, setContent] = useState(fileContent);
  // COMMIT MESSAGE STATE
  const [commitMessage, setCommitMessage] = useState("");
  // UPDATE FILE MUTATION
  const updateFile = useUpdateFile();
  // EDITOR SETTINGS (LOADED FROM LOCAL STORAGE)
  const [editorSettings, setEditorSettings] =
    useState<EditorSettings>(loadEditorSettings);
  // HANDLE EDITOR SETTINGS CHANGE
  const handleEditorSettingsChange = useCallback((settings: EditorSettings) => {
    // SET EDITOR SETTINGS
    setEditorSettings(settings);
    // SAVE EDITOR SETTINGS TO LOCAL STORAGE
    saveEditorSettings(settings);
  }, []);
  // RESET FORM ON OPEN
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // SET CONTENT TO FILE CONTENT
      setContent(fileContent);
      // SET COMMIT MESSAGE TO EMPTY
      setCommitMessage("");
      // RELOAD SETTINGS FROM LOCAL STORAGE
      setEditorSettings(loadEditorSettings());
    }
  }, [isOpen, fileContent]);
  // PREVENT BODY SCROLL
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // SET BODY STYLE TO HIDDEN
      document.body.style.overflow = "hidden";
    } else {
      // SET BODY STYLE TO DEFAULT
      document.body.style.overflow = "";
    }
    // CLEANUP FUNCTION
    return () => {
      // SET BODY STYLE TO DEFAULT
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // CHECK IF CONTENT CHANGED
  const hasChanges = content !== fileContent;
  // HANDLE UPDATE
  const handleUpdate = () => {
    // CHECK IF COMMIT MESSAGE IS EMPTY
    if (!commitMessage.trim()) {
      // SHOW ERROR TOAST
      toast.error("Please enter a commit message");
      // RETURN
      return;
    }
    // CHECK IF THERE ARE CHANGES
    if (!hasChanges) {
      // SHOW ERROR TOAST
      toast.error("No changes to save");
      // RETURN
      return;
    }
    // UPDATE INPUT
    const input: UpdateFileInput = {
      owner,
      repo,
      path: filePath,
      content,
      message: commitMessage,
      sha: fileSha,
      branch,
    };
    // UPDATE FILE
    updateFile.mutate(input, {
      // <== ON SUCCESS ==>
      onSuccess: () => {
        // SHOW SUCCESS TOAST
        toast.success(`File "${fileName}" updated successfully!`);
        // CLOSE MODAL
        onClose();
        // CALL ON SUCCESS CALLBACK
        onSuccess?.();
      },
      // <== ON ERROR ==>
      onError: (error) => {
        // SHOW ERROR TOAST
        toast.error(error.response?.data?.message || "Failed to update file");
      },
    });
  };
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN MODAL
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <FileEdit size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Edit File
              </h2>
              <p className="text-xs text-[var(--light-text)] flex items-center gap-1">
                <FileCode size={12} />
                {filePath}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-500">
                Unsaved changes
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        {/* BODY */}
        <div className="overflow-y-auto p-4 space-y-4">
          {/* FILE CONTENT */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              File Content
            </label>
            {/* EDITOR TOOLBAR */}
            <EditorToolbar
              settings={editorSettings}
              onSettingsChange={handleEditorSettingsChange}
              className="rounded-t-lg border border-b-0 border-[var(--border)]"
            />
            <div className="h-[350px] rounded-b-lg border border-[var(--border)]">
              <CodeEditor
                value={content}
                onChange={(val) => setContent(val)}
                language={fileLanguage}
                readOnly={false}
                height="100%"
                settings={editorSettings}
                className="h-full border-0 rounded-none"
              />
            </div>
          </div>
          {/* COMMIT MESSAGE */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Commit Message <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder={`Update ${fileName}`}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
            />
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={
              updateFile.isPending || !hasChanges || !commitMessage.trim()
            }
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateFile.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// <== DELETE FILE/FOLDER MODAL PROPS ==>
type DeleteFileModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== BRANCH ==>
  branch: string;
  // <== FILE PATH ==>
  filePath: string;
  // <== FILE NAME ==>
  fileName: string;
  // <== FILE SHA ==>
  fileSha: string;
  // <== IS FOLDER ==>
  isFolder?: boolean;
  // <== TREE DATA (FOR FOLDER DELETION) ==>
  treeData?: { tree: { path: string; type: string; sha: string }[] };
  // <== ON SUCCESS ==>
  onSuccess?: () => void;
};

// <== DELETE FILE/FOLDER MODAL COMPONENT ==>
export const DeleteFileModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  branch,
  filePath,
  fileName,
  fileSha,
  isFolder = false,
  treeData,
  onSuccess,
}: DeleteFileModalProps): JSX.Element | null => {
  // COMMIT MESSAGE STATE
  const [commitMessage, setCommitMessage] = useState("");
  // CONFIRM NAME STATE
  const [confirmName, setConfirmName] = useState("");
  // IS DELETING STATE
  const [isDeleting, setIsDeleting] = useState(false);
  // DELETE FILE MUTATION
  const deleteFile = useDeleteFile();
  // GET FILES IN FOLDER
  const filesInFolder = useMemo(() => {
    // CHECK IF IS FOLDER AND TREE DATA EXISTS
    if (!isFolder || !treeData?.tree) return [];
    // FILTER FILES IN FOLDER
    return treeData.tree.filter(
      (item) =>
        item.type === "blob" &&
        (item.path.startsWith(filePath + "/") || item.path === filePath)
    );
  }, [isFolder, treeData, filePath]);
  // RESET FORM ON OPEN
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // SET COMMIT MESSAGE TO EMPTY
      setCommitMessage("");
      // SET CONFIRM NAME TO EMPTY
      setConfirmName("");
      // SET IS DELETING TO FALSE
      setIsDeleting(false);
    }
  }, [isOpen]);
  // PREVENT BODY SCROLL
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // SET BODY STYLE TO HIDDEN
      document.body.style.overflow = "hidden";
    } else {
      // SET BODY STYLE TO DEFAULT
      document.body.style.overflow = "";
    }
    // CLEANUP FUNCTION
    return () => {
      // SET BODY STYLE TO DEFAULT
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // CHECK IF CONFIRMED
  const isConfirmed = confirmName === fileName;
  // HANDLE DELETE
  const handleDelete = async () => {
    // CHECK IF CONFIRMED
    if (!isConfirmed) {
      // SHOW ERROR TOAST
      toast.error(
        `Please type the ${isFolder ? "folder" : "file"} name to confirm`
      );
      // RETURN
      return;
    }
    // CHECK IF COMMIT MESSAGE IS EMPTY
    if (!commitMessage.trim()) {
      // SHOW ERROR TOAST
      toast.error("Please enter a commit message");
      // RETURN
      return;
    }
    // SET IS DELETING TO TRUE
    setIsDeleting(true);
    try {
      // CHECK IF IS FOLDER AND HAS FILES IN FOLDER
      if (isFolder && filesInFolder.length > 0) {
        // DELETE ALL FILES IN FOLDER ONE BY ONE
        for (const file of filesInFolder) {
          // DELETE FILE USING MUTATION
          await new Promise<void>((resolve, reject) => {
            // DELETE FILE USING MUTATION
            deleteFile.mutate(
              {
                owner,
                repo,
                path: file.path,
                message: commitMessage,
                sha: file.sha,
                branch,
              },
              {
                // <== ON SUCCESS ==>
                onSuccess: () => resolve(),
                // <== ON ERROR ==>
                onError: (error) => reject(error),
              }
            );
          });
        }
        // SHOW SUCCESS TOAST
        toast.success(
          `Folder "${fileName}" and all its contents deleted successfully!`
        );
      } else {
        // DELETE SINGLE FILE
        await new Promise<void>((resolve, reject) => {
          deleteFile.mutate(
            {
              owner,
              repo,
              path: filePath,
              message: commitMessage,
              sha: fileSha,
              branch,
            },
            {
              // <== ON SUCCESS ==>
              onSuccess: () => resolve(),
              // <== ON ERROR ==>
              onError: (error) => reject(error),
            }
          );
        });
        // SHOW SUCCESS TOAST
        toast.success(`File "${fileName}" deleted successfully!`);
        // CLOSE MODAL
      }
      // CLOSE MODAL
      onClose();
      // CALL ON SUCCESS CALLBACK
      onSuccess?.();
    } catch (error: unknown) {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      // SHOW ERROR TOAST
      toast.error(
        axiosError.response?.data?.message ||
          `Failed to delete ${isFolder ? "folder" : "file"}`
      );
    } finally {
      // SET IS DELETING TO FALSE
      setIsDeleting(false);
    }
  };
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN MODAL
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/15">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Delete {isFolder ? "Folder" : "File"}
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>
        {/* BODY */}
        <div className="p-4 space-y-4">
          {/* WARNING */}
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle
                size={16}
                className="text-red-500 flex-shrink-0 mt-0.5"
              />
              <div className="text-xs text-red-500">
                <p className="font-medium mb-1">Warning</p>
                <p>
                  You are about to permanently delete{" "}
                  <span className="font-mono font-medium">{fileName}</span>
                  {isFolder && filesInFolder.length > 0 && (
                    <> and all {filesInFolder.length} file(s) inside it</>
                  )}{" "}
                  from the repository.
                </p>
              </div>
            </div>
          </div>
          {/* FILE/FOLDER PATH */}
          <div className="p-2 bg-[var(--inside-card-bg)] rounded-lg">
            <p className="text-xs text-[var(--light-text)]">
              {isFolder ? "Folder" : "File"} path:
            </p>
            <p className="text-sm text-[var(--text-primary)] font-mono break-all">
              {filePath}
            </p>
          </div>
          {/* FILES IN FOLDER (IF FOLDER) */}
          {isFolder && filesInFolder.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-[var(--text-primary)]">
                Files to be deleted ({filesInFolder.length}):
              </p>
              <div className="max-h-[100px] overflow-y-auto p-2 bg-[var(--inside-card-bg)] rounded-lg space-y-1">
                {filesInFolder.map((file) => (
                  <div
                    key={file.path}
                    className="flex items-center gap-1.5 text-xs text-[var(--light-text)]"
                  >
                    <File size={10} className="flex-shrink-0" />
                    <span className="truncate font-mono">{file.path}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* CONFIRM NAME */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Type <span className="font-mono text-red-500">{fileName}</span> to
              confirm
            </label>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={fileName}
              disabled={isDeleting}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-50"
            />
          </div>
          {/* COMMIT MESSAGE */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Commit Message <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder={`Delete ${fileName}`}
              disabled={isDeleting}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 disabled:opacity-50"
            />
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || !isConfirmed || !commitMessage.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete {isFolder ? "Folder" : "File"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
