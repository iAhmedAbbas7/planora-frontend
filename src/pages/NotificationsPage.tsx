// <== IMPORTS ==>
import {
  Bell,
  Check,
  Trash2,
  Folder,
  ListTodo,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import ConfirmationModal, {
  ModalType,
} from "../components/common/ConfirmationModal";
import { useState, JSX } from "react";
import useTitle from "../hooks/useTitle";
import DashboardHeader from "../components/layout/DashboardHeader";
import { useNotifications, Notification } from "../hooks/useNotifications";
import NotificationsSkeleton from "../components/skeletons/NotificationsSkeleton";

// <== GET NOTIFICATION ICON FUNCTION ==>
const getNotificationIcon = (type: Notification["type"]): JSX.Element => {
  // SWITCH ON NOTIFICATION TYPE
  switch (type) {
    // PROJECT NOTIFICATIONS
    case "project_created":
    case "project_updated":
    case "project_deleted":
      // RETURN FOLDER ICON
      return <Folder className="h-5 w-5 text-blue-500" />;
    // TASK NOTIFICATIONS
    case "task_created":
    case "task_updated":
    case "task_deleted":
      // RETURN LIST TODO ICON
      return <ListTodo className="h-5 w-5 text-green-500" />;
    // TASK DUE SOON NOTIFICATION
    case "task_due_soon":
      // RETURN CLOCK ICON
      return <Clock className="h-5 w-5 text-orange-500" />;
    // DEFAULT NOTIFICATION
    default:
      // RETURN BELL ICON
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};
// <== GET NOTIFICATION COLOR FUNCTION ==>
const getNotificationColor = (): string => {
  // RETURN DEFAULT COLOR (ALL USE SAME STYLING)
  return "bg-[var(--cards-bg)] border-[var(--border)]";
};

// <== NOTIFICATIONS PAGE COMPONENT ==>
const NotificationsPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Notifications");
  // GET NOTIFICATIONS DATA FROM HOOK
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isMarkingAllAsRead,
    refetchNotifications,
  } = useNotifications();
  // SELECTED ITEMS STATE
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // FILTER STATE
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  // CONFIRMATION MODAL STATE
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    showCancel?: boolean;
  }>({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    showCancel: true,
  });
  // MARK AS READ FUNCTION
  const handleMarkAsRead = (notificationId: string): void => {
    // CALL MARK AS READ MUTATION
    markAsRead(notificationId);
  };
  // MARK ALL AS READ FUNCTION
  const handleMarkAllAsRead = (): void => {
    // CHECK IF MARKING ALL AS READ
    if (isMarkingAllAsRead) return;
    // CALL MARK ALL AS READ MUTATION
    markAllAsRead(undefined, {
      onSuccess: () => {
        // SHOW SUCCESS MESSAGE
        setModalState({
          isOpen: true,
          type: "success",
          title: "Marked as Read",
          message: "All notifications marked as read successfully.",
          showCancel: false,
          confirmText: "OK",
        });
      },
    });
  };
  // DELETE NOTIFICATION FUNCTION
  const handleDeleteNotification = (notificationId: string): void => {
    // CALL DELETE NOTIFICATION MUTATION
    deleteNotification(notificationId);
    // REMOVE FROM SELECTED ITEMS
    setSelectedItems((prev) => prev.filter((id) => id !== notificationId));
  };
  // MARK SELECTED AS READ FUNCTION
  const handleMarkSelectedAsRead = (): void => {
    // CHECK IF ITEMS SELECTED
    if (selectedItems.length === 0) return;
    // STORE SELECTED COUNT
    const selectedCount = selectedItems.length;
    // MARK EACH SELECTED NOTIFICATION AS READ
    selectedItems.forEach((id) => {
      markAsRead(id);
    });
    // CLEAR SELECTION
    setSelectedItems([]);
    // SHOW SUCCESS MESSAGE
    setModalState({
      isOpen: true,
      type: "success",
      title: "Marked as Read",
      message: `${selectedCount} notification(s) marked as read successfully.`,
      showCancel: false,
      confirmText: "OK",
    });
  };
  // DELETE SELECTED NOTIFICATIONS FUNCTION
  const handleDeleteSelected = (): void => {
    // CHECK IF ITEMS SELECTED
    if (selectedItems.length === 0) return;
    // STORE SELECTED COUNT
    const selectedCount = selectedItems.length;
    // SHOW CONFIRMATION MODAL
    setModalState({
      isOpen: true,
      type: "warning",
      title: "Confirm Deletion",
      message: `Are you sure you want to delete ${selectedCount} notification(s)? This action cannot be undone.`,
      confirmText: "Delete",
      showCancel: true,
      onConfirm: () => {
        // DELETE EACH SELECTED NOTIFICATION
        selectedItems.forEach((id) => {
          deleteNotification(id);
        });
        // CLEAR SELECTION
        setSelectedItems([]);
        // SHOW SUCCESS MESSAGE
        setModalState({
          isOpen: true,
          type: "success",
          title: "Deleted",
          message: `${selectedCount} notification(s) deleted successfully.`,
          showCancel: false,
          confirmText: "OK",
        });
      },
    });
  };
  // HANDLE SELECT ALL FUNCTION
  const handleSelectAll = (checked: boolean): void => {
    // UPDATE SELECTED ITEMS
    if (checked) {
      setSelectedItems(filteredNotifications.map((n) => n._id));
    } else {
      setSelectedItems([]);
    }
  };
  // HANDLE SELECT ONE FUNCTION
  const handleSelectOne = (id: string): void => {
    // TOGGLE SELECTION
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  // FILTER NOTIFICATIONS
  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications.filter((n) => n.isRead);
  // CHECK IF ALL SELECTED
  const allSelected =
    filteredNotifications.length > 0 &&
    selectedItems.length === filteredNotifications.length;
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    return <NotificationsSkeleton />;
  }
  // RETURNING THE NOTIFICATIONS PAGE COMPONENT
  return (
    // NOTIFICATIONS PAGE MAIN CONTAINER
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* PAGE HEADER */}
      <DashboardHeader
        title="Notifications"
        subtitle="Stay updated with all your activities and updates"
        showSearch={false}
      />
      {/* NOTIFICATIONS CONTENT CONTAINER */}
      <div className="p-4">
        {/* NOTIFICATIONS CARD */}
        <div className="border border-[var(--border)] rounded-2xl bg-[var(--cards-bg)] overflow-hidden">
          {/* HEADER SECTION */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 py-4 border-b border-[var(--border)] bg-[var(--accent-color)]">
            {/* HEADER LEFT */}
            <div className="flex items-center gap-3">
              {/* BELL ICON */}
              <Bell className="h-6 w-6 text-white" />
              {/* TITLE */}
              <p className="font-semibold text-xl text-white">Notifications</p>
              {/* UNREAD COUNT BADGE */}
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2.5 py-1 min-w-[24px] text-center font-medium">
                  {unreadCount}
                </span>
              )}
            </div>
            {/* HEADER RIGHT - ACTIONS */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* MARK ALL AS READ BUTTON */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAllAsRead}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-white/20 hover:bg-white/30 text-white transition cursor-pointer ${
                    isMarkingAllAsRead ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Mark all as read"
                >
                  {/* CHECK CIRCLE ICON */}
                  <CheckCircle2 size={16} />
                  {/* BUTTON TEXT */}
                  <span className="hidden sm:inline">
                    {isMarkingAllAsRead ? "Marking..." : "Mark All Read"}
                  </span>
                </button>
              )}
              {/* REFRESH BUTTON */}
              <button
                onClick={() => refetchNotifications()}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                title="Refresh"
              >
                {/* REFRESH ICON */}
                <RefreshCw size={16} />
                {/* BUTTON TEXT */}
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
          {/* FILTER TABS */}
          <div className="flex gap-2 px-4 sm:px-6 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
            {/* ALL TAB */}
            <button
              onClick={() => {
                setFilter("all");
                setSelectedItems([]);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                filter === "all"
                  ? "bg-[var(--accent-color)] text-white"
                  : "text-[var(--light-text)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              All
            </button>
            {/* UNREAD TAB */}
            <button
              onClick={() => {
                setFilter("unread");
                setSelectedItems([]);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                filter === "unread"
                  ? "bg-[var(--accent-color)] text-white"
                  : "text-[var(--light-text)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
            {/* READ TAB */}
            <button
              onClick={() => {
                setFilter("read");
                setSelectedItems([]);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                filter === "read"
                  ? "bg-[var(--accent-color)] text-white"
                  : "text-[var(--light-text)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              Read
            </button>
          </div>
          {/* BULK ACTIONS BAR */}
          {selectedItems.length > 0 && (
            <div className="flex flex-wrap justify-between items-center gap-3 px-4 sm:px-6 py-3 border-b border-[var(--border)] bg-[var(--inside-card-bg)]">
              {/* SELECTED COUNT */}
              <p className="text-sm text-[var(--text-primary)]">
                {selectedItems.length} selected
              </p>
              {/* BULK ACTIONS */}
              <div className="flex gap-2">
                {/* MARK SELECTED AS READ BUTTON */}
                <button
                  onClick={handleMarkSelectedAsRead}
                  className="px-3 py-1.5 text-sm rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer"
                >
                  Mark as Read
                </button>
                {/* DELETE SELECTED BUTTON */}
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                >
                  Delete
                </button>
                {/* CANCEL BUTTON */}
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] hover:bg-[var(--hover-bg)] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* NOTIFICATIONS LIST */}
          <div className="p-4 sm:p-6">
            {/* CHECK IF EMPTY */}
            {filteredNotifications.length === 0 ? (
              // EMPTY STATE
              <div className="text-center py-12 text-[var(--light-text)]">
                {/* BELL ICON */}
                <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
                {/* EMPTY STATE TEXT */}
                <p className="text-lg font-medium mb-2">
                  No {filter === "all" ? "" : filter} notifications
                </p>
                <p className="text-sm">
                  {filter === "all"
                    ? "You're all caught up!"
                    : filter === "unread"
                    ? "No unread notifications"
                    : "No read notifications"}
                </p>
              </div>
            ) : (
              // NOTIFICATIONS LIST
              <div className="space-y-3">
                {/* SELECT ALL CHECKBOX (IF NOTIFICATIONS EXIST) */}
                {filteredNotifications.length > 0 && (
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                    {/* SELECT ALL CHECKBOX */}
                    <input
                      type="checkbox"
                      className="accent-[var(--accent-color)] cursor-pointer"
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    {/* SELECT ALL LABEL */}
                    <label className="text-sm text-[var(--light-text)] cursor-pointer">
                      Select all
                    </label>
                  </div>
                )}
                {/* MAPPING THROUGH FILTERED NOTIFICATIONS */}
                {filteredNotifications.map((notification) => (
                  // NOTIFICATION ITEM
                  <div
                    key={notification._id}
                    className={`p-4 rounded-lg border transition ${
                      notification.isRead
                        ? "bg-[var(--cards-bg)] hover:bg-[var(--hover-bg)]"
                        : "bg-[var(--bg)] hover:bg-[var(--hover-bg)] border-[var(--accent-color)]/30"
                    } ${getNotificationColor()} ${
                      selectedItems.includes(notification._id)
                        ? "ring-2 ring-[var(--accent-color)]"
                        : ""
                    }`}
                  >
                    {/* NOTIFICATION CONTENT */}
                    <div className="flex items-start gap-4">
                      {/* SELECT CHECKBOX */}
                      <input
                        type="checkbox"
                        className="accent-[var(--accent-color)] cursor-pointer mt-1"
                        checked={selectedItems.includes(notification._id)}
                        onChange={() => handleSelectOne(notification._id)}
                      />
                      {/* NOTIFICATION ICON */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      {/* NOTIFICATION DETAILS */}
                      <div className="flex-1 min-w-0">
                        {/* NOTIFICATION HEADER */}
                        <div className="flex items-start justify-between gap-3">
                          {/* NOTIFICATION TEXT */}
                          <div className="flex-1">
                            {/* NOTIFICATION TITLE */}
                            <p
                              className={`text-base font-medium mb-1 ${
                                notification.isRead
                                  ? "text-[var(--light-text)]"
                                  : "text-[var(--text-primary)]"
                              }`}
                            >
                              {notification.title}
                            </p>
                            {/* NOTIFICATION MESSAGE */}
                            <p className="text-sm text-[var(--text-primary)] mb-2">
                              {notification.message}
                            </p>
                            {/* NOTIFICATION DATE */}
                            <p className="text-xs text-[var(--light-text)]">
                              {new Date(notification.createdAt).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                          {/* NOTIFICATION ACTIONS */}
                          <div className="flex items-center gap-1">
                            {/* MARK AS READ BUTTON */}
                            {!notification.isRead && (
                              <button
                                onClick={() =>
                                  handleMarkAsRead(notification._id)
                                }
                                className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer"
                                title="Mark as read"
                              >
                                {/* CHECK ICON */}
                                <Check
                                  size={16}
                                  className="text-[var(--light-text)]"
                                />
                              </button>
                            )}
                            {/* DELETE BUTTON */}
                            <button
                              onClick={() =>
                                handleDeleteNotification(notification._id)
                              }
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition cursor-pointer"
                              title="Delete"
                            >
                              {/* TRASH ICON */}
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* FOOTER */}
          {filteredNotifications.length > 0 && (
            <div className="border-t border-[var(--border)] bg-[var(--bg)] px-4 sm:px-6 py-3">
              {/* FOOTER CONTENT */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                {/* TOTAL NOTIFICATIONS COUNT */}
                <p className="text-sm text-[var(--light-text)]">
                  Showing {filteredNotifications.length} of{" "}
                  {notifications.length} notifications
                </p>
                {/* STATS */}
                <div className="flex gap-4 text-sm text-[var(--light-text)]">
                  {/* UNREAD COUNT */}
                  <span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {unreadCount}
                    </span>{" "}
                    unread
                  </span>
                  {/* READ COUNT */}
                  <span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {notifications.length - unreadCount}
                    </span>{" "}
                    read
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            type: "confirm",
            title: "",
            message: "",
            showCancel: true,
          })
        }
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        showCancel={modalState.showCancel}
      />
    </div>
  );
};

export default NotificationsPage;
