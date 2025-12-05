// <== EDITOR THEME OPTIONS ==>
export type EditorTheme =
  | "vs-dark"
  | "light"
  | "hc-black"
  | "github-dark"
  | "one-dark"
  | "dracula";

// <== THEME OPTIONS CONFIG ==>
export const themeOptions: {
  value: EditorTheme;
  label: string;
  isDark: boolean;
}[] = [
  { value: "vs-dark", label: "VS Code Dark", isDark: true },
  { value: "one-dark", label: "One Dark Pro", isDark: true },
  { value: "dracula", label: "Dracula", isDark: true },
  { value: "github-dark", label: "GitHub Dark", isDark: true },
  { value: "hc-black", label: "High Contrast", isDark: true },
  { value: "light", label: "VS Code Light", isDark: false },
];

// <== EDITOR SETTINGS TYPE ==>
export type EditorSettings = {
  // <== THEME ==>
  theme: EditorTheme;
  // <== FONT SIZE ==>
  fontSize: number;
  // <== SHOW LINE NUMBERS ==>
  showLineNumbers: boolean;
  // <== SHOW MINIMAP ==>
  showMinimap: boolean;
  // <== WORD WRAP ==>
  wordWrap: boolean;
};

// <== DEFAULT EDITOR SETTINGS ==>
export const defaultEditorSettings: EditorSettings = {
  theme: "vs-dark",
  fontSize: 13,
  showLineNumbers: true,
  showMinimap: true,
  wordWrap: false,
};

