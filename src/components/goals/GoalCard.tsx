// <== IMPORTS ==>
import {
  Target,
  MoreHorizontal,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flag,
  Link2,
  Calendar,
} from "lucide-react";
import {
  Goal,
  GOAL_STATUS_CONFIG,
  GOAL_TYPE_CONFIG,
  useDeleteGoal,
} from "../../hooks/useGoals";
import { JSX, useState, useRef, useEffect } from "react";
import ConfirmationModal from "../common/ConfirmationModal";

// <== PROPS TYPE ==>
type GoalCardProps = {
  // <== GOAL FIELD ==>
  goal: Goal;
  // <== ON EDIT FUNCTION ==>
  onEdit: (goal: Goal) => void;
  // <== ON ADD KEY RESULT FUNCTION ==>
  onAddKeyResult?: (parentGoal: Goal) => void;
  // <== IS CHILD FIELD ==>
  isChild?: boolean;
};

// <== GOAL CARD COMPONENT ==>
const GoalCard = ({
  goal,
  onEdit,
  onAddKeyResult,
  isChild = false,
}: GoalCardProps): JSX.Element => {
  // EXPANDED STATE
  const [isExpanded, setIsExpanded] = useState(true);
  // DROPDOWN STATE
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // DELETE CONFIRMATION STATE
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement>(null);
  // DELETE MUTATION
  const deleteGoal = useDeleteGoal();
  // HAS KEY RESULTS
  const hasKeyResults = goal.keyResults && goal.keyResults.length > 0;
  // HANDLE CLICK OUTSIDE DROPDOWN
  useEffect(() => {
    // HANDLE CLICK OUTSIDE DROPDOWN
    const handleClickOutside = (event: MouseEvent): void => {
      // CHECK IF DROPDOWN REF IS PROVIDED AND THE CLICK IS NOT INSIDE THE DROPDOWN
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // SET DROPDOWN OPEN STATE TO FALSE
        setIsDropdownOpen(false);
      }
    };
    // ADD EVENT LISTENER FOR CLICK OUTSIDE DROPDOWN
    document.addEventListener("mousedown", handleClickOutside);
    // RETURN CLEANUP FUNCTION
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // HANDLE DELETE
  const handleDelete = async (): Promise<void> => {
    // TRY TO DELETE GOAL
    try {
      // AWAIT DELETE GOAL MUTATION
      await deleteGoal.mutateAsync(goal._id);
      // SET DELETE MODAL OPEN STATE TO FALSE
      setIsDeleteModalOpen(false);
    } catch {
      // ERROR IS HANDLED BY THE MUTATION
    }
  };
  // GET STATUS ICON
  const getStatusIcon = (): JSX.Element => {
    // SWITCH ON GOAL STATUS
    switch (goal.status) {
      // CASE COMPLETED
      case "completed":
        // RETURN CHECK CIRCLE ICON
        return <CheckCircle2 size={14} className="text-green-500" />;
      // CASE ON TRACK
      case "on_track":
        // RETURN CLOCK ICON
        return <Clock size={14} className="text-blue-500" />;
      // CASE AT RISK
      case "at_risk":
        // RETURN ALERT TRIANGLE ICON
        return <AlertTriangle size={14} className="text-yellow-500" />;
      // CASE BEHIND
      case "behind":
        // RETURN ALERT TRIANGLE ICON
        return <AlertTriangle size={14} className="text-yellow-500" />;
      // DEFAULT CASE
      default:
        // RETURN CLOCK ICON
        return <Clock size={14} className="text-gray-400" />;
    }
  };
  // RETURN GOAL CARD
  return (
    <>
      <div
        className={`bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl overflow-hidden ${
          isChild ? "ml-6 border-l-2" : ""
        }`}
        style={
          isChild ? { borderLeftColor: goal.color || "#6366f1" } : undefined
        }
      >
        {/* MAIN CONTENT */}
        <div className="p-4">
          {/* HEADER ROW */}
          <div className="flex items-start justify-between gap-3 mb-3">
            {/* LEFT SIDE */}
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {/* EXPAND/COLLAPSE BUTTON (FOR OBJECTIVES WITH KEY RESULTS) */}
              {hasKeyResults && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 rounded hover:bg-[var(--hover-bg)] transition mt-0.5 flex-shrink-0 cursor-pointer"
                >
                  {isExpanded ? (
                    <ChevronDown
                      size={16}
                      className="text-[var(--light-text)]"
                    />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="text-[var(--light-text)]"
                    />
                  )}
                </button>
              )}
              {/* ICON */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${goal.color || "#6366f1"}20`,
                }}
              >
                {goal.type === "objective" ? (
                  <Target
                    size={20}
                    style={{ color: goal.color || "#6366f1" }}
                  />
                ) : goal.type === "key_result" ? (
                  <CheckCircle2
                    size={20}
                    style={{ color: goal.color || "#6366f1" }}
                  />
                ) : (
                  <Flag size={20} style={{ color: goal.color || "#6366f1" }} />
                )}
              </div>
              {/* TITLE AND META */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {goal.title}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${
                      GOAL_STATUS_CONFIG[goal.status].bg
                    } ${GOAL_STATUS_CONFIG[goal.status].color}`}
                  >
                    {GOAL_STATUS_CONFIG[goal.status].label}
                  </span>
                </div>
                {goal.description && (
                  <p className="text-xs text-[var(--light-text)] line-clamp-1 mb-2">
                    {goal.description}
                  </p>
                )}
                {/* META ROW */}
                <div className="flex items-center gap-3 text-[10px] text-[var(--light-text)]">
                  <span
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${GOAL_TYPE_CONFIG[goal.type].color}15`,
                      color: GOAL_TYPE_CONFIG[goal.type].color,
                    }}
                  >
                    {GOAL_TYPE_CONFIG[goal.type].label}
                  </span>
                  {goal.quarter && goal.year && (
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {goal.quarter} {goal.year}
                    </span>
                  )}
                  {goal.linkedTasks.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Link2 size={10} />
                      {goal.linkedTasks.length} tasks
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* RIGHT SIDE - ACTIONS */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* ADD KEY RESULT BUTTON */}
              {goal.type === "objective" && onAddKeyResult && (
                <button
                  onClick={() => onAddKeyResult(goal)}
                  className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                  title="Add Key Result"
                >
                  <Plus size={16} />
                </button>
              )}
              {/* MORE DROPDOWN */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                >
                  <MoreHorizontal size={16} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-36 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10 overflow-hidden">
                    <button
                      onClick={() => {
                        onEdit(goal);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* PROGRESS BAR */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[var(--light-text)]">
                Progress
              </span>
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                {goal.currentValue} / {goal.targetValue} {goal.unit}
              </span>
            </div>
            <div className="h-2 bg-[var(--hover-bg)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${goal.progress}%`,
                  backgroundColor: goal.color || "#6366f1",
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-[var(--light-text)]">
                {goal.progress}% complete
              </span>
              {goal.deadline && (
                <span className="text-[10px] text-[var(--light-text)] flex items-center gap-1">
                  <Calendar size={10} />
                  Due {new Date(goal.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* KEY RESULTS */}
        {hasKeyResults && isExpanded && (
          <div className="border-t border-[var(--border)] p-3 space-y-2 bg-[var(--hover-bg)]/30">
            {goal.keyResults!.map((kr) => (
              <div
                key={kr._id}
                className="flex items-center gap-3 p-2 rounded-lg bg-[var(--cards-bg)] border border-[var(--border)]"
              >
                {/* STATUS ICON */}
                <div className="flex-shrink-0">{getStatusIcon()}</div>
                {/* TITLE */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {kr.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 bg-[var(--hover-bg)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${kr.progress}%`,
                          backgroundColor: kr.color || "#10b981",
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-[var(--light-text)] flex-shrink-0">
                      {kr.progress}%
                    </span>
                  </div>
                </div>
                {/* ACTIONS */}
                <button
                  onClick={() => onEdit(kr)}
                  className="p-1 rounded hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--text-primary)] transition cursor-pointer"
                >
                  <Edit2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Goal"
        message={`Are you sure you want to delete "${goal.title}"? ${
          hasKeyResults
            ? "This will also delete all associated key results."
            : ""
        }`}
        confirmText="Delete"
        type="error"
      />
    </>
  );
};

export default GoalCard;
