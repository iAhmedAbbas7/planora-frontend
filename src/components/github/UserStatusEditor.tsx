// <== IMPORTS ==>
import {
  UserStatusInput,
  useUpdateUserStatus,
  useClearUserStatus,
} from "../../hooks/useGitHub";
import { JSX, useState, useEffect } from "react";
import { X, Loader2, Clock, Smile } from "lucide-react";

// <== POPULAR EMOJIS ==>
const POPULAR_EMOJIS = [
  "🏠",
  "💻",
  "🎯",
  "📚",
  "🎮",
  "🎵",
  "✈️",
  "🌴",
  "🤒",
  "🔴",
  "💪",
  "🎉",
  "☕",
  "🍕",
  "🚀",
  "⚡",
  "🔥",
  "💡",
  "🌙",
  "☀️",
  "🌈",
  "❤️",
  "💜",
  "💙",
  "💚",
  "💛",
  "🧡",
  "🖤",
  "😀",
  "😎",
  "🤔",
  "😴",
  "🤯",
  "🥳",
  "😇",
  "🤓",
];

// <== PRESET STATUSES ==>
const PRESET_STATUSES = [
  { emoji: "🏠", message: "Working from home" },
  { emoji: "🌴", message: "On vacation" },
  { emoji: "🤒", message: "Out sick" },
  { emoji: "💻", message: "Focusing" },
  { emoji: "🎯", message: "In a meeting" },
  { emoji: "🔴", message: "Do not disturb" },
];

// <== USER STATUS EDITOR PROPS ==>
type UserStatusEditorProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== CURRENT STATUS ==>
  currentStatus?: {
    emoji: string | null;
    message: string | null;
    busy: boolean;
  } | null;
};

// <== USER STATUS EDITOR COMPONENT ==>
const UserStatusEditor = ({
  isOpen,
  onClose,
  currentStatus,
}: UserStatusEditorProps): JSX.Element | null => {
  // FORM STATE
  const [formData, setFormData] = useState<UserStatusInput>({
    emoji: "",
    message: "",
    limitedAvailability: false,
  });
  // EMOJI PICKER OPEN STATE
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // UPDATE STATUS MUTATION
  const updateStatus = useUpdateUserStatus();
  // CLEAR STATUS MUTATION
  const clearStatus = useClearUserStatus();
  // LOCK BODY SCROLL AND RESET ON CLOSE
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
      // SET FORM DATA FROM CURRENT STATUS
      if (currentStatus) {
        setFormData({
          emoji: currentStatus.emoji || "",
          message: currentStatus.message || "",
          limitedAvailability: currentStatus.busy || false,
        });
      } else {
        setFormData({
          emoji: "",
          message: "",
          limitedAvailability: false,
        });
      }
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
      // RESET SHOW EMOJI PICKER
      setShowEmojiPicker(false);
    }
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen, currentStatus]);
  // HANDLE EMOJI SELECT
  const handleEmojiSelect = (emoji: string) => {
    // SET FORM DATA
    setFormData((prev) => ({ ...prev, emoji }));
    // CLOSE EMOJI PICKER
    setShowEmojiPicker(false);
  };
  // HANDLE PRESET SELECT
  const handlePresetSelect = (preset: { emoji: string; message: string }) => {
    // SET FORM DATA
    setFormData((prev) => ({
      ...prev,
      emoji: preset.emoji,
      message: preset.message,
    }));
  };
  // HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // UPDATE STATUS USING MUTATION
    await updateStatus.mutateAsync({
      emoji: formData.emoji || null,
      message: formData.message || null,
      limitedAvailability: formData.limitedAvailability,
    });
    // CLOSE MODAL ON SUCCESS
    onClose();
  };
  // HANDLE CLEAR STATUS
  const handleClearStatus = async () => {
    // CLEAR STATUS
    await clearStatus.mutateAsync();
    // CLOSE MODAL ON SUCCESS
    onClose();
  };
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RENDER USER STATUS EDITOR
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Smile size={20} className="text-[var(--accent-color)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Set Status
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {/* STATUS INPUT */}
          <div className="flex items-center gap-2 p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
            {/* EMOJI BUTTON */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-10 h-10 flex items-center justify-center bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg text-xl hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              {formData.emoji || (
                <Smile className="w-5 h-5 text-[var(--light-text)]" />
              )}
            </button>
            {/* MESSAGE INPUT */}
            <input
              type="text"
              value={formData.message || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="What's happening?"
              maxLength={80}
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none"
            />
          </div>
          {/* EMOJI PICKER */}
          {showEmojiPicker && (
            <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
              <p className="text-xs font-medium text-[var(--light-text)] mb-2">
                Choose an emoji
              </p>
              <div className="flex flex-wrap gap-1">
                {POPULAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiSelect(emoji)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                      formData.emoji === emoji
                        ? "bg-[var(--accent-color)]/20 ring-1 ring-[var(--accent-color)]"
                        : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* PRESET STATUSES */}
          <div>
            <p className="text-xs font-medium text-[var(--light-text)] mb-2">
              Suggestions
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_STATUSES.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`flex items-center gap-2 p-2.5 bg-[var(--cards-bg)] border rounded-xl text-sm text-left hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                    formData.emoji === preset.emoji &&
                    formData.message === preset.message
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10"
                      : "border-[var(--border)]"
                  }`}
                >
                  <span className="text-lg">{preset.emoji}</span>
                  <span className="text-[var(--light-text)] truncate">
                    {preset.message}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {/* BUSY TOGGLE */}
          <div className="flex items-center justify-between p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--light-text)]" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Busy
                </p>
                <p className="text-xs text-[var(--light-text)]">
                  Others will see you have limited availability
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  limitedAvailability: !prev.limitedAvailability,
                }))
              }
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                formData.limitedAvailability
                  ? "bg-[var(--accent-color)]"
                  : "bg-[var(--border)]"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.limitedAvailability
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </form>
        {/* FOOTER */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--border)] flex-shrink-0">
          {/* CLEAR BUTTON */}
          <button
            type="button"
            onClick={handleClearStatus}
            disabled={clearStatus.isPending || !currentStatus?.emoji}
            className="px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {clearStatus.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Clear status
          </button>
          {/* SAVE BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={updateStatus.isPending}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateStatus.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Set status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatusEditor;
