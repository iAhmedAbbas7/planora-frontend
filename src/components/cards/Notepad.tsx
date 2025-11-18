// <== IMPORTS ==>
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useState, useEffect, JSX, CSSProperties } from "react";

// <== FORMAT TYPE INTERFACE ==>
type Format = {
  // <== BOLD ==>
  bold: boolean;
  // <== ITALIC ==>
  italic: boolean;
  // <== UNDERLINE ==>
  underline: boolean;
  // <== ALIGN ==>
  align: "left" | "center" | "right";
};

// <== NOTEPAD COMPONENT ==>
const Notepad = (): JSX.Element => {
  // GET SAVED NOTE FROM LOCAL STORAGE
  const savedNote = localStorage.getItem("notepad") || "";
  // GET SAVED FORMAT FROM LOCAL STORAGE
  const savedFormat = JSON.parse(
    localStorage.getItem("notepadFormat") || "null"
  ) || {
    bold: false,
    italic: false,
    underline: false,
    align: "left",
  };
  // NOTE STATE
  const [note, setNote] = useState<string>(savedNote);
  // FORMAT STATE
  const [format, setFormat] = useState<Format>(savedFormat);
  // SYNC NOTE TO LOCAL STORAGE EFFECT
  useEffect(() => {
    // SAVE NOTE TO LOCAL STORAGE
    localStorage.setItem("notepad", note);
  }, [note]);
  // SYNC FORMAT TO LOCAL STORAGE EFFECT
  useEffect(() => {
    // SAVE FORMAT TO LOCAL STORAGE
    localStorage.setItem("notepadFormat", JSON.stringify(format));
  }, [format]);
  // TEXT STYLE OBJECT
  const textStyle: CSSProperties = {
    fontWeight: format.bold ? "bold" : "normal",
    fontStyle: format.italic ? "italic" : "normal",
    textDecoration: format.underline ? "underline" : "none",
    textAlign: format.align,
  };
  // GET ALIGN ICON BASED ON FORMAT
  const AlignIcon =
    format.align === "left"
      ? AlignLeft
      : format.align === "center"
      ? AlignCenter
      : AlignRight;

  // RETURNING THE NOTEPAD COMPONENT
  return (
    // NOTEPAD MAIN CONTAINER
    <div className="flex flex-col border border-[var(--border)] bg-[var(--cards-bg)] rounded-xl">
      {/* NOTEPAD HEADER */}
      <header className="border-b border-[var(--border)] px-4 py-1.5">
        {/* HEADER TITLE */}
        <p className="text-lg font-medium">Private Notepad</p>
      </header>
      {/* NOTEPAD MAIN CONTENT */}
      <main>
        {/* TEXTAREA */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your notes here..."
          className="w-full h-46 resize-none rounded-lg p-4 focus:outline-none bg-transparent"
          style={textStyle}
        />
      </main>
      {/* NOTEPAD FOOTER */}
      <footer className="flex gap-3 items-center px-4 py-1.5 border-t border-[var(--border)]">
        {/* BOLD BUTTON */}
        <button
          onClick={() => setFormat((f) => ({ ...f, bold: !f.bold }))}
          className={`p-2 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer ${
            format.bold ? "bg-[var(--inside-card-bg)]" : ""
          }`}
        >
          {/* BOLD ICON */}
          <Bold size={18} />
        </button>
        {/* ITALIC BUTTON */}
        <button
          onClick={() => setFormat((f) => ({ ...f, italic: !f.italic }))}
          className={`p-2 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer ${
            format.italic ? "bg-[var(--inside-card-bg)]" : ""
          }`}
        >
          {/* ITALIC ICON */}
          <Italic size={18} />
        </button>
        {/* UNDERLINE BUTTON */}
        <button
          onClick={() => setFormat((f) => ({ ...f, underline: !f.underline }))}
          className={`p-2 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer ${
            format.underline ? "bg-[var(--inside-card-bg)]" : ""
          }`}
        >
          {/* UNDERLINE ICON */}
          <Underline size={18} />
        </button>
        {/* ALIGN BUTTON */}
        <button
          onClick={() =>
            setFormat((f) => ({
              ...f,
              align:
                f.align === "left"
                  ? "center"
                  : f.align === "center"
                  ? "right"
                  : "left",
            }))
          }
          className="p-2 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer"
        >
          {/* ALIGN ICON */}
          <AlignIcon size={18} />
        </button>
      </footer>
    </div>
  );
};

export default Notepad;
