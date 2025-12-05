// <== IMPORTS ==>
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileCode,
  FileJson,
  FileText,
  FileImage,
  FileType,
  Trash2,
} from "lucide-react";
import { useState, JSX, useMemo } from "react";
import { FileTreeItem } from "../../hooks/useGitHub";

// <== FILE ICON MAPPING ==>
const getFileIcon = (fileName: string): JSX.Element => {
  // GET EXTENSION
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  // DETERMINE ICON BASED ON EXTENSION
  switch (ext) {
    // CODE FILES
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "py":
    case "java":
    case "c":
    case "cpp":
    case "cs":
    case "go":
    case "rs":
    case "rb":
    case "php":
    case "swift":
    case "kt":
    case "vue":
    case "svelte":
      return <FileCode size={16} className="text-blue-400" />;
    // JSON / CONFIG FILES
    case "json":
    case "yaml":
    case "yml":
    case "toml":
    case "xml":
      return <FileJson size={16} className="text-yellow-400" />;
    // MARKDOWN / TEXT FILES
    case "md":
    case "txt":
    case "rst":
      return <FileText size={16} className="text-gray-400" />;
    // IMAGE FILES
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
    case "ico":
      return <FileImage size={16} className="text-green-400" />;
    // STYLE FILES
    case "css":
    case "scss":
    case "sass":
    case "less":
      return <FileType size={16} className="text-pink-400" />;
    // DEFAULT
    default:
      return <File size={16} className="text-[var(--light-text)]" />;
  }
};

// <== TREE NODE TYPE ==>
type TreeNode = {
  // <== NAME ==>
  name: string;
  // <== PATH ==>
  path: string;
  // <== TYPE ==>
  type: "file" | "dir";
  // <== SHA ==>
  sha: string;
  // <== SIZE ==>
  size?: number;
  // <== CHILDREN ==>
  children?: TreeNode[];
};

// <== BUILD TREE FUNCTION ==>
const buildTree = (
  items: { path: string; type: string; sha: string; size?: number }[]
): TreeNode[] => {
  // ROOT NODES
  const root: TreeNode[] = [];
  // PATH MAP FOR QUICK LOOKUP
  const pathMap = new Map<string, TreeNode>();
  // SORT ITEMS (DIRECTORIES FIRST, THEN ALPHABETICALLY)
  const sortedItems = [...items].sort((a, b) => {
    // DIRECTORIES FIRST
    if (a.type === "tree" && b.type !== "tree") return -1;
    // FILES AFTER DIRECTORIES
    if (a.type !== "tree" && b.type === "tree") return 1;
    // THEN ALPHABETICALLY
    return a.path.localeCompare(b.path);
  });
  // BUILD TREE
  sortedItems.forEach((item) => {
    // GET PATH PARTS
    const parts = item.path.split("/");
    // GET NAME (LAST PART)
    const name = parts[parts.length - 1];
    // CREATE NODE
    const node: TreeNode = {
      name,
      path: item.path,
      type: item.type === "tree" ? "dir" : "file",
      sha: item.sha,
      size: item.size,
      children: item.type === "tree" ? [] : undefined,
    };
    // ADD TO PATH MAP
    pathMap.set(item.path, node);
    // IF ROOT LEVEL
    if (parts.length === 1) {
      // ADD TO ROOT
      root.push(node);
    } else {
      // FIND PARENT PATH
      const parentPath = parts.slice(0, -1).join("/");
      // FIND PARENT NODE
      const parent = pathMap.get(parentPath);
      // CHECK IF PARENT EXISTS AND HAS CHILDREN
      if (parent && parent.children) {
        // ADD NODE TO PARENT CHILDREN
        parent.children.push(node);
      }
    }
  });
  // SORT CHILDREN (DIRECTORIES FIRST)
  const sortChildren = (nodes: TreeNode[]) => {
    // SORT NODES (DIRECTORIES FIRST)
    nodes.sort((a, b) => {
      // DIRECTORIES FIRST
      if (a.type === "dir" && b.type === "file") return -1;
      // FILES AFTER DIRECTORIES
      if (a.type === "file" && b.type === "dir") return 1;
      // THEN ALPHABETICALLY
      return a.name.localeCompare(b.name);
    });
    // SORT EACH NODE'S CHILDREN
    nodes.forEach((node) => {
      // SORT CHILDREN
      if (node.children) sortChildren(node.children);
    });
  };
  // SORT ROOT NODES
  sortChildren(root);
  // RETURN ROOT NODES
  return root;
};

