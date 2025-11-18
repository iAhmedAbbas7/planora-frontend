// <== IMPORTS ==>
import { useTheme } from "../../hooks/useTheme";
import { useState, useEffect, JSX } from "react";

// <== APPEARANCE COMPONENT ==>
const Appearance = (): JSX.Element => {
  // THEME CONTEXT
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  // TEMP ACCENT STATE
  const [tempAccent, setTempAccent] = useState<string>(accentColor);
  // INITIAL ACCENT STATE
  const [initialAccent, setInitialAccent] = useState<string>(accentColor);
  // SYNC ACCENT COLOR EFFECT
  useEffect(() => {
    // SYNC TEMP ACCENT WITH CONTEXT
    setTempAccent(accentColor);
    // SYNC INITIAL ACCENT WITH CONTEXT
    setInitialAccent(accentColor);
  }, [accentColor]);
  // COLORS ARRAY
  const colors = [
    { name: "Violet", color: "bg-violet-700" },
    { name: "Pink", color: "bg-pink-700" },
    { name: "Blue", color: "bg-blue-700" },
    { name: "Green", color: "bg-green-700" },
  ];
  // HANDLE COLOR SELECT FUNCTION
  const handleColorSelect = (color: string): void => {
    // SET TEMP ACCENT
    setTempAccent(color);
    // UPDATE CSS VARIABLES FOR PREVIEW
    document.documentElement.style.setProperty(
      "--accent-color",
      `var(--accent-${color}-500)`
    );
    document.documentElement.style.setProperty(
      "--accent-bg-color",
      `var(--accent-${color}-100)`
    );
    document.documentElement.style.setProperty(
      "--accent-hover-color",
      `var(--accent-${color}-hover)`
    );
    document.documentElement.style.setProperty(
      "--accent-highlight-color",
      `var(--accent-${color}-600)`
    );
    document.documentElement.style.setProperty(
      "--accent-btn-hover-color",
      `var(--accent-btn-${color}-700)`
    );
  };
  // HANDLE CANCEL FUNCTION
  const handleCancel = (): void => {
    // RESET TEMP ACCENT TO INITIAL
    setTempAccent(initialAccent);
    // RESET CSS VARIABLES TO INITIAL
    document.documentElement.style.setProperty(
      "--accent-color",
      `var(--accent-${initialAccent}-500)`
    );
    document.documentElement.style.setProperty(
      "--accent-bg-color",
      `var(--accent-${initialAccent}-100)`
    );
    document.documentElement.style.setProperty(
      "--accent-hover-color",
      `var(--accent-${initialAccent}-hover)`
    );
    document.documentElement.style.setProperty(
      "--accent-highlight-color",
      `var(--accent-${initialAccent}-600)`
    );
    document.documentElement.style.setProperty(
      "--accent-btn-hover-color",
      `var(--accent-btn-${initialAccent}-700)`
    );
  };
  // HANDLE SAVE FUNCTION
  const handleSave = (): void => {
    // SET ACCENT COLOR IN CONTEXT
    setAccentColor(tempAccent);
    // UPDATE INITIAL ACCENT
    setInitialAccent(tempAccent);
    // SHOW SUCCESS MESSAGE
    alert("Appearance settings updated successfully!");
  };
  // RETURNING THE APPEARANCE COMPONENT
  return (
    // APPEARANCE MAIN CONTAINER
    <div
      className="m-4 border border-[var(--border)] rounded-2xl p-6 space-y-8"
      style={{ backgroundColor: "var(--cards-bg)" }}
    >
      {/* TITLE SECTION */}
      <div>
        {/* TITLE */}
        <p className="text-xl font-semibold">Appearance</p>
        {/* DESCRIPTION */}
        <p className="text-sm text-[var(--light-text)]">
          Customize how your dashboard looks and feels.
        </p>
      </div>
      {/* ACCENT COLOR SELECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:gap-16 lg:justify-start">
        {/* ACCENT COLOR INFO */}
        <div>
          {/* ACCENT COLOR TITLE */}
          <p className="text-lg font-medium text-[var(--text-primary)]">
            Accent Color
          </p>
          {/* ACCENT COLOR DESCRIPTION */}
          <p className="text-sm text-[var(--light-text)]">
            Choose your favorite color for highlights and buttons.
          </p>
        </div>
        {/* COLOR OPTIONS */}
        <div className="flex flex-wrap gap-3">
          {/* MAPPING THROUGH COLORS */}
          {colors.map((c) => {
            // CHECK IF COLOR IS SELECTED
            const isSelected = tempAccent === c.name.toLowerCase();
            return (
              // COLOR BUTTON
              <button
                key={c.name}
                onClick={() => handleColorSelect(c.name.toLowerCase())}
                className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 transition cursor-pointer ${
                  isSelected
                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]"
                    : "border-[var(--border)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                {/* COLOR DOT */}
                <span className={`w-4 h-4 rounded-full ${c.color}`}></span>
                {/* COLOR NAME */}
                <span className="text-sm">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* THEME PREFERENCE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:gap-16 lg:justify-start">
        {/* THEME INFO */}
        <div>
          {/* THEME TITLE */}
          <p className="text-lg font-medium text-[var(--text-primary)]">
            Theme Preference
          </p>
          {/* THEME DESCRIPTION */}
          <p className="text-sm text-[var(--light-text)]">
            Choose between light and dark mode for your dashboard.
          </p>
        </div>
        {/* THEME OPTIONS */}
        <div className="flex gap-4">
          {/* LIGHT THEME OPTION */}
          <div
            className="flex flex-col items-center border-2 cursor-pointer border-[var(--border)] rounded-xl p-4 w-32 hover:border-[var(--accent-color)] transition"
            onClick={() => setTheme("light")}
          >
            {/* LIGHT THEME PREVIEW */}
            <button
              className={`w-full h-16 bg-gray-500 rounded-md mb-2 ${
                theme === "light" ? "ring-2 ring-[var(--accent-color)]" : ""
              }`}
            ></button>
            {/* LIGHT THEME LABEL */}
            <span className="text-sm">Light</span>
          </div>
          {/* DARK THEME OPTION */}
          <div
            className="flex flex-col items-center border-2 cursor-pointer border-[var(--border)] rounded-xl p-4 w-32 hover:border-[var(--accent-color)] transition"
            onClick={() => setTheme("dark")}
          >
            {/* DARK THEME PREVIEW */}
            <button
              className={`w-full h-16 bg-gray-500 rounded-md mb-2 ${
                theme === "dark" ? "ring-2 ring-[var(--accent-color)]" : ""
              }`}
            ></button>
            {/* DARK THEME LABEL */}
            <span className="text-sm">Dark</span>
          </div>
        </div>
      </div>
      {/* SAVE AND CANCEL BUTTONS */}
      <div className="pt-2 flex justify-end gap-3">
        {/* CANCEL BUTTON */}
        <button
          onClick={handleCancel}
          className="w-full sm:w-auto border border-[var(--border)] hover:bg-[var(--hover-bg)] cursor-pointer px-6 py-2.5 rounded-lg font-medium transition"
        >
          Cancel
        </button>
        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full sm:w-auto text-white px-6 py-2 rounded-lg cursor-pointer font-medium transition"
          style={{ backgroundColor: "var(--accent-color)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--accent-btn-hover-color)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--accent-color)")
          }
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Appearance;
