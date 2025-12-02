// <== IMPORTS ==>
import {
  MoreHorizontal,
  FolderPlus,
  User,
  Briefcase,
  Calendar,
  CheckSquare,
  TrendingUp,
  CircleDot,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  JSX,
  Dispatch,
  SetStateAction,
} from "react";
import ProjectDetails from "../projects/ProjectDetails";
import ActionDropdown from "../projects/dropdown/ActionDropdown";

// <== PROJECT TYPE INTERFACE ==>
type Project = {
  // <== PROJECT ID ==>
  _id: string;
  // <== PROJECT TITLE ==>
  title: string;
  // <== PROJECT STATUS ==>
  status?: string;
  // <== PROJECT DUE DATE ==>
  dueDate?: string;
  // <== PROJECT IN CHARGE NAME ==>
  inChargeName?: string;
  // <== PROJECT IS TRASHED ==>
  isTrashed?: boolean;
  // <== PROJECT ROLE ==>
  role?: string;
  // <== PROJECT COMPLETED TASKS ==>
  completedTasks?: number;
  // <== PROJECT TOTAL TASKS ==>
  totalTasks?: number;
  // <== PROJECT PROGRESS ==>
  progress?: number;
};
// <== CARDS MODE PROPS TYPE INTERFACE ==>
type CardsModeProps = {
  // <== CURRENT PROJECTS ==>
  currentProjects: Project[];
  // <== TOTAL PAGES ==>
  totalPages: number;
  currentPage: number;
  // <== SET CURRENT PAGE ==>
  setCurrentPage: Dispatch<SetStateAction<number>>;
  // <== ON DELETE PROJECT ==>
  onDeleteProject: (projectId: string) => void;
  // <== SET SELECTED PROJECT ID ==>
  setSelectedProjectId: Dispatch<SetStateAction<string | null>>;
  // <== SET EDIT PROJECT ==>
  setEditProject: Dispatch<SetStateAction<Project | null>>;
  // <== SET IS PROJECT MODAL OPEN ==>
  setIsProjectModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedProjectId: string | null;
  // <== EDIT PROJECT ==>
  editProject: Project | null;
  // <== HANDLE PROJECT ADDED ==>
  handleProjectAdded: (newProject: Project) => void;
  // <== ON OPEN ADD TASK ==>
  onOpenAddTask: (projectId: string) => void;
  // <== SEARCH TERM ==>
  searchTerm: string;
  // <== HAS PROJECTS ==>
  hasProjects: boolean;
};

