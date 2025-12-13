// <== IMPORTS ==>
import {
  X,
  Play,
  Pause,
  Square,
  Clock,
  Target,
  FileText,
  Minimize2,
  Timer,
  CheckCircle2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  Loader2,
} from "lucide-react";
import {
  FocusSession,
  usePauseSession,
  useResumeSession,
  useEndSession,
  useCompletePomodoro,
  useEndPomodoroBreak,
  useUpdateSessionNotes,
  formatTimerDisplay,
  getElapsedSeconds,
} from "../../hooks/useFocusSession";
import PomodoroTimer from "./PomodoroTimer";
import { useState, useEffect, useCallback, CSSProperties } from "react";

// <== FORMAT TYPE ==>
type Format = {
  // <== BOLD ==>
  bold: boolean;
  // <== ITALIC ==>
  italic: boolean;
  // <== UNDERLINE ==>
  underline: boolean;
  // <== ALIGN ==>
  align: "left" | "center" | "right";
};

// <== NOTES DATA TYPE ==>
interface NotesData {
  // <== CONTENT ==>
  content: string;
  // <== FORMAT ==>
  format: Format;
}

// <== PARSE NOTES HELPER ==>
const parseNotes = (notes: string): NotesData => {
  // TRY TO PARSE JSON
  try {
    // PARSE JSON
    const parsed = JSON.parse(notes);
    // IF PARSED AND CONTENT IS STRING AND FORMAT IS OBJECT, RETURN PARSED
    if (parsed && typeof parsed.content === "string" && parsed.format) {
      // RETURN PARSED
      return parsed;
    }
  } catch {
    // IF NOT JSON, TREAT AS PLAIN TEXT
  }
  // RETURN DEFAULT
  return {
    content: notes || "",
    format: { bold: false, italic: false, underline: false, align: "left" },
  };
};

// <== STRINGIFY NOTES HELPER ==>
const stringifyNotes = (content: string, format: Format): string => {
  // STRINGIFY JSON
  return JSON.stringify({ content, format });
};

// <== NOTES MODAL PROPS ==>
interface NotesModalProps {
  // <== NOTES ==>
  notes: string;
  // <== ON NOTES CHANGE ==>
  onNotesChange: (notes: string) => void;
  // <== ON SAVE ==>
  onSave: () => void;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== IS SAVING ==>
  isSaving: boolean;
}

// <== NOTES MODAL COMPONENT ==>
const NotesModal = ({
  notes,
  onNotesChange,
  onSave,
  onClose,
  isSaving,
}: NotesModalProps) => {
  // PARSE INCOMING NOTES
  const initialData = parseNotes(notes);
  // CONTENT STATE
  const [content, setContent] = useState(initialData.content);
  // FORMAT STATE
  const [format, setFormat] = useState<Format>(initialData.format);
  // UPDATE PARENT WHEN CONTENT OR FORMAT CHANGES
  useEffect(() => {
    // STRINGIFY NOTES
    onNotesChange(stringifyNotes(content, format));
  }, [content, format, onNotesChange]);
  // TEXT STYLE
  const textStyle: CSSProperties = {
    fontWeight: format.bold ? "bold" : "normal",
    fontStyle: format.italic ? "italic" : "normal",
    textDecoration: format.underline ? "underline" : "none",
    textAlign: format.align,
  };
  // GET ALIGN ICON
  const AlignIcon =
    format.align === "left"
      ? AlignLeft
      : format.align === "center"
      ? AlignCenter
      : AlignRight;
  // RETURN NOTES MODAL
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-[var(--black-overlay)]"
        onClick={onClose}
      />
      {/* MODAL */}
      <div className="relative w-full max-w-lg bg-[var(--bg)] rounded-2xl border border-[var(--border)] shadow-2xl flex flex-col max-h-[80vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <FileText size={18} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Session Notes
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                Add notes for this focus session
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] transition"
          >
            <X size={18} />
          </button>
        </div>
        {/* CONTENT */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your notes here..."
            className="flex-1 w-full min-h-[200px] p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--light-text)] resize-none focus:outline-none focus:border-[var(--accent-color)]"
            style={textStyle}
          />
        </div>
        {/* FOOTER WITH TOOLBAR */}
        <div className="p-4 border-t border-[var(--border)]">
          {/* TOOLBAR */}
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setFormat((f) => ({ ...f, bold: !f.bold }))}
              className={`p-2 rounded-lg transition ${
                format.bold
                  ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30"
                  : "text-[var(--light-text)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
              }`}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => setFormat((f) => ({ ...f, italic: !f.italic }))}
              className={`p-2 rounded-lg transition ${
                format.italic
                  ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30"
                  : "text-[var(--light-text)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
              }`}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() =>
                setFormat((f) => ({ ...f, underline: !f.underline }))
              }
              className={`p-2 rounded-lg transition ${
                format.underline
                  ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30"
                  : "text-[var(--light-text)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
              }`}
              title="Underline"
            >
              <Underline size={16} />
            </button>
            <div className="w-px h-5 bg-[var(--border)] mx-1" />
            <button
              type="button"
              onClick={() =>
                setFormat((f) => ({
                  ...f,
                  align:
                    f.align === "left"
                      ? "center"
                      : f.align === "center"
                      ? "right"
                      : "left",
                }))
              }
              className="p-2 rounded-lg text-[var(--light-text)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition"
              title="Text Alignment"
            >
              <AlignIcon size={16} />
            </button>
          </div>
          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// <== FOCUS MODE PROPS ==>
