// <== IMPORTS ==>
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { useState, useEffect, JSX, FormEvent } from "react";
import { useLogManualTime } from "../../hooks/useTimeTracking";
import { X, Clock, Calendar, FileText, Timer, Check } from "lucide-react";

// <== TIME LOG MODAL PROPS ==>
type TimeLogModalProps = {
  // <== TASK ID ==>
  taskId: string;
  // <== TASK TITLE ==>
  taskTitle: string;
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE FUNCTION ==>
  onClose: () => void;
};

// <== TIME LOG MODAL COMPONENT ==>
const TimeLogModal = ({
  taskId,
  taskTitle,
  isOpen,
  onClose,
}: TimeLogModalProps): JSX.Element | null => {
  // LOG MANUAL TIME MUTATION
  const logManualTime = useLogManualTime();
  // LOG TIMER HOURS STATE
  const [hours, setHours] = useState<string>("0");
  // LOG TIMER MINUTES STATE
  const [minutes, setMinutes] = useState<string>("30");
  // LOG TIMER NOTE STATE
  const [note, setNote] = useState<string>("");
  // LOG TIMER DATE STATE
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // LOG TIMER CALENDAR OPEN STATE
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  // PREVENT BODY SCROLL WHEN MODAL IS OPEN (USE EFFECT)
  useEffect(() => {
    // IF MODAL IS OPEN, PREVENT BODY SCROLL
    if (isOpen) {
      // SET BODY SCROLL TO HIDDEN
      document.body.style.overflow = "hidden";
      // RETURN A FUNCTION TO RESET BODY SCROLL WHEN MODAL IS CLOSED
      return () => {
        // RESET BODY SCROLL TO UNSET
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);
  // DON'T RENDER IF NOT OPEN
  if (!isOpen) return null;
  // HANDLE FORM SUBMIT
  const handleSubmit = (e: FormEvent) => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // CALCULATE TOTAL DURATION IN MINUTES
    const totalMinutes = parseInt(hours || "0") * 60 + parseInt(minutes || "0");
    // IF TOTAL MINUTES IS LESS THAN OR EQUAL TO 0, RETURN
    if (totalMinutes <= 0) {
      // SHOW ERROR TOAST
      return;
    }
    // CALL LOG MANUAL TIME MUTATION
    logManualTime.mutate(
      {
        taskId,
        duration: totalMinutes,
        date: selectedDate.toISOString(),
        note: note.trim(),
      },
      {
        onSuccess: () => {
          // RESET HOURS
          setHours("0");
          // RESET MINUTES
          setMinutes("30");
          // RESET NOTE
          setNote("");
          // RESET DATE
          setSelectedDate(new Date());
          // CLOSE TIME LOG MODAL
          onClose();
        },
      }
    );
  };
  // FORMAT DATE FOR DISPLAY (FUNCTION)
  const formatDate = (date: Date): string => {
    // RETURN FORMATTED DATE
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  // RETURN TIME LOG MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--black-overlay)] p-4">
      {/* BACKDROP - CLICK TO CLOSE */}
      <div className="absolute inset-0" onClick={onClose} />
      {/* MODAL */}
      <div className="relative bg-[var(--bg)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Clock size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Log Time
              </h2>
              <p
                className="text-xs text-[var(--light-text)] truncate max-w-[200px]"
                title={taskTitle}
              >
                {taskTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* DURATION INPUT */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-primary)] mb-2">
              <Timer size={14} className="text-[var(--accent-color)]" />
              Duration
            </label>
            <div className="flex items-center gap-2">
              {/* HOURS */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-center focus:outline-none focus:border-[var(--accent-color)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--light-text)]">
                    hrs
                  </span>
                </div>
              </div>
              <span className="text-[var(--light-text)]">:</span>
              {/* MINUTES */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-center focus:outline-none focus:border-[var(--accent-color)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--light-text)]">
                    min
                  </span>
                </div>
              </div>
            </div>
            {/* QUICK SELECT */}
            <div className="flex items-center gap-2 mt-2">
              {[15, 30, 60, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setHours(String(Math.floor(mins / 60)));
                    setMinutes(String(mins % 60));
                  }}
                  className="px-2 py-1 text-xs bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-md text-[var(--light-text)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors"
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>
          {/* DATE PICKER */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-primary)] mb-2">
              <Calendar size={14} className="text-[var(--accent-color)]" />
              Date
            </label>
            <button
              type="button"
              onClick={() => setIsCalendarOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-colors text-left"
            >
              <span className="text-sm">{formatDate(selectedDate)}</span>
            </button>
          </div>
          {/* NOTE INPUT */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-primary)] mb-2">
              <FileText size={14} className="text-[var(--accent-color)]" />
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you work on?"
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--light-text)] resize-none focus:outline-none focus:border-[var(--accent-color)]"
            />
          </div>
        </form>
        {/* FOOTER */}
        <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="time-log-form"
            onClick={handleSubmit as never}
            disabled={
              logManualTime.isPending ||
              (parseInt(hours || "0") === 0 && parseInt(minutes || "0") === 0)
            }
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={16} />
            {logManualTime.isPending ? "Logging..." : "Log Time"}
          </button>
        </div>
      </div>
      {/* DATE PICKER MODAL */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--black-overlay)] p-4">
          {/* BACKDROP - CLICK TO CLOSE */}
          <div
            className="absolute inset-0"
            onClick={() => setIsCalendarOpen(false)}
          />
          {/* CALENDAR CONTAINER */}
          <div className="relative bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-xl p-4">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }
              }}
              disabled={{ after: new Date() }}
              classNames={{
                day_selected:
                  "bg-[var(--accent-color)] text-white hover:bg-[var(--accent-color)]",
                day_today: "font-bold text-[var(--accent-color)]",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeLogModal;
