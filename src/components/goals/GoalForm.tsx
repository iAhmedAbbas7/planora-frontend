// <== IMPORTS ==>
import {
  X,
  Target,
  Sparkles,
  Calendar,
  ChevronDown,
  Check,
  Hash,
  FileText,
  Loader2,
  AlignLeft,
  Layers,
  Activity,
  Ruler,
  Palette,
} from "lucide-react";
import {
  Goal,
  GoalType,
  GoalStatus,
  CreateGoalInput,
  useCreateGoal,
  useUpdateGoal,
  GOAL_STATUS_CONFIG,
  GOAL_TYPE_CONFIG,
  QUARTER_OPTIONS,
  getCurrentQuarter,
  getCurrentYear,
} from "../../hooks/useGoals";
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { JSX, useState, useRef, useEffect } from "react";

// <== PROPS TYPE ==>
type GoalFormProps = {
  // <== IS OPEN FIELD ==>
  isOpen: boolean;
  // <== ON CLOSE FUNCTION ==>
  onClose: () => void;
  goal?: Goal | null;
  parentGoal?: Goal | null;
  defaultType?: GoalType;
};

// <== GOAL FORM COMPONENT ==>
const GoalForm = ({
  isOpen,
  onClose,
  goal,
  parentGoal,
  defaultType = "objective",
}: GoalFormProps): JSX.Element | null => {
  // CREATE GOAL MUTATION
  const createGoal = useCreateGoal();
  // UPDATE GOAL MUTATION
  const updateGoal = useUpdateGoal();
  // GOAL TITLE STATE
  const [title, setTitle] = useState(goal?.title || "");
  // GOAL DESCRIPTION STATE
  const [description, setDescription] = useState(goal?.description || "");
  // GOAL TYPE STATE
  const [type, setType] = useState<GoalType>(
    goal?.type || parentGoal ? "key_result" : defaultType
  );
  // GOAL STATUS STATE
  const [status, setStatus] = useState<GoalStatus>(
    goal?.status || "not_started"
  );
  // GOAL TARGET VALUE STATE
  const [targetValue, setTargetValue] = useState(goal?.targetValue ?? 100);
  // GOAL CURRENT VALUE STATE
  const [currentValue, setCurrentValue] = useState(goal?.currentValue ?? 0);
  // GOAL UNIT STATE
  const [unit, setUnit] = useState(goal?.unit || "%");
  // GOAL QUARTER STATE
  const [quarter, setQuarter] = useState(goal?.quarter || getCurrentQuarter());
  // GOAL YEAR STATE
  const [year, setYear] = useState(goal?.year || getCurrentYear());
  // GOAL DEADLINE STATE
  const [deadline, setDeadline] = useState(
    goal?.deadline ? goal.deadline.split("T")[0] : ""
  );
  // GOAL COLOR STATE
  const [color, setColor] = useState(goal?.color || "#6366f1");
  // DROPDOWN STATES
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  // GOAL STATUS DROPDOWN OPEN STATE
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  // GOAL QUARTER DROPDOWN OPEN STATE
  const [isQuarterDropdownOpen, setIsQuarterDropdownOpen] = useState(false);
  // GOAL CALENDAR OPEN STATE
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // TYPE DROPDOWN REF
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  // GOAL STATUS DROPDOWN REF
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  // GOAL QUARTER DROPDOWN REF
  const quarterDropdownRef = useRef<HTMLDivElement>(null);
  // IS EDITING
  const isEditing = !!goal;
  // FORMAT DATE FUNCTION
  const formatDate = (dateStr: string): string => {
    // IF DATE STRING IS EMPTY, RETURN EMPTY STRING
    if (!dateStr) return "";
    // PARSE DATE STRING DIRECTLY TO AVOID TIMEZONE ISSUES
    const [year, month, day] = dateStr.split("-");
    // RETURN FORMATTED DATE
    return `${day}/${month}/${year}`;
  };
  // RESET FORM WHEN GOAL CHANGES
  useEffect(() => {
    // IF GOAL IS PROVIDED, RESET FORM
    if (goal) {
      // SET TITLE
      setTitle(goal.title);
      // SET DESCRIPTION
      setDescription(goal.description || "");
      // SET TYPE
      setType(goal.type);
      // SET STATUS
      setStatus(goal.status);
      // SET TARGET VALUE
      setTargetValue(goal.targetValue);
      // SET CURRENT VALUE
      setCurrentValue(goal.currentValue);
      // SET UNIT
      setUnit(goal.unit);
      // SET QUARTER
      setQuarter(goal.quarter || getCurrentQuarter());
      // SET YEAR
      setYear(goal.year || getCurrentYear());
      // SET DEADLINE
      setDeadline(goal.deadline ? goal.deadline.split("T")[0] : "");
      // SET COLOR
      setColor(goal.color || "#6366f1");
    } else {
      // SET TITLE
      setTitle("");
      // SET DESCRIPTION
      setDescription("");
      // SET TYPE
      setType(parentGoal ? "key_result" : defaultType);
      // SET STATUS
      setStatus("not_started");
      // SET TARGET VALUE
      setTargetValue(100);
      // SET CURRENT VALUE
      setCurrentValue(0);
      // SET UNIT
      setUnit("%");
      // SET QUARTER
      setQuarter(getCurrentQuarter());
      // SET YEAR
      setYear(getCurrentYear());
      // SET DEADLINE
      setDeadline("");
      // SET COLOR
      setColor("#6366f1");
    }
  }, [goal, parentGoal, defaultType]);
  // HANDLE CLICK OUTSIDE DROPDOWNS
  useEffect(() => {
    // HANDLE CLICK OUTSIDE DROPDOWNS
    const handleClickOutside = (event: MouseEvent): void => {
      // IF TYPE DROPDOWN REF EXISTS AND CLICKED OUTSIDE, SET IS TYPE DROPDOWN OPEN TO FALSE
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        // SET IS TYPE DROPDOWN OPEN TO FALSE
        setIsTypeDropdownOpen(false);
      }
      // IF STATUS DROPDOWN REF EXISTS AND CLICKED OUTSIDE, SET IS STATUS DROPDOWN OPEN TO FALSE
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        // SET IS STATUS DROPDOWN OPEN TO FALSE
        setIsStatusDropdownOpen(false);
      }
      // IF QUARTER DROPDOWN REF EXISTS AND CLICKED OUTSIDE, SET IS QUARTER DROPDOWN OPEN TO FALSE
      if (
        quarterDropdownRef.current &&
        !quarterDropdownRef.current.contains(event.target as Node)
      ) {
        // SET IS QUARTER DROPDOWN OPEN TO FALSE
        setIsQuarterDropdownOpen(false);
      }
    };
    // ADD EVENT LISTENER FOR CLICK OUTSIDE DROPDOWNS
    document.addEventListener("mousedown", handleClickOutside);
    // RETURN CLEANUP FUNCTION
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // IF TITLE IS EMPTY, RETURN
    if (!title.trim()) return;
    // CREATE GOAL INPUT
    const input: CreateGoalInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      status,
      targetValue,
      currentValue,
      unit,
      quarter,
      year,
      deadline: deadline || undefined,
      color,
      parentGoal: parentGoal?._id,
    };
    // TRY TO SUBMIT GOAL
    try {
      // IF GOAL IS EDITING, UPDATE GOAL
      if (isEditing && goal) {
        // AWAIT UPDATE GOAL MUTATION
        await updateGoal.mutateAsync({ id: goal._id, ...input });
      } else {
        // AWAIT CREATE GOAL MUTATION
        await createGoal.mutateAsync(input);
      }
      // CLOSE MODAL
      onClose();
    } catch {
      // ERROR IS HANDLED BY THE MUTATION
    }
  };
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN FORM
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--black-overlay)] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
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
              <Target size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {isEditing
                  ? "Edit Goal"
                  : parentGoal
                  ? "Add Key Result"
                  : "New Goal"}
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                {parentGoal
                  ? `For: ${parentGoal.title}`
                  : "Track your objectives and key results"}
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
        {/* FORM CONTENT */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto min-h-0"
        >
          <div className="p-4 space-y-4">
            {/* TITLE INPUT */}
            <div>
              <label className="block text-xs font-medium text-[var(--light-text)] mb-1.5">
                Title *
              </label>
              <div className="relative">
                <FileText
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter goal title..."
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:border-[var(--accent-color)] transition"
                  required
                />
              </div>
            </div>
            {/* DESCRIPTION INPUT */}
            <div>
              <label className="block text-xs font-medium text-[var(--light-text)] mb-1.5">
                Description
              </label>
              <div className="relative">
                <AlignLeft
                  size={16}
                  className="absolute left-3 top-3 text-[var(--light-text)]"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your goal..."
                  rows={2}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:border-[var(--accent-color)] transition resize-none"
                />
              </div>
            </div>
            {/* TYPE & STATUS ROW */}
            <div className="grid grid-cols-2 gap-3">
              {/* TYPE DROPDOWN */}
              <div>
                <label className="block text-xs font-medium text-[var(--light-text)] mb-1.5">
                  Type
                </label>
                <div ref={typeDropdownRef} className="relative">
                  <Layers
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)] z-10 pointer-events-none"
                  />
                  <button
                    type="button"
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    className="w-full flex items-center justify-between pl-10 pr-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent-color)] transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: GOAL_TYPE_CONFIG[type].color,
                        }}
                      />
                      {GOAL_TYPE_CONFIG[type].label}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition ${
                        isTypeDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isTypeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10 overflow-hidden">
                      {(Object.keys(GOAL_TYPE_CONFIG) as GoalType[]).map(
                        (t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setType(t);
                              setIsTypeDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor: GOAL_TYPE_CONFIG[t].color,
                                }}
                              />
                              {GOAL_TYPE_CONFIG[t].label}
                            </span>
                            {type === t && (
                              <Check
                                size={14}
                                className="text-[var(--accent-color)]"
                              />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* STATUS DROPDOWN */}
              <div>
                <label className="block text-xs font-medium text-[var(--light-text)] mb-1.5">
                  Status
                </label>
                <div ref={statusDropdownRef} className="relative">
                  <Activity
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)] z-10 pointer-events-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setIsStatusDropdownOpen(!isStatusDropdownOpen)
                    }
                    className="w-full flex items-center justify-between pl-10 pr-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent-color)] transition cursor-pointer"
                  >
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${GOAL_STATUS_CONFIG[status].bg} ${GOAL_STATUS_CONFIG[status].color}`}
                    >
                      {GOAL_STATUS_CONFIG[status].label}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition ${
                        isStatusDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                      {(Object.keys(GOAL_STATUS_CONFIG) as GoalStatus[]).map(
                        (s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setStatus(s);
                              setIsStatusDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer"
                          >
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${GOAL_STATUS_CONFIG[s].bg} ${GOAL_STATUS_CONFIG[s].color}`}
                            >
                              {GOAL_STATUS_CONFIG[s].label}
                            </span>
                            {status === s && (
                              <Check
                                size={14}
                                className="text-[var(--accent-color)]"
                              />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* TARGET VALUE & UNIT ROW */}
            <div className="grid grid-cols-3 gap-3">
              {/* CURRENT VALUE */}
              <div>
                <label className="block text-xs font-medium text-[var(--light-text)] mb-1.5">
                  Current
                </label>
                <div className="relative">
                  <Hash
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                  />
                  <input
                    type="number"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(Number(e.target.value))}
                    min={0}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              {/* TARGET VALUE */}
              <div>
                <label className="block text-xs font-medium text-[var(--light-text)] mb-1.5">
                  Target
                </label>
                <div className="relative">
                  <Target
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                  />
                  <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    min={1}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              {/* UNIT */}
              <div>
                <label className="block text-xs font-medium text-[var(--light-text)] mb-1.5">
                  Unit
                </label>
                <div className="relative">
                  <Ruler
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                  />
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="%"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:border-[var(--accent-color)] transition"
                  />
                </div>
              </div>
            </div>
            {/* QUARTER & YEAR ROW */}
            <div className="grid grid-cols-2 gap-3">
              {/* QUARTER DROPDOWN */}
              <div>
                <label className="block text-xs font-medium text-[var(--light-text)] mb-1.5">
                  Quarter
                </label>
                <div ref={quarterDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsQuarterDropdownOpen(!isQuarterDropdownOpen)
                    }
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent-color)] transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar
                        size={14}
                        className="text-[var(--light-text)]"
                      />
                      {QUARTER_OPTIONS.find((q) => q.value === quarter)
                        ?.label || quarter}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition ${
                        isQuarterDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isQuarterDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10 overflow-hidden">
                      {QUARTER_OPTIONS.map((q) => (
                        <button
                          key={q.value}
                          type="button"
                          onClick={() => {
                            setQuarter(q.value);
                            setIsQuarterDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer"
                        >
                          {q.label}
                          {quarter === q.value && (
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
              </div>
              {/* YEAR INPUT */}
              <div>
                <label className="block text-xs font-medium text-[var(--light-text)] mb-1.5">
                  Year
                </label>
                <div className="relative">
                  <Hash
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                  />
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    min={2020}
                    max={2100}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
            {/* DEADLINE INPUT */}
            <div>
              <label className="block text-xs font-medium text-[var(--light-text)] mb-1.5">
                Deadline
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(true)}
                  className={`w-full flex items-center justify-between pl-10 pr-3 py-2.5 text-sm rounded-lg border cursor-pointer transition ${
                    isCalendarOpen
                      ? "border-[var(--accent-color)]"
                      : "border-[var(--border)] hover:border-[var(--accent-color)]"
                  } ${
                    deadline
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--light-text)]"
                  } bg-transparent`}
                >
                  <Calendar
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                  />
                  {deadline ? formatDate(deadline) : "Select deadline"}
                  <ChevronDown
                    size={16}
                    className={`text-[var(--light-text)] transition ${
                      isCalendarOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {/* CALENDAR MODAL */}
                {isCalendarOpen && (
                  <div
                    className="fixed z-50 inset-0 flex items-center justify-center bg-[var(--black-overlay)] p-4"
                    onClick={(e) => {
                      if (e.target === e.currentTarget) {
                        setIsCalendarOpen(false);
                      }
                    }}
                  >
                    <div
                      className="bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-lg p-3 w-full max-w-[320px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DayPicker
                        mode="single"
                        selected={
                          deadline
                            ? new Date(deadline + "T00:00:00")
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            // USE LOCAL DATE FORMAT TO AVOID TIMEZONE ISSUES
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const day = String(date.getDate()).padStart(2, "0");
                            setDeadline(`${year}-${month}-${day}`);
                          } else {
                            setDeadline("");
                          }
                          setIsCalendarOpen(false);
                        }}
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
            </div>
            {/* COLOR PICKER */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--light-text)] mb-1.5">
                <Palette size={14} className="text-[var(--light-text)]" />
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)]"
                />
                <div className="flex gap-1.5">
                  {[
                    "#6366f1",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                    "#06b6d4",
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-lg transition ${
                        color === c
                          ? "ring-2 ring-offset-2 ring-[var(--accent-color)]"
                          : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--border)] flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !title.trim() || createGoal.isPending || updateGoal.isPending
            }
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createGoal.isPending || updateGoal.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {isEditing ? "Update Goal" : "Create Goal"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalForm;
