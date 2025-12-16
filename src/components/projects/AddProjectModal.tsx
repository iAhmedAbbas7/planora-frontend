// <== IMPORTS ==>
import {
  ChevronDown,
  FileText,
  User,
  Briefcase,
  Circle,
  Calendar,
  Flag,
  Sparkles,
  Check,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ListTodo,
  Globe,
  Smartphone,
  Server,
  Cloud,
  BarChart2,
  Palette,
  Megaphone,
  Folder,
  ChevronRight,
  FolderKanban,
  X,
  Layers,
} from "lucide-react";
import {
  useCreateProject,
  useUpdateProject,
  Project as ProjectType,
} from "../../hooks/useProjects";
import {
  useProjectTemplates,
  useCreateProjectFromTemplate,
  ProjectTemplate,
  TEMPLATE_CATEGORIES,
} from "../../hooks/useProjectTemplates";
import { toast } from "@/lib/toast";
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { useState, useEffect, JSX, FormEvent, useRef, useMemo } from "react";

// <== PROJECT TYPE INTERFACE ==>
type Project = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== IN CHARGE NAME ==>
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
  // <== ON CLOSE ==>
  onClose?: () => void;
  // <== ON PROJECT ADDED ==>
  onProjectAdded?: (project: Project) => void;
  // <== INITIAL PROJECT ==>
  initialProject?: Partial<Project>;
  // <== SHOW BUTTONS ==>
  showButtons?: boolean;
};

// <== VIEW TYPE ==>
type ViewType = "form" | "templates" | "template-detail";

// <== CATEGORY ICON MAP ==>
const getCategoryIcon = (category: string, size: number = 16): JSX.Element => {
  // GET CATEGORY ICON FUNCTION ICON MAP
  const iconMap: Record<string, JSX.Element> = {
    // WEB DEVELOPMENT ICON
    "Web Development": <Globe size={size} />,
    // MOBILE DEVELOPMENT ICON
    "Mobile Development": <Smartphone size={size} />,
    // BACKEND DEVELOPMENT ICON
    "Backend Development": <Server size={size} />,
    // DEVOPS ICON
    DevOps: <Cloud size={size} />,
    // DATA SCIENCE ICON
    "Data Science": <BarChart2 size={size} />,
    // DESIGN ICON
    Design: <Palette size={size} />,
    // MARKETING ICON
    Marketing: <Megaphone size={size} />,
    // BUSINESS ICON
    Business: <Briefcase size={size} />,
    // PERSONAL ICON
    Personal: <User size={size} />,
    // OTHER ICON
    Other: <Folder size={size} />,
  };
  // RETURN ICON MAP
  return iconMap[category] || <Folder size={size} />;
};

// <== GET CATEGORY COLOR FUNCTION ==>
const getCategoryColor = (category: string): string => {
  // GET CATEGORY COLOR FUNCTION COLOR MAP
  const colorMap: Record<string, string> = {
    // WEB DEVELOPMENT COLOR
    "Web Development": "#3b82f6",
    // MOBILE DEVELOPMENT COLOR
    "Mobile Development": "#a855f7",
    // BACKEND DEVELOPMENT COLOR
    "Backend Development": "#f97316",
    // DEVOPS COLOR
    DevOps: "#06b6d4",
    // DATA SCIENCE COLOR
    "Data Science": "#10b981",
    // DESIGN COLOR
    Design: "#ec4899",
    // MARKETING COLOR
    Marketing: "#ef4444",
    // BUSINESS COLOR
    Business: "#f59e0b",
    // PERSONAL COLOR
    Personal: "#6366f1",
    // OTHER COLOR
    Other: "#6b7280",
  };
  // RETURN COLOR MAP
  return colorMap[category] || "#6b7280";
};

