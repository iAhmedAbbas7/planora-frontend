// <== IMPORTS ==>
import {
  ChevronDown,
  Check,
  Minus,
  Plus,
  WrapText,
  Hash,
  Map,
  Palette,
} from "lucide-react";
import {
  type EditorSettings,
  defaultEditorSettings,
  themeOptions,
} from "./editorConfig";
import { useRef, useEffect, useState, JSX, useCallback } from "react";
import Editor, { OnMount, loader, Monaco } from "@monaco-editor/react";

// <== CONFIGURE MONACO LOADER TO USE CDN ==>
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
  },
});

// <== DEFINE CUSTOM THEMES ==>
const defineCustomThemes = (monaco: Monaco) => {
  // ONE DARK PRO THEME
  monaco.editor.defineTheme("one-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "5c6370", fontStyle: "italic" },
      { token: "keyword", foreground: "c678dd" },
      { token: "string", foreground: "98c379" },
      { token: "number", foreground: "d19a66" },
      { token: "type", foreground: "e5c07b" },
      { token: "function", foreground: "61afef" },
      { token: "variable", foreground: "e06c75" },
      { token: "constant", foreground: "d19a66" },
      { token: "operator", foreground: "56b6c2" },
    ],
    colors: {
      "editor.background": "#282c34",
      "editor.foreground": "#abb2bf",
      "editor.lineHighlightBackground": "#2c313c",
      "editorCursor.foreground": "#528bff",
      "editor.selectionBackground": "#3e4451",
      "editorLineNumber.foreground": "#495162",
      "editorLineNumber.activeForeground": "#abb2bf",
    },
  });
  // DRACULA THEME
  monaco.editor.defineTheme("dracula", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4", fontStyle: "italic" },
      { token: "keyword", foreground: "ff79c6" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
      { token: "type", foreground: "8be9fd", fontStyle: "italic" },
      { token: "function", foreground: "50fa7b" },
      { token: "variable", foreground: "f8f8f2" },
      { token: "constant", foreground: "bd93f9" },
      { token: "operator", foreground: "ff79c6" },
    ],
    colors: {
      "editor.background": "#282a36",
      "editor.foreground": "#f8f8f2",
      "editor.lineHighlightBackground": "#44475a",
      "editorCursor.foreground": "#f8f8f2",
      "editor.selectionBackground": "#44475a",
      "editorLineNumber.foreground": "#6272a4",
      "editorLineNumber.activeForeground": "#f8f8f2",
    },
  });
  // GITHUB DARK THEME
  monaco.editor.defineTheme("github-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8b949e", fontStyle: "italic" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "string", foreground: "a5d6ff" },
      { token: "number", foreground: "79c0ff" },
      { token: "type", foreground: "ffa657" },
      { token: "function", foreground: "d2a8ff" },
      { token: "variable", foreground: "ffa657" },
      { token: "constant", foreground: "79c0ff" },
      { token: "operator", foreground: "ff7b72" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editor.lineHighlightBackground": "#161b22",
      "editorCursor.foreground": "#c9d1d9",
      "editor.selectionBackground": "#264f78",
      "editorLineNumber.foreground": "#484f58",
      "editorLineNumber.activeForeground": "#c9d1d9",
    },
  });
};

