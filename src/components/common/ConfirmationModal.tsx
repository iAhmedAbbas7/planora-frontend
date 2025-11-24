// <== IMPORTS ==>
import { JSX, useEffect } from "react";
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  AlertCircle,
} from "lucide-react";

// <== MODAL TYPE INTERFACE ==>
export type ModalType = "confirm" | "warning" | "error" | "success" | "info";
// <== CONFIRMATION MODAL PROPS TYPE INTERFACE ==>
type ConfirmationModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE FUNCTION ==>
  onClose: () => void;
  // <== ON CONFIRM FUNCTION ==>
  onConfirm?: () => void;
  // <== TITLE ==>
  title: string;
  // <== MESSAGE ==>
  message: string;
  // <== MODAL TYPE ==>
  type?: ModalType;
  // <== CONFIRM BUTTON TEXT ==>
  confirmText?: string;
  // <== CANCEL BUTTON TEXT ==>
  cancelText?: string;
  // <== SHOW CANCEL BUTTON ==>
  showCancel?: boolean;
};

// <== CONFIRMATION MODAL COMPONENT ==>
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "confirm",
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true,
}: ConfirmationModalProps): JSX.Element | null => {
  // PREVENT BACKGROUND SCROLLING EFFECT
  useEffect(() => {
    // IF MODAL IS OPEN
    if (isOpen) {
      // DISABLE BODY SCROLLING
      document.body.style.overflow = "hidden";
    } else {
      // ENABLE BODY SCROLLING
      document.body.style.overflow = "unset";
    }
    // CLEANUP FUNCTION
    return () => {
      // ENABLE BODY SCROLLING ON UNMOUNT
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // GET ICON BASED ON TYPE
  const getIcon = (): JSX.Element => {
    // SWITCH ON TYPE
    switch (type) {
      // WARNING TYPE
      case "warning":
        return <AlertTriangle size={48} className="text-yellow-500" />;
      // ERROR TYPE
      case "error":
        return <AlertCircle size={48} className="text-red-500" />;
      // SUCCESS TYPE
      case "success":
        return <CheckCircle2 size={48} className="text-green-500" />;
      // INFO TYPE
      case "info":
        return <Info size={48} className="text-blue-500" />;
      // DEFAULT (CONFIRM) TYPE
      default:
        return <AlertTriangle size={48} className="text-yellow-500" />;
    }
  };
  // GET BUTTON STYLES BASED ON TYPE
  const getConfirmButtonStyle = (): string => {
    // SWITCH ON TYPE
    switch (type) {
      // ERROR TYPE
      case "error":
        return "bg-red-500 hover:bg-red-600 text-white";
      // SUCCESS TYPE
      case "success":
        return "bg-green-500 hover:bg-green-600 text-white";
      // WARNING TYPE
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      // INFO TYPE
      case "info":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      // DEFAULT (CONFIRM) TYPE
      default:
        return "bg-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] text-white";
    }
  };
  // HANDLE BACKDROP CLICK
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // IF CLICKED ON BACKDROP (NOT MODAL CONTENT)
    if (e.target === e.currentTarget) {
      // CLOSE MODAL
      onClose();
    }
  };
  // RETURNING THE CONFIRMATION MODAL COMPONENT
  return (
    // MODAL BACKDROP
    <div
      className="fixed inset-0 bg-[var(--black-overlay)] z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      {/* MODAL CONTAINER */}
      <div className="bg-[var(--bg)] rounded-xl w-full max-w-md shadow-lg relative overflow-hidden border border-[var(--border)]">
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center p-3 sm:p-4 pb-2 border-b border-[var(--border)] flex-shrink-0">
          {/* MODAL TITLE */}
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {title}
          </h2>
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="cursor-pointer bg-[var(--accent-color)] rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white hover:bg-[var(--accent-btn-hover-color)] transition"
          >
            {/* CLOSE ICON */}
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
        {/* MODAL CONTENT */}
        <div className="p-4 sm:p-6">
          {/* ICON AND MESSAGE CONTAINER */}
          <div className="flex flex-col items-center gap-4 text-center">
            {/* ICON */}
            <div className="flex-shrink-0">{getIcon()}</div>
            {/* MESSAGE */}
            <p className="text-sm sm:text-base text-[var(--text-primary)]">
              {message}
            </p>
          </div>
        </div>
        {/* MODAL FOOTER */}
        <div className="flex justify-end gap-2 p-3 sm:p-4 pt-2 border-t border-[var(--border)] flex-shrink-0 bg-[var(--bg)]">
          {/* CANCEL BUTTON */}
          {showCancel && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] cursor-pointer transition"
            >
              {cancelText}
            </button>
          )}
          {/* CONFIRM BUTTON */}
          <button
            onClick={() => {
              // IF ON CONFIRM EXISTS, CALL IT
              if (onConfirm) {
                onConfirm();
              }
              // CLOSE MODAL
              onClose();
            }}
            className={`px-4 py-2 text-sm rounded-lg cursor-pointer transition ${getConfirmButtonStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
