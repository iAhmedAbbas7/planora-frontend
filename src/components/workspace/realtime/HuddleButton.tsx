// <== IMPORTS ==>
import { JSX, useState, useEffect } from "react";
import {
  Video,
  X,
  ExternalLink,
  Users,
  Copy,
  Check,
  Loader2,
} from "lucide-react";

// <== HUDDLE BUTTON PROPS ==>
interface HuddleButtonProps {
  // <== WORKSPACE ID ==>
  workspaceId: string;
  // <== WORKSPACE NAME ==>
  workspaceName: string;
  // <== ONLINE COUNT ==>
  onlineCount?: number;
  // <== COMPACT MODE ==>
  compact?: boolean;
}

// <== GENERATE MEETING ID ==>
const generateMeetingId = (workspaceId: string): string => {
  // CREATE A UNIQUE MEETING ID BASED ON WORKSPACE ID AND DATE
  const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
  // CREATE A RANDOM STRING
  const randomStr = Math.random().toString(36).substring(2, 8);
  // RETURN MEETING ID
  return `planora-${workspaceId.slice(-6)}-${dateStr}-${randomStr}`;
};

// <== HUDDLE BUTTON COMPONENT ==>
const HuddleButton = ({
  workspaceId,
  workspaceName,
  onlineCount = 0,
  compact = false,
}: HuddleButtonProps): JSX.Element => {
  // IS MODAL OPEN STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  // MEETING URL STATE
  const [meetingUrl, setMeetingUrl] = useState("");
  // COPIED STATE
  const [copied, setCopied] = useState(false);
  // IS LOADING STATE
  const [isLoading, setIsLoading] = useState(false);
  // GENERATE MEETING URL
  const generateMeetingUrl = () => {
    // SET LOADING
    setIsLoading(true);
    // SIMULATE LOADING DELAY
    setTimeout(() => {
      // GENERATE MEETING ID
      const meetingId = generateMeetingId(workspaceId);
      // CREATE JITSI MEET URL (FREE, NO ACCOUNT NEEDED)
      const jitsiUrl = `https://meet.jit.si/${meetingId}`;
      // SET MEETING URL
      setMeetingUrl(jitsiUrl);
      // RESET LOADING
      setIsLoading(false);
    }, 500);
  };
  // OPEN MODAL
  const openModal = () => {
    // OPEN MODAL
    setIsModalOpen(true);
    // GENERATE MEETING URL
    generateMeetingUrl();
  };
  // CLOSE MODAL
  const closeModal = () => {
    // CLOSE MODAL
    setIsModalOpen(false);
    // RESET MEETING URL
    setMeetingUrl("");
    // RESET COPIED STATE
    setCopied(false);
  };
  // COPY URL
  const copyUrl = async () => {
    // TRY TO COPY TO CLIPBOARD
    try {
      await navigator.clipboard.writeText(meetingUrl);
      // SET COPIED STATE
      setCopied(true);
      // RESET COPIED STATE AFTER 2 SECONDS
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // IGNORE ERRORS (COPIED STATE WILL REMAIN FALSE)
    }
  };
  // OPEN MEETING
  const openMeeting = () => {
    // OPEN IN NEW TAB
    window.open(meetingUrl, "_blank");
  };
  // PREVENT BODY SCROLL WHEN MODAL IS OPEN
  useEffect(() => {
    // IF MODAL IS OPEN
    if (isModalOpen) {
      // PREVENT BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // ALLOW BODY SCROLL
      document.body.style.overflow = "";
    }
    // CLEANUP
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);
  // RENDER MODAL
  const renderModal = () => {
    // IF NOT OPEN, RETURN NULL
    if (!isModalOpen) return null;
    // RETURN MODAL
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="relative bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
                <Video size={20} className="text-[var(--accent-color)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--primary-text)]">
                  Quick Huddle
                </h2>
                <p className="text-xs text-[var(--light-text)]">
                  {workspaceName}
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--primary-text)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          {/* CONTENT */}
          <div className="p-4 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2
                  size={32}
                  className="text-[var(--accent-color)] animate-spin mb-3"
                />
                <p className="text-sm text-[var(--light-text)]">
                  Creating meeting room...
                </p>
              </div>
            ) : meetingUrl ? (
              <>
                {/* INFO */}
                <div className="flex items-center gap-2 p-3 bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/20 rounded-lg">
                  <Users size={16} className="text-[var(--accent-color)]" />
                  <p className="text-sm text-[var(--primary-text)]">
                    Share this link with your team to join the huddle
                  </p>
                </div>
                {/* URL */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={meetingUrl}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-[var(--hover-bg)] border border-[var(--border)] rounded-lg text-[var(--primary-text)] focus:outline-none"
                  />
                  <button
                    onClick={copyUrl}
                    className="p-2 bg-[var(--hover-bg)] border border-[var(--border)] rounded-lg text-[var(--primary-text)] hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)] transition-colors"
                    title="Copy link"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                {/* FEATURES */}
                <div className="text-xs text-[var(--light-text)] space-y-1">
                  <p>✓ No account required</p>
                  <p>✓ HD video & audio</p>
                  <p>✓ Screen sharing enabled</p>
                  <p>✓ Powered by Jitsi Meet</p>
                </div>
              </>
            ) : null}
          </div>
          {/* FOOTER */}
          {!isLoading && meetingUrl && (
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--border)] bg-[var(--hover-bg)]/30">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-[var(--primary-text)] border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={openMeeting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--accent-color)] rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition-colors"
              >
                <Video size={16} />
                Join Huddle
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  // COMPACT VIEW
  if (compact) {
    // RETURN COMPACT VIEW WITH MODAL
    return (
      <>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition-colors"
        >
          <Video size={14} />
          <span>Huddle</span>
        </button>
        {renderModal()}
      </>
    );
  }
  // FULL VIEW
  return (
    <>
      {/* BUTTON */}
      <button
        onClick={openModal}
        className="flex items-center gap-3 w-full p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 transition-colors group"
      >
        {/* ICON */}
        <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center group-hover:bg-[var(--accent-color)]/20 transition-colors">
          <Video size={20} className="text-[var(--accent-color)]" />
        </div>
        {/* TEXT */}
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-[var(--primary-text)]">
            Start Quick Huddle
          </p>
          <p className="text-xs text-[var(--light-text)]">
            {onlineCount > 0
              ? `${onlineCount} team member${onlineCount > 1 ? "s" : ""} online`
              : "Start an instant video call"}
          </p>
        </div>
        {/* ARROW */}
        <ExternalLink
          size={16}
          className="text-[var(--light-text)] group-hover:text-[var(--accent-color)] transition-colors"
        />
      </button>
      {/* MODAL */}
      {renderModal()}
    </>
  );
};

export default HuddleButton;
