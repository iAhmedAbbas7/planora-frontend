// <== IMPORTS ==>
import { useState, useEffect, JSX } from "react";

// <== NOTIFICATIONS COMPONENT ==>
const Notifications = (): JSX.Element => {
  // SETTINGS STATE
  const [settings, setSettings] = useState({
    taskReminders: true,
    dueDateAlerts: false,
    emailUpdates: true,
  });
  // LOADING STATE
  const [loading, setLoading] = useState<boolean>(false);
  // FETCH SETTINGS EFFECT (MOCK DATA - NO API)
  useEffect(() => {
    // SIMULATE API CALL
    setTimeout(() => {
      // SET DEFAULT SETTINGS (UI ONLY)
      setSettings({
        taskReminders: true,
        dueDateAlerts: false,
        emailUpdates: true,
      });
      // SET LOADING TO FALSE
      setLoading(false);
    }, 500);
  }, []);
  // HANDLE SAVE FUNCTION
  const handleSave = (): void => {
    // SET LOADING
    setLoading(true);
    // SIMULATE API CALL (UI ONLY)
    setTimeout(() => {
      // LOG SETTINGS (UI ONLY)
      console.log("Notification settings:", settings);
      // SHOW SUCCESS MESSAGE
      alert("Settings updated successfully");
      // SET LOADING TO FALSE
      setLoading(false);
    }, 500);
  };
  // RETURNING THE NOTIFICATIONS COMPONENT
  return (
    // NOTIFICATIONS MAIN CONTAINER
    <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-8">
      {/* TITLE SECTION */}
      <div>
        {/* TITLE */}
        <p className="text-xl font-semibold">Notifications</p>
        {/* DESCRIPTION */}
        <p className="text-sm text-[var(--light-text)]">
          Manage your notification preferences.
        </p>
      </div>
      {/* TOGGLES */}
      {/* MAPPING THROUGH SETTINGS KEYS */}
      {["taskReminders", "dueDateAlerts", "emailUpdates"].map((key) => (
        // TOGGLE CONTAINER
        <div
          key={key}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          {/* TOGGLE INFO */}
          <div>
            {/* TOGGLE TITLE */}
            <p className="text-base font-medium">
              {key === "taskReminders"
                ? "Task Reminders"
                : key === "dueDateAlerts"
                ? "Due Date Alerts"
                : "Email Updates"}
            </p>
            {/* TOGGLE DESCRIPTION */}
            <p className="text-sm text-[var(--light-text)]">
              {key === "taskReminders"
                ? "Get reminders when tasks are due soon."
                : key === "dueDateAlerts"
                ? "Receive alerts for approaching or missed due dates."
                : "Stay informed about updates and activity summaries."}
            </p>
          </div>
          {/* TOGGLE BUTTON */}
          <button
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                [key]: !prev[key as keyof typeof prev],
              }))
            }
            className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
              settings[key as keyof typeof settings]
                ? "bg-[var(--accent-color)]"
                : "bg-[var(--light-text)]"
            }`}
          >
            {/* TOGGLE SLIDER */}
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[var(--bg)] rounded-full shadow-md transform transition-transform ${
                settings[key as keyof typeof settings]
                  ? "translate-x-6"
                  : "translate-x-0"
              }`}
            ></span>
          </button>
        </div>
      ))}
      {/* BUTTONS CONTAINER */}
      <div className="pt-2 flex justify-end gap-3">
        {/* CANCEL BUTTON */}
        <button
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto border border-[var(--border)] hover:bg-[var(--hover-bg)] px-6 py-2.5 rounded-lg font-medium cursor-pointer"
        >
          Cancel
        </button>
        {/* SAVE BUTTON */}
        <button
          disabled={loading}
          onClick={handleSave}
          style={{ backgroundColor: "var(--accent-color)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--accent-btn-hover-color)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--accent-color)")
          }
          className="w-full sm:w-auto text-white px-6 py-2 rounded-lg font-medium cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Notifications;
