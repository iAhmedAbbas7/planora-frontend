// <== IMPORTS ==>
import { JSX } from "react";
import { Search } from "lucide-react";
import { useCommandPaletteStore } from "../../store/useCommandPaletteStore";

// <== COMMAND BAR TRIGGER PROPS TYPE ==>
type CommandBarTriggerProps = {
  // <== VARIANT ==>
  variant?: "button" | "input";
  // <== CLASSNAME ==>
  className?: string;
};

// <== COMMAND BAR TRIGGER COMPONENT ==>
const CommandBarTrigger = ({
  variant = "button",
  className = "",
}: CommandBarTriggerProps): JSX.Element => {
  // STORE HOOKS
  const { openCommandPalette } = useCommandPaletteStore();
  // HANDLE CLICK
  const handleClick = (): void => {
    // OPEN COMMAND PALETTE
    openCommandPalette();
  };
  // DETECT OS FOR SHORTCUT KEY
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  // GET SHORTCUT KEY
  const shortcutKey = isMac ? "⌘" : "Ctrl";
  // INPUT VARIANT
  if (variant === "input") {
    // RETURN INPUT VARIANT
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-3 py-2 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--light-text)] hover:bg-[var(--hover-bg)] hover:border-[var(--accent-color)] transition-all cursor-pointer w-full sm:w-64 ${className}`}
      >
        {/* SEARCH ICON */}
        <Search size={16} />
        {/* PLACEHOLDER TEXT */}
        <span className="flex-1 text-left truncate">
          Search or type command...
        </span>
        {/* SHORTCUT BADGE */}
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded text-[10px] font-medium">
          {shortcutKey}+K
        </kbd>
      </button>
    );
  }
  // BUTTON VARIANT (DEFAULT)
  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--inside-card-bg)] border border-[var(--border)] text-[var(--light-text)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-all cursor-pointer ${className}`}
      title={`Search (${shortcutKey}+K)`}
    >
      {/* SEARCH ICON */}
      <Search size={18} />
    </button>
  );
};

export default CommandBarTrigger;
