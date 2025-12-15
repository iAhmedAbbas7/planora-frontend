// <== IMPORTS ==>
import {
  X,
  Download,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileType,
  FileText,
} from "lucide-react";
import {
  exportPersonalReportToExcel,
  exportProjectReportToExcel,
  exportWorkspaceReportToExcel,
  exportPersonalReportToPDF,
  exportProjectReportToPDF,
  exportWorkspaceReportToPDF,
  ReportPeriod,
} from "../../hooks/useReports";
import { toast } from "../../lib/toast";
import { useState, useEffect } from "react";

// <== EXPORT FORMAT TYPE ==>
type ExportFormat = "excel" | "pdf";

// <== EXPORT MODAL PROPS TYPE ==>
type ExportModalProps = {
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

// <== EXPORT MODAL COMPONENT ==>
const ExportModal = ({
  isOpen,
  onClose,
  reportType,
  period,
  projectId,
  projectName,
  workspaceId,
  workspaceName,
}: ExportModalProps) => {
  // FORMAT STATE
  const [format, setFormat] = useState<ExportFormat>("excel");
  // LOADING STATE
  const [isExporting, setIsExporting] = useState(false);
  // SUCCESS STATE
  const [exportSuccess, setExportSuccess] = useState(false);
  // ERROR STATE
  const [exportError, setExportError] = useState<string | null>(null);
  // SCROLL LOCK EFFECT
  useEffect(() => {
    // LOCK SCROLL WHEN MODAL IS OPEN
    if (isOpen) {
      // DISABLE BODY SCROLLING
      document.body.style.overflow = "hidden";
      // ENABLE BODY SCROLLING
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

  // RESET ON CLOSE
  useEffect(() => {
    // IF MODAL IS NOT OPEN
    if (!isOpen) {
      // RESET FORMAT
      setFormat("excel");
      // RESET SUCCESS
      setExportSuccess(false);
      // RESET ERROR
      setExportError(null);
    }
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
  // HANDLE EXPORT
  const handleExport = async () => {
    // SET LOADING
    setIsExporting(true);
    // RESET STATES
    setExportSuccess(false);
    // RESET ERROR
    setExportError(null);
    // TRY TO EXPORT
    try {
      // SWITCH ON FORMAT AND REPORT TYPE
      if (format === "excel") {
        // SWITCH ON REPORT TYPE
        switch (reportType) {
          // CASE PERSONAL
          case "personal":
            await exportPersonalReportToExcel(period);
            break;
          // CASE PROJECT
          case "project":
            if (!projectId) throw new Error("Project ID is required");
            await exportProjectReportToExcel(projectId, period, projectName);
            break;
          // CASE WORKSPACE
          case "workspace":
            if (!workspaceId) throw new Error("Workspace ID is required");
            await exportWorkspaceReportToExcel(
              workspaceId,
              period,
              workspaceName
            );
            break;
        }
      } else {
        // SWITCH ON REPORT TYPE
        switch (reportType) {
          // CASE PERSONAL
          case "personal":
            await exportPersonalReportToPDF(period);
            break;
          // CASE PROJECT
          case "project":
            if (!projectId) throw new Error("Project ID is required");
            await exportProjectReportToPDF(projectId, period, projectName);
            break;
          // CASE WORKSPACE
          case "workspace":
            if (!workspaceId) throw new Error("Workspace ID is required");
            await exportWorkspaceReportToPDF(
              workspaceId,
              period,
              workspaceName
            );
            break;
        }
      }
      // SET SUCCESS
      setExportSuccess(true);
      // SHOW SUCCESS TOAST
      toast.success("Report exported successfully!");
      // CLOSE MODAL AFTER 1.5 SECONDS
      setTimeout(() => {
        // CLOSE MODAL
        onClose();
        // RESET SUCCESS
        setExportSuccess(false);
      }, 1500);
    } catch (error) {
      // SET ERROR
      console.error("Export error:", error);
      // SET ERROR
      setExportError("Failed to export report. Please try again.");
      // SHOW ERROR TOAST
      toast.error("Failed to export report");
    } finally {
      // SET LOADING FALSE
      setIsExporting(false);
    }
  };
  // RETURNING THE EXPORT MODAL
  return (
    // RETURNING THE MODAL BACKDROP
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--black-overlay)]"
      onClick={onClose}
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
              <Download size={18} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Export Report
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                Download your report
              </p>
            </div>
          </div>
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition"
          >
            <X size={18} className="text-[var(--light-text)]" />
          </button>
        </div>
        {/* BODY */}
        <div className="p-5 space-y-4">
          {/* FORMAT SELECTOR */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-[var(--light-text)]">
              <FileType size={12} className="text-[var(--accent-color)]" />
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* EXCEL OPTION */}
              <button
                onClick={() => setFormat("excel")}
                className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                  format === "excel"
                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10"
                    : "border-[var(--border)] hover:border-[var(--light-text)]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    format === "excel"
                      ? "bg-[var(--accent-color)]/20"
                      : "bg-[var(--cards-bg)]"
                  }`}
                >
                  <FileSpreadsheet
                    size={16}
                    className={
                      format === "excel"
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--light-text)]"
                    }
                  />
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-medium ${
                      format === "excel"
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    Excel
                  </p>
                  <p className="text-[10px] text-[var(--light-text)]">.xlsx</p>
                </div>
              </button>
              {/* PDF OPTION */}
              <button
                onClick={() => setFormat("pdf")}
                className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                  format === "pdf"
                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10"
                    : "border-[var(--border)] hover:border-[var(--light-text)]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    format === "pdf"
                      ? "bg-[var(--accent-color)]/20"
                      : "bg-[var(--cards-bg)]"
                  }`}
                >
                  <FileText
                    size={16}
                    className={
                      format === "pdf"
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--light-text)]"
                    }
                  />
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-medium ${
                      format === "pdf"
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    PDF
                  </p>
                  <p className="text-[10px] text-[var(--light-text)]">.pdf</p>
                </div>
              </button>
            </div>
          </div>
          {/* REPORT INFO */}
          <div className="bg-[var(--cards-bg)] rounded-lg border border-[var(--border)] p-4">
            {/* REPORT TYPE */}
            <div className="flex items-center gap-3 mb-3">
              {format === "excel" ? (
                <FileSpreadsheet
                  size={16}
                  className="text-[var(--accent-color)]"
                />
              ) : (
                <FileText size={16} className="text-[var(--accent-color)]" />
              )}
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {getReportTypeLabel()}
              </span>
            </div>
            {/* PERIOD */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-[var(--light-text)]">
                <Calendar size={14} className="text-[var(--accent-color)]" />
                <span>Period:</span>
              </div>
              <span className="text-[var(--text-primary)] font-medium">
                {getPeriodLabel()}
              </span>
            </div>
          </div>
          {/* SUCCESS MESSAGE */}
          {exportSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30">
              <CheckCircle2 size={16} className="text-[var(--accent-color)]" />
              <span className="text-sm text-[var(--accent-color)] font-medium">
                Export completed successfully!
              </span>
            </div>
          )}
          {/* ERROR MESSAGE */}
          {exportError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/15 border border-red-500/30">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-sm text-red-500 font-medium">
                {exportError}
              </span>
            </div>
          )}
          {/* WHAT'S INCLUDED */}
          <div className="text-xs text-[var(--light-text)]">
            <p className="font-medium mb-1">What's included:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-1">
              <li>Summary statistics</li>
              <li>Task completion data</li>
              {reportType === "personal" && <li>Focus session stats</li>}
              {reportType === "project" && <li>All tasks list</li>}
              {reportType === "workspace" && <li>Member contributions</li>}
              <li>Distribution breakdowns</li>
              {format === "pdf" && <li>Visual progress charts</li>}
            </ul>
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[var(--border)]">
          {/* CANCEL BUTTON */}
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--light-text)] hover:bg-[var(--hover-bg)] transition disabled:opacity-50"
          >
            Cancel
          </button>
          {/* EXPORT BUTTON */}
          <button
            onClick={handleExport}
            disabled={isExporting || exportSuccess}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Exporting...
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle2 size={16} />
                Exported!
              </>
            ) : (
              <>
                <Download size={16} />
                Export to {format === "excel" ? "Excel" : "PDF"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
