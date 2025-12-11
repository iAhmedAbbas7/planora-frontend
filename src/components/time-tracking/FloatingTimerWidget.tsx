// <== IMPORTS ==>
import {
  Timer,
  Square,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import {
  useActiveTimer,
  useStopTimer,
  useDiscardTimer,
  formatElapsedTime,
} from "../../hooks/useTimeTracking";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, JSX } from "react";

// <== FLOATING TIMER WIDGET COMPONENT ==>
const FloatingTimerWidget = (): JSX.Element | null => {
  // NAVIGATION
  const navigate = useNavigate();
  // GET ACTIVE TIMER DATA
  const { data: activeTimer } = useActiveTimer();
  // STOP TIMER MUTATION
  const stopTimer = useStopTimer();
  // DISCARD TIMER MUTATION
  const discardTimer = useDiscardTimer();
  // MINIMIZED STATE
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  // ELAPSED TIME STATE
  const [elapsedTime, setElapsedTime] = useState<string>("0:00");
  // UPDATE ELAPSED TIME EVERY SECOND WHEN TIMER IS RUNNING (USE EFFECT)
  useEffect(() => {
    // IF NO ACTIVE TIMER, SET ELAPSED TIME TO 0:00
    if (!activeTimer?.startedAt) {
      // SET ELAPSED TIME TO 0:00
      setElapsedTime("0:00");
      // RETURN
      return;
    }
    // UPDATE IMMEDIATELY WITH THE CURRENT ELAPSED TIME
    setElapsedTime(formatElapsedTime(activeTimer.startedAt));
    // UPDATE EVERY SECOND WITH THE CURRENT ELAPSED TIME
    const interval = setInterval(() => {
      // UPDATE ELAPSED TIME WITH THE CURRENT ELAPSED TIME
      setElapsedTime(formatElapsedTime(activeTimer.startedAt));
    }, 1000);
    // RETURN A FUNCTION TO CLEAR THE INTERVAL WHEN THE COMPONENT UNMOUNTs
    return () => clearInterval(interval);
  }, [activeTimer?.startedAt]);
  // HANDLE STOP TIMER
  const handleStop = () => {
    // IF NO ACTIVE TIMER, RETURN
    if (!activeTimer?.taskId) return;
    // CALL STOP TIMER MUTATION
    stopTimer.mutate({ taskId: activeTimer.taskId });
  };
  // HANDLE DISCARD TIMER
  const handleDiscard = () => {
    // IF NO ACTIVE TIMER, RETURN
    if (!activeTimer?.taskId) return;
    // CALL DISCARD TIMER MUTATION
    discardTimer.mutate(activeTimer.taskId);
  };
  // HANDLE NAVIGATE TO TASK
  const handleNavigateToTask = () => {
    // IF NO ACTIVE TIMER, RETURN
    if (!activeTimer?.taskId) return;
    // NAVIGATE TO TASK
    navigate(`/tasks?taskId=${activeTimer.taskId}`);
  };
  // DON'T RENDER IF NO ACTIVE TIMER
  if (!activeTimer) return null;
  // MINIMIZED VIEW (IF MINIMIZED STATE IS TRUE)
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          <Timer size={16} className="animate-pulse" />
          <span className="font-mono font-bold">{elapsedTime}</span>
          <ChevronUp size={14} />
        </button>
      </div>
    );
  }
  // FULL VIEW
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden min-w-[300px]">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--accent-color)]/10 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Timer
            size={18}
            className="text-[var(--accent-color)] animate-pulse"
          />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Timer Running
          </span>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-[var(--hover-bg)] rounded transition-colors"
          title="Minimize"
        >
          <ChevronDown size={16} className="text-[var(--light-text)]" />
        </button>
      </div>
      {/* CONTENT */}
      <div className="p-4">
        {/* TASK INFO */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium text-[var(--text-primary)] truncate"
              title={activeTimer.title}
            >
              {activeTimer.title}
            </p>
            {activeTimer.project && (
              <p className="text-xs text-[var(--light-text)] truncate">
                {activeTimer.project.title}
              </p>
            )}
          </div>
          <button
            onClick={handleNavigateToTask}
            className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg transition-colors ml-2 flex-shrink-0"
            title="Go to task"
          >
            <ExternalLink size={14} className="text-[var(--light-text)]" />
          </button>
        </div>
        {/* ELAPSED TIME */}
        <div className="text-center py-4 bg-[var(--inside-card-bg)] rounded-lg mb-4">
          <span className="text-4xl font-mono font-bold text-[var(--accent-color)]">
            {elapsedTime}
          </span>
        </div>
        {/* CONTROLS */}
        <div className="flex items-center gap-2">
          {/* STOP BUTTON */}
          <button
            onClick={handleStop}
            disabled={stopTimer.isPending}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent-color)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Square size={14} />
            {stopTimer.isPending ? "Stopping..." : "Stop & Save"}
          </button>
          {/* DISCARD BUTTON */}
          <button
            onClick={handleDiscard}
            disabled={discardTimer.isPending}
            className="p-2.5 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors disabled:opacity-50 border border-red-400/30"
            title="Discard timer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingTimerWidget;