// <== CARDS MODE PROJECTS COMPONENT ==>
const CardsModeProjects = ({
  currentProjects,
  totalPages,
  currentPage,
  setCurrentPage,
  onDeleteProject,
  setSelectedProjectId,
  setEditProject,
  setIsProjectModalOpen,
  selectedProjectId,
  onOpenAddTask,
  searchTerm,
  hasProjects,
}: CardsModeProps): JSX.Element => {
  // DROPDOWN OPEN STATE
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // TOGGLE DROPDOWN FUNCTION
  const toggleDropdown = (id: string): void => {
    // TOGGLE DROPDOWN
    setIsDropdownOpen(isDropdownOpen === id ? null : id);
  };
  // HANDLE CLICK OUTSIDE EFFECT
  useEffect(() => {
    // HANDLE CLICK OUTSIDE FUNCTION
    const handleClickOutside = (e: MouseEvent): void => {
      // CHECK IF CLICK IS OUTSIDE DROPDOWN
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        // CLOSE DROPDOWN
        setIsDropdownOpen(null);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // HANDLE EDIT FUNCTION
  const handleEdit = (project: Project): void => {
    // SET EDIT PROJECT
    setEditProject(project);
    // OPEN PROJECT MODAL
    setIsProjectModalOpen(true);
    // CLOSE DROPDOWN
    setIsDropdownOpen(null);
  };
  // RETURNING THE CARDS MODE PROJECTS COMPONENT
  return (
    // CARDS MODE MAIN CONTAINER
    <div>
      {/* PROJECTS CARDS GRID */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CHECK IF NO PROJECTS OR NO SEARCH RESULTS */}
        {currentProjects.length === 0 && totalPages === 1 ? (
          // EMPTY STATE
          <div className="col-span-full flex flex-col items-center justify-center py-8 gap-3">
            {/* CHECK IF NO PROJECTS AT ALL OR SEARCH RETURNED NO RESULTS */}
            {!hasProjects ? (
              // NO PROJECTS CREATED STATE
              <>
                {/* EMPTY STATE ICON */}
                <FolderPlus
                  size={48}
                  className="text-[var(--light-text)] opacity-50"
                />
                {/* EMPTY STATE TITLE */}
                <p className="text-lg font-medium text-[var(--light-text)]">
                  No projects yet
                </p>
                {/* EMPTY STATE MESSAGE */}
                <p className="text-sm text-[var(--light-text)] text-center">
                  Start by adding a new project to see it here.
                </p>
              </>
            ) : searchTerm.trim() !== "" ? (
              // SEARCH RETURNED NO RESULTS STATE
              <>
                {/* SEARCH ICON */}
                <Search
                  size={48}
                  className="text-[var(--accent-color)] opacity-50"
                />
                {/* EMPTY STATE TITLE */}
                <p className="text-lg font-medium text-[var(--text-primary)]">
                  Your search does not match any projects
                </p>
                {/* EMPTY STATE MESSAGE */}
                <p className="text-sm text-[var(--light-text)] text-center">
                  Try adjusting your search terms or create a new project.
                </p>
              </>
            ) : null}
          </div>
        ) : (
          // MAPPING THROUGH PROJECTS
          currentProjects.map((item, index) => (
            // PROJECT CARD
            <div
              key={item._id || index}
              className={`flex flex-col gap-3 sm:gap-4 rounded-xl p-3 sm:p-4 shadow-sm transition ${
                index % 2 === 0
                  ? "bg-[var(--cards-bg)] border border-[var(--border)]"
                  : "bg-[var(--bg)] border border-[var(--border)]"
              }`}
            >
              {/* CARD HEADER */}
              <header className="flex justify-between items-start gap-2">
                {/* PROJECT TITLE BUTTON */}
                <button
                  className="font-semibold text-base sm:text-lg text-left cursor-pointer flex-1 text-[var(--accent-color)] hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedProjectId(item._id)}
                >
                  {item.title}
                </button>
                {/* DROPDOWN CONTAINER */}
                <div
                  className="relative flex-shrink-0"
                  onClick={() => toggleDropdown(item._id)}
                >
                  {/* DROPDOWN BUTTON */}
                  <button className="cursor-pointer text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                  {/* DROPDOWN MENU */}
                  {isDropdownOpen == item._id && (
                    <div
                      className="absolute top-4 z-50 bg-[var(--bg)] right-0 shadow-lg rounded-md border border-[var(--border)]"
                      ref={dropdownRef}
                    >
                      <ActionDropdown
                        onViewDetails={() => {
                          setSelectedProjectId(item._id);
                          setIsDropdownOpen(null);
                        }}
                        onEditProject={() => handleEdit(item)}
                        onAddTask={() => {
                          onOpenAddTask(item._id);
                          setIsDropdownOpen(null);
                        }}
                        onDeleteProject={() => {
                          onDeleteProject(item._id);
                          setIsDropdownOpen(null);
                        }}
                      />
                    </div>
                  )}
                </div>
              </header>
              {/* CARD INFO SECTION */}
              <section className="flex flex-col gap-3 text-sm">
                {/* STATUS INFO */}
                <div className="flex items-center gap-3">
                  {/* ICON */}
                  <CircleDot
                    size={16}
                    className="text-[var(--accent-color)] flex-shrink-0"
                  />
                  {/* CONTENT */}
                  <div className="flex items-center gap-3 flex-1 justify-between">
                    {/* STATUS LABEL */}
                    <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                      Status
                    </span>
                    {/* STATUS BADGE */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold relative">
                      <span
                        className="absolute inset-0 rounded-full"
                        style={{
                          backgroundColor: `var(--accent-color)`,
                          opacity: 0.15,
                        }}
                      ></span>
                      <span
                        className="relative"
                        style={{ color: `var(--accent-color)` }}
                      >
                        {item.status || "N/A"}
                      </span>
                    </span>
                  </div>
                </div>
                {/* INCHARGE INFO */}
                <div className="flex items-center gap-3">
                  {/* ICON */}
                  <User
                    size={16}
                    className="text-[var(--accent-color)] flex-shrink-0"
                  />
                  {/* CONTENT */}
                  <div className="flex items-center gap-3 flex-1 justify-between">
                    {/* INCHARGE LABEL */}
                    <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                      Incharge
                    </span>
                    {/* INCHARGE VALUE */}
                    <p className="font-medium text-[var(--text-primary)] text-xs text-right truncate flex-1">
                      {item.inChargeName || "N/A"}
                    </p>
                  </div>
                </div>
                {/* ROLE INFO */}
                <div className="flex items-center gap-3">
                  {/* ICON */}
                  <Briefcase
                    size={16}
                    className="text-[var(--accent-color)] flex-shrink-0"
                  />
                  {/* CONTENT */}
                  <div className="flex items-center gap-3 flex-1 justify-between">
                    {/* ROLE LABEL */}
                    <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                      Role
                    </span>
                    {/* ROLE VALUE */}
                    <p className="font-medium text-[var(--text-primary)] text-xs text-right truncate flex-1">
                      {item.role || "N/A"}
                    </p>
                  </div>
                </div>
                {/* TASKS INFO */}
                <div className="flex items-center gap-3">
                  {/* ICON */}
                  <CheckSquare
                    size={16}
                    className="text-[var(--accent-color)] flex-shrink-0"
                  />
                  {/* CONTENT */}
                  <div className="flex items-center gap-3 flex-1 justify-between">
                    {/* TASKS LABEL */}
                    <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                      Tasks
                    </span>
                    {/* TASKS VALUE */}
                    <p className="font-medium text-[var(--text-primary)] text-xs text-right">
                      {item.completedTasks || 0}/{item.totalTasks || 0}
                    </p>
                  </div>
                </div>
                {/* DEADLINE INFO */}
                <div className="flex items-center gap-3">
                  {/* ICON */}
                  <Calendar
                    size={16}
                    className="text-[var(--accent-color)] flex-shrink-0"
                  />
                  {/* CONTENT */}
                  <div className="flex items-center gap-3 flex-1 justify-between">
                    {/* DEADLINE LABEL */}
                    <span className="font-medium text-[var(--light-text)] text-xs min-w-[60px] sm:min-w-[70px]">
                      Deadline
                    </span>
                    {/* DEADLINE VALUE */}
                    <p className="font-medium text-[var(--text-primary)] text-xs text-right truncate flex-1">
                      {item.dueDate
                        ? new Date(item.dueDate).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </section>
              {/* PROGRESS SECTION */}
              <div className="mt-1">
                {/* PROGRESS HEADER */}
                <div className="flex justify-between items-center text-sm mb-2">
                  {/* PROGRESS LABEL WITH ICON */}
                  <div className="flex items-center gap-1.5">
                    <TrendingUp
                      size={14}
                      className="text-[var(--accent-color)]"
                    />
                    <p className="text-[var(--light-text)]">Progress</p>
                  </div>
                  {/* PROGRESS PERCENTAGE */}
                  <p className="font-semibold text-[var(--text-primary)]">
                    {item.totalTasks && item.totalTasks > 0
                      ? Math.round(
                          ((item.completedTasks || 0) / item.totalTasks) * 100
                        )
                      : 0}
                    %
                  </p>
                </div>
                {/* PROGRESS BAR */}
                <div className="h-2 w-full bg-[var(--inside-card-bg)] rounded-full overflow-hidden">
                  {/* PROGRESS BAR FILL */}
                  <div
                    className="h-full bg-[var(--accent-color)] rounded-full transition-all"
                    style={{
                      width: `${
                        item.totalTasks && item.totalTasks > 0
                          ? Math.round(
                              ((item.completedTasks || 0) / item.totalTasks) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              {/* CARD FOOTER */}
              <footer className="flex flex-col sm:flex-row gap-2 mt-2">
                {/* VIEW DETAILS BUTTON */}
                <button
                  className="flex-1 border border-[var(--border)] rounded-md py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm hover:bg-[var(--accent-btn-hover-color)] cursor-pointer transition-colors text-[var(--accent-color)] font-medium hover:text-white flex items-center justify-center gap-1.5"
                  onClick={() => setSelectedProjectId(item._id)}
                >
                  <Eye size={14} className="sm:w-4 sm:h-4" />
                  <span>View Details</span>
                </button>
                {/* EDIT INFO BUTTON */}
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 border border-[var(--border)] rounded-md py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm hover:bg-[var(--accent-btn-hover-color)] cursor-pointer transition-colors text-[var(--accent-color)] font-medium hover:text-white flex items-center justify-center gap-1.5"
                >
                  <Edit size={14} className="sm:w-4 sm:h-4" />
                  <span>Edit Info</span>
                </button>
              </footer>
            </div>
          ))
        )}
      </main>
      {/* PROJECT DETAILS MODAL */}
      {selectedProjectId && (
        <ProjectDetails
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
      {/* PAGINATION */}
      <footer className="flex justify-between items-center mt-6 flex-wrap gap-2">
        {/* PREVIOUS BUTTON */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-[var(--border)] cursor-pointer rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover-bg)] transition-colors text-[var(--text-primary)]"
        >
          <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
        </button>
        {/* PAGE NUMBERS */}
        <div className="flex gap-1 sm:gap-1.5">
          {/* MAPPING THROUGH PAGES */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            // PAGE NUMBER BUTTON
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-[var(--border)] cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                num === currentPage
                  ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)]"
                  : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        {/* NEXT BUTTON */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-[var(--border)] cursor-pointer rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover-bg)] transition-colors text-[var(--text-primary)]"
        >
          <ChevronRight size={14} className="sm:w-4 sm:h-4" />
        </button>
      </footer>
    </div>
  );
};

export default CardsModeProjects;
