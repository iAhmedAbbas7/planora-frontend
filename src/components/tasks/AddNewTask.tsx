// <== IMPORTS ==>
import {
  ChevronDown,
  Folder,
  FileText,
  Circle,
  Calendar,
  Flag,
} from "lucide-react";
import "react-day-picker/dist/style.css";
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
  // <== SHOW BUTTONS ==>
  showButtons?: boolean;
};

// <== ADD NEW TASK COMPONENT ==>
const AddNewTask = ({
  onClose,
  onTaskAdded,
  initialTask = {},
  projectId,
  showButtons = true,
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
    // SET STATUS OPEN TO FALSE
    setIsStatusOpen(false);
    // SET PRIORITY OPEN TO FALSE
    setIsPriorityOpen(false);
    // SET PROJECT OPEN TO FALSE
    setIsOpen(false);
    // SET CALENDAR OPEN TO FALSE
    setIsCalendarOpen(false);
  };
  // HANDLE BUTTON CLICK FUNCTION
  const handleButtonClick = (): void => {
    // GET FORM ELEMENT
    const form = document.getElementById("task-form") as HTMLFormElement;
    // CHECK IF FORM EXISTS
    if (form) {
      // CREATE SYNTHETIC FORM EVENT
      const syntheticEvent = {
        preventDefault: () => {},
        currentTarget: form,
        target: form,
      } as unknown as FormEvent<HTMLFormElement>;
      // CALL HANDLE SUBMIT
      handleSubmit(syntheticEvent);
    }
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
      // SET TASK TO DEFAULT VALUES
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
      // SET PROJECT SELECTED TO "SELECT PROJECT"
      setProjectSelected("Select Project");
      // SET PRIORITY TO NULL
      setPriority(null);
      // SET STATUS TO NULL
      setStatus(null);
      // SET SELECTED TO NULL
      setSelected(null);
    }
    // CALL ON CLOSE FUNCTION
    if (onClose) onClose();
  };
  // RETURNING THE ADD NEW TASK COMPONENT
  return (
    <>
      {/* FORM CONTAINER */}
      <form
        id="task-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-2.5 w-full p-3 sm:p-4"
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
              className="flex justify-between items-center w-full border border-[var(--border)] pl-10 pr-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg cursor-pointer bg-[var(--inside-card-bg)] relative"
            >
              {/* FOLDER ICON */}
              <Folder
                size={18}
                className="absolute left-3 text-[var(--light-text)]"
              />
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
          {/* TITLE INPUT CONTAINER */}
          <div className="relative">
            {/* FILE ICON */}
            <FileText
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--light-text)]"
            />
            {/* TITLE INPUT */}
            <input
              required
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full pl-10 pr-3 py-1.5 sm:py-2 text-sm sm:text-base placeholder:text-xs sm:placeholder:text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-none"
            />
          </div>
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
          {/* DESCRIPTION TEXTAREA CONTAINER */}
          <div className="relative">
            {/* FILE ICON */}
            <FileText
              size={18}
              className="absolute left-3 top-3 text-[var(--light-text)]"
            />
            {/* DESCRIPTION TEXTAREA */}
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              id="description"
              placeholder="Enter task details..."
              className="w-full pl-10 pr-3 py-1.5 sm:py-2 text-sm sm:text-base placeholder:text-xs sm:placeholder:text-sm border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:ring-none focus:ring-[var(--accent-color)]"
              rows={2}
            ></textarea>
          </div>
        </div>
        {/* DUE DATE AND STATUS ROW */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
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
              className={`w-full flex items-center justify-between pl-10 pr-3 py-1.5 sm:py-2 border border-[var(--border)] cursor-pointer rounded-lg bg-[var(--inside-card-bg)] ${
                selected
                  ? "text-sm sm:text-base text-[var(--primary-text)]"
                  : "text-xs sm:text-sm text-[var(--light-text)]"
              } focus:ring-none focus:ring-[var(--accent-color)] relative`}
            >
              {/* CALENDAR ICON */}
              <Calendar
                size={18}
                className="absolute left-3 text-[var(--light-text)]"
              />
              {selected ? formatDate(selected) : "Select a date"}
              {/* CHEVRON DOWN ICON */}
              <ChevronDown size={16} className="text-[var(--light-text)]" />
            </button>
            {/* CALENDAR DROPDOWN */}
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
                      nav_button:
                        "text-[#8b5cf6] hover:bg-[#f3e8ff] rounded p-1",
                      nav_button_next:
                        "text-[#8b5cf6] hover:bg-[#f3e8ff] rounded p-1",
                      nav_button_previous:
                        "text-[#8b5cf6] hover:bg-[#f3e8ff] rounded p-1",
                    }}
                    className="rdp-weekdays-none"
                  />
                </div>
              </div>
            )}
          </div>
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
              className={`w-full flex items-center justify-between pl-10 pr-3 py-1.5 sm:py-2 border cursor-pointer border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] ${
                status
                  ? "text-sm sm:text-base text-[var(--primary-text)]"
                  : "text-xs sm:text-sm text-[var(--light-text)]"
              } focus:ring-none focus:ring-[var(--accent-color)] relative`}
            >
              {/* CIRCLE ICON */}
              <Circle
                size={18}
                className="absolute left-3 text-[var(--light-text)]"
              />
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
            className={`w-full flex items-center justify-between pl-10 pr-3 py-1.5 sm:py-2 border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] cursor-pointer ${
              priority
                ? "text-sm sm:text-base text-[var(--primary-text)]"
                : "text-xs sm:text-sm text-[var(--light-text)]"
            } focus:ring-none focus:ring-[var(--accent-color)] relative`}
          >
            {/* FLAG ICON */}
            <Flag
              size={18}
              className="absolute left-3 text-[var(--light-text)]"
            />
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
      </form>
      {/* BUTTONS CONTAINER - FIXED FOOTER */}
      {showButtons && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-[var(--bg)] flex justify-end gap-2 p-2 sm:p-3 pt-2 border-t border-[var(--border)] z-10 shadow-lg"
          style={{ height: "auto", minHeight: "auto" }}
        >
          {/* CANCEL BUTTON */}
          <button
            type="button"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm border border-[var(--border)] hover:bg-[var(--hover-bg)] cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          {/* SUBMIT BUTTON */}
          <button
            type="button"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-[var(--accent-btn-hover-color)] bg-[var(--accent-color)] text-white shadow cursor-pointer"
            onClick={handleButtonClick}
          >
            {task._id ? "Update Task" : "Add Task"}
          </button>
        </div>
      )}
    </>
  );
};

export default AddNewTask;
