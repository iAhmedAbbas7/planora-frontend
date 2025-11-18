// <== IMPORTS ==>
import "react-day-picker/dist/style.css";
import { ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import type { Task } from "../../types/task";
import { useEffect, useState, JSX, ChangeEvent, FormEvent } from "react";

// <== PROJECT TYPE INTERFACE ==>
type Project = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
};
// <== ADD NEW TASK PROPS TYPE INTERFACE ==>
type Props = {
  // <== ON CLOSE FUNCTION ==>
  onClose?: () => void;
  // <== ON TASK ADDED FUNCTION ==>
  onTaskAdded?: (task: Task) => void;
  // <== INITIAL TASK ==>
  initialTask?: Partial<Task>;
  // <== PROJECT ID ==>
  projectId?: string | null;
};

// <== ADD NEW TASK COMPONENT ==>
const AddNewTask = ({
  onClose,
  onTaskAdded,
  initialTask = {},
  projectId,
}: Props): JSX.Element => {
  // STATUS DROPDOWN OPEN STATE
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  // PROJECT DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // CALENDAR OPEN STATE
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  // STATUS STATE
  const [status, setStatus] = useState<string | null>(null);
  // SELECTED DATE STATE
  const [selected, setSelected] = useState<Date | null>(null);
  // PROJECTS STATE
  const [projects, setProjects] = useState<Project[]>([]);
  // PRIORITY STATE
  const [priority, setPriority] = useState<string | null>(null);
  // PRIORITY DROPDOWN OPEN STATE
  const [isPriorityOpen, setIsPriorityOpen] = useState<boolean>(false);
  // PROJECT SELECTED STATE
  const [projectSelected, setProjectSelected] =
    useState<string>("Select Project");
  // TASK STATE
  const [task, setTask] = useState<Task>({
    _id: initialTask._id || "",
    title: initialTask.title || "",
    description: initialTask.description || "",
    dueDate: initialTask.dueDate || 0,
    status: initialTask.status || "to do",
    priority: initialTask.priority || "low",
    projectId: initialTask.projectId || "",
    userId: initialTask.userId || "",
  });
  // INITIALIZE FROM INITIAL TASK EFFECT
  useEffect(() => {
    // CHECK IF INITIAL TASK EXISTS
    if (initialTask) {
      // SET STATUS IF EXISTS
      if (initialTask.status) setStatus(initialTask.status);
      // SET PRIORITY IF EXISTS
      if (initialTask.priority) setPriority(initialTask.priority);
      // SET SELECTED DATE IF EXISTS
      if (initialTask.dueDate) setSelected(new Date(initialTask.dueDate));
    }
  }, [initialTask]);
  // FETCH PROJECTS EFFECT (MOCK DATA - NO API)
  useEffect(() => {
    // SET EMPTY PROJECTS (UI ONLY)
    setProjects([]);
  }, []);
  // HANDLE CHANGE FUNCTION
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    // GET NAME AND VALUE FROM EVENT
    const { name, value } = e.target;
    // UPDATE TASK STATE
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // FORMAT DATE FUNCTION
  const formatDate = (date: Date): string => {
    // GET DAY
    const d = date.getDate().toString().padStart(2, "0");
    // GET MONTH
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    // GET YEAR
    const y = date.getFullYear();
    // RETURN FORMATTED DATE
    return `${d}/${m}/${y}`;
  };
  // CLOSE ALL DROPDOWNS FUNCTION
  const closeAllDropdowns = (): void => {
    // CLOSE ALL DROPDOWNS
    setIsStatusOpen(false);
    setIsPriorityOpen(false);
    setIsOpen(false);
    setIsCalendarOpen(false);
  };
  // HANDLE SUBMIT FUNCTION
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // CHECK IF STATUS IS SELECTED
    if (!status) {
      alert("Please select a status.");
      return;
    }
    // CHECK IF DATE IS SELECTED
    if (!selected) {
      alert("Please select a due date.");
      return;
    }
    // CHECK IF PROJECT IS SELECTED
    if (!projectSelected || projectSelected === "Select Project") {
      alert("Please select a project.");
      return;
    }
    // CREATE TASK OBJECT
    const newTask: Task = {
      _id: task._id || Date.now().toString(),
      title: task.title,
      description: task.description,
      status: (status?.toLowerCase() || "to do") as Task["status"],
      priority: priority?.toLowerCase() || "low",
      dueDate: selected ? selected.getTime() : 0,
      projectId: projectId || task.projectId,
      completedAt:
        status?.toLowerCase() === "completed" ? new Date() : undefined,
    };
    // LOG TASK (UI ONLY - NO API)
    console.log("Task data:", newTask);
    // CALL ON TASK ADDED CALLBACK
    if (onTaskAdded) onTaskAdded(newTask);
    // RESET FORM IF NEW TASK
    if (!task._id) {
      setTask({
        _id: "",
        title: "",
        description: "",
        projectId: "",
        dueDate: 0,
        status: "to do",
        priority: "",
        userId: "",
      });
      setProjectSelected("Select Project");
      setPriority(null);
      setStatus(null);
      setSelected(null);
    }
    // CLOSE MODAL
    if (onClose) onClose();
  };
  // RETURNING THE ADD NEW TASK COMPONENT
  return (
    // FORM CONTAINER
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md p-2 rounded-xl"
    >
      {/* PROJECT FIELD */}
      <div className="flex flex-col gap-1 w-full">
        {/* PROJECT LABEL */}
        <label
          htmlFor="project"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Project
        </label>
        {/* PROJECT DROPDOWN CONTAINER */}
        <div className="relative">
          {/* PROJECT BUTTON */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between items-center w-full border border-[var(--border)] p-2.5 rounded-lg cursor-pointer bg-[var(--inside-card-bg)]"
          >
            {/* PROJECT SELECTED TEXT */}
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {projectSelected}
            </span>
            {/* CHEVRON DOWN ICON */}
            <ChevronDown
              size={16}
              className={`text-[var(--light-text)] transform transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {/* PROJECT DROPDOWN MENU */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {/* PROJECTS LIST */}
              <ul className="divide-y divide-[var(--border)]">
                {/* CHECK IF PROJECTS EXIST */}
                {projects.length > 0 ? (
                  // MAPPING THROUGH PROJECTS
                  projects.map((project) => (
                    // PROJECT ITEM
                    <li
                      key={project._id}
                      className="px-4 py-2 text-sm hover:bg-[var(--hover-bg)] cursor-pointer"
                      onClick={() => {
                        setProjectSelected(project.title);
                        setTask((prev) => ({
                          ...prev,
                          projectId: project._id,
                        }));
                        setIsOpen(false);
                      }}
                    >
                      {project.title}
                    </li>
                  ))
                ) : (
                  // EMPTY STATE
                  <li className="px-4 py-2 text-sm text-[var(--light-text)]">
                    No projects found
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        {/* TITLE LABEL */}
        <label
          htmlFor="title"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Title
        </label>
        {/* TITLE INPUT */}
        <input
          required
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Enter task title"
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-none"
        />
      </div>
      {/* DESCRIPTION FIELD */}
      <div className="flex flex-col gap-1 w-full">
        {/* DESCRIPTION LABEL */}
        <label
          htmlFor="description"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Description
        </label>
        {/* DESCRIPTION TEXTAREA */}
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          id="description"
          placeholder="Enter task details..."
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:ring-none focus:ring-[var(--accent-color)]"
          rows={3}
        ></textarea>
      </div>
      {/* STATUS AND DUE DATE ROW */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {/* STATUS DROPDOWN */}
        <div className="flex flex-col gap-1 w-full relative">
          {/* STATUS LABEL */}
          <label
            htmlFor="status"
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            Status <span className="text-red-500">*</span>
          </label>
          {/* STATUS BUTTON */}
          <button
            id="status"
            type="button"
            onClick={() => {
              closeAllDropdowns();
              setIsStatusOpen((prev) => !prev);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 border cursor-pointer border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] ${
              status ? "text-[var(--primary-text)]" : "text-[var(--light-text)]"
            } focus:ring-none focus:ring-[var(--accent-color)]`}
          >
            {status || "Select status"}
            {/* CHEVRON DOWN ICON */}
            <ChevronDown size={16} className="text-[var(--light-text)]" />
          </button>
          {/* STATUS DROPDOWN MENU */}
          {isStatusOpen && (
            <div className="absolute z-10 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
              {/* MAPPING THROUGH STATUS OPTIONS */}
              {["To Do", "In Progress", "Completed"].map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    setIsStatusOpen(false);
                  }}
                  className="px-3 py-2 text-sm text-[var(--primary-text)] hover:bg-[var(--hover-bg)] cursor-pointer"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* DUE DATE PICKER */}
        <div className="flex flex-col gap-1 w-full relative">
          {/* DUE DATE LABEL */}
          <label
            htmlFor="dueDate"
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            Due Date <span className="text-red-500">*</span>
          </label>
          {/* DUE DATE BUTTON */}
          <button
            type="button"
            onClick={() => {
              closeAllDropdowns();
              setIsCalendarOpen((prev) => !prev);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 border border-[var(--border)] cursor-pointer rounded-lg bg-[var(--inside-card-bg)] ${
              selected
                ? "text-[var(--primary-text)]"
                : "text-[var(--light-text)]"
            } focus:ring-none focus:ring-[var(--accent-color)]`}
          >
            {selected ? formatDate(selected) : "Select a date"}
            {/* CHEVRON DOWN ICON */}
            <ChevronDown size={16} className="text-[var(--light-text)]" />
          </button>
          {/* CALENDAR DROPDOWN */}
          {isCalendarOpen && (
            <div className="absolute z-20 -top-26 bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-lg p-3 min-w-[280px] overflow-hidden">
              {/* DAY PICKER */}
              <DayPicker
                mode="single"
                selected={selected || undefined}
                onSelect={(date) => {
                  setSelected(date || null);
                  setIsCalendarOpen(false);
                }}
                disabled={{ before: new Date() }}
                classNames={{
                  day_selected: "bg-[#8b5cf6] text-white rounded-full",
                  nav_button: "text-[#8b5cf6] hover:bg-[#f3e8ff] rounded p-1",
                  nav_button_next:
                    "text-[#8b5cf6] hover:bg-[#f3e8ff] rounded p-1",
                  nav_button_previous:
                    "text-[#8b5cf6] hover:bg-[#f3e8ff] rounded p-1",
                }}
                className="rdp-weekdays-none"
              />
            </div>
          )}
        </div>
      </div>
      {/* PRIORITY DROPDOWN */}
      <div className="flex flex-col gap-1 w-full relative">
        {/* PRIORITY LABEL */}
        <label
          htmlFor="priority"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Priority <span className="text-red-500">*</span>
        </label>
        {/* PRIORITY BUTTON */}
        <button
          id="priority"
          type="button"
          onClick={() => {
            closeAllDropdowns();
            setIsPriorityOpen((prev) => !prev);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] cursor-pointer ${
            priority ? "text-[var(--primary-text)]" : "text-[var(--light-text)]"
          } focus:ring-none focus:ring-[var(--accent-color)]`}
        >
          {priority || "Select priority"}
          {/* CHEVRON DOWN ICON */}
          <ChevronDown size={16} className="text-[var(--light-text)]" />
        </button>
        {/* PRIORITY DROPDOWN MENU */}
        {isPriorityOpen && (
          <div className="absolute z-10 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
            {/* MAPPING THROUGH PRIORITY OPTIONS */}
            {["Low", "Medium", "High"].map((p) => (
              <div
                key={p}
                onClick={() => {
                  setPriority(p);
                  setIsPriorityOpen(false);
                }}
                className="px-3 py-2 text-sm text-[var(--primary-text)] hover:bg-[var(--hover-bg)] cursor-pointer"
              >
                {p}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* BUTTONS CONTAINER */}
      <div className="flex justify-end gap-3 mt-4">
        {/* CANCEL BUTTON */}
        <button
          type="button"
          className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] hover:bg-[var(--hover-bg)] cursor-pointer"
          onClick={onClose}
        >
          Cancel
        </button>
        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm hover:bg-[var(--accent-btn-hover-color)] bg-[var(--accent-color)] text-white shadow cursor-pointer"
        >
          {task._id ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
};

export default AddNewTask;
