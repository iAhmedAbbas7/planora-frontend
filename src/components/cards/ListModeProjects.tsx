// <== IMPORTS ==>
import {
  FolderPlus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  CircleDot,
  Calendar,
  User,
  Settings,
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
};
// <== LIST MODE PROPS TYPE INTERFACE ==>
type ListModeProps = {
  // <== CURRENT PROJECTS ==>
  currentProjects: Project[];
  // <== TOTAL PAGES ==>
  totalPages: number;
  // <== CURRENT PAGE ==>
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
  // <== SEARCH TERM ==>
  searchTerm: string;
  // <== HAS PROJECTS ==>
  hasProjects: boolean;
};

// <== LIST MODE PROJECTS COMPONENT ==>
const ListModeProjects = ({
  currentProjects,
  totalPages,
  currentPage,
  setCurrentPage,
  onDeleteProject,
  setSelectedProjectId,
  setEditProject,
  setIsProjectModalOpen,
  selectedProjectId,
  searchTerm,
  hasProjects,
}: ListModeProps): JSX.Element => {
  // DROPDOWN OPEN STATE
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
  // MOBILE DROPDOWN OPEN STATE
  const [isSmScreenDropdownOpen, setIsSmScreenDropdownOpen] = useState<
    string | null
  >(null);
  // DROPDOWN POSITION STATE
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // MOBILE DROPDOWN REF
  const smDropdownRef = useRef<HTMLDivElement | null>(null);
  // TOGGLE DROPDOWN FUNCTION
  const toggleDropdown = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    // CHECK IF DROPDOWN IS ALREADY OPEN
    if (isDropdownOpen === id) {
      // CLOSE DROPDOWN
      setIsDropdownOpen(null);
    } else {
      // GET BUTTON POSITION
      const rect = event.currentTarget.getBoundingClientRect();
      // GET DROPDOWN WIDTH
      const dropdownWidth = 164;
      // CALCULATE SPACE ON RIGHT
      const spaceRight = window.innerWidth - rect.right;
      // CALCULATE LEFT POSITION
      const left =
        spaceRight > dropdownWidth
          ? rect.right + window.scrollX
          : rect.left - dropdownWidth + window.scrollX;
      // SET DROPDOWN POSITION
      setDropdownPosition({
        top: rect.top + window.scrollY,
        left,
      });
      // OPEN DROPDOWN
      setIsDropdownOpen(id);
    }
  };
  // TOGGLE MOBILE DROPDOWN FUNCTION
  const toggleSmDropdown = (id: string): void => {
    // TOGGLE MOBILE DROPDOWN
    setIsSmScreenDropdownOpen(isSmScreenDropdownOpen === id ? null : id);
  };
  // HANDLE CLICK OUTSIDE EFFECT (DESKTOP)
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
  // HANDLE CLICK OUTSIDE EFFECT (MOBILE)
  useEffect(() => {
    // HANDLE CLICK OUTSIDE FUNCTION
    const handleClickOutside = (e: MouseEvent): void => {
      // CHECK IF CLICK IS OUTSIDE MOBILE DROPDOWN
      if (
        smDropdownRef.current &&
        !smDropdownRef.current.contains(e.target as Node)
      ) {
        // CLOSE MOBILE DROPDOWN
        setIsSmScreenDropdownOpen(null);
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
    // CLOSE DESKTOP DROPDOWN
    setIsDropdownOpen(null);
    // CLOSE MOBILE DROPDOWN
    setIsSmScreenDropdownOpen(null);
  };
  // RETURNING THE LIST MODE PROJECTS COMPONENT
  return (
    // LIST MODE MAIN CONTAINER
    <div className="w-full">
      {/* CHECK IF NO PROJECTS */}
      {currentProjects.length === 0 && totalPages === 1 ? (
        // EMPTY STATE
        <div className="flex flex-col items-center justify-center py-8 gap-3">
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
        // PROJECTS LIST
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            {/* TABLE */}
            <table className="w-full border-collapse">
              {/* TABLE HEADER */}
              <thead>
                <tr className="text-left text-sm text-[var(--light-text)] border-b border-[var(--border)]">
                  {/* PROJECT COLUMN HEADER - ALWAYS VISIBLE */}
                  <th className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      {/* FILE TEXT ICON */}
                      <FileText
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <span className="font-medium">Project</span>
                    </div>
                  </th>
                  {/* STATUS COLUMN HEADER - ALWAYS VISIBLE */}
                  <th className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      {/* CIRCLE DOT ICON */}
                      <CircleDot
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <span className="font-medium">Status</span>
                    </div>
                  </th>
                  {/* DUE DATE COLUMN HEADER - HIDDEN ON SMALL, VISIBLE FROM LG */}
                  <th className="py-2.5 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      {/* CALENDAR ICON */}
                      <Calendar
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <span className="font-medium">Due Date</span>
                    </div>
                  </th>
                  {/* IN CHARGE COLUMN HEADER - HIDDEN ON SMALL, VISIBLE FROM LG */}
                  <th className="py-2.5 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      {/* USER ICON */}
                      <User size={16} className="text-[var(--accent-color)]" />
                      <span className="font-medium">In Charge</span>
                    </div>
                  </th>
                  {/* ACTION COLUMN HEADER - ALWAYS VISIBLE */}
                  <th className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      {/* SETTINGS ICON */}
                      <Settings
                        size={16}
                        className="text-[var(--accent-color)]"
                      />
                      <span className="font-medium">Action</span>
                    </div>
                  </th>
                </tr>
              </thead>
              {/* TABLE BODY */}
              <tbody>
                {/* MAPPING THROUGH PROJECTS */}
                {currentProjects.map((project) => (
                  // TABLE ROW
                  <tr
                    key={project._id}
                    onClick={() => setSelectedProjectId(project._id)}
                    className="text-sm text-[var(--text-primary)] border-b border-[var(--border)] transition-colors duration-150 hover:bg-[var(--hover-bg)] cursor-pointer"
                  >
                    {/* PROJECT NAME CELL - ALWAYS VISIBLE */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-[var(--accent-color)] text-left">
                        {project.title}
                      </span>
                    </td>
                    {/* STATUS CELL - ALWAYS VISIBLE */}
                    <td className="py-3 px-4">
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
                          {project.status || "N/A"}
                        </span>
                      </span>
                    </td>
                    {/* DUE DATE CELL - HIDDEN ON SMALL, VISIBLE FROM LG */}
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-[var(--light-text)]">
                        {project.dueDate
                          ? new Date(project.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </span>
                    </td>
                    {/* IN CHARGE CELL - HIDDEN ON SMALL, VISIBLE FROM LG */}
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-[var(--light-text)]">
                        {project.inChargeName || "N/A"}
                      </span>
                    </td>
                    {/* ACTION CELL - ALWAYS VISIBLE */}
                    <td
                      className="py-3 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* ACTION DROPDOWN CONTAINER */}
                      <div className="relative">
                        {/* DROPDOWN BUTTON */}
                        <button
                          className="cursor-pointer flex items-center justify-center"
                          onClick={(e) => toggleDropdown(project._id, e)}
                        >
                          <MoreHorizontal
                            size={24}
                            className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition-colors"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* DESKTOP DROPDOWN MENU */}
            {isDropdownOpen && dropdownPosition && (
              <div
                className="fixed z-[999] bg-[var(--bg)] shadow-lg rounded-md border border-[var(--border)]"
                style={{
                  top: dropdownPosition.top + 30,
                  left: dropdownPosition.left,
                }}
                ref={dropdownRef}
              >
                <ActionDropdown
                  onViewDetails={() => {
                    setSelectedProjectId(isDropdownOpen);
                    setIsDropdownOpen(null);
                  }}
                  onEditProject={() => {
                    const project = currentProjects.find(
                      (p) => p._id === isDropdownOpen
                    );
                    if (project) handleEdit(project);
                  }}
                  onAddTask={() => {
                    console.log("TODO: open Add Task modal");
                    setIsDropdownOpen(null);
                  }}
                  onDeleteProject={() => {
                    onDeleteProject(isDropdownOpen);
                    setIsDropdownOpen(null);
                  }}
                />
              </div>
            )}
          </div>
          {/* MOBILE VERTICAL LAYOUT */}
          <div className="md:hidden mt-4 space-y-3">
            {/* MAPPING THROUGH PROJECTS */}
            {currentProjects.map((project) => (
              // MOBILE PROJECT CARD
              <div
                key={project._id}
                className="border border-[var(--border)] rounded-lg p-4 bg-[var(--cards-bg)] shadow-sm"
              >
                {/* PROJECT TITLE SECTION */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border)]">
                  {/* PROJECT TITLE WITH ICON */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText
                      size={16}
                      className="text-[var(--accent-color)] flex-shrink-0"
                    />
                    <button
                      onClick={() => setSelectedProjectId(project._id)}
                      className="font-semibold text-[var(--accent-color)] hover:opacity-80 transition-opacity text-left truncate"
                    >
                      {project.title}
                    </button>
                  </div>
                  {/* ACTION DROPDOWN */}
                  <div className="relative flex-shrink-0">
                    {/* DROPDOWN BUTTON */}
                    <button onClick={() => toggleSmDropdown(project._id)}>
                      <MoreHorizontal
                        size={18}
                        className="text-[var(--light-text)] hover:text-[var(--accent-color)] cursor-pointer transition-colors"
                      />
                    </button>
                    {/* MOBILE DROPDOWN MENU */}
                    {isSmScreenDropdownOpen == project._id && (
                      <div
                        className="absolute top-6 right-0 z-50 bg-[var(--bg)] shadow-lg rounded-md border border-[var(--border)]"
                        ref={smDropdownRef}
                      >
                        <ActionDropdown
                          onViewDetails={() => {
                            setSelectedProjectId(project._id);
                            setIsSmScreenDropdownOpen(null);
                          }}
                          onEditProject={() => handleEdit(project)}
                          onAddTask={() => {
                            console.log("TODO: open Add Task modal");
                            setIsSmScreenDropdownOpen(null);
                          }}
                          onDeleteProject={() => {
                            onDeleteProject(project._id);
                            setIsSmScreenDropdownOpen(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* PROJECT DETAILS SECTION */}
                <div className="space-y-2.5">
                  {/* STATUS */}
                  <div className="flex items-center gap-2">
                    <CircleDot
                      size={14}
                      className="text-[var(--accent-color)] flex-shrink-0"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-medium text-[var(--light-text)] min-w-[60px]">
                        Status
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold relative">
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
                          {project.status || "N/A"}
                        </span>
                      </span>
                    </div>
                  </div>
                  {/* DUE DATE */}
                  <div className="flex items-center gap-2">
                    <Calendar
                      size={14}
                      className="text-[var(--accent-color)] flex-shrink-0"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-medium text-[var(--light-text)] min-w-[60px]">
                        Due Date
                      </span>
                      <span className="text-xs text-[var(--text-primary)]">
                        {project.dueDate
                          ? new Date(project.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  {/* IN CHARGE */}
                  <div className="flex items-center gap-2">
                    <User
                      size={14}
                      className="text-[var(--accent-color)] flex-shrink-0"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-medium text-[var(--light-text)] min-w-[60px]">
                        In Charge
                      </span>
                      <span className="text-xs text-[var(--text-primary)] truncate">
                        {project.inChargeName || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* PROJECT DETAILS MODAL */}
      <ProjectDetails
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />
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
        {currentProjects.length > 0 && (
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
        )}
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

export default ListModeProjects;
