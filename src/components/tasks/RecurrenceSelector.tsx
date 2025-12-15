// <== IMPORTS ==>
import { Repeat, ChevronDown, Check, Calendar, X, Info } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState, useRef, useEffect, JSX } from "react";
import type { RecurrencePattern, Recurrence } from "../../types/task";

// <== RECURRENCE SELECTOR PROPS TYPE INTERFACE ==>
type Props = {
  // <== RECURRENCE VALUE ==>
  value: Partial<Recurrence> | null;
  // <== ON CHANGE FUNCTION ==>
  onChange: (recurrence: Partial<Recurrence> | null) => void;
  // <== DISABLED STATE ==>
  disabled?: boolean;
};

// <== PATTERN OPTIONS ==>
const PATTERN_OPTIONS: { value: RecurrencePattern; label: string }[] = [
  // DAILY PATTERN OPTION
  { value: "daily", label: "Daily" },
  // WEEKLY PATTERN OPTION
  { value: "weekly", label: "Weekly" },
  // MONTHLY PATTERN OPTION
  { value: "monthly", label: "Monthly" },
  // YEARLY PATTERN OPTION
  { value: "yearly", label: "Yearly" },
  // CUSTOM PATTERN OPTION
  { value: "custom", label: "Custom" },
];

// <== DAYS OF WEEK OPTIONS ==>
const DAYS_OF_WEEK: { value: number; label: string; short: string }[] = [
  // SUNDAY OPTION
  { value: 0, label: "Sunday", short: "Sun" },
  // MONDAY OPTION
  { value: 1, label: "Monday", short: "Mon" },
  // TUESDAY OPTION
  { value: 2, label: "Tuesday", short: "Tue" },
  // WEDNESDAY OPTION
  { value: 3, label: "Wednesday", short: "Wed" },
  // THURSDAY OPTION
  { value: 4, label: "Thursday", short: "Thu" },
  // FRIDAY OPTION
  { value: 5, label: "Friday", short: "Fri" },
  // SATURDAY OPTION
  { value: 6, label: "Saturday", short: "Sat" },
];

// <== INTERVAL OPTIONS ==>
const INTERVAL_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 14, 30];

