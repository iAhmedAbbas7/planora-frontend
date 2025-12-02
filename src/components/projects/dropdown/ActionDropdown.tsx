// <== IMPORTS ==>
import { JSX } from "react";
import { Eye, Edit, Plus, Trash2 } from "lucide-react";

// <== ACTION DROPDOWN PROPS TYPE INTERFACE ==>
type ActionDropdownProps = {
  // <== ON VIEW DETAILS FUNCTION ==>
  onViewDetails?: () => void;
  // <== ON EDIT PROJECT FUNCTION ==>
  onEditProject?: () => void;
  // <== ON ADD TASK FUNCTION ==>
  onAddTask?: () => void;
  // <== ON DELETE PROJECT FUNCTION ==>
  onDeleteProject?: () => void;
};

// <== ACTION DROPDOWN COMPONENT ==>
const ActionDropdown = ({
  onViewDetails,
  onEditProject,
  onAddTask,
  onDeleteProject,
}: ActionDropdownProps): JSX.Element => {
  // ACTIONS ARRAY
  const actions = [
    { label: "View Details", onClick: onViewDetails, icon: Eye },
    { label: "Edit Project", onClick: onEditProject, icon: Edit },
    { label: "Add Task", onClick: onAddTask, icon: Plus },
    { label: "Delete Project", onClick: onDeleteProject, icon: Trash2 },
  ];
  // RETURNING THE ACTION DROPDOWN COMPONENT
  return (
    // DROPDOWN MAIN CONTAINER
    <div className="bg-[var(--bg)] z-10 shadow-md rounded-md border border-[var(--border)] p-2 w-40">
      {/* MAPPING THROUGH ACTIONS */}
      {actions.map((item, index) => {
        const IconComponent = item.icon;
        return (
          // ACTION BUTTON
          <button
            key={index}
            onClick={item.onClick}
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