// <== TEMPLATE CARD SKELETON ==>
const TemplateCardSkeleton = (): JSX.Element => (
  <div className="w-full flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--cards-bg)] animate-pulse">
    {/* ICON BOX SHADOW */}
    <div className="w-10 h-10 rounded-xl bg-[var(--hover-bg)] flex-shrink-0" />
    {/* INFO SECTION SHADOW */}
    <div className="flex-1 min-w-0">
      {/* TITLE SHADOW */}
      <div className="h-[14px] w-2/3 bg-[var(--hover-bg)] rounded mb-1.5" />
      {/* DESCRIPTION SHADOW - 2 lines */}
      <div className="h-[12px] w-full bg-[var(--hover-bg)] rounded mb-1" />
      <div className="h-[12px] w-3/4 bg-[var(--hover-bg)] rounded" />
      {/* STATS ROW SHADOW */}
      <div className="flex items-center gap-3 mt-2">
        {/* TASK COUNT SHADOW */}
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[var(--hover-bg)]" />
          <div className="h-[11px] w-12 bg-[var(--hover-bg)] rounded" />
        </div>
        {/* DURATION SHADOW */}
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[var(--hover-bg)]" />
          <div className="h-[11px] w-14 bg-[var(--hover-bg)] rounded" />
        </div>
      </div>
    </div>
    {/* ARROW SHADOW */}
    <div className="w-4 h-4 rounded bg-[var(--hover-bg)] flex-shrink-0" />
  </div>
);

