// <== IMPORTS ==>
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ListTodo,
  ChevronRight,
} from "lucide-react";
import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

// <== TASK NODE DATA INTERFACE ==>
interface TaskNodeData {
  // <== LABEL ==>
  label: string;
  // <== TASK KEY ==>
  taskKey: string;
  // <== STATUS ==>
  status: string;
  // <== PRIORITY ==>
  priority: string;
  // <== IS BLOCKED ==>
  isBlocked: boolean;
  // <== HAS SUBTASKS ==>
  hasSubtasks: boolean;
  // <== IS SUBTASK ==>
  isSubtask: boolean;
}

// <== STATUS ICONS ==>
const statusIcons: Record<string, React.ReactNode> = {
  // <== TO DO ICON ==>
  "to do": <Circle size={14} className="text-[var(--light-text)]" />,
  // <== IN PROGRESS ICON ==>
  "in progress": <Clock size={14} className="text-[var(--accent-color)]" />,
  // <== COMPLETED ICON ==>
  completed: <CheckCircle2 size={14} className="text-green-500" />,
};

// <== PRIORITY COLORS ==>
const priorityColors: Record<string, string> = {
  // <== LOW PRIORITY COLOR ==>
  low: "bg-green-500/20 text-green-500",
  // <== MEDIUM PRIORITY COLOR ==>
  medium: "bg-yellow-500/20 text-yellow-500",
  // <== HIGH PRIORITY COLOR ==>
  high: "bg-red-500/20 text-red-500",
};

// <== TASK NODE COMPONENT ==>
const TaskNode = ({ data }: NodeProps) => {
  // CAST DATA TO TASK NODE DATA
  const nodeData = data as unknown as TaskNodeData;
  // RETURN TASK NODE
  return (
    // TASK NODE CONTAINER
    <div
      className={`px-3 py-2 rounded-lg border min-w-[160px] max-w-[200px] ${
        nodeData.isBlocked
          ? "border-red-500 bg-red-500/10"
          : "border-[var(--border)] bg-[var(--card-bg)]"
      } ${nodeData.isSubtask ? "opacity-80" : ""}`}
    >
      {/* TOP HANDLE */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-[var(--accent-color)] !border-[var(--border)] !w-2 !h-2"
      />
      {/* TASK KEY BADGE */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[10px] font-mono text-[var(--light-text)] bg-[var(--hover-bg)] px-1.5 py-0.5 rounded">
          {nodeData.taskKey || "—"}
        </span>
        {/* BLOCKED INDICATOR */}
        {nodeData.isBlocked && (
          <AlertTriangle size={12} className="text-red-500" />
        )}
        {/* SUBTASK INDICATOR */}
        {nodeData.isSubtask && (
          <ChevronRight size={12} className="text-[var(--light-text)]" />
        )}
      </div>
      {/* TASK TITLE */}
      <div className="text-xs font-medium text-[var(--text-primary)] truncate mb-1.5">
        {nodeData.label}
      </div>
      {/* STATUS AND PRIORITY ROW */}
      <div className="flex items-center justify-between gap-2">
        {/* STATUS */}
        <div className="flex items-center gap-1">
          {statusIcons[nodeData.status] || statusIcons["to do"]}
          <span className="text-[10px] text-[var(--light-text)] capitalize">
            {nodeData.status}
          </span>
        </div>
        {/* PRIORITY BADGE */}
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded capitalize ${
            priorityColors[nodeData.priority] || priorityColors["medium"]
          }`}
        >
          {nodeData.priority}
        </span>
      </div>
      {/* HAS SUBTASKS INDICATOR */}
      {nodeData.hasSubtasks && (
        <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-[var(--border)]">
          <ListTodo size={10} className="text-[var(--light-text)]" />
          <span className="text-[9px] text-[var(--light-text)]">
            Has subtasks
          </span>
        </div>
      )}
      {/* BOTTOM HANDLE */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-[var(--accent-color)] !border-[var(--border)] !w-2 !h-2"
      />
    </div>
  );
};

// <== EXPORT MEMOIZED COMPONENT ==>
export default memo(TaskNode);