// <== RECURRENCE SELECTOR COMPONENT ==>
const RecurrenceSelector = ({
  value,
  onChange,
  disabled = false,
}: Props): JSX.Element => {
  // DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState(false);
  // END DATE PICKER OPEN STATE
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement>(null);
  // IS RECURRING TOGGLE STATE
  const isRecurring = value?.isRecurring || false;
  // SELECTED PATTERN
  const selectedPattern = value?.pattern || null;
  // SELECTED INTERVAL
  const selectedInterval = value?.interval || 1;
  // SELECTED DAYS OF WEEK
  const selectedDaysOfWeek = value?.daysOfWeek || [];
  // SELECTED END DATE
  const selectedEndDate = value?.endDate || null;
  // SKIP WEEKENDS
  const skipWeekends = value?.skipWeekends || false;
  // HANDLE CLICK OUTSIDE EFFECT
  useEffect(() => {
    // HANDLE CLICK OUTSIDE FUNCTION
    const handleClickOutside = (event: MouseEvent): void => {
      // CHECK IF CLICK IS OUTSIDE DROPDOWN
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // CLOSE DROPDOWN
        setIsOpen(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // HANDLE TOGGLE RECURRING
  const handleToggleRecurring = (): void => {
    // IF CURRENTLY RECURRING, DISABLE IT
    if (isRecurring) {
      // DISABLE RECURRENCE
      onChange(null);
    } else {
      // ENABLE RECURRENCE WITH DEFAULT VALUES
      onChange({
        isRecurring: true,
        pattern: "daily",
        interval: 1,
        daysOfWeek: [],
        dayOfMonth: null,
        endDate: null,
        skipWeekends: false,
      });
    }
  };
  // HANDLE PATTERN CHANGE
  const handlePatternChange = (pattern: RecurrencePattern): void => {
    // UPDATE RECURRENCE WITH NEW PATTERN
    onChange({
      ...value,
      isRecurring: true,
      pattern,
      daysOfWeek: pattern === "weekly" ? selectedDaysOfWeek : [],
    });
    // CLOSE DROPDOWN
    setIsOpen(false);
  };
  // HANDLE INTERVAL CHANGE
  const handleIntervalChange = (interval: number): void => {
    // UPDATE RECURRENCE WITH NEW INTERVAL
    onChange({
      ...value,
      isRecurring: true,
      interval,
    });
  };
  // HANDLE DAY OF WEEK TOGGLE
  const handleDayOfWeekToggle = (day: number): void => {
    // GET CURRENT DAYS
    const currentDays = [...selectedDaysOfWeek];
    // CHECK IF DAY IS ALREADY SELECTED
    const index = currentDays.indexOf(day);
    // IF DAY IS SELECTED, REMOVE IT
    if (index > -1) {
      // REMOVE DAY
      currentDays.splice(index, 1);
    } else {
      // ADD DAY TO DAYS OF WEEK
      currentDays.push(day);
      // SORT DAYS OF WEEK
      currentDays.sort((a, b) => a - b);
    }
    // UPDATE RECURRENCE
    onChange({
      ...value,
      isRecurring: true,
      daysOfWeek: currentDays,
    });
  };
  // HANDLE SKIP WEEKENDS TOGGLE
  const handleSkipWeekendsToggle = (): void => {
    // UPDATE RECURRENCE
    onChange({
      ...value,
      isRecurring: true,
      skipWeekends: !skipWeekends,
    });
  };
  // HANDLE END DATE CHANGE
  const handleEndDateChange = (date: Date | undefined): void => {
    // UPDATE RECURRENCE
    onChange({
      ...value,
      isRecurring: true,
      endDate: date || null,
    });
    // CLOSE DATE PICKER
    setIsEndDatePickerOpen(false);
  };
  // CLEAR END DATE
  const clearEndDate = (): void => {
    // UPDATE RECURRENCE
    onChange({
      ...value,
      isRecurring: true,
      endDate: null,
    });
  };
  // FORMAT END DATE
  const formatEndDate = (date: Date): string => {
    // FORMAT DATE
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  // GET RECURRENCE SUMMARY
  const getRecurrenceSummary = (): string => {
    // IF NOT RECURRING, RETURN "NO REPEAT"
    if (!isRecurring || !selectedPattern) return "Does not repeat";
    // BUILD SUMMARY
    let summary = "";
    // ADD INTERVAL PREFIX
    if (selectedInterval > 1) {
      // ADD INTERVAL PREFIX
      summary = `Every ${selectedInterval} `;
    } else {
      // ADD INTERVAL PREFIX
      summary = "Every ";
    }
    // ADD PATTERN
    switch (selectedPattern) {
      // DAILY PATTERN
      case "daily":
        // ADD INTERVAL PREFIX
        summary += selectedInterval > 1 ? "days" : "day";
        break;
      // WEEKLY PATTERN
      case "weekly":
        // ADD INTERVAL PREFIX
        summary += selectedInterval > 1 ? "weeks" : "week";
        // ADD DAYS
        if (selectedDaysOfWeek.length > 0) {
          // GET DAY NAMES
          const dayNames = selectedDaysOfWeek.map(
            (d) => DAYS_OF_WEEK.find((day) => day.value === d)?.short || ""
          );
          // ADD DAY NAMES TO SUMMARY
          summary += ` on ${dayNames.join(", ")}`;
        }
        break;
      // MONTHLY PATTERN
      case "monthly":
        // ADD INTERVAL PREFIX
        summary += selectedInterval > 1 ? "months" : "month";
        break;
      // YEARLY PATTERN
      case "yearly":
        // ADD INTERVAL PREFIX
        summary += selectedInterval > 1 ? "years" : "year";
        break;
      // CUSTOM PATTERN
      case "custom":
        // SET SUMMARY TO CUSTOM RECURRENCE
        summary = "Custom recurrence";
        break;
    }
    // ADD SKIP WEEKENDS
    if (skipWeekends && selectedPattern === "daily") {
      // ADD SKIP WEEKENDS TO SUMMARY
      summary += " (skip weekends)";
    }
    // ADD END DATE
    if (selectedEndDate) {
      // ADD END DATE TO SUMMARY
      summary += ` until ${formatEndDate(new Date(selectedEndDate))}`;
    }
    // RETURN SUMMARY
    return summary;
  };
  // RETURN RECURRENCE SELECTOR
  return (
    <div className="flex flex-col gap-1.5">
      {/* LABEL */}
      <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
        <Repeat size={14} className="text-[var(--accent-color)]" />
        Repeat
      </label>
      {/* TOGGLE AND SETTINGS CONTAINER */}
      <div className="space-y-3">
        {/* RECURRING TOGGLE ROW */}
        <div className="flex items-center justify-between p-3 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-3">
            <Repeat
              size={18}
              className={
                isRecurring
                  ? "text-[var(--accent-color)]"
                  : "text-[var(--light-text)]"
              }
            />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Recurring Task
              </p>
              <p className="text-xs text-[var(--light-text)]">
                {getRecurrenceSummary()}
              </p>
            </div>
          </div>
          {/* TOGGLE BUTTON */}
          <button
            type="button"
            onClick={handleToggleRecurring}
            disabled={disabled}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              isRecurring ? "bg-[var(--accent-color)]" : "bg-[var(--hover-bg)]"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                isRecurring ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
        {/* RECURRENCE SETTINGS (ONLY SHOW IF RECURRING) */}
        {isRecurring && (
          <div className="space-y-3 p-3 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
            {/* PATTERN SELECTOR */}
            <div className="relative" ref={dropdownRef}>
              <label className="text-xs text-[var(--light-text)] mb-1.5 block">
                Repeat Pattern
              </label>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-transparent transition cursor-pointer ${
                  isOpen
                    ? "border-[var(--accent-color)]"
                    : "border-[var(--border)] hover:border-[var(--accent-color)]"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="text-sm text-[var(--text-primary)]">
                  {PATTERN_OPTIONS.find((p) => p.value === selectedPattern)
                    ?.label || "Select pattern"}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[var(--light-text)] transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {/* PATTERN DROPDOWN */}
              {isOpen && (
                <div className="absolute z-20 top-full left-0 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
                  {PATTERN_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handlePatternChange(option.value)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                        selectedPattern === option.value
                          ? "text-[var(--accent-color)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      <span className="flex-1 text-left">{option.label}</span>
                      {selectedPattern === option.value && (
                        <Check
                          size={14}
                          className="text-[var(--accent-color)]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* INTERVAL SELECTOR */}
            <div>
              <label className="text-xs text-[var(--light-text)] mb-1.5 block">
                Every
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {INTERVAL_OPTIONS.slice(0, 7).map((interval) => (
                  <button
                    key={interval}
                    type="button"
                    onClick={() => handleIntervalChange(interval)}
                    disabled={disabled}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedInterval === interval
                        ? "bg-[var(--accent-color)] text-white"
                        : "bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--border)]"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {interval}
                  </button>
                ))}
                <span className="text-xs text-[var(--light-text)]">
                  {selectedPattern === "daily" && "day(s)"}
                  {selectedPattern === "weekly" && "week(s)"}
                  {selectedPattern === "monthly" && "month(s)"}
                  {selectedPattern === "yearly" && "year(s)"}
                  {selectedPattern === "custom" && "interval(s)"}
                </span>
              </div>
            </div>
            {/* DAYS OF WEEK (FOR WEEKLY PATTERN) */}
            {selectedPattern === "weekly" && (
              <div>
                <label className="text-xs text-[var(--light-text)] mb-1.5 block">
                  On these days
                </label>
                <div className="flex items-center gap-1 flex-wrap">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayOfWeekToggle(day.value)}
                      disabled={disabled}
                      className={`w-9 h-9 rounded-lg text-xs font-medium transition ${
                        selectedDaysOfWeek.includes(day.value)
                          ? "bg-[var(--accent-color)] text-white"
                          : "bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--border)]"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={day.label}
                    >
                      {day.short.charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* SKIP WEEKENDS (FOR DAILY PATTERN) */}
            {selectedPattern === "daily" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={14} className="text-[var(--light-text)]" />
                  <span className="text-xs text-[var(--light-text)]">
                    Skip weekends
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSkipWeekendsToggle}
                  disabled={disabled}
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    skipWeekends
                      ? "bg-[var(--accent-color)]"
                      : "bg-[var(--hover-bg)]"
                  } ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      skipWeekends ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            )}
            {/* END DATE SELECTOR */}
            <div>
              <label className="text-xs text-[var(--light-text)] mb-1.5 block">
                End date (optional)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEndDatePickerOpen(true)}
                  disabled={disabled}
                  className={`flex-1 flex items-center gap-2 px-3 py-2 border rounded-lg bg-transparent transition cursor-pointer ${
                    selectedEndDate
                      ? "border-[var(--accent-color)]/50"
                      : "border-[var(--border)] hover:border-[var(--accent-color)]"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Calendar
                    size={14}
                    className={
                      selectedEndDate
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--light-text)]"
                    }
                  />
                  <span
                    className={`text-sm ${
                      selectedEndDate
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--light-text)]"
                    }`}
                  >
                    {selectedEndDate
                      ? formatEndDate(new Date(selectedEndDate))
                      : "No end date"}
                  </span>
                </button>
                {selectedEndDate && (
                  <button
                    type="button"
                    onClick={clearEndDate}
                    disabled={disabled}
                    className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition"
                    title="Clear end date"
                  >
                    <X size={14} className="text-[var(--light-text)]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* END DATE PICKER MODAL */}
      {isEndDatePickerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-[var(--black-overlay)]"
            onClick={() => setIsEndDatePickerOpen(false)}
          />
          {/* MODAL */}
          <div className="relative bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-lg p-3 w-full max-w-[320px] mx-4">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                  }}
                >
                  <Calendar size={14} className="text-[var(--accent-color)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  End Date
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEndDatePickerOpen(false)}
                className="p-1 hover:bg-[var(--hover-bg)] rounded-lg transition"
              >
                <X size={16} className="text-[var(--light-text)]" />
              </button>
            </div>
            {/* DAY PICKER */}
            <DayPicker
              mode="single"
              selected={selectedEndDate ? new Date(selectedEndDate) : undefined}
              onSelect={handleEndDateChange}
              disabled={{ before: new Date() }}
              classNames={{
                day_selected:
                  "bg-[var(--accent-color)] text-white rounded-full",
                day_today: "font-bold text-[var(--accent-color)]",
                nav_button:
                  "text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded p-1",
                nav_button_next:
                  "text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded p-1",
                nav_button_previous:
                  "text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded p-1",
              }}
              className="rdp-weekdays-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurrenceSelector;
