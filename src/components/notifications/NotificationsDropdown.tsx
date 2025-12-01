// <== IMPORTS ==>
import {
  Bell,
  Check,
  Trash2,
  Folder,
  ListTodo,
  Clock,
  CheckCircle2,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, JSX } from "react";
import ConfirmationModal, { ModalType } from "../common/ConfirmationModal";
import { useNotifications, Notification } from "../../hooks/useNotifications";

// <== NOTIFICATIONS DROPDOWN PROPS TYPE INTERFACE ==>
type NotificationProps = {
  // <== COLLAPSED STATE ==>
  collapsed?: boolean;
  // <== ON CLOSE FUNCTION ==>
  onClose?: () => void;
};
// <== GET NOTIFICATION ICON FUNCTION ==>
const getNotificationIcon = (type: Notification["type"]): JSX.Element => {
  // SWITCH ON NOTIFICATION TYPE
  switch (type) {
    // PROJECT NOTIFICATIONS
    case "project_created":
    case "project_updated":
    case "project_deleted":
      // RETURN FOLDER ICON
      return <Folder className="h-4 w-4 text-blue-500" />;
    // TASK NOTIFICATIONS
    case "task_created":
    case "task_updated":
    case "task_deleted":
      // RETURN LIST TODO ICON
      return <ListTodo className="h-4 w-4 text-green-500" />;
    // TASK DUE SOON NOTIFICATION
    case "task_due_soon":
      // RETURN CLOCK ICON
      return <Clock className="h-4 w-4 text-orange-500" />;
    // DEFAULT NOTIFICATION
    default:
      // RETURN BELL ICON
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};
// <== GET NOTIFICATION COLOR FUNCTION ==>
const getNotificationColor = (): string => {
  // RETURN DEFAULT COLOR (ALL USE SAME STYLING)
  return "bg-[var(--cards-bg)] border-[var(--border)]";
};

// <== NOTIFICATIONS DROPDOWN COMPONENT ==>
const NotificationsDropdown = ({
  collapsed,
  onClose,
}: NotificationProps): JSX.Element => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
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
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement | null>(null);
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
  // HANDLE CLICK OUTSIDE EFFECT
  useEffect(() => {
    // HANDLE CLICK OUTSIDE FUNCTION
    const handleClickOutside = (e: MouseEvent): void => {
      // CHECK IF CLICK IS OUTSIDE DROPDOWN
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        // CHECK IF CLICK IS ON NOTIFICATION TAB BUTTON
        const target = e.target as HTMLElement;
        // CHECK IF CLICK IS ON NOTIFICATION TAB BUTTON
        const isNotificationTab = target.closest(
          'button[data-notification-tab="true"]'
        );
        // IF NOT CLICKING ON NOTIFICATION TAB, CLOSE DROPDOWN
        if (!isNotificationTab) {
          // CLOSE DROPDOWN
          onClose?.();
        }
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
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
      // ON SUCCESS
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
  };
  // RETURNING THE NOTIFICATIONS DROPDOWN COMPONENT
  return (
    // DROPDOWN MAIN CONTAINER
    <div
      ref={dropdownRef}
      className={`fixed top-6 bottom-6 h-auto w-[90%] sm:w-80 bg-[var(--bg)] border border-[var(--border)] shadow-xl rounded-xl z-50 overflow-hidden flex flex-col ${
        collapsed
          ? "left-24 md:left-24"
          : "left-1/2 -translate-x-1/2 md:left-[17rem] md:translate-x-0"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--accent-color)] border-b border-[var(--border)]">
        {/* HEADER LEFT */}
        <div className="flex items-center gap-2">
          {/* BELL ICON */}
          <Bell className="h-5 w-5 text-white" />
          {/* NOTIFICATIONS TITLE */}
          <p className="font-semibold text-lg text-white">Notifications</p>
          {/* UNREAD COUNT BADGE */}
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        {/* HEADER RIGHT */}
        <div className="flex items-center gap-2">
          {/* REFRESH BUTTON */}
          <button
            onClick={() => refetchNotifications()}
            className="p-1.5 rounded-md hover:bg-[var(--accent-btn-hover-color)] cursor-pointer hover:text-white transition"
            title="Refresh notifications"
          >
            {/* REFRESH ICON */}
            <RefreshCw size={16} className="text-white" />
          </button>
          {/* EXPAND BUTTON */}
          <button
            onClick={() => {
              onClose?.();
              navigate("/notifications");
            }}
            className="p-1.5 rounded-md hover:bg-[var(--accent-btn-hover-color)] cursor-pointer hover:text-white transition"
            title="View all notifications"
          >
            {/* MAXIMIZE ICON */}
            <Maximize2 size={16} className="text-white" />
          </button>
          {/* MARK ALL AS READ BUTTON */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead}
              className={`p-1.5 rounded-md hover:bg-[var(--accent-btn-hover-color)] cursor-pointer hover:text-white transition ${
                isMarkingAllAsRead ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Mark all as read"
            >
              {/* CHECK CIRCLE ICON */}
              <CheckCircle2 size={16} className="text-white" />
            </button>
          )}
        </div>
      </div>
      {/* BODY */}
      <div className="flex-1 overflow-y-auto w-full h-full">
        {/* CHECK IF LOADING */}
        {isLoading ? (
          // LOADING STATE
          <div className="flex items-center justify-center h-full text-[var(--light-text)]">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center h-full text-[var(--light-text)]">
            {/* BELL ICON */}
            <Bell className="h-12 w-12 mb-2 opacity-50" />
            {/* EMPTY STATE TEXT */}
            <p>No notifications yet</p>
          </div>
        ) : (
          // NOTIFICATIONS LIST
          <div className="px-2 py-2 space-y-2">
            {/* MAPPING THROUGH NOTIFICATIONS */}
            {notifications.map((notification) => (
              // NOTIFICATION ITEM
              <div
                key={notification._id}
                className={`p-3 rounded-md border cursor-pointer transition ${
                  notification.isRead
                    ? "bg-[var(--cards-bg)] hover:bg-[var(--hover-bg)]"
                    : "bg-[var(--bg)] hover:bg-[var(--hover-bg)]"
                } ${getNotificationColor()}`}
              >
                {/* NOTIFICATION CONTENT */}
                <div className="flex items-start gap-3">
                  {/* NOTIFICATION ICON */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  {/* NOTIFICATION DETAILS */}
                  <div className="flex-1 min-w-0">
                    {/* NOTIFICATION HEADER */}
                    <div className="flex items-start justify-between">
                      {/* NOTIFICATION TEXT */}
                      <div className="flex-1">
                        {/* NOTIFICATION TITLE */}
                        <p
                          className={`text-sm font-medium ${
                            notification.isRead
                              ? "text-[var(--light-text)]"
                              : "text-[var(--text-primary)]"
                          }`}
                        >
                          {notification.title}
                        </p>
                        {/* NOTIFICATION MESSAGE */}
                        <p className="text-xs text-[var(--text-primary)] mt-1">
                          {notification.message}
                        </p>
                        {/* NOTIFICATION DATE */}
                        <p className="text-xs text-[var(--light-text)] mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {/* NOTIFICATION ACTIONS */}
                      <div className="flex items-center gap-1 ml-2">
                        {/* MARK AS READ BUTTON */}
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-1 rounded hover:bg-[var(--hover-bg)] transition cursor-pointer"
                            title="Mark as read"
                          >
                            {/* CHECK ICON */}
                            <Check
                              size={14}
                              className="text-[var(--light-text)]"
                            />
                          </button>
                        )}
                        {/* DELETE BUTTON */}
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification._id)
                          }
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition cursor-pointer"
                          title="Delete"
                        >
                          {/* TRASH ICON */}
                          <Trash2 size={14} className="text-red-500" />
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
      <div className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-2">
        {/* FOOTER CONTENT */}
        <div className="flex justify-center items-center">
          {/* TOTAL NOTIFICATIONS COUNT */}
          <p className="text-xs text-[var(--light-text)]">
            {notifications.length} total notifications
          </p>
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

export default NotificationsDropdown;
