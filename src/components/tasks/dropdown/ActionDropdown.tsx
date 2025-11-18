// <== IMPORTS ==>
import { JSX } from "react";

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
    { label: "Edit Task", onClick: onEditTask, text: "edited" },
    { label: "Delete Task", onClick: onDeleteTask, text: "deleted" },
  ];
  // RETURNING THE ACTION DROPDOWN COMPONENT
  return (
    // DROPDOWN MAIN CONTAINER
    <div className="bg-[var(--bg)] z-[9999] shadow-md rounded-md border border-[var(--border)] p-2 w-40">
      {/* MAPPING THROUGH ACTIONS */}
      {actions.map((item, index) => (
        // ACTION BUTTON
        <button
          key={index}
          onClick={() => {
            // LOG ACTION (UI ONLY)
            console.log(item.text);
            // CALL ONCLICK
            item.onClick?.();
          }}
          className="w-full cursor-pointer text-left px-3 py-2 text-sm hover:bg-[var(--hover-bg)] rounded-md"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ActionDropdown;
