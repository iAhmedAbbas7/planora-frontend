// <== IMPORTS ==>
import { JSX } from "react";
import { Edit, Trash2 } from "lucide-react";

// <== ACTION DROPDOWN PROPS TYPE INTERFACE ==>
type ActionDropdownProps = {
  // <== ON EDIT TASK FUNCTION ==>
  onEditTask?: () => void;
  // <== ON DELETE TASK FUNCTION ==>
  onDeleteTask?: () => void;
};

// <== ACTION DROPDOWN COMPONENT ==>
const ActionDropdown = ({
  onEditTask,
  onDeleteTask,
}: ActionDropdownProps): JSX.Element => {
  // ACTIONS ARRAY
  const actions = [
    { label: "Edit Task", onClick: onEditTask, icon: Edit },
    { label: "Delete Task", onClick: onDeleteTask, icon: Trash2 },
  ];
  // RETURNING THE ACTION DROPDOWN COMPONENT
  return (
    // DROPDOWN MAIN CONTAINER
    <div className="bg-[var(--bg)] z-[9999] shadow-md rounded-md border border-[var(--border)] p-2 w-40">
      {/* MAPPING THROUGH ACTIONS */}
      {actions.map((item, index) => {
        // GET THE ICON COMPONENT
        const IconComponent = item.icon;
        // RETURN THE ACTION BUTTON
        return (
          // ACTION BUTTON
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick?.();
            }}
            className="w-full cursor-pointer text-left px-3 py-2 text-sm hover:bg-[var(--hover-bg)] rounded-md flex items-center gap-2 text-[var(--text-primary)]"
          >
            <IconComponent size={16} className="text-[var(--accent-color)]" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ActionDropdown;
