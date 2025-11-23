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
import useTitle from "../hooks/useTitle";
import { useState, useEffect, JSX } from "react";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== NOTIFICATION TYPE INTERFACE ==>
interface Notification {
  _id: string;
  type:
    | "project_created"
    | "project_updated"
    | "project_deleted"
    | "task_created"
    | "task_updated"
    | "task_deleted"
    | "task_due_soon";
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}
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
  // NOTIFICATIONS STATE
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // LOADING STATE
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // SELECTED ITEMS STATE
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // FILTER STATE
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  // FETCH NOTIFICATIONS EFFECT (MOCK DATA - NO API)
  useEffect(() => {
    // SET LOADING
    setIsLoading(true);
    // SIMULATE API CALL
    setTimeout(() => {
      // SET EMPTY NOTIFICATIONS (UI ONLY)
      setNotifications([]);
      // SET LOADING TO FALSE
      setIsLoading(false);
    }, 500);
  }, []);
  // MARK AS READ FUNCTION
  const markAsRead = (notificationId: string): void => {
    // MARK NOTIFICATION AS READ (UI ONLY - NO API)
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
    // LOG MARK AS READ (UI ONLY)
    console.log("Notification marked as read:", notificationId);
  };
  // MARK ALL AS READ FUNCTION
  const markAllAsRead = (): void => {
    // MARK ALL NOTIFICATIONS AS READ (UI ONLY - NO API)
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    // LOG MARK ALL AS READ (UI ONLY)
    console.log("All notifications marked as read");
    // SHOW SUCCESS MESSAGE
    alert("All notifications marked as read");
  };
  // DELETE NOTIFICATION FUNCTION
  const deleteNotification = (notificationId: string): void => {
    // DELETE NOTIFICATION (UI ONLY - NO API)
    setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    // REMOVE FROM SELECTED ITEMS
    setSelectedItems((prev) => prev.filter((id) => id !== notificationId));
    // LOG DELETION (UI ONLY)
    console.log("Notification deleted:", notificationId);
  };
  // DELETE SELECTED NOTIFICATIONS FUNCTION
  const deleteSelected = (): void => {
    // DELETE SELECTED NOTIFICATIONS (UI ONLY - NO API)
    setNotifications((prev) =>
      prev.filter((n) => !selectedItems.includes(n._id))
    );
    // LOG DELETION (UI ONLY)
    console.log("Notifications deleted:", selectedItems);
    // CLEAR SELECTION
    setSelectedItems([]);
    // SHOW SUCCESS MESSAGE
    alert(`${selectedItems.length} notifications deleted`);
  };
  // FETCH NOTIFICATIONS FUNCTION
  const fetchNotifications = (): void => {
    // SET LOADING
    setIsLoading(true);
    // SIMULATE API CALL (UI ONLY)
    setTimeout(() => {
      // SET EMPTY NOTIFICATIONS
      setNotifications([]);
      // SET LOADING TO FALSE
      setIsLoading(false);
    }, 500);
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
  // GET UNREAD COUNT
  const unreadCount = notifications.filter((n) => !n.isRead).length;
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
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                  title="Mark all as read"
                >
                  {/* CHECK CIRCLE ICON */}
                  <CheckCircle2 size={16} />
                  {/* BUTTON TEXT */}
                  <span className="hidden sm:inline">Mark All Read</span>
                </button>
              )}
              {/* REFRESH BUTTON */}
              <button
                onClick={fetchNotifications}
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
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) =>
                        selectedItems.includes(n._id)
                          ? { ...n, isRead: true }
                          : n
                      )
                    );
                    setSelectedItems([]);
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer"
                >
                  Mark as Read
                </button>
                {/* DELETE SELECTED BUTTON */}
                <button
                  onClick={deleteSelected}
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
            {/* CHECK IF LOADING */}
            {isLoading ? (
              // LOADING STATE
              <div className="text-center py-12 text-[var(--light-text)]">
                <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin" />
                <p>Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
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
                                onClick={() => markAsRead(notification._id)}
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
                                deleteNotification(notification._id)
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
    </div>
  );
};

export default NotificationsPage;