// <== CODE EDITOR SKELETON LOADER ==>
export const CodeEditorSkeleton = ({
  className = "",
}: {
  className?: string;
}): JSX.Element => {
  // FAKE CODE LINES WITH VARYING WIDTHS
  const lines = [
    { indent: 0, width: "60%" },
    { indent: 0, width: "45%" },
    { indent: 1, width: "70%" },
    { indent: 2, width: "55%" },
    { indent: 2, width: "40%" },
    { indent: 2, width: "65%" },
    { indent: 1, width: "30%" },
    { indent: 0, width: "50%" },
    { indent: 0, width: "0%" },
    { indent: 0, width: "55%" },
    { indent: 1, width: "75%" },
    { indent: 1, width: "45%" },
    { indent: 1, width: "60%" },
    { indent: 0, width: "25%" },
    { indent: 0, width: "0%" },
    { indent: 0, width: "65%" },
    { indent: 1, width: "50%" },
    { indent: 2, width: "70%" },
    { indent: 2, width: "35%" },
    { indent: 1, width: "40%" },
    { indent: 0, width: "20%" },
  ];
  // RETURN SKELETON
  return (
    <div
      className={`w-full h-full flex flex-col bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)] overflow-hidden ${className}`}
    >
      {/* FAKE LINE NUMBERS + CODE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LINE NUMBERS GUTTER */}
        <div className="flex flex-col py-3 px-2 border-r border-[var(--border)] bg-[var(--cards-bg)]">
          {lines.map((_, idx) => (
            <div
              key={idx}
              className="h-5 flex items-center justify-end pr-2 text-xs text-[var(--light-text)]/30"
              style={{ fontFamily: "monospace" }}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        {/* CODE AREA */}
        <div className="flex-1 flex flex-col py-3 px-4 overflow-hidden">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className="h-5 flex items-center"
              style={{ paddingLeft: `${line.indent * 16}px` }}
            >
              {line.width !== "0%" && (
                <div
                  className="h-3 rounded animate-pulse"
                  style={{
                    width: line.width,
                    backgroundColor:
                      "color-mix(in srgb, var(--light-text) 15%, transparent)",
                    animationDelay: `${idx * 50}ms`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
        {/* MINIMAP AREA (HIDDEN ON SMALL SCREENS) */}
        <div className="hidden md:flex flex-col w-24 py-3 px-2 border-l border-[var(--border)] bg-[var(--cards-bg)]">
          {[...Array(15)].map((_, idx) => (
            <div key={idx} className="h-1.5 mb-0.5 flex items-center">
              <div
                className="h-0.5 rounded animate-pulse"
                style={{
                  width: `${30 + Math.random() * 50}%`,
                  backgroundColor:
                    "color-mix(in srgb, var(--light-text) 10%, transparent)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// <== FILE CONTENT LOADING SKELETON ==>
export const FileContentSkeleton = ({
  className = "",
}: {
  className?: string;
}): JSX.Element => {
  // FAKE CODE LINES
  const lines = [
    { indent: 0, width: "60%" },
    { indent: 0, width: "45%" },
    { indent: 1, width: "70%" },
    { indent: 2, width: "55%" },
    { indent: 2, width: "40%" },
    { indent: 2, width: "65%" },
    { indent: 1, width: "30%" },
    { indent: 0, width: "50%" },
    { indent: 0, width: "0%" },
    { indent: 0, width: "55%" },
    { indent: 1, width: "75%" },
    { indent: 1, width: "45%" },
    { indent: 1, width: "60%" },
    { indent: 0, width: "25%" },
    { indent: 0, width: "0%" },
    { indent: 0, width: "65%" },
    { indent: 1, width: "50%" },
    { indent: 2, width: "70%" },
    { indent: 2, width: "35%" },
    { indent: 1, width: "40%" },
    { indent: 0, width: "20%" },
  ];
  // RETURN SKELETON
  return (
    <div
      className={`w-full h-full flex flex-col bg-[var(--inside-card-bg)] overflow-hidden ${className}`}
    >
      {/* FILE HEADER SKELETON */}
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--inside-card-bg)] border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded animate-pulse"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent-color) 30%, transparent)",
            }}
          />
          <div
            className="h-4 w-32 rounded animate-pulse"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--light-text) 15%, transparent)",
            }}
          />
          <div
            className="h-4 w-12 rounded animate-pulse hidden sm:block"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--light-text) 10%, transparent)",
            }}
          />
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-md animate-pulse"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--light-text) 10%, transparent)",
              }}
            />
          ))}
        </div>
      </div>
      {/* CODE AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* LINE NUMBERS GUTTER */}
        <div className="flex flex-col py-3 px-2 border-r border-[var(--border)] bg-[var(--cards-bg)]">
          {lines.map((_, idx) => (
            <div
              key={idx}
              className="h-5 flex items-center justify-end pr-2 text-xs text-[var(--light-text)]/30"
              style={{ fontFamily: "monospace" }}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        {/* CODE LINES */}
        <div className="flex-1 flex flex-col py-3 px-4 overflow-hidden">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className="h-5 flex items-center"
              style={{ paddingLeft: `${line.indent * 16}px` }}
            >
              {line.width !== "0%" && (
                <div
                  className="h-3 rounded animate-pulse"
                  style={{
                    width: line.width,
                    backgroundColor:
                      "color-mix(in srgb, var(--light-text) 15%, transparent)",
                    animationDelay: `${idx * 50}ms`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
        {/* MINIMAP SKELETON */}
        <div className="hidden md:flex flex-col w-24 py-3 px-2 border-l border-[var(--border)] bg-[var(--cards-bg)]">
          {[...Array(15)].map((_, idx) => (
            <div key={idx} className="h-1.5 mb-0.5 flex items-center">
              <div
                className="h-0.5 rounded animate-pulse"
                style={{
                  width: `${30 + Math.random() * 50}%`,
                  backgroundColor:
                    "color-mix(in srgb, var(--light-text) 10%, transparent)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// <== EDITOR TOOLBAR PROPS ==>
type EditorToolbarProps = {
  // <== SETTINGS ==>
  settings: EditorSettings;
  // <== ON SETTINGS CHANGE ==>
  onSettingsChange: (settings: EditorSettings) => void;
  // <== CLASS NAME ==>
  className?: string;
};

// <== EDITOR TOOLBAR COMPONENT ==>
export const EditorToolbar = ({
  settings,
  onSettingsChange,
  className = "",
}: EditorToolbarProps): JSX.Element => {
  // DROPDOWN STATES
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  // DROPDOWN REFS
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  // HANDLE OUTSIDE CLICKS
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK IF CLICK IS OUTSIDE THEME DROPDOWN
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node)
      ) {
        // CLOSE THEME DROPDOWN
        setShowThemeDropdown(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // GET CURRENT THEME LABEL
  const currentThemeLabel =
    themeOptions.find((t) => t.value === settings.theme)?.label ||
    "VS Code Dark";
  // RETURN TOOLBAR
  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 py-1.5 bg-[var(--inside-card-bg)] border-b border-[var(--border)] ${className}`}
    >
      {/* LEFT - THEME SELECTOR */}
      <div ref={themeDropdownRef} className="relative">
        <button
          onClick={() => setShowThemeDropdown(!showThemeDropdown)}
          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md border border-[var(--border)] bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
        >
          <Palette size={12} className="text-[var(--accent-color)]" />
          <span className="hidden sm:inline">{currentThemeLabel}</span>
          <ChevronDown
            size={12}
            className={`transition ${showThemeDropdown ? "rotate-180" : ""}`}
          />
        </button>
        {/* THEME DROPDOWN */}
        {showThemeDropdown && (
          <div className="absolute top-full left-0 mt-1 min-w-[160px] bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
            <div className="px-2 py-1 text-[10px] text-[var(--light-text)] font-medium uppercase tracking-wider">
              Dark Themes
            </div>
            {themeOptions
              .filter((t) => t.isDark)
              .map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => {
                    onSettingsChange({ ...settings, theme: theme.value });
                    setShowThemeDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                    settings.theme === theme.value
                      ? "text-[var(--accent-color)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  <span>{theme.label}</span>
                  {settings.theme === theme.value && (
                    <Check size={12} className="text-[var(--accent-color)]" />
                  )}
                </button>
              ))}
            <div className="my-1 border-t border-[var(--border)]" />
            <div className="px-2 py-1 text-[10px] text-[var(--light-text)] font-medium uppercase tracking-wider">
              Light Themes
            </div>
            {themeOptions
              .filter((t) => !t.isDark)
              .map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => {
                    onSettingsChange({ ...settings, theme: theme.value });
                    setShowThemeDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                    settings.theme === theme.value
                      ? "text-[var(--accent-color)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  <span>{theme.label}</span>
                  {settings.theme === theme.value && (
                    <Check size={12} className="text-[var(--accent-color)]" />
                  )}
                </button>
              ))}
          </div>
        )}
      </div>
      {/* RIGHT - CONTROLS */}
      <div className="flex items-center gap-1">
        {/* FONT SIZE CONTROLS */}
        <div className="flex items-center gap-0.5 px-1">
          <button
            onClick={() =>
              onSettingsChange({
                ...settings,
                fontSize: Math.max(10, settings.fontSize - 1),
              })
            }
            disabled={settings.fontSize <= 10}
            className="p-1 rounded text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Decrease font size"
          >
            <Minus size={12} />
          </button>
          <span className="text-[10px] text-[var(--light-text)] w-6 text-center font-mono">
            {settings.fontSize}
          </span>
          <button
            onClick={() =>
              onSettingsChange({
                ...settings,
                fontSize: Math.min(20, settings.fontSize + 1),
              })
            }
            disabled={settings.fontSize >= 20}
            className="p-1 rounded text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Increase font size"
          >
            <Plus size={12} />
          </button>
        </div>
        {/* DIVIDER */}
        <div className="w-px h-4 bg-[var(--border)] mx-1" />
        {/* QUICK TOGGLES */}
        <button
          onClick={() =>
            onSettingsChange({ ...settings, wordWrap: !settings.wordWrap })
          }
          className={`p-1.5 rounded transition cursor-pointer ${
            settings.wordWrap
              ? "text-[var(--accent-color)] bg-[var(--accent-color)]/10"
              : "text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
          }`}
          title={`Word Wrap: ${settings.wordWrap ? "On" : "Off"}`}
        >
          <WrapText size={14} />
        </button>
        <button
          onClick={() =>
            onSettingsChange({
              ...settings,
              showLineNumbers: !settings.showLineNumbers,
            })
          }
          className={`p-1.5 rounded transition cursor-pointer ${
            settings.showLineNumbers
              ? "text-[var(--accent-color)] bg-[var(--accent-color)]/10"
              : "text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
          }`}
          title={`Line Numbers: ${settings.showLineNumbers ? "On" : "Off"}`}
        >
          <Hash size={14} />
        </button>
        <button
          onClick={() =>
            onSettingsChange({
              ...settings,
              showMinimap: !settings.showMinimap,
            })
          }
          className={`p-1.5 rounded transition cursor-pointer hidden sm:block ${
            settings.showMinimap
              ? "text-[var(--accent-color)] bg-[var(--accent-color)]/10"
              : "text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
          }`}
          title={`Minimap: ${settings.showMinimap ? "On" : "Off"}`}
        >
          <Map size={14} />
        </button>
      </div>
    </div>
  );
};

// <== CODE EDITOR PROPS ==>
type CodeEditorProps = {
  // <== VALUE ==>
  value: string;
  // <== LANGUAGE ==>
  language?: string;
  // <== READ ONLY ==>
  readOnly?: boolean;
  // <== ON CHANGE ==>
  onChange?: (value: string) => void;
  // <== HEIGHT ==>
  height?: string;
  // <== SETTINGS ==>
  settings?: EditorSettings;
  // <== SHOW TOOLBAR ==>
  showToolbar?: boolean;
  // <== ON SETTINGS CHANGE ==>
  onSettingsChange?: (settings: EditorSettings) => void;
  // <== CLASS NAME ==>
  className?: string;
};

// <== CODE EDITOR COMPONENT ==>
const CodeEditor = ({
  value,
  language = "plaintext",
  readOnly = true,
  onChange,
  height = "100%",
  settings = defaultEditorSettings,
  showToolbar = false,
  onSettingsChange,
  className = "",
}: CodeEditorProps): JSX.Element => {
  // EDITOR REF
  const editorRef = useRef<unknown>(null);
  // MONACO REF
  const monacoRef = useRef<Monaco | null>(null);
  // HANDLE EDITOR BEFORE MOUNT
  const handleEditorBeforeMount = useCallback((monaco: Monaco) => {
    // STORE MONACO REFERENCE
    monacoRef.current = monaco;
    // DEFINE CUSTOM THEMES
    defineCustomThemes(monaco);
  }, []);
  // HANDLE EDITOR MOUNT
  const handleEditorMount: OnMount = (editor) => {
    // STORE EDITOR REFERENCE
    editorRef.current = editor;
  };
  // MAP LANGUAGE TO MONACO LANGUAGE
  const getMonacoLanguage = (lang: string): string => {
    // LANGUAGE MAP
    const languageMap: Record<string, string> = {
      javascript: "javascript",
      typescript: "typescript",
      python: "python",
      java: "java",
      csharp: "csharp",
      cpp: "cpp",
      c: "c",
      go: "go",
      rust: "rust",
      ruby: "ruby",
      php: "php",
      swift: "swift",
      kotlin: "kotlin",
      scala: "scala",
      html: "html",
      css: "css",
      scss: "scss",
      less: "less",
      json: "json",
      xml: "xml",
      yaml: "yaml",
      markdown: "markdown",
      sql: "sql",
      shell: "shell",
      dockerfile: "dockerfile",
      makefile: "makefile",
      plaintext: "plaintext",
      vue: "vue",
      svelte: "svelte",
      dotenv: "plaintext",
    };
    // RETURN MONACO LANGUAGE
    return languageMap[lang.toLowerCase()] || "plaintext";
  };
  // LOADING COMPONENT
  const LoadingComponent = () => (
    <CodeEditorSkeleton className="absolute inset-0" />
  );
  // HANDLE INTERNAL SETTINGS CHANGE
  const handleSettingsChange = (newSettings: EditorSettings) => {
    // CALL PARENT HANDLER IF PROVIDED
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };
  // RETURN CODE EDITOR
  return (
    <div
      className={`flex flex-col rounded-lg overflow-hidden border border-[var(--border)] ${className}`}
    >
      {/* TOOLBAR */}
      {showToolbar && onSettingsChange && (
        <EditorToolbar
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      )}
      {/* EDITOR */}
      <div className="flex-1 relative">
        <Editor
          height={height}
          language={getMonacoLanguage(language)}
          value={value}
          theme={settings.theme}
          onChange={(val) => onChange?.(val || "")}
          beforeMount={handleEditorBeforeMount}
          onMount={handleEditorMount}
          loading={<LoadingComponent />}
          options={{
            readOnly,
            minimap: { enabled: settings.showMinimap },
            lineNumbers: settings.showLineNumbers ? "on" : "off",
            wordWrap: settings.wordWrap ? "on" : "off",
            scrollBeyondLastLine: false,
            fontSize: settings.fontSize,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
            tabSize: 2,
            automaticLayout: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            padding: {
              top: 12,
              bottom: 12,
            },
            renderLineHighlight: "line",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            contextmenu: true,
            folding: true,
            foldingHighlight: true,
            showFoldingControls: "mouseover",
            bracketPairColorization: {
              enabled: true,
            },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            fixedOverflowWidgets: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
