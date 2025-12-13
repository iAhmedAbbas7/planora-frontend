// <== IMPORTS ==>
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Coffee,
  Brain,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { FocusSession, PomodoroSettings } from "../../hooks/useFocusSession";

// <== POMODORO TIMER PROPS ==>
interface PomodoroTimerProps {
  // <== SESSION ==>
  session: FocusSession;
  // <== ON PAUSE ==>
  onPause: () => void;
  // <== ON RESUME ==>
  onResume: () => void;
  // <== ON COMPLETE POMODORO ==>
  onCompletePomodoro: (startBreak: boolean) => void;
  // <== ON END BREAK ==>
  onEndBreak: () => void;
  // <== ON RESET ==>
  onReset?: () => void;
  // <== COMPACT MODE ==>
  compact?: boolean;
}

// <== DEFAULT POMODORO SETTINGS ==>
const DEFAULT_SETTINGS: PomodoroSettings = {
  // <== WORK DURATION ==>
  workDuration: 25,
  // <== BREAK DURATION ==>
  breakDuration: 5,
  // <== LONG BREAK DURATION ==>
  longBreakDuration: 15,
  // <== SESSIONS BEFORE LONG BREAK ==>
  sessionsBeforeLongBreak: 4,
};

// <== POMODORO TIMER COMPONENT ==>
const PomodoroTimer = ({
  session,
  onPause,
  onResume,
  onCompletePomodoro,
  onEndBreak,
  onReset,
  compact = false,
}: PomodoroTimerProps) => {
  // MEMOIZED SETTINGS (USE DEFAULT SETTINGS AND MERGE WITH SESSION SETTINGS)
  const settings: PomodoroSettings = useMemo(
    () => ({
      ...DEFAULT_SETTINGS,
      ...session.pomodoroSettings,
    }),
    [session.pomodoroSettings]
  );
  // MEMOIZED CALCULATE TOTAL SECONDS FOR A PHASE
  const calculateTotalSeconds = useCallback(
    (isBreak: boolean, pomodorosCompleted: number): number => {
      // IF ON BREAK, RETURN LONG BREAK OR BREAK DURATION IN SECONDS
      if (isBreak) {
        // CHECK IF IT'S A LONG BREAK
        const isLongBreak =
          pomodorosCompleted > 0 &&
          pomodorosCompleted % settings.sessionsBeforeLongBreak === 0;
        // RETURN LONG BREAK OR BREAK DURATION IN SECONDS
        return (
          (isLongBreak ? settings.longBreakDuration : settings.breakDuration) *
          60
        );
      }
      // RETURN WORK DURATION IN SECONDS
      return settings.workDuration * 60;
    },
    [settings]
  );

  // STATE - LAZY INITIALIZATION
  const [secondsRemaining, setSecondsRemaining] = useState(() =>
    calculateTotalSeconds(session.isOnBreak, session.pomodorosCompleted)
  );
  // REFS FOR STABLE VALUES (PREVENTS EFFECT RE-RUNS)
  // AUDIO REF
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // CALLBACKS REF
  const callbacksRef = useRef({ onCompletePomodoro, onEndBreak });
  // SESSION REF
  const sessionRef = useRef({
    currentPomodoro: session.currentPomodoro,
    isOnBreak: session.isOnBreak,
    pomodorosCompleted: session.pomodorosCompleted,
  });
  // KEEP CALLBACKS REF UPDATED (ENSURES CALLBACKS ARE ALWAYS UP TO DATE)
  useEffect(() => {
    // UPDATE CALLBACKS REF
    callbacksRef.current = { onCompletePomodoro, onEndBreak };
  }, [onCompletePomodoro, onEndBreak]);
  // RESET TIMER WHEN POMODORO/BREAK STATE ACTUALLY CHANGES
  useEffect(() => {
    // GET PREVIOUS SESSION VALUES
    const prev = sessionRef.current;
    // CHECK IF POMODORO HAS CHANGED
    const pomodoroChanged = prev.currentPomodoro !== session.currentPomodoro;
    // CHECK IF BREAK HAS CHANGED
    const breakChanged = prev.isOnBreak !== session.isOnBreak;
    // IF POMODORO OR BREAK HAS CHANGED, CALCULATE NEW SECONDS REMAINING
    if (pomodoroChanged || breakChanged) {
      // CALCULATE NEW SECONDS REMAINING
      const newSeconds = calculateTotalSeconds(
        session.isOnBreak,
        session.pomodorosCompleted
      );
      // SET NEW SECONDS REMAINING
      setSecondsRemaining(newSeconds);
      // UPDATE SESSION REF
      sessionRef.current = {
        currentPomodoro: session.currentPomodoro,
        isOnBreak: session.isOnBreak,
        pomodorosCompleted: session.pomodorosCompleted,
      };
    }
  }, [
    session.currentPomodoro,
    session.isOnBreak,
    session.pomodorosCompleted,
    calculateTotalSeconds,
  ]);
  // TIMER COUNTDOWN - ONLY DEPENDS ON STATUS
  useEffect(() => {
    // IF SESSION IS NOT ACTIVE, RETURN
    if (session.status !== "active") return;
    // SET UP INTERVAL TO UPDATE SECONDS REMAINING EVERY SECOND
    const interval = setInterval(() => {
      // UPDATE SECONDS REMAINING
      setSecondsRemaining((prev) => {
        // IF SECONDS REMAINING IS 1 OR LESS, PLAY SOUND AND CALL APPROPRIATE CALLBACK
        if (prev <= 1) {
          // PLAY SOUND (IGNORE ERRORS)
          audioRef.current?.play().catch(() => {});
          // CALL APPROPRIATE CALLBACK VIA REF (ENSURES CALLBACKS ARE ALWAYS UP TO DATE)
          if (sessionRef.current.isOnBreak) {
            // CALL ON END BREAK CALLBACK
            callbacksRef.current.onEndBreak();
          } else {
            // CALL ON COMPLETE POMODORO CALLBACK
            callbacksRef.current.onCompletePomodoro(true);
          }
          // RETURN 0 SECONDS REMAINING
          return 0;
        }
        // RETURN NEW SECONDS REMAINING
        return prev - 1;
      });
    }, 1000);
    // RETURN A FUNCTION TO CLEAR THE INTERVAL WHEN THE COMPONENT UNMOUNTs
    return () => clearInterval(interval);
  }, [session.status]);
  // FORMAT TIME (MINUTES AND SECONDS)
  const formatTime = (seconds: number): string => {
    // CALCULATE MINUTES
    const mins = Math.floor(seconds / 60);
    // CALCULATE SECONDS
    const secs = seconds % 60;
    // RETURN FORMATTED TIME
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  // CALCULATE PROGRESS
  const totalSeconds = calculateTotalSeconds(
    session.isOnBreak,
    session.pomodorosCompleted
  );
  // CALCULATE PROGRESS (0-100)
  const progress =
    totalSeconds > 0
      ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100
      : 0;
  // HANDLE PAUSE/RESUME
  const handlePauseResume = () => {
    // IF SESSION IS ACTIVE, CALL ON PAUSE
    if (session.status === "active") {
      // CALL ON PAUSE
      onPause();
    } else {
      // IF SESSION IS NOT ACTIVE, CALL ON RESUME
      onResume();
    }
  };
  // HANDLE SKIP
  const handleSkip = () => {
    // IF SESSION IS ON BREAK, CALL ON END BREAK
    if (session.isOnBreak) {
      // CALL ON END BREAK
      onEndBreak();
    } else {
      // IF SESSION IS NOT ON BREAK, CALL ON COMPLETE POMODORO
      onCompletePomodoro(true);
    }
  };
  // IS LONG BREAK
  const isLongBreak =
    session.isOnBreak &&
    session.pomodorosCompleted > 0 &&
    session.pomodorosCompleted % settings.sessionsBeforeLongBreak === 0;
  // COMPACT MODE
  if (compact) {
    // RETURN COMPACT MODE COMPONENT
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {session.isOnBreak ? (
            <Coffee size={16} className="text-green-500" />
          ) : (
            <Brain size={16} className="text-[var(--accent-color)]" />
          )}
          <span className="font-mono text-lg font-semibold text-[var(--text-primary)]">
            {formatTime(secondsRemaining)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: settings.sessionsBeforeLongBreak }).map(
            (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition ${
                  i < session.pomodorosCompleted
                    ? "bg-[var(--accent-color)]"
                    : "bg-[var(--hover-bg)]"
                }`}
              />
            )
          )}
        </div>
        <button
          onClick={handlePauseResume}
          className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition"
        >
          {session.status === "active" ? (
            <Pause size={16} className="text-[var(--text-primary)]" />
          ) : (
            <Play size={16} className="text-[var(--text-primary)]" />
          )}
        </button>
      </div>
    );
  }
  // RETURN FULL MODE COMPONENT
  return (
    <div className="flex flex-col items-center w-full">
      {/* AUDIO */}
      <audio ref={audioRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleVVEkdrj4oRpVT+A1/Dnd1c1HIrh8/B1QyEPhNjo9YVYQ0CA0O3xiE4nBnLI7/2OYUQ+dsXy/IxWNQxuwfD+jFY1DGnA8P6NWDgRasDw/o1YOBFmv/D+jVc3D2W/8P6NVzcPZb/w/o1XNw9lv/D+jVc3D2W/8P6NVzcPZcDw/o1XNw9mwPD+jVg4EWbA8P6NWDgRZ8Dw/o1YOBFowPD+jVg4EWnA8P6NWDgRasHw/o1YOBFrwfD+jVg4EWzC8P6NWDgRbcLw/o1YOBFtwfD+jVg4EW3B8P6NWDgRbMHw/o1YOBFrwfD+jVg4EWrB8P6NWDgRasHw/o1YOBFqwfD+jVg4EWvB8P6NWDgRbMHw/o1YOBFtwfD+jVg4EW7C8P6NWDgRb8Lw/o1YOBFwwvD+jVg4EXHC8P6NWDgRcsLw/o1YOBFyw/D+jVg4EQ=="
          type="audio/wav"
        />
      </audio>
      {/* STATUS LABEL */}
      <div className="mb-3 sm:mb-4 flex items-center gap-2">
        {session.isOnBreak ? (
          <>
            <Coffee size={16} className="text-green-500 sm:hidden" />
            <Coffee size={20} className="text-green-500 hidden sm:block" />
            <span className="text-xs sm:text-sm font-medium text-green-500">
              {isLongBreak ? "Long Break" : "Short Break"}
            </span>
          </>
        ) : (
          <>
            <Brain size={16} className="text-[var(--accent-color)] sm:hidden" />
            <Brain
              size={20}
              className="text-[var(--accent-color)] hidden sm:block"
            />
            <span className="text-xs sm:text-sm font-medium text-[var(--accent-color)]">
              Focus Time
            </span>
          </>
        )}
      </div>
      {/* CIRCULAR PROGRESS - RESPONSIVE */}
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 mb-4 sm:mb-6">
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
            stroke={session.isOnBreak ? "#22c55e" : "var(--accent-color)"}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
            className="transition-all duration-1000"
          />
        </svg>
        {/* TIME DISPLAY */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            {formatTime(secondsRemaining)}
          </span>
          <span className="text-[10px] sm:text-xs text-[var(--light-text)] mt-0.5 sm:mt-1">
            Pomodoro {session.currentPomodoro}
          </span>
        </div>
      </div>
      {/* POMODORO INDICATORS */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
        {Array.from({ length: settings.sessionsBeforeLongBreak }).map(
          (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition ${
                i < session.pomodorosCompleted
                  ? "bg-[var(--accent-color)]"
                  : "bg-[var(--hover-bg)]"
              }`}
              title={`Pomodoro ${i + 1}`}
            />
          )
        )}
      </div>
      {/* CONTROLS */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* RESET BUTTON */}
        {onReset && (
          <button
            onClick={onReset}
            className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-[var(--hover-bg)] hover:bg-[var(--inside-card-bg)] transition"
            title="Reset Timer"
          >
            <RotateCcw
              size={16}
              className="text-[var(--light-text)] sm:hidden"
            />
            <RotateCcw
              size={20}
              className="text-[var(--light-text)] hidden sm:block"
            />
          </button>
        )}
        {/* PAUSE/RESUME BUTTON */}
        <button
          onClick={handlePauseResume}
          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition ${
            session.status === "active"
              ? "bg-[var(--accent-color)] hover:opacity-90"
              : "bg-green-500 hover:bg-green-600"
          }`}
          title={session.status === "active" ? "Pause" : "Resume"}
        >
          {session.status === "active" ? (
            <>
              <Pause size={20} className="text-white sm:hidden" />
              <Pause size={24} className="text-white hidden sm:block" />
            </>
          ) : (
            <>
              <Play size={20} className="text-white sm:hidden" />
              <Play size={24} className="text-white hidden sm:block" />
            </>
          )}
        </button>
        {/* SKIP BUTTON */}
        <button
          onClick={handleSkip}
          className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-[var(--hover-bg)] hover:bg-[var(--inside-card-bg)] transition"
          title={session.isOnBreak ? "Skip Break" : "Skip to Break"}
        >
          <SkipForward
            size={16}
            className="text-[var(--light-text)] sm:hidden"
          />
          <SkipForward
            size={20}
            className="text-[var(--light-text)] hidden sm:block"
          />
        </button>
      </div>
      {/* STATS */}
      <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1 text-[10px] sm:text-xs text-[var(--light-text)]">
        <span>🍅 {session.pomodorosCompleted} completed</span>
        <span className="text-[var(--border)]">•</span>
        <span>
          {settings.workDuration}m work / {settings.breakDuration}m break
        </span>
      </div>
    </div>
  );
};

export default PomodoroTimer;
