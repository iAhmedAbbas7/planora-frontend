// <== IMPORTS ==>
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  AlertCircle,
  Trash2,
  Check,
} from "lucide-react";
import { JSX, useEffect } from "react";

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
  // GET ICON AND COLOR BASED ON TYPE
  const getIconConfig = (): {
    icon: JSX.Element;
    color: string;
    bgColor: string;
  } => {
    // SWITCH ON TYPE
    switch (type) {
      // WARNING TYPE
      case "warning":
        return {
          icon: <AlertTriangle size={20} />,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/15",
        };
      // ERROR TYPE
      case "error":
        return {
          icon: <AlertCircle size={20} />,
          color: "text-red-500",
          bgColor: "bg-red-500/15",
        };
      // SUCCESS TYPE
      case "success":
        return {
          icon: <CheckCircle2 size={20} />,
          color: "text-green-500",
          bgColor: "bg-green-500/15",
        };
      // INFO TYPE
      case "info":
        return {
          icon: <Info size={20} />,
          color: "text-blue-500",
          bgColor: "bg-blue-500/15",
        };
      // DEFAULT (CONFIRM) TYPE
      default:
        return {
          icon: <AlertTriangle size={20} />,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/15",
        };
    }
  };
  // GET ICON CONFIG
  const iconConfig = getIconConfig();
  // GET CONFIRM BUTTON ICON
  const getConfirmIcon = (): JSX.Element | null => {
    // SWITCH ON TYPE
    switch (type) {
      // ERROR TYPE
      case "error":
        return <Trash2 size={16} />;
      // SUCCESS TYPE
      case "success":
        return <Check size={16} />;
      // DEFAULT (CONFIRM) TYPE
      default:
        return <Check size={16} />;
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
      className="fixed inset-0 min-h-screen bg-[var(--black-overlay)] z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* MODAL CONTAINER */}
      <div className="bg-[var(--bg)] rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-[var(--border)] flex flex-col">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            {/* ICON BADGE */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconConfig.bgColor}`}
            >
              <span className={iconConfig.color}>{iconConfig.icon}</span>
            </div>
            {/* TITLE */}
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
          </div>
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* MODAL CONTENT */}
        <div className="p-4 sm:p-6">
          {/* MESSAGE */}
          <p className="text-sm text-[var(--text-primary)] text-center">
            {message}
          </p>
        </div>
        {/* MODAL FOOTER */}
        <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
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
            className={`px-4 py-2 text-sm rounded-lg cursor-pointer transition flex items-center gap-2 ${getConfirmButtonStyle()}`}
          >
            {getConfirmIcon()}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