// <== ADD PROJECT MODAL COMPONENT ==>
const AddProjectModal = ({
  onClose,
  onProjectAdded,
  initialProject = {},
  showButtons = true,
}: Props): JSX.Element => {
  // VIEW STATE
  const [currentView, setCurrentView] = useState<ViewType>("form");
  // SELECTED CATEGORY FOR TEMPLATES
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  // PREVIEW TEMPLATE STATE
  const [previewTemplate, setPreviewTemplate] =
    useState<ProjectTemplate | null>(null);
  // MORE CATEGORIES DROPDOWN STATE
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  // MORE CATEGORIES REF
  const moreCategoriesRef = useRef<HTMLDivElement>(null);
  // CREATE PROJECT MUTATION
  const createProjectMutation = useCreateProject();
  // UPDATE PROJECT MUTATION
  const updateProjectMutation = useUpdateProject();
  // CREATE FROM TEMPLATE MUTATION
  const createFromTemplateMutation = useCreateProjectFromTemplate();
  // FETCH TEMPLATES
  const { data: templates, isLoading: isLoadingTemplates } =
    useProjectTemplates(
      selectedCategory === "all" ? undefined : selectedCategory
    );
  // SELECTED TEMPLATE STATE
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate | null>(null);
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
  // STATUS DROPDOWN REF
  const statusRef = useRef<HTMLDivElement>(null);
  // PRIORITY DROPDOWN REF
  const priorityRef = useRef<HTMLDivElement>(null);
  // VISIBLE CATEGORIES (FIRST 5)
  const visibleCategories = TEMPLATE_CATEGORIES.slice(0, 5);
  // MORE CATEGORIES
  const moreCategories = TEMPLATE_CATEGORIES.slice(5);
  // FILTERED TEMPLATES BY CATEGORY
  const filteredTemplates = useMemo(() => {
    // CHECK IF TEMPLATES ARE NOT AVAILABLE
    if (!templates) return [];
    // RETURN TEMPLATES
    return templates;
  }, [templates]);
  // HANDLE OUTSIDE CLICK FOR DROPDOWNS
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK IF STATUS DROPDOWN REF IS PROVIDED AND THE CLICK IS NOT INSIDE THE STATUS DROPDOWN
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        // SET STATUS DROPDOWN OPEN TO FALSE
        setIsStatusOpen(false);
      }
      // CHECK IF PRIORITY DROPDOWN REF IS PROVIDED AND THE CLICK IS NOT INSIDE THE PRIORITY DROPDOWN
      if (
        priorityRef.current &&
        !priorityRef.current.contains(event.target as Node)
      ) {
        // SET PRIORITY DROPDOWN OPEN TO FALSE
        setIsPriorityOpen(false);
      }
      // CHECK IF MORE CATEGORIES REF IS PROVIDED AND THE CLICK IS NOT INSIDE THE MORE CATEGORIES DROPDOWN
      if (
        moreCategoriesRef.current &&
        !moreCategoriesRef.current.contains(event.target as Node)
      ) {
        // SET MORE CATEGORIES DROPDOWN OPEN TO FALSE
        setIsMoreCategoriesOpen(false);
      }
    };
    // ADD EVENT LISTENER FOR CLICK OUTSIDE
    document.addEventListener("mousedown", handleClickOutside);
    // CLEANUP: REMOVE EVENT LISTENER ON UNMOUNT
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // FORMAT PRIORITY FOR DISPLAY FUNCTION
  const formatPriorityForDisplay = (
    priorityValue: string | null | undefined
  ): string => {
    // CHECK IF PRIORITY VALUE IS NOT AVAILABLE
    if (!priorityValue) return "";
    // GET LOWER PRIORITY
    const lowerPriority = priorityValue.toLowerCase();
    // CHECK IF LOWER PRIORITY IS LOW
    if (lowerPriority === "low") return "Low";
    // CHECK IF LOWER PRIORITY IS MEDIUM
    if (lowerPriority === "medium") return "Medium";
    // CHECK IF LOWER PRIORITY IS HIGH
    if (lowerPriority === "high") return "High";
    // RETURN PRIORITY VALUE
    return (
      priorityValue.charAt(0).toUpperCase() +
      priorityValue.slice(1).toLowerCase()
    );
  };
  // INITIALIZE FROM INITIAL PROJECT EFFECT
  useEffect(() => {
    // CHECK IF INITIAL PROJECT IS AVAILABLE
    if (initialProject) {
      // SET STATUS
      if (initialProject.status) setStatus(initialProject.status);
      // CHECK IF INITIAL PROJECT PRIORITY IS AVAILABLE
      if (initialProject.priority) {
        // FORMAT PRIORITY FOR DISPLAY
        const formattedPriority = formatPriorityForDisplay(
          initialProject.priority
        );
        // SET PRIORITY
        setPriority(formattedPriority);
      }
      // SET SELECTED DATE
      if (initialProject.dueDate) setSelected(new Date(initialProject.dueDate));
    }
  }, [initialProject]);
  // FORMAT DATE FUNCTION
  const formatDate = (date: Date): string => {
    // GET DATE
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
  // HANDLE TEMPLATE SELECT FUNCTION
  const handleTemplateSelect = (template: ProjectTemplate) => {
    // SET SELECTED TEMPLATE
    setSelectedTemplate(template);
    // SET PROJECT
    setProject((prev) => ({
      ...prev,
      description: template.description || prev.description,
    }));
    // SET CURRENT VIEW TO FORM
    setCurrentView("form");
    // SET PREVIEW TEMPLATE TO NULL
    setPreviewTemplate(null);
  };

  // HANDLE SUBMIT FUNCTION
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // CHECK IF STATUS IS NOT SELECTED
    if (!status) {
      // SHOW ERROR TOAST
      toast.error("Please select a status.");
      // RETURN
      return;
    }
    // CHECK IF SELECTED DATE IS NOT AVAILABLE
    if (!selected) {
      // SHOW ERROR TOAST
      toast.error("Please select a due date.");
      // RETURN
      return;
    }
    // CHECK IF PRIORITY IS NOT SELECTED
    if (!priority) {
      // SHOW ERROR TOAST
      toast.error("Please select priority.");
      // RETURN
      return;
    }
    // CHECK IF SELECTED TEMPLATE IS AVAILABLE AND PROJECT ID IS NOT AVAILABLE
    if (selectedTemplate && !project._id) {
      // CREATE FROM TEMPLATE MUTATION
      createFromTemplateMutation.mutate(
        {
          templateId: selectedTemplate._id,
          title: project.title,
          description: project.description || selectedTemplate.description,
          inChargeName: project.inChargeName,
          role: project.role,
          dueDate: selected ? selected.toISOString() : undefined,
          priority: (priority || "medium").toLowerCase(),
          createTasks: true,
        },
        {
          // ON SUCCESS
          onSuccess: (result) => {
            // CALL ON PROJECT ADDED CALLBACK
            onProjectAdded?.(result.project as Project);
            // RESET FORM
            resetForm();
            // CLOSE MODAL
            onClose?.();
          },
        }
      );
      return;
    }
    // PREPARE PROJECT DATA FOR API
    const projectData = {
      title: project.title,
      description: project.description || "",
      priority: (priority || "medium").toLowerCase(),
      inChargeName: project.inChargeName,
      role: project.role,
      status: status || "To Do",
      dueDate: selected ? selected.toISOString() : null,
    };
    // CHECK IF PROJECT ID IS AVAILABLE
    if (project._id) {
      // UPDATE PROJECT MUTATION
      updateProjectMutation.mutate(
        { projectId: project._id, projectData },
        {
          // ON SUCCESS
          onSuccess: (updatedProject: ProjectType) => {
            // CALL ON PROJECT ADDED CALLBACK
            onProjectAdded?.(updatedProject as Project);
            // RESET FORM
            resetForm();
            // CLOSE MODAL
            onClose?.();
          },
        }
      );
    } else {
      // CREATE PROJECT MUTATION
      createProjectMutation.mutate(projectData, {
        // ON SUCCESS
        onSuccess: (createdProject: ProjectType) => {
          // CALL ON PROJECT ADDED CALLBACK
          onProjectAdded?.(createdProject as Project);
          // RESET FORM
          resetForm();
          // CLOSE MODAL
          onClose?.();
        },
      });
    }
  };
  // RESET FORM FUNCTION
  const resetForm = () => {
    // SET PROJECT
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
    // SET SELECTED TEMPLATE TO NULL
    setSelectedTemplate(null);
    // SET CURRENT VIEW TO FORM
    setCurrentView("form");
    // SET PREVIEW TEMPLATE TO NULL
    setPreviewTemplate(null);
  };
  // CLOSE ALL DROPDOWNS FUNCTION
  const closeAllDropdowns = (): void => {
    // SET STATUS DROPDOWN OPEN TO FALSE
    setIsStatusOpen(false);
    // SET PRIORITY DROPDOWN OPEN TO FALSE
    setIsPriorityOpen(false);
    // SET CALENDAR OPEN TO FALSE
    setIsCalendarOpen(false);
    // SET MORE CATEGORIES DROPDOWN OPEN TO FALSE
    setIsMoreCategoriesOpen(false);
  };
  // GET HEADER CONFIG BASED ON VIEW
  const getHeaderConfig = () => {
    // CHECK IF CURRENT VIEW IS TEMPLATES
    if (currentView === "templates") {
      // RETURN TEMPLATES HEADER CONFIG
      return {
        icon: <Layers size={20} className="text-[var(--accent-color)]" />,
        title: "Choose a Template",
        subtitle: "Select a template to get started quickly",
        showBack: true,
        onBack: () => setCurrentView("form"),
      };
    }
    // CHECK IF CURRENT VIEW IS TEMPLATE DETAIL AND PREVIEW TEMPLATE IS AVAILABLE
    if (currentView === "template-detail" && previewTemplate) {
      // RETURN TEMPLATE DETAIL HEADER CONFIG
      return {
        icon: (
          <span style={{ color: getCategoryColor(previewTemplate.category) }}>
            {getCategoryIcon(previewTemplate.category, 20)}
          </span>
        ),
        title: previewTemplate.name,
        subtitle: previewTemplate.category,
        showBack: true,
        onBack: () => setCurrentView("templates"),
      };
    }
    // RETURN DEFAULT HEADER CONFIG
    return {
      icon: <FolderKanban size={20} className="text-[var(--accent-color)]" />,
      title: project._id ? "Edit Project" : "Create New Project",
      subtitle: project._id
        ? "Update project details"
        : "Add a new project to track",
      showBack: false,
      onBack: () => {},
    };
  };
  // GET HEADER CONFIG
  const headerConfig = getHeaderConfig();
  // RENDER TEMPLATES CONTENT FUNCTION
  const renderTemplatesContent = (): JSX.Element => (
    <>
      {/* CATEGORY BADGES */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-2">
          {visibleCategories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat.value
                  ? "bg-[var(--accent-color)] text-white"
                  : "bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
              }`}
            >
              {cat.value !== "all" && (
                <span
                  className={selectedCategory === cat.value ? "text-white" : ""}
                >
                  {getCategoryIcon(cat.value, 12)}
                </span>
              )}
              {cat.label}
            </button>
          ))}
          {/* MORE DROPDOWN */}
          {moreCategories.length > 0 && (
            <div className="relative" ref={moreCategoriesRef}>
              <button
                type="button"
                onClick={() => setIsMoreCategoriesOpen(!isMoreCategoriesOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  moreCategories.some((c) => c.value === selectedCategory)
                    ? "bg-[var(--accent-color)] text-white"
                    : "bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
                }`}
              >
                More
                <ChevronDown
                  size={12}
                  className={`transition ${
                    isMoreCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isMoreCategoriesOpen && (
                <div className="absolute z-20 top-full left-0 mt-1 w-48 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg py-1">
                  {moreCategories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setIsMoreCategoriesOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                        selectedCategory === cat.value
                          ? "text-[var(--accent-color)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      <span
                        style={{ color: getCategoryColor(cat.value) }}
                        className={
                          selectedCategory === cat.value
                            ? "text-[var(--accent-color)]"
                            : ""
                        }
                      >
                        {getCategoryIcon(cat.value, 14)}
                      </span>
                      <span className="flex-1 text-left">{cat.label}</span>
                      {selectedCategory === cat.value && (
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
          )}
        </div>
      </div>
      {/* TEMPLATES LIST */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingTemplates ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <TemplateCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--light-text) 10%, transparent)",
              }}
            >
              <FileText size={24} className="text-[var(--light-text)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
              No templates found
            </p>
            <p className="text-xs text-[var(--light-text)]">
              Try selecting a different category
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map((template) => {
              const categoryColor = getCategoryColor(template.category);
              return (
                <button
                  key={template._id}
                  type="button"
                  onClick={() => {
                    setPreviewTemplate(template);
                    setCurrentView("template-detail");
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--cards-bg)] hover:border-[var(--accent-color)]/50 hover:shadow-sm transition cursor-pointer text-left group"
                >
                  {/* ICON */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${categoryColor}15`,
                      color: categoryColor,
                    }}
                  >
                    {getCategoryIcon(template.category, 20)}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate mb-0.5">
                      {template.name}
                    </p>
                    <p className="text-xs text-[var(--light-text)] line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[11px] text-[var(--light-text)]">
                        <ListTodo size={12} />
                        {template.tasks?.length || 0} tasks
                      </span>
                      {template.estimatedDuration && (
                        <span className="flex items-center gap-1 text-[11px] text-[var(--light-text)]">
                          <Clock size={12} />
                          {template.estimatedDuration} days
                        </span>
                      )}
                    </div>
                  </div>
                  {/* ARROW */}
                  <ChevronRight
                    size={16}
                    className="text-[var(--light-text)] flex-shrink-0 group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
  // RENDER TEMPLATE DETAIL CONTENT FUNCTION
  const renderTemplateDetailContent = () => {
    // CHECK IF PREVIEW TEMPLATE IS NOT AVAILABLE
    if (!previewTemplate) return null;
    // RETURN TEMPLATE DETAIL CONTENT
    return (
      <div className="p-4">
        {/* DESCRIPTION */}
        <div className="mb-4">
          <h5 className="text-xs font-medium text-[var(--text-primary)] mb-2">
            Description
          </h5>
          <p className="text-sm text-[var(--light-text)] leading-relaxed">
            {previewTemplate.description || "No description available."}
          </p>
        </div>
        {/* STATS */}
        <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-[var(--hover-bg)]">
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-primary)]">
            <ListTodo size={16} className="text-[var(--accent-color)]" />
            <span className="font-medium">
              {previewTemplate.tasks?.length || 0}
            </span>
            <span className="text-[var(--light-text)]">tasks</span>
          </div>
          {previewTemplate.estimatedDuration && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--text-primary)]">
              <Clock size={16} className="text-[var(--accent-color)]" />
              <span className="font-medium">
                {previewTemplate.estimatedDuration}
              </span>
              <span className="text-[var(--light-text)]">days</span>
            </div>
          )}
        </div>
        {/* TASKS LIST */}
        <div>
          <h5 className="text-xs font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <ListTodo size={12} className="text-[var(--accent-color)]" />
            Tasks Included
          </h5>
          <div className="space-y-2">
            {previewTemplate.tasks?.map((task, index) => (
              <div
                key={task._id || index}
                className="p-3 rounded-lg bg-[var(--cards-bg)] border border-[var(--border)]"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-[var(--text-primary)] leading-tight">
                    {task.title}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-medium flex-shrink-0 uppercase ${
                      task.priority === "high"
                        ? "bg-red-500/10 text-red-500"
                        : task.priority === "low"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    <Flag size={8} />
                    {task.priority}
                  </span>
                </div>
                {task.phase && (
                  <span className="text-[10px] text-[var(--light-text)] bg-[var(--hover-bg)] px-1.5 py-0.5 rounded">
                    {task.phase}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  // RENDER FORM CONTENT
  const renderFormContent = () => (
    <form
      id="project-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full p-4"
    >
      {/* TEMPLATE SELECTION - ONLY SHOW WHEN CREATING NEW PROJECT */}
      {!project._id && (
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-[var(--text-primary)]">
            Start with a Template
          </label>
          {selectedTemplate ? (
            <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--accent-color)] bg-[var(--accent-color)]/5">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${getCategoryColor(
                      selectedTemplate.category
                    )}15`,
                    color: getCategoryColor(selectedTemplate.category),
                  }}
                >
                  {getCategoryIcon(selectedTemplate.category, 18)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {selectedTemplate.name}
                  </p>
                  <p className="text-xs text-[var(--light-text)]">
                    {selectedTemplate.tasks?.length || 0} tasks will be created
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="text-xs text-[var(--light-text)] hover:text-[var(--text-primary)] transition cursor-pointer px-2 py-1 rounded hover:bg-[var(--hover-bg)]"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentView("templates")}
              className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-[var(--border)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition text-sm text-[var(--light-text)] hover:text-[var(--accent-color)] cursor-pointer"
            >
              <Sparkles size={16} />
              Choose a template (optional)
            </button>
          )}
        </div>
      )}
      {/* TITLE FIELD */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="title"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Project Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FileText
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--light-text)]"
          />
          <input
            required
            type="text"
            id="title"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            placeholder="Enter project title"
            className="w-full pl-10 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
          />
        </div>
      </div>
      {/* DESCRIPTION FIELD */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Description
        </label>
        <div className="relative">
          <FileText
            size={18}
            className="absolute left-3 top-3 text-[var(--light-text)]"
          />
          <textarea
            id="description"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
            placeholder="Enter project details..."
            className="w-full pl-10 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:border-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
            rows={2}
          />
        </div>
      </div>
      {/* INCHARGE INFO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="incharge"
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            Incharge Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--light-text)]"
            />
            <input
              required
              type="text"
              id="incharge"
              value={project.inChargeName}
              onChange={(e) =>
                setProject({ ...project, inChargeName: e.target.value })
              }
              placeholder="Enter incharge name"
              className="w-full pl-10 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="role"
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            Incharge Role <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--light-text)]"
            />
            <input
              required
              type="text"
              id="role"
              value={project.role}
              onChange={(e) => setProject({ ...project, role: e.target.value })}
              placeholder="Enter incharge role"
              className="w-full pl-10 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
            />
          </div>
        </div>
      </div>
      {/* DUE DATE AND STATUS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* DUE DATE PICKER */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="dueDate"
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            Due Date <span className="text-red-500">*</span>
          </label>
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
            <Calendar
              size={18}
              className="absolute left-3 text-[var(--light-text)]"
            />
            {selected ? formatDate(selected) : "Select a date"}
            <ChevronDown
              size={16}
              className={`text-[var(--light-text)] transition ${
                isCalendarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
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
          <label
            htmlFor="status"
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            Status <span className="text-red-500">*</span>
          </label>
          <button
            id="status"
            type="button"
            onClick={() => {
              setIsStatusOpen(!isStatusOpen);
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
            <Circle
              size={18}
              className="absolute left-3 text-[var(--light-text)]"
            />
            {status || "Select status"}
            <ChevronDown
              size={16}
              className={`text-[var(--light-text)] transition ${
                isStatusOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isStatusOpen && (
            <div className="absolute z-20 top-full left-0 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
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
                      <Check size={14} className="text-[var(--accent-color)]" />
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
        <label
          htmlFor="priority"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Priority <span className="text-red-500">*</span>
        </label>
        <button
          id="priority"
          type="button"
          onClick={() => {
            setIsPriorityOpen(!isPriorityOpen);
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
          <Flag
            size={18}
            className="absolute left-3 text-[var(--light-text)]"
          />
          {priority || "Select priority"}
          <ChevronDown
            size={16}
            className={`text-[var(--light-text)] transition ${
              isPriorityOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isPriorityOpen && (
          <div className="absolute z-20 top-full left-0 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
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
    </form>
  );
  // RENDER FOOTER BASED ON VIEW FUNCTION
  const renderFooter = () => {
    // CHECK IF SHOW BUTTONS IS NOT AVAILABLE
    if (!showButtons) return null;
    // CHECK IF CURRENT VIEW IS TEMPLATES
    if (currentView === "templates") {
      // RETURN TEMPLATES FOOTER
      return (
        <div className="flex-shrink-0 flex justify-between items-center gap-2 p-4 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={() => {
              setSelectedTemplate(null);
              setCurrentView("form");
            }}
            className="text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition cursor-pointer"
          >
            Skip template
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] cursor-pointer transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      );
    }
    // CHECK IF CURRENT VIEW IS TEMPLATE DETAIL
    if (currentView === "template-detail") {
      // RETURN TEMPLATE DETAIL FOOTER
      return (
        <div className="flex-shrink-0 flex justify-end gap-2 p-4 border-t border-[var(--border)]">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] cursor-pointer transition"
            onClick={() => setCurrentView("templates")}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => handleTemplateSelect(previewTemplate!)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer transition flex items-center gap-2"
          >
            <Sparkles size={16} />
            Use Template
          </button>
        </div>
      );
    }
    // RETURN FORM VIEW FOOTER
    return (
      <div className="flex-shrink-0 flex justify-end gap-2 p-4 border-t border-[var(--border)]">
        <button
          type="button"
          className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] cursor-pointer transition"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={
            createProjectMutation.isPending ||
            updateProjectMutation.isPending ||
            createFromTemplateMutation.isPending
          }
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          onClick={handleButtonClick}
        >
          <Check size={16} />
          {createProjectMutation.isPending ||
          updateProjectMutation.isPending ||
          createFromTemplateMutation.isPending
            ? project._id
              ? "Updating..."
              : "Creating..."
            : project._id
            ? "Update Project"
            : selectedTemplate
            ? `Create with ${selectedTemplate.tasks?.length || 0} Tasks`
            : "Create Project"}
        </button>
      </div>
    );
  };
  // RETURN ADD PROJECT MODAL COMPONENT
  return (
    <>
      {/* HEADER - FIXED */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          {/* BACK BUTTON */}
          {headerConfig.showBack && (
            <button
              type="button"
              onClick={headerConfig.onBack}
              className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--text-primary)] transition cursor-pointer -ml-1"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          {/* ICON BADGE */}
          {!headerConfig.showBack && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              {headerConfig.icon}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {headerConfig.title}
            </h2>
            <p className="text-xs text-[var(--light-text)]">
              {headerConfig.subtitle}
            </p>
          </div>
        </div>
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>
      {/* CONTENT - SCROLLABLE */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {currentView === "form" && renderFormContent()}
        {currentView === "templates" && renderTemplatesContent()}
        {currentView === "template-detail" && renderTemplateDetailContent()}
      </div>
      {/* FOOTER - FIXED */}
      {renderFooter()}
    </>
  );
};

export default AddProjectModal;
