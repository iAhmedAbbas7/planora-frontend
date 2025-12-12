// <== IMPORTS ==>
import {
  ChevronDown,
  Folder,
  FileText,
  Circle,
  Calendar,
  Flag,
  Check,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  useCreateTask,
  useUpdateTask,
  Task as TaskType,
} from "../../hooks/useTasks";
import { toast } from "../../lib/toast";
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import type { Task } from "../../types/task";
import { useProjects } from "../../hooks/useProjects";
import {
  useEffect,
  useState,
  JSX,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import { DependencyManager, SubtaskManager } from "../dependencies";

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
  // CREATE TASK MUTATION
  const createTaskMutation = useCreateTask();
  // UPDATE TASK MUTATION
  const updateTaskMutation = useUpdateTask();
  // GET PROJECTS FROM HOOK
  const { projects: fetchedProjects } = useProjects();
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
  // PROJECT DROPDOWN REF
  const projectRef = useRef<HTMLDivElement>(null);
  // STATUS DROPDOWN REF
  const statusRef = useRef<HTMLDivElement>(null);
  // PRIORITY DROPDOWN REF
  const priorityRef = useRef<HTMLDivElement>(null);
  // HANDLE OUTSIDE CLICK FOR DROPDOWNS
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK PROJECT DROPDOWN
      if (
        projectRef.current &&
        !projectRef.current.contains(event.target as Node)
      ) {
        // SET PROJECT DROPDOWN OPEN TO FALSE
        setIsOpen(false);
      }
      // CHECK STATUS DROPDOWN
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        // SET STATUS DROPDOWN OPEN TO FALSE
        setIsStatusOpen(false);
      }
      // CHECK PRIORITY DROPDOWN
      if (
        priorityRef.current &&
        !priorityRef.current.contains(event.target as Node)
      ) {
        // SET PRIORITY DROPDOWN OPEN TO FALSE
        setIsPriorityOpen(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // CLEANUP: REMOVE EVENT LISTENER ON UNMOUNT
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // HELPER FUNCTION TO EXTRACT PROJECT ID FROM INITIAL TASK
  const extractProjectId = (projectIdValue: unknown): string => {
    // IF NO PROJECT ID, RETURN EMPTY STRING
    if (!projectIdValue) return "";
    // IF PROJECT ID IS A STRING, RETURN IT
    if (typeof projectIdValue === "string") return projectIdValue;
    // IF PROJECT ID IS AN OBJECT, RETURN THE _ID PROPERTY
    if (typeof projectIdValue === "object" && projectIdValue !== null) {
      // CAST THE PROJECT ID VALUE TO AN OBJECT WITH AN _ID PROPERTY
      const obj = projectIdValue as { _id?: string };
      // IF THE _ID PROPERTY EXISTS, RETURN IT
      if (obj._id) return obj._id;
    }
    // IF NO PROJECT ID, RETURN EMPTY STRING
    return "";
  };
  // TASK STATE
  const [task, setTask] = useState<Task>({
    _id: initialTask._id || "",
    title: initialTask.title || "",
    description: initialTask.description || "",
    dueDate: initialTask.dueDate || 0,
    status: initialTask.status || "to do",
    priority: initialTask.priority || "low",
    projectId: extractProjectId(initialTask.projectId),
    userId: initialTask.userId || "",
  });
  // FORMAT STATUS FOR DISPLAY FUNCTION
  const formatStatusForDisplay = (statusValue: string | null): string => {
    // IF NO STATUS, RETURN EMPTY STRING
    if (!statusValue) return "";
    // CONVERT TO LOWERCASE FOR COMPARISON
    const lowerStatus = statusValue.toLowerCase();
    // IF TO DO, RETURN "TO DO"
    if (lowerStatus === "to do") return "To Do";
    // IF IN PROGRESS, RETURN "IN PROGRESS"
    if (lowerStatus === "in progress") return "In Progress";
    // IF COMPLETED, RETURN "COMPLETED"
    if (lowerStatus === "completed") return "Completed";
    // RETURN ORIGINAL IF NO MATCH
    return statusValue;
  };
  // FORMAT PRIORITY FOR DISPLAY FUNCTION
  const formatPriorityForDisplay = (
    priorityValue: string | null | undefined
  ): string => {
    // IF NO PRIORITY, RETURN EMPTY STRING
    if (!priorityValue) return "";
    // CONVERT TO LOWERCASE FOR COMPARISON
    const lowerPriority = priorityValue.toLowerCase();
    // IF LOW, RETURN "Low"
    if (lowerPriority === "low") return "Low";
    // IF MEDIUM, RETURN "Medium"
    if (lowerPriority === "medium") return "Medium";
    // IF HIGH, RETURN "High"
    if (lowerPriority === "high") return "High";
    // RETURN CAPITALIZED VERSION
    return (
      priorityValue.charAt(0).toUpperCase() +
      priorityValue.slice(1).toLowerCase()
    );
  };
  // INITIALIZE FROM INITIAL TASK EFFECT
  useEffect(() => {
    // CHECK IF INITIAL TASK EXISTS
    if (initialTask) {
      // SET STATUS IF EXISTS
      if (initialTask.status) {
        // FORMAT STATUS FOR DISPLAY
        const formattedStatus = formatStatusForDisplay(initialTask.status);
        // SET STATUS
        setStatus(formattedStatus);
      }
      // SET PRIORITY IF EXISTS (FORMAT IT)
      if (initialTask.priority) {
        // FORMAT PRIORITY FOR DISPLAY
        const formattedPriority = formatPriorityForDisplay(
          initialTask.priority
        );
        // SET PRIORITY
        setPriority(formattedPriority);
      }
      // SET SELECTED DATE IF EXISTS
      if (initialTask.dueDate) setSelected(new Date(initialTask.dueDate));
      // SET PROJECT IF EXISTS AND PROJECTS ARE LOADED
      const initialProjectId = extractProjectId(initialTask.projectId);
      // GET THE EFFECTIVE PROJECT ID (USE PROVIDED PROJECT ID OR GET FROM INITIAL TASK)
      const effectiveProjectId = projectId || initialProjectId;
      // CHECK IF THE EFFECTIVE PROJECT ID EXISTS AND PROJECTS ARE LOADED
      if (effectiveProjectId && fetchedProjects && fetchedProjects.length > 0) {
        // FIND PROJECT BY ID
        const project = fetchedProjects.find(
          (p) => p._id === effectiveProjectId
        );
        // IF PROJECT EXISTS, SET IT AS SELECTED
        if (project) {
          // SET PROJECT SELECTED
          setProjectSelected(project.title || "");
          // UPDATE TASK STATE WITH THE PROJECT ID
          setTask((prev) => ({
            ...prev,
            projectId: project._id,
          }));
        }
      }
    } else {
      // RESET PROJECT SELECTION FOR NEW TASK
      if (!projectId) {
        setProjectSelected("Select Project");
      }
    }
  }, [initialTask, fetchedProjects, projectId]);
  // FETCH PROJECTS EFFECT
  useEffect(() => {
    // UPDATE PROJECTS FROM API
    if (fetchedProjects && fetchedProjects.length > 0) {
      // MAP FETCHED PROJECTS TO PROJECTS STATE
      setProjects(
        fetchedProjects.map((p) => ({
          _id: p._id,
          title: p.title || "",
        }))
      );
      // USE PROVIDED PROJECT ID OR GET FROM INITIAL TASK
      const initialProjectId = extractProjectId(initialTask?.projectId);
      // GET THE EFFECTIVE PROJECT ID (USE PROVIDED PROJECT ID OR GET FROM INITIAL TASK)
      const effectiveProjectId = projectId || initialProjectId;
      // IF PROJECT ID IS PROVIDED, SET IT AS SELECTED
      if (effectiveProjectId) {
        // FIND PROJECT BY ID
        const project = fetchedProjects.find(
          (p) => p._id === effectiveProjectId
        );
        // IF PROJECT EXISTS, SET IT AS SELECTED
        if (project) {
          // SET PROJECT SELECTED
          setProjectSelected(project.title || "");
          // UPDATE TASK STATE
          setTask((prev) => ({
            ...prev,
            projectId: project._id,
          }));
        }
      }
    } else {
      // SET EMPTY PROJECTS IF NO DATA
      setProjects([]);
    }
  }, [fetchedProjects, projectId, initialTask]);
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
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // CHECK IF STATUS IS SELECTED
    if (!status) {
      toast.error("Please select a status.");
      return;
    }
    // CHECK IF DATE IS SELECTED
    if (!selected) {
      toast.error("Please select a due date.");
      return;
    }
    // CHECK IF PROJECT IS SELECTED
    const finalProjectId = projectId || task.projectId;
    if (!finalProjectId || projectSelected === "Select Project") {
      toast.error("Please select a project.");
      return;
    }
    // PREPARE TASK DATA FOR API
    const taskData = {
      title: task.title,
      description: task.description || "",
      status: (status?.toLowerCase() || "to do").replace(
        "inprogress",
        "in progress"
      ),
      priority: priority?.toLowerCase() || "medium",
      dueDate: selected ? selected.toISOString() : null,
      projectId: finalProjectId,
    };
    // CHECK IF EDITING
    if (task._id) {
      // UPDATE TASK
      updateTaskMutation.mutate(
        {
          taskId: task._id,
          taskData,
        },
        {
          // <== ON SUCCESS ==>
          onSuccess: (updatedTask: TaskType) => {
            // CALL ON TASK ADDED CALLBACK
            onTaskAdded?.(updatedTask as Task);
            // RESET FORM
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
            // CLOSE MODAL
            onClose?.();
          },
        }
      );
    } else {
      // CREATE TASK
      createTaskMutation.mutate(taskData, {
        // <== ON SUCCESS ==>
        onSuccess: (createdTask: TaskType) => {
          // CALL ON TASK ADDED CALLBACK
          onTaskAdded?.(createdTask as Task);
          // RESET FORM
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
          // CLOSE MODAL
          onClose?.();
        },
      });
    }
  };
  // RETURNING THE ADD NEW TASK COMPONENT
  return (
    <>
      {/* FORM CONTAINER */}
      <form
        id="task-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full p-4"
      >
        {/* PROJECT FIELD */}
        <div className="flex flex-col gap-1.5 relative" ref={projectRef}>
          {/* PROJECT LABEL */}
          <label
            htmlFor="project"
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            Project <span className="text-red-500">*</span>
          </label>
          {/* PROJECT DROPDOWN CONTAINER */}
          <div className="relative">
            {/* PROJECT BUTTON */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                setIsStatusOpen(false);
                setIsPriorityOpen(false);
              }}
              className={`flex justify-between items-center w-full border pl-10 pr-3 py-2 text-sm rounded-lg cursor-pointer bg-transparent transition relative text-[var(--text-primary)] ${
                isOpen
                  ? "border-[var(--accent-color)]"
                  : "border-[var(--border)] hover:border-[var(--accent-color)]"
              }`}
            >
              {/* FOLDER ICON */}
              <Folder
                size={18}
                className="absolute left-3 text-[var(--light-text)]"
              />
              {/* PROJECT SELECTED TEXT */}
              <span
                className={
                  projectSelected === "Select Project"
                    ? "text-[var(--light-text)]"
                    : ""
                }
              >
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
              <div className="absolute z-20 top-full left-0 mt-1 w-full max-h-48 overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
                {/* CHECK IF PROJECTS EXIST */}
                {projects.length > 0 ? (
                  // MAPPING THROUGH PROJECTS
                  projects.map((project) => (
                    // PROJECT ITEM
                    <button
                      key={project._id}
                      type="button"
                      onClick={() => {
                        setProjectSelected(project.title);
                        setTask((prev) => ({
                          ...prev,
                          projectId: project._id,
                        }));
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                        projectSelected === project.title
                          ? "text-[var(--accent-color)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      <Folder
                        size={14}
                        className={
                          projectSelected === project.title
                            ? "text-[var(--accent-color)]"
                            : "text-[var(--light-text)]"
                        }
                      />
                      <span className="flex-1 text-left">{project.title}</span>
                      {projectSelected === project.title && (
                        <Check
                          size={14}
                          className="text-[var(--accent-color)]"
                        />
                      )}
                    </button>
                  ))
                ) : (
                  // EMPTY STATE
                  <div className="px-3 py-2 text-sm text-[var(--light-text)]">
                    No projects found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* TITLE FIELD */}
        <div className="flex flex-col gap-1.5">
          {/* TITLE LABEL */}
          <label
            htmlFor="title"
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            Title <span className="text-red-500">*</span>
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
              className="w-full pl-10 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
            />
          </div>
        </div>
        {/* DESCRIPTION FIELD */}
        <div className="flex flex-col gap-1.5">
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
              className="w-full pl-10 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:border-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
              rows={2}
            ></textarea>
          </div>
        </div>
        {/* DUE DATE AND STATUS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* DUE DATE PICKER */}
          <div className="flex flex-col gap-1.5">
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
              className={`w-full flex items-center justify-between pl-10 pr-3 py-2 border cursor-pointer rounded-lg bg-transparent transition relative ${
                isCalendarOpen
                  ? "border-[var(--accent-color)]"
                  : "border-[var(--border)] hover:border-[var(--accent-color)]"
              } ${
                selected
                  ? "text-sm text-[var(--text-primary)]"
                  : "text-sm text-[var(--light-text)]"
              }`}
            >
              {/* CALENDAR ICON */}
              <Calendar
                size={18}
                className="absolute left-3 text-[var(--light-text)]"
              />
              {selected ? formatDate(selected) : "Select a date"}
              {/* CHEVRON DOWN ICON */}
              <ChevronDown
                size={16}
                className={`text-[var(--light-text)] transition ${
                  isCalendarOpen ? "rotate-180" : ""
                }`}
              />
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
          {/* STATUS DROPDOWN */}
          <div className="flex flex-col gap-1.5 relative" ref={statusRef}>
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
                setIsStatusOpen(!isStatusOpen);
                setIsOpen(false);
                setIsPriorityOpen(false);
              }}
              className={`w-full flex items-center justify-between pl-10 pr-3 py-2 border rounded-lg bg-transparent transition cursor-pointer relative ${
                isStatusOpen
                  ? "border-[var(--accent-color)]"
                  : "border-[var(--border)] hover:border-[var(--accent-color)]"
              } ${
                status
                  ? "text-sm text-[var(--text-primary)]"
                  : "text-sm text-[var(--light-text)]"
              }`}
            >
              {/* CIRCLE ICON */}
              <Circle
                size={18}
                className="absolute left-3 text-[var(--light-text)]"
              />
              {formatStatusForDisplay(status) || "Select status"}
              {/* CHEVRON DOWN ICON */}
              <ChevronDown
                size={16}
                className={`text-[var(--light-text)] transition ${
                  isStatusOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {/* STATUS DROPDOWN MENU */}
            {isStatusOpen && (
              <div className="absolute z-20 top-full left-0 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
                {/* MAPPING THROUGH STATUS OPTIONS */}
                {[
                  { value: "To Do", icon: Circle, color: "text-blue-500" },
                  {
                    value: "In Progress",
                    icon: Clock,
                    color: "text-yellow-500",
                  },
                  {
                    value: "Completed",
                    icon: CheckCircle2,
                    color: "text-green-500",
                  },
                ].map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setStatus(option.value);
                        setIsStatusOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                        status === option.value
                          ? "text-[var(--accent-color)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      <IconComponent
                        size={14}
                        className={
                          status === option.value
                            ? "text-[var(--accent-color)]"
                            : option.color
                        }
                      />
                      <span className="flex-1 text-left">{option.value}</span>
                      {status === option.value && (
                        <Check
                          size={14}
                          className="text-[var(--accent-color)]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* PRIORITY DROPDOWN */}
        <div className="flex flex-col gap-1.5 relative" ref={priorityRef}>
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
              setIsPriorityOpen(!isPriorityOpen);
              setIsOpen(false);
              setIsStatusOpen(false);
            }}
            className={`w-full flex items-center justify-between pl-10 pr-3 py-2 border rounded-lg bg-transparent transition cursor-pointer relative ${
              isPriorityOpen
                ? "border-[var(--accent-color)]"
                : "border-[var(--border)] hover:border-[var(--accent-color)]"
            } ${
              priority
                ? "text-sm text-[var(--text-primary)]"
                : "text-sm text-[var(--light-text)]"
            }`}
          >
            {/* FLAG ICON */}
            <Flag
              size={18}
              className="absolute left-3 text-[var(--light-text)]"
            />
            {formatPriorityForDisplay(priority) || "Select priority"}
            {/* CHEVRON DOWN ICON */}
            <ChevronDown
              size={16}
              className={`text-[var(--light-text)] transition ${
                isPriorityOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {/* PRIORITY DROPDOWN MENU */}
          {isPriorityOpen && (
            <div className="absolute z-20 top-full left-0 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
              {/* MAPPING THROUGH PRIORITY OPTIONS */}
              {[
                { value: "Low", icon: Flag, color: "text-green-500" },
                { value: "Medium", icon: Flag, color: "text-yellow-500" },
                { value: "High", icon: AlertCircle, color: "text-red-500" },
              ].map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setPriority(option.value);
                      setIsPriorityOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                      priority === option.value
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    <IconComponent
                      size={14}
                      className={
                        priority === option.value
                          ? "text-[var(--accent-color)]"
                          : option.color
                      }
                    />
                    <span className="flex-1 text-left">{option.value}</span>
                    {priority === option.value && (
                      <Check size={14} className="text-[var(--accent-color)]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {/* DEPENDENCY AND SUBTASK MANAGERS - ONLY SHOW WHEN EDITING */}
        {task._id && (
          <div className="flex flex-col gap-4 mt-4">
            {/* DEPENDENCY MANAGER */}
            <DependencyManager taskId={task._id} taskTitle={task.title} />
            {/* SUBTASK MANAGER */}
            <SubtaskManager
              taskId={task._id}
              projectId={task.projectId || projectId || undefined}
            />
          </div>
        )}
      </form>
      {/* BUTTONS CONTAINER - FIXED FOOTER */}
      {showButtons && (
        <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
          {/* CANCEL BUTTON */}
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] cursor-pointer transition"
            onClick={onClose}
          >
            Cancel
          </button>
          {/* SUBMIT BUTTON */}
          <button
            type="button"
            disabled={
              createTaskMutation.isPending || updateTaskMutation.isPending
            }
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleButtonClick}
          >
            {createTaskMutation.isPending || updateTaskMutation.isPending
              ? task._id
                ? "Updating..."
                : "Creating..."
              : task._id
              ? "Update Task"
              : "Add Task"}
          </button>
        </div>
      )}
    </>
  );
};

export default AddNewTask;