interface FocusModeProps {
  // <== SESSION ==>
  session: FocusSession;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== ON MINIMIZE ==>
  onMinimize?: () => void;
}

// <== FOCUS MODE COMPONENT ==>
const FocusMode = ({ session, onClose, onMinimize }: FocusModeProps) => {
  // ELAPSED SECONDS STATE
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  // SHOW NOTES MODAL STATE
  const [showNotesModal, setShowNotesModal] = useState(false);
  // NOTES STATE
  const [notes, setNotes] = useState(session.notes || "");
  // PAUSE MUTATION
  const pauseMutation = usePauseSession();
  // RESUME MUTATION
  const resumeMutation = useResumeSession();
  // END MUTATION
  const endMutation = useEndSession();
  // COMPLETE POMODORO MUTATION
  const completePomodoroMutation = useCompletePomodoro();
  // END POMODORO BREAK MUTATION
  const endBreakMutation = useEndPomodoroBreak();
  // UPDATE NOTES MUTATION
  const updateNotesMutation = useUpdateSessionNotes();
  // UPDATE ELAPSED TIME EFFECT
  useEffect(() => {
    // IF SESSION IS PAUSED, RETURN
    if (session.status === "paused") return;
    // UPDATE ELAPSED TIME FUNCTION
    const updateElapsed = () => {
      // GET ELAPSED SECONDS
      const elapsed = getElapsedSeconds(
        session.startedAt,
        session.pausedAt,
        session.totalPauseDuration
      );
      // FLOOR TO ENSURE SYNC BETWEEN COUNTDOWN AND ELAPSED DISPLAY (ENSURES INTEGER VALUES)
      setElapsedSeconds(Math.floor(elapsed));
    };
    // INITIAL UPDATE
    updateElapsed();
    // UPDATE EVERY SECOND
    const interval = setInterval(updateElapsed, 1000);
    // RETURN A FUNCTION TO CLEAR THE INTERVAL WHEN THE COMPONENT UNMOUNTs
    return () => clearInterval(interval);
  }, [
    session.startedAt,
    session.pausedAt,
    session.totalPauseDuration,
    session.status,
  ]);
  // HANDLE PAUSE
  const handlePause = useCallback(() => {
    // CALL PAUSE MUTATION
    pauseMutation.mutate(session._id);
  }, [pauseMutation, session._id]);
  // HANDLE RESUME
  const handleResume = useCallback(() => {
    // CALL RESUME MUTATION
    resumeMutation.mutate(session._id);
  }, [resumeMutation, session._id]);
  // HANDLE END
  const handleEnd = useCallback(
    (completed: boolean) => {
      // CALL END MUTATION
      endMutation.mutate(
        { sessionId: session._id, notes, completed },
        { onSuccess: onClose }
      );
    },
    [endMutation, session._id, notes, onClose]
  );
  // HANDLE COMPLETE POMODORO
  const handleCompletePomodoro = useCallback(
    (startBreak: boolean) => {
      // CALL COMPLETE POMODORO MUTATION
      completePomodoroMutation.mutate({ sessionId: session._id, startBreak });
    },
    [completePomodoroMutation, session._id]
  );
  // HANDLE END BREAK
  const handleEndBreak = useCallback(() => {
    // CALL END BREAK MUTATION
    endBreakMutation.mutate(session._id);
  }, [endBreakMutation, session._id]);
  // HANDLE SAVE NOTES
  const handleSaveNotes = useCallback(() => {
    // CALL UPDATE NOTES MUTATION
    updateNotesMutation.mutate(
      { sessionId: session._id, notes },
      { onSuccess: () => setShowNotesModal(false) }
    );
  }, [updateNotesMutation, session._id, notes]);
  // GET TASK INFO
  const task = typeof session.taskId === "object" ? session.taskId : null;
  // CALCULATE REMAINING SECONDS FROM ELAPSED STATE (LIVE UPDATE)
  const remainingSeconds = session.plannedDuration
    ? Math.max(0, session.plannedDuration * 60 - elapsedSeconds)
    : 0;
  // PROGRESS BASED ON ELAPSED TIME
  const progress = session.plannedDuration
    ? Math.min(100, (elapsedSeconds / (session.plannedDuration * 60)) * 100)
    : 0;
  // RETURN FOCUS MODE COMPONENT
  return (
    <div className="fixed inset-0 z-[100] bg-[var(--bg)] flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="flex-shrink-0 flex items-center justify-between px-3 sm:px-4 py-3 border-b border-[var(--border)]">
        {/* LEFT - SESSION INFO */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent-color) 15%, transparent)",
            }}
          >
            <Target
              size={16}
              className="text-[var(--accent-color)] sm:hidden"
            />
            <Target
              size={20}
              className="text-[var(--accent-color)] hidden sm:block"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-semibold text-[var(--text-primary)] truncate">
              {session.title || task?.title || "Focus Session"}
            </h1>
            <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
              {session.isPomodoroMode ? (
                <>
                  <span className="hidden sm:inline">Pomodoro Mode • </span>
                  <span>{session.pomodorosCompleted} completed</span>
                </>
              ) : session.plannedDuration && session.plannedDuration > 0 ? (
                `${session.plannedDuration}min session`
              ) : (
                "No time limit session"
              )}
            </p>
          </div>
        </div>
        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setShowNotesModal(true)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] transition"
            title="Notes"
          >
            <FileText size={18} className="sm:hidden" />
            <FileText size={20} className="hidden sm:block" />
          </button>
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] transition hidden sm:block"
              title="Minimize"
            >
              <Minimize2 size={20} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] transition"
            title="Close"
          >
            <X size={18} className="sm:hidden" />
            <X size={20} className="hidden sm:block" />
          </button>
        </div>
      </header>
      {/* MAIN CONTENT - SCROLLABLE */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center min-h-full px-4 py-6 sm:py-8">
          {/* TIMER SECTION */}
          <div className="flex flex-col items-center w-full max-w-md">
            {/* POMODORO MODE */}
            {session.isPomodoroMode ? (
              <PomodoroTimer
                session={session}
                onPause={handlePause}
                onResume={handleResume}
                onCompletePomodoro={handleCompletePomodoro}
                onEndBreak={handleEndBreak}
              />
            ) : (
              <>
                {/* REGULAR TIMER */}
                {/* PROGRESS CIRCLE */}
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 mb-6 sm:mb-8">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* BACKGROUND CIRCLE */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="var(--hover-bg)"
                      strokeWidth="6"
                      fill="none"
                    />
                    {/* PROGRESS CIRCLE */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={
                        session.status === "paused"
                          ? "#f59e0b"
                          : "var(--accent-color)"
                      }
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={
                        session.plannedDuration > 0
                          ? 2 *
                            Math.PI *
                            45 *
                            (1 - Math.min(progress, 100) / 100)
                          : 0
                      }
                      className="transition-all duration-1000"
                    />
                  </svg>
                  {/* TIME DISPLAY - COUNTDOWN OR ELAPSED */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                      {session.plannedDuration > 0
                        ? formatTimerDisplay(Math.max(0, remainingSeconds))
                        : formatTimerDisplay(elapsedSeconds)}
                    </span>
                    {session.plannedDuration > 0 ? (
                      <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-xs sm:text-sm text-[var(--light-text)]">
                        <Timer size={12} className="sm:hidden" />
                        <Timer size={14} className="hidden sm:block" />
                        <span>
                          {remainingSeconds > 0
                            ? `${formatTimerDisplay(elapsedSeconds)} elapsed`
                            : "Time's up!"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-xs sm:text-sm text-[var(--light-text)]">
                        <Timer size={12} className="sm:hidden" />
                        <Timer size={14} className="hidden sm:block" />
                        <span>No time limit</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* STATUS INDICATOR */}
                <div className="flex items-center gap-2 mb-6 sm:mb-8">
                  <div
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                      session.status === "active"
                        ? "bg-green-500 animate-pulse"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-xs sm:text-sm text-[var(--light-text)] capitalize">
                    {session.status}
                  </span>
                </div>
                {/* CONTROLS */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={
                      session.status === "active" ? handlePause : handleResume
                    }
                    disabled={
                      pauseMutation.isPending || resumeMutation.isPending
                    }
                    className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl transition ${
                      session.status === "active"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    title={session.status === "active" ? "Pause" : "Resume"}
                  >
                    {session.status === "active" ? (
                      <>
                        <Pause size={24} className="text-white sm:hidden" />
                        <Pause
                          size={32}
                          className="text-white hidden sm:block"
                        />
                      </>
                    ) : (
                      <>
                        <Play size={24} className="text-white sm:hidden" />
                        <Play
                          size={32}
                          className="text-white hidden sm:block"
                        />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
            {/* END SESSION BUTTONS */}
            <div className="flex items-center gap-2 sm:gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => handleEnd(false)}
                disabled={endMutation.isPending}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-[var(--border)] rounded-lg text-xs sm:text-sm text-[var(--light-text)] hover:bg-[var(--hover-bg)] transition"
              >
                <Square size={14} className="sm:hidden" />
                <Square size={16} className="hidden sm:block" />
                Abandon
              </button>
              <button
                onClick={() => handleEnd(true)}
                disabled={endMutation.isPending}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 transition"
              >
                <CheckCircle2 size={14} className="sm:hidden" />
                <CheckCircle2 size={16} className="hidden sm:block" />
                <span className="hidden sm:inline">Complete Session</span>
                <span className="sm:hidden">Complete</span>
              </button>
            </div>
            {/* TASK INFO */}
            {task && (
              <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] w-full max-w-xs sm:max-w-sm">
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <Clock
                    size={12}
                    className="text-[var(--light-text)] sm:hidden"
                  />
                  <Clock
                    size={14}
                    className="text-[var(--light-text)] hidden sm:block"
                  />
                  <span className="text-[10px] sm:text-xs text-[var(--light-text)]">
                    Working on
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-mono text-[var(--light-text)] bg-[var(--hover-bg)] px-1.5 py-0.5 rounded flex-shrink-0">
                    {task.taskKey}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] truncate">
                    {task.title}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* FOOTER STATS */}
      <footer className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-[var(--border)]">
        <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-1 text-[10px] sm:text-xs text-[var(--light-text)]">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="sm:hidden" />
            <Clock size={14} className="hidden sm:block" />
            <span className="hidden sm:inline">
              Started {new Date(session.startedAt).toLocaleTimeString()}
            </span>
            <span className="sm:hidden">
              {new Date(session.startedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {session.breaks.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--border)]">•</span>
              <span>{session.breaks.length} break(s)</span>
            </div>
          )}
          {session.totalPauseDuration > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--border)]">•</span>
              <span>{Math.round(session.totalPauseDuration)}m paused</span>
            </div>
          )}
        </div>
      </footer>
      {/* NOTES MODAL */}
      {showNotesModal && (
        <NotesModal
          notes={notes}
          onNotesChange={setNotes}
          onSave={handleSaveNotes}
          onClose={() => setShowNotesModal(false)}
          isSaving={updateNotesMutation.isPending}
        />
      )}
    </div>
  );
};

export default FocusMode;
