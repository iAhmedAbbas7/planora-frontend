// <== IMPORTS ==>
import {
  ChevronDown,
  FileText,
  User,
  Briefcase,
  Circle,
  Calendar,
  Flag,
} from "lucide-react";
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { useState, useEffect, JSX, FormEvent } from "react";

// <== PROJECT TYPE INTERFACE ==>
type Project = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
  description: string;
  // <== INCHARGE NAME ==>
  inChargeName: string;
  // <== ROLE ==>
  role: string;
  // <== PRIORITY ==>
  priority: string;
  // <== STATUS ==>
  status: string;
  // <== DUE DATE ==>
  dueDate: string;
};
// <== ADD PROJECT MODAL PROPS TYPE INTERFACE ==>
type Props = {
  // <== ON CLOSE FUNCTION ==>
  onClose?: () => void;
  // <== ON PROJECT ADDED FUNCTION ==>
  onProjectAdded?: (project: Project) => void;
  // <== INITIAL PROJECT ==>
  initialProject?: Partial<Project>;
  // <== SHOW BUTTONS ==>
  showButtons?: boolean;
};

// <== ADD PROJECT MODAL COMPONENT ==>
const AddProjectModal = ({
  onClose,
  onProjectAdded,
  initialProject = {},
  showButtons = true,
}: Props): JSX.Element => {
  // STATUS DROPDOWN OPEN STATE
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  // PRIORITY STATE
  const [priority, setPriority] = useState<string | null>(null);
  // PRIORITY DROPDOWN OPEN STATE
  const [isPriorityOpen, setIsPriorityOpen] = useState<boolean>(false);
  // CALENDAR OPEN STATE
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  // STATUS STATE
  const [status, setStatus] = useState<string | null>(null);
  // SELECTED DATE STATE
  const [selected, setSelected] = useState<Date | null>(null);
  // PROJECT STATE
  const [project, setProject] = useState<Project>({
    _id: initialProject._id || "",
    title: initialProject.title || "",
    description: initialProject.description || "",
    dueDate: initialProject.dueDate || "",
    status: initialProject.status || "To Do",
    inChargeName: initialProject.inChargeName || "",
    role: initialProject.role || "",
    priority: initialProject.priority || "Low",
  });
  // INITIALIZE FROM INITIAL PROJECT EFFECT
  useEffect(() => {
    // CHECK IF INITIAL PROJECT EXISTS
    if (initialProject) {
      // SET STATUS IF EXISTS
      if (initialProject.status) setStatus(initialProject.status);
      // SET PRIORITY IF EXISTS
      if (initialProject.priority) setPriority(initialProject.priority);
      // SET SELECTED DATE IF EXISTS
      if (initialProject.dueDate) setSelected(new Date(initialProject.dueDate));
    }
  }, [initialProject]);
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
  // HANDLE BUTTON CLICK FUNCTION
  const handleButtonClick = (): void => {
    // GET FORM ELEMENT
    const form = document.getElementById("project-form") as HTMLFormElement;
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
    // CHECK IF PRIORITY IS SELECTED
    if (!priority) {
      alert("Please select priority.");
      return;
    }
    // CREATE PROJECT OBJECT
    const newProject: Project = {
      _id: project._id || Date.now().toString(),
      title: project.title,
      description: project.description,
      dueDate: selected ? selected.toISOString() : "",
      role: project.role,
      status: status || project.status,
      inChargeName: project.inChargeName,
      priority: priority || project.priority,
    };
    // LOG PROJECT (UI ONLY - NO API)
    console.log("Project data:", newProject);
    // CALL ON PROJECT ADDED CALLBACK
    onProjectAdded?.(newProject);
    // RESET FORM IF NEW PROJECT
    if (!project._id) {
      // SET PROJECT TO DEFAULT VALUES
      setProject({
        _id: "",
        title: "",
        description: "",
        dueDate: "",
        status: "To Do",
        inChargeName: "",
        role: "",
        priority: "Low",
      });
      // SET STATUS TO NULL
      setStatus(null);
      // SET PRIORITY TO NULL
      setPriority(null);
      // SET SELECTED TO NULL
      setSelected(null);
    }
    // CLOSE MODAL
    onClose?.();
  };
  // RETURNING THE ADD PROJECT MODAL COMPONENT
  return (
    <>
      {/* FORM CONTAINER */}
      <form
        id="project-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-2.5 w-full p-3 sm:p-4"
      >
        {/* TITLE FIELD */}
        <div className="flex flex-col gap-1 w-full">
          {/* TITLE LABEL */}
          <label
            htmlFor="title"
            className="text-sm font-medium text-[var(--primary-text)]"
          >
            Project Title
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
              id="title"
              value={project.title}
              onChange={(e) =>
                setProject({ ...project, title: e.target.value })
              }
              placeholder="Enter project title"
              className="w-full pl-10 pr-3 py-1.5 sm:py-2 text-sm sm:text-base placeholder:text-xs sm:placeholder:text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-none focus:ring-violet-500"
            />
          </div>
        </div>
        {/* DESCRIPTION FIELD */}
        <div className="flex flex-col gap-1 w-full">
          {/* DESCRIPTION LABEL */}
          <label
            htmlFor="description"
            className="text-sm font-medium text-[var(--primary-text)]"
          >
            Project Description
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
              id="description"
              value={project.description}
              onChange={(e) =>
                setProject({ ...project, description: e.target.value })
              }
              placeholder="Enter project details..."
              className="w-full pl-10 pr-3 py-1.5 sm:py-2 text-sm sm:text-base placeholder:text-xs sm:placeholder:text-sm border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:ring-none focus:ring-violet-500"
              rows={2}
            />
          </div>
        </div>
        {/* INCHARGE INFO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
          {/* INCHARGE NAME FIELD */}
          <div className="flex flex-col gap-1">
            {/* INCHARGE NAME LABEL */}
            <label
              htmlFor="incharge"
              className="text-sm font-medium text-[var(--primary-text)]"
            >
              Incharge Name
            </label>
            {/* INCHARGE NAME INPUT CONTAINER */}
            <div className="relative">
              {/* USER ICON */}
              <User
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--light-text)]"
              />
              {/* INCHARGE NAME INPUT */}
              <input
                required
                type="text"
                id="incharge"
                value={project.inChargeName}
                onChange={(e) =>
                  setProject({ ...project, inChargeName: e.target.value })
                }
                placeholder="Enter incharge name"
                className="w-full pl-10 pr-3 py-1.5 sm:py-2 text-sm sm:text-base placeholder:text-xs sm:placeholder:text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-none focus:ring-violet-500"
              />
            </div>
          </div>
          {/* ROLE FIELD */}
          <div className="flex flex-col gap-1">
            {/* ROLE LABEL */}
            <label
              htmlFor="role"
              className="text-sm font-medium text-[var(--primary-text)]"
            >
              Incharge Role
            </label>
            {/* ROLE INPUT CONTAINER */}
            <div className="relative">
              {/* BRIEFCASE ICON */}
              <Briefcase
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--light-text)]"
              />
              {/* ROLE INPUT */}
              <input
                required
                type="text"
                id="role"
                value={project.role}
                onChange={(e) =>
                  setProject({ ...project, role: e.target.value })
                }
                placeholder="Enter incharge role"
                className="w-full pl-10 pr-3 py-1.5 sm:py-2 text-sm sm:text-base placeholder:text-xs sm:placeholder:text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-none focus:ring-violet-500"
              />
            </div>
          </div>
        </div>
        {/* DUE DATE AND STATUS ROW */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
          {/* DUE DATE PICKER */}
          <div className="flex flex-col gap-1 w-full relative">
            {/* DUE DATE LABEL */}
            <label
              htmlFor="dueDate"
              className="text-sm font-medium text-[var(--primary-text)]"
            >
              Due Date <span className="text-red-500">*</span>
            </label>
            {/* DUE DATE BUTTON */}
            <button
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`w-full flex items-center justify-between cursor-pointer pl-10 pr-3 py-1.5 sm:py-2 border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] ${
                selected
                  ? "text-sm sm:text-base text-[var(--primary-text)]"
                  : "text-xs sm:text-sm text-[var(--light-text)]"
              } focus:ring-none focus:ring-violet-500 relative`}
              aria-label="Select due date"
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
                      day_selected:
                        "bg-[var(--accent-color)] text-white rounded-full",
                      nav_button:
                        "text-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] rounded p-1",
                      nav_button_next:
                        "text-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] rounded p-1",
                      nav_button_previous:
                        "text-[var(--accent-color)] hover:[var(--accent-btn-hover-color)] rounded p-1",
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
              className="text-sm font-medium text-[var(--primary-text)]"
            >
              Status <span className="text-red-500">*</span>
            </label>
            {/* STATUS BUTTON */}
            <button
              id="status"
              type="button"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className={`w-full flex items-center justify-between pl-10 pr-3 py-1.5 sm:py-2 border cursor-pointer border-[var(--border)] rounded-lg bg-[var(--cards-bg)] ${
                status
                  ? "text-sm sm:text-base text-[var(--primary-text)]"
                  : "text-xs sm:text-sm text-[var(--light-text)]"
              } focus:ring-none focus:ring-violet-500 relative`}
              aria-label="Select status"
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
              <div className="absolute z-20 top-16 right-0 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
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
            className="text-sm font-medium text-[var(--primary-text)]"
          >
            Priority <span className="text-red-500">*</span>
          </label>
          {/* PRIORITY BUTTON */}
          <button
            id="priority"
            type="button"
            onClick={() => setIsPriorityOpen(!isPriorityOpen)}
            className={`w-full flex items-center cursor-pointer justify-between pl-10 pr-3 py-1.5 sm:py-2 border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] ${
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
                  className="px-3 py-2 text-sm text-[var(--primary-text)] cursor-pointer hover:bg-[var(--hover-bg)]"
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
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] shadow cursor-pointer"
            onClick={handleButtonClick}
          >
            {project._id ? "Update Project" : "Add Project"}
          </button>
        </div>
      )}
    </>
  );
};

export default AddProjectModal;