// <== TREE NODE COMPONENT PROPS ==>
type TreeNodeComponentProps = {
  // <== NODE ==>
  node: TreeNode;
  // <== DEPTH ==>
  depth: number;
  // <== SELECTED PATH ==>
  selectedPath: string | null;
  // <== ON SELECT ==>
  onSelect: (path: string, type: "file" | "dir") => void;
  // <== EXPANDED FOLDERS ==>
  expandedFolders: Set<string>;
  // <== ON TOGGLE FOLDER ==>
  onToggleFolder: (path: string) => void;
  // <== ON DELETE ITEM ==>
  onDeleteItem?: (
    path: string,
    name: string,
    type: "file" | "dir",
    sha: string
  ) => void;
};

// <== TREE NODE COMPONENT ==>
const TreeNodeComponent = ({
  node,
  depth,
  selectedPath,
  onSelect,
  expandedFolders,
  onToggleFolder,
  onDeleteItem,
}: TreeNodeComponentProps): JSX.Element => {
  // HOVERED STATE
  const [isHovered, setIsHovered] = useState(false);
  // IS EXPANDED
  const isExpanded = expandedFolders.has(node.path);
  // IS SELECTED
  const isSelected = selectedPath === node.path;
  // HANDLE CLICK
  const handleClick = () => {
    // CHECK IF NODE IS A DIRECTORY
    if (node.type === "dir") {
      // TOGGLE FOLDER
      onToggleFolder(node.path);
    }
    // SELECT NODE
    onSelect(node.path, node.type);
  };
  // HANDLE DELETE CLICK
  const handleDeleteClick = (e: React.MouseEvent) => {
    // STOP PROPAGATION
    e.stopPropagation();
    // CALL ON DELETE ITEM
    onDeleteItem?.(node.path, node.name, node.type, node.sha);
  };
  // RETURN TREE NODE
  return (
    <div>
      {/* NODE ITEM */}
      <div
        className={`group w-full flex items-center gap-1.5 py-1 px-2 text-left text-sm rounded-md transition cursor-pointer ${
          isSelected
            ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
            : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* EXPAND ICON FOR FOLDERS */}
        {node.type === "dir" ? (
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            {isExpanded ? (
              <ChevronDown size={14} className="text-[var(--light-text)]" />
            ) : (
              <ChevronRight size={14} className="text-[var(--light-text)]" />
            )}
          </span>
        ) : (
          <span className="w-4 h-4 flex-shrink-0" />
        )}
        {/* FILE/FOLDER ICON */}
        <span className="flex-shrink-0">
          {node.type === "dir" ? (
            isExpanded ? (
              <FolderOpen size={16} className="text-yellow-500" />
            ) : (
              <Folder size={16} className="text-yellow-500" />
            )
          ) : (
            getFileIcon(node.name)
          )}
        </span>
        {/* NAME */}
        <span className="truncate text-xs flex-1">{node.name}</span>
        {/* DELETE BUTTON (VISIBLE ON HOVER) */}
        {onDeleteItem && isHovered && (
          <button
            onClick={handleDeleteClick}
            className="p-0.5 rounded text-[var(--light-text)] hover:text-red-500 hover:bg-red-500/10 transition flex-shrink-0 opacity-0 group-hover:opacity-100"
            title={`Delete ${node.type === "dir" ? "folder" : "file"}`}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      {/* CHILDREN */}
      {node.type === "dir" && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// <== FILE TREE PROPS ==>
type FileTreeProps = {
  // <== TREE DATA ==>
  treeData?: {
    sha: string;
    url: string;
    truncated: boolean;
    tree: {
      path: string;
      mode: string;
      type: string;
      sha: string;
      size?: number;
    }[];
  };
  // <== CONTENTS (ALTERNATIVE TO TREE) ==>
  contents?: FileTreeItem[];
  // <== IS LOADING ==>
  isLoading: boolean;
  // <== SELECTED PATH ==>
  selectedPath: string | null;
  // <== ON SELECT FILE ==>
  onSelectFile: (path: string) => void;
  // <== ON SELECT FOLDER ==>
  onSelectFolder?: (path: string) => void;
  // <== ON DELETE ITEM ==>
  onDeleteItem?: (
    path: string,
    name: string,
    type: "file" | "dir",
    sha: string
  ) => void;
  // <== CLASS NAME ==>
  className?: string;
};

// <== FILE TREE COMPONENT ==>
const FileTree = ({
  treeData,
  contents,
  isLoading,
  selectedPath,
  onSelectFile,
  onSelectFolder,
  onDeleteItem,
  className = "",
}: FileTreeProps): JSX.Element => {
  // EXPANDED FOLDERS STATE
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  // BUILD TREE FROM DATA
  const tree = useMemo(() => {
    // CHECK IF TREE DATA EXISTS
    if (treeData?.tree) {
      // BUILD TREE FROM TREE DATA
      return buildTree(treeData.tree);
    }
    // CHECK IF CONTENTS EXISTS
    if (contents) {
      // BUILD TREE FROM CONTENTS
      return contents
        .map((item) => ({
          name: item.name,
          path: item.path,
          type: item.type === "dir" ? ("dir" as const) : ("file" as const),
          sha: item.sha,
          size: item.size,
          children: item.type === "dir" ? [] : undefined,
        }))
        .sort((a, b) => {
          if (a.type === "dir" && b.type === "file") return -1;
          if (a.type === "file" && b.type === "dir") return 1;
          return a.name.localeCompare(b.name);
        });
    }
    // RETURN EMPTY ARRAY
    return [];
  }, [treeData, contents]);
  // HANDLE TOGGLE FOLDER
  const handleToggleFolder = (path: string) => {
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
  // HANDLE SELECT
  const handleSelect = (path: string, type: "file" | "dir") => {
    // CHECK IF NODE IS A FILE
    if (type === "file") {
      // SELECT FILE
      onSelectFile(path);
    } else if (onSelectFolder) {
      // SELECT FOLDER
      onSelectFolder(path);
    }
  };
  // LOADING STATE
  if (isLoading) {
    return (
      <div className={`p-2 ${className}`}>
        {/* FILE TREE SKELETON */}
        {[
          { indent: 0, width: "55%" },
          { indent: 0, width: "45%" },
          { indent: 1, width: "60%" },
          { indent: 1, width: "40%" },
          { indent: 2, width: "50%" },
          { indent: 2, width: "35%" },
          { indent: 1, width: "55%" },
          { indent: 0, width: "50%" },
          { indent: 0, width: "65%" },
          { indent: 1, width: "45%" },
          { indent: 1, width: "55%" },
          { indent: 0, width: "40%" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 py-1 px-2"
            style={{ paddingLeft: `${item.indent * 12 + 8}px` }}
          >
            <div
              className="w-4 h-4 rounded animate-pulse flex-shrink-0"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--light-text) 10%, transparent)",
                animationDelay: `${idx * 50}ms`,
              }}
            />
            <div
              className="w-4 h-4 rounded animate-pulse flex-shrink-0"
              style={{
                backgroundColor:
                  idx % 3 === 0
                    ? "color-mix(in srgb, #eab308 20%, transparent)"
                    : "color-mix(in srgb, var(--light-text) 12%, transparent)",
                animationDelay: `${idx * 50}ms`,
              }}
            />
            <div
              className="h-3 rounded animate-pulse"
              style={{
                width: item.width,
                backgroundColor:
                  "color-mix(in srgb, var(--light-text) 15%, transparent)",
                animationDelay: `${idx * 50}ms`,
              }}
            />
          </div>
        ))}
      </div>
    );
  }
  // EMPTY STATE
  if (tree.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-8 text-center ${className}`}
      >
        <Folder size={32} className="text-[var(--light-text)] mb-2" />
        <p className="text-sm text-[var(--light-text)]">No files found</p>
      </div>
    );
  }
  // RETURN FILE TREE
  return (
    <div className={`overflow-y-auto ${className}`}>
      {tree.map((node) => (
        <TreeNodeComponent
          key={node.path}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          onSelect={handleSelect}
          expandedFolders={expandedFolders}
          onToggleFolder={handleToggleFolder}
          onDeleteItem={onDeleteItem}
        />
      ))}
    </div>
  );
};

export default FileTree;
