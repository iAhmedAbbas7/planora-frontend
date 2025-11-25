// <== IMPORTS ==>
import { useState, useEffect, useMemo, JSX } from "react";
import ConfirmationModal from "../common/ConfirmationModal";
import type { ModalType } from "../common/ConfirmationModal";
import NotificationsSkeleton from "../skeletons/NotificationsSkeleton";
import { useNotificationSettings } from "../../hooks/useNotificationSettings";

// <== NOTIFICATIONS COMPONENT ==>
const Notifications = (): JSX.Element => {
  // NOTIFICATION SETTINGS HOOK
  const { settings, isLoading, isError, updateSettings, isUpdating } =
    useNotificationSettings();
  // FORM STATE
  const [formData, setFormData] = useState({
    taskReminders: true,
    dueDateAlerts: true,
    emailUpdates: true,
  });
  // ORIGINAL DATA STATE
  const [originalData, setOriginalData] = useState({
    taskReminders: true,
    dueDateAlerts: true,
    emailUpdates: true,
  });
  // MODAL STATE
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  // INITIALIZE FORM DATA FROM API
  useEffect(() => {
    // IF SETTINGS ARE LOADED
    if (settings) {
      // SET INITIAL DATA
      const initialData = {
        taskReminders: settings.taskReminders ?? true,
        dueDateAlerts: settings.dueDateAlerts ?? true,
        emailUpdates: settings.emailUpdates ?? true,
      };
      // SET FORM DATA
      setFormData(initialData);
      // SET ORIGINAL DATA
      setOriginalData(initialData);
    }
  }, [settings]);
  // CHECK IF CHANGES WERE MADE
  const hasChanges = useMemo(() => {
    return (
      formData.taskReminders !== originalData.taskReminders ||
      formData.dueDateAlerts !== originalData.dueDateAlerts ||
      formData.emailUpdates !== originalData.emailUpdates
    );
  }, [formData, originalData]);
  // HANDLE TOGGLE FUNCTION
  const handleToggle = (key: keyof typeof formData): void => {
    // SET FORM DATA
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  // HANDLE SAVE FUNCTION
  const handleSave = (): void => {
    updateSettings({
      taskReminders: formData.taskReminders,
      dueDateAlerts: formData.dueDateAlerts,
      emailUpdates: formData.emailUpdates,
    })
      .then(() => {
        // UPDATE ORIGINAL DATA
        setOriginalData({ ...formData });
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Notification settings updated successfully!",
        });
      })
      .catch((error) => {
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message:
            error.response?.data?.message ||
            "Failed to update notification settings. Please try again.",
        });
      });
  };
  // HANDLE CANCEL FUNCTION
  const handleCancel = (): void => {
    // RESET FORM DATA TO ORIGINAL
    setFormData({ ...originalData });
    // SHOW INFO MODAL
    setModalState({
      isOpen: true,
      type: "info",
      title: "Changes Reverted",
      message: "All changes have been reverted to original values.",
    });
  };
  // CLOSE MODAL FUNCTION
  const closeModal = (): void => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    return <NotificationsSkeleton />;
  }
  // IF ERROR, SHOW ERROR MESSAGE
  if (isError) {
    return (
      <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)]">
        <p className="text-red-500">
          Failed to load notification settings. Please try again.
        </p>
      </div>
    );
  }
  // RETURNING THE NOTIFICATIONS COMPONENT
  return (
    <>
      {/* NOTIFICATIONS MAIN CONTAINER */}
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
        {[
          {
            key: "taskReminders",
            title: "Task Reminders",
            desc: "Get reminders when tasks are due soon.",
          },
          {
            key: "dueDateAlerts",
            title: "Due Date Alerts",
            desc: "Receive alerts for approaching or missed due dates.",
          },
          {
            key: "emailUpdates",
            title: "Email Updates",
            desc: "Stay informed about updates and activity summaries.",
          },
        ].map(({ key, title, desc }) => (
          // TOGGLE CONTAINER
          <div
            key={key}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            {/* TOGGLE INFO */}
            <div>
              {/* TOGGLE TITLE */}
              <p className="text-base font-medium">{title}</p>
              {/* TOGGLE DESCRIPTION */}
              <p className="text-sm text-[var(--light-text)]">{desc}</p>
            </div>
            {/* TOGGLE BUTTON */}
            <button
              onClick={() => handleToggle(key as keyof typeof formData)}
              className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                formData[key as keyof typeof formData]
                  ? "bg-[var(--accent-color)]"
                  : "bg-[var(--light-text)]"
              }`}
            >
              {/* TOGGLE SLIDER */}
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[var(--bg)] rounded-full shadow-md transform transition-transform ${
                  formData[key as keyof typeof formData]
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
            onClick={handleCancel}
            disabled={!hasChanges || isUpdating}
            className="w-full sm:w-auto border border-[var(--border)] hover:bg-[var(--hover-bg)] px-6 py-2.5 rounded-lg font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          {/* SAVE BUTTON */}
          <button
            disabled={!hasChanges || isUpdating}
            onClick={handleSave}
            style={{ backgroundColor: "var(--accent-color)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--accent-btn-hover-color)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent-color)")
            }
            className="w-full sm:w-auto text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onConfirm={modalState.onConfirm}
        showCancel={false}
      />
    </>
  );
};

export default Notifications;
