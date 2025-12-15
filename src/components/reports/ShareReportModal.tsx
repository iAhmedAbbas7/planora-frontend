// <== IMPORTS ==>
import {
  X,
  Share2,
  Copy,
  Link,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  Calendar,
} from "lucide-react";
import { toast } from "../../lib/toast";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createShareableLink, ReportPeriod } from "../../hooks/useReports";

// <== SHARE REPORT MODAL PROPS TYPE ==>
type ShareReportModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== REPORT TYPE ==>
  reportType: "personal" | "project" | "workspace";
  // <== PERIOD ==>
  period: ReportPeriod;
  // <== PROJECT ID (FOR PROJECT REPORTS) ==>
  projectId?: string;
  // <== PROJECT NAME (FOR PROJECT REPORTS) ==>
  projectName?: string;
  // <== WORKSPACE ID (FOR WORKSPACE REPORTS) ==>
  workspaceId?: string;
  // <== WORKSPACE NAME (FOR WORKSPACE REPORTS) ==>
  workspaceName?: string;
};

// <== EXPIRY OPTIONS ==>
const EXPIRY_OPTIONS = [
  { value: 1, label: "1 day" },
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
];

// <== SHARE REPORT MODAL COMPONENT ==>
const ShareReportModal = ({
  isOpen,
  onClose,
  reportType,
  period,
  projectId,
  projectName,
  workspaceId,
  workspaceName,
}: ShareReportModalProps) => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // EXPIRY DAYS STATE
  const [expiresInDays, setExpiresInDays] = useState(7);
  // LOADING STATE
  const [isCreating, setIsCreating] = useState(false);
  // SHARE URL STATE
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  // ERROR STATE
  const [error, setError] = useState<string | null>(null);
  // COPIED STATE
  const [copied, setCopied] = useState(false);
  // SCROLL LOCK EFFECT
  useEffect(() => {
    // LOCK SCROLL WHEN MODAL IS OPEN
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
  // GET REPORT TYPE LABEL
  const getReportTypeLabel = () => {
    // SWITCH ON REPORT TYPE
    switch (reportType) {
      // CASE PERSONAL
      case "personal":
        // RETURN PERSONAL REPORT
        return "Personal Report";
      // CASE PROJECT
      case "project":
        // RETURN PROJECT REPORT
        return projectName ? `Project: ${projectName}` : "Project Report";
      // CASE WORKSPACE
      case "workspace":
        // RETURN WORKSPACE REPORT
        return workspaceName
          ? `Workspace: ${workspaceName}`
          : "Workspace Report";
      // DEFAULT CASE
      default:
        // RETURN DEFAULT REPORT
        return "Report";
    }
  };
  // GET PERIOD LABEL
  const getPeriodLabel = () => {
    // SWITCH ON PERIOD
    switch (period) {
      // CASE WEEK
      case "week":
        return "Last 7 Days";
      // CASE MONTH
      case "month":
        // RETURN LAST MONTH
        return "Last Month";
      // CASE QUARTER
      case "quarter":
        // RETURN LAST QUARTER
        return "Last Quarter";
      // CASE YEAR
      case "year":
        // RETURN LAST YEAR
        return "Last Year";
      // DEFAULT CASE
      default:
        // RETURN CUSTOM PERIOD
        return "Custom Period";
    }
  };
  // HANDLE CREATE SHARE LINK
  const handleCreateShareLink = async () => {
    // SET LOADING
    setIsCreating(true);
    // RESET STATES
    setShareUrl(null);
    // RESET ERROR
    setError(null);
    // TRY TO CREATE SHARE LINK
    try {
      // CREATE SHARE LINK
      const result = await createShareableLink({
        reportType,
        projectId,
        workspaceId,
        period,
        expiresInDays,
      });
      // SET SHARE URL
      setShareUrl(result.shareUrl);
      // INVALIDATE SHARED REPORTS QUERY
      queryClient.invalidateQueries({ queryKey: ["userSharedReports"] });
      // SHOW SUCCESS TOAST
      toast.success("Shareable link created!");
    } catch (err) {
      // SET ERROR
      console.error("Create share link error:", err);
      // SET ERROR
      setError("Failed to create shareable link. Please try again.");
      // SHOW ERROR TOAST
      toast.error("Failed to create shareable link");
    } finally {
      // SET LOADING FALSE
      setIsCreating(false);
    }
  };
  // HANDLE COPY LINK
  const handleCopyLink = async () => {
    // IF NO SHARE URL, RETURN
    if (!shareUrl) return;
    // TRY TO COPY LINK
    try {
      // COPY TO CLIPBOARD
      await navigator.clipboard.writeText(shareUrl);
      // SET COPIED
      setCopied(true);
      // SHOW SUCCESS TOAST
      toast.success("Link copied to clipboard!");
      // RESET COPIED AFTER 2 SECONDS
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // SHOW ERROR TOAST
      console.error("Copy error:", err);
      // SET ERROR
      toast.error("Failed to copy link");
    }
  };
  // HANDLE CLOSE
  const handleClose = () => {
    // RESET STATES
    setShareUrl(null);
    // RESET ERROR
    setError(null);
    // RESET COPIED
    setCopied(false);
    // CLOSE MODAL
    onClose();
  };
  // RETURNING THE SHARE REPORT MODAL
  return (
    // RETURNING THE MODAL BACKDROP
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--black-overlay)]"
      onClick={handleClose}
    >
      {/* MODAL CONTENT */}
      <div
        className="relative w-full max-w-md bg-[var(--bg)] rounded-xl border border-[var(--border)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent-color)]/15 flex items-center justify-center">
              <Share2 size={18} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Share Report
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                Create a shareable link
              </p>
            </div>
          </div>
          {/* CLOSE BUTTON */}
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition"
          >
            <X size={18} className="text-[var(--light-text)]" />
          </button>
        </div>
        {/* BODY */}
        <div className="p-5 space-y-4">
          {/* SHARE URL GENERATED */}
          {shareUrl ? (
            // SHARE LINK SECTION
            <div className="space-y-4">
              {/* SUCCESS INDICATOR */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30">
                <CheckCircle2
                  size={16}
                  className="text-[var(--accent-color)]"
                />
                <span className="text-sm text-[var(--accent-color)] font-medium">
                  Shareable link created!
                </span>
              </div>
              {/* SHARE URL INPUT */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--light-text)]">
                  <Link size={12} className="text-[var(--accent-color)]" />
                  Share URL
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--cards-bg)] border border-[var(--border)]">
                    <Link
                      size={14}
                      className="text-[var(--accent-color)] flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none truncate"
                    />
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`p-2.5 rounded-lg transition flex-shrink-0 ${
                      copied
                        ? "bg-[var(--accent-color)]/20 text-[var(--accent-color)]"
                        : "bg-[var(--accent-color)]/15 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/25"
                    }`}
                  >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              {/* INFO */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--hover-bg)]">
                <Globe
                  size={14}
                  className="text-[var(--accent-color)] mt-0.5 flex-shrink-0"
                />
                <div className="text-xs text-[var(--light-text)]">
                  <p>
                    Anyone with this link can view a summary of this report.
                  </p>
                  <p className="mt-1">
                    Link expires in{" "}
                    <span className="font-medium text-[var(--text-primary)]">
                      {expiresInDays} day{expiresInDays > 1 ? "s" : ""}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // CREATE SHARE LINK FORM
            <>
              {/* REPORT INFO */}
              <div className="bg-[var(--cards-bg)] rounded-lg border border-[var(--border)] p-4">
                {/* REPORT TYPE */}
                <div className="flex items-center gap-3 mb-3">
                  <Share2 size={16} className="text-[var(--accent-color)]" />
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {getReportTypeLabel()}
                  </span>
                </div>
                {/* PERIOD */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[var(--light-text)]">
                    <Calendar
                      size={14}
                      className="text-[var(--accent-color)]"
                    />
                    <span>Period:</span>
                  </div>
                  <span className="text-[var(--text-primary)] font-medium">
                    {getPeriodLabel()}
                  </span>
                </div>
              </div>
              {/* EXPIRY SELECTOR */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--light-text)]">
                  <Clock size={12} className="text-[var(--accent-color)]" />
                  Link expiration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {EXPIRY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setExpiresInDays(opt.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                        expiresInDays === opt.value
                          ? "bg-[var(--accent-color)] text-white"
                          : "bg-[var(--cards-bg)] text-[var(--light-text)] hover:bg-[var(--hover-bg)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* ERROR MESSAGE */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/15 border border-red-500/30">
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-sm text-red-500 font-medium">
                    {error}
                  </span>
                </div>
              )}
              {/* INFO */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--hover-bg)]">
                <Globe
                  size={14}
                  className="text-[var(--accent-color)] mt-0.5 flex-shrink-0"
                />
                <p className="text-xs text-[var(--light-text)]">
                  The shared report will show a summary of your data. You can
                  revoke access at any time from Settings.
                </p>
              </div>
            </>
          )}
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[var(--border)]">
          {shareUrl ? (
            // DONE BUTTON
            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:opacity-90 transition"
            >
              Done
            </button>
          ) : (
            <>
              {/* CANCEL BUTTON */}
              <button
                onClick={handleClose}
                disabled={isCreating}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--light-text)] hover:bg-[var(--hover-bg)] transition disabled:opacity-50"
              >
                Cancel
              </button>
              {/* CREATE LINK BUTTON */}
              <button
                onClick={handleCreateShareLink}
                disabled={isCreating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:opacity-90 transition disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Link size={16} />
                    Create Link
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareReportModal;
