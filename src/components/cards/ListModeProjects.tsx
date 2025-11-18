// <== IMPORTS ==>
import {
  useState,
  useRef,
  useEffect,
  JSX,
  Dispatch,
  SetStateAction,
} from "react";
import { MoreHorizontal } from "lucide-react";
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
      setIsDropdownOpen(null);
    } else {
      // GET BUTTON POSITION
      const rect = event.currentTarget.getBoundingClientRect();
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
    // CLOSE DROPDOWNS
    setIsDropdownOpen(null);
    setIsSmScreenDropdownOpen(null);
  };
  // RETURNING THE LIST MODE PROJECTS COMPONENT
  return (
    // LIST MODE MAIN CONTAINER
    <div className="w-full">
      {/* CHECK IF NO PROJECTS */}
      {currentProjects.length === 0 && totalPages === 1 ? (
        // EMPTY STATE
        <div className="text-center text-[var(--light-text)]">
          {/* EMPTY STATE TITLE */}
          <p className="text-lg font-medium">No projects yet</p>
          {/* EMPTY STATE MESSAGE */}
          <p className="text-sm mt-2">
            Start by adding a new project to see it here.
          </p>
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
                <tr className="bg-[var(--inside-card-bg)] text-[var(--light-text)] text-left text-sm font-medium">
                  {/* PROJECT COLUMN HEADER */}
                  <th className="px-4 py-2">Project</th>
                  {/* STATUS COLUMN HEADER */}
                  <th className="px-4 py-2">Status</th>
                  {/* DUE DATE COLUMN HEADER */}
                  <th className="px-4 py-2">Due Date</th>
                  {/* IN CHARGE COLUMN HEADER */}
                  <th className="px-4 py-2">In Charge</th>
                  {/* ACTION COLUMN HEADER */}
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              {/* TABLE BODY */}
              <tbody>
                {/* MAPPING THROUGH PROJECTS */}
                {currentProjects.map((project, idx) => (
                  // TABLE ROW
                  <tr
                    key={project._id}
                    className={`border-b border-[var(--border)] ${
                      idx % 2 === 1 ? "bg-[var(--inside-card-bg)]" : ""
                    }`}
                  >
                    {/* PROJECT NAME CELL */}
                    <td className="py-2 px-4 font-medium text-left">
                      {/* PROJECT TITLE BUTTON */}
                      <button
                        onClick={() => setSelectedProjectId(project._id)}
                        className="hover:underline cursor-pointer text-[var(--accent-color)]"
                      >
                        {project.title}
                      </button>
                    </td>
                    {/* STATUS CELL */}
                    <td className="px-4 py-2">{project.status || "N/A"}</td>
                    {/* DUE DATE CELL */}
                    <td className="px-4 py-2">
                      {project.dueDate
                        ? new Date(project.dueDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
                    {/* IN CHARGE CELL */}
                    <td className="px-4 py-2">
                      {project.inChargeName || "N/A"}
                    </td>
                    {/* ACTION CELL */}
                    <td className="px-4 py-2 text-left">
                      {/* ACTION DROPDOWN CONTAINER */}
                      <div className="relative">
                        {/* DROPDOWN BUTTON */}
                        <button
                          className="cursor-pointer flex items-center justify-center"
                          onClick={(e) => toggleDropdown(project._id, e)}
                        >
                          <MoreHorizontal
                            size={18}
                            className="text-[var(--light-text)] hover:text-[var(--text-primary)]"
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
          {/* MOBILE 2-COLUMN LAYOUT */}
          <div className="md:hidden mt-4">
            {/* MAPPING THROUGH PROJECTS */}
            {currentProjects.map((project) => (
              // MOBILE PROJECT CARD
              <div
                key={project._id}
                className="grid grid-cols-2 gap-4 border border-b-0 border-[var(--border)] p-4 bg-[var(--bg)] shadow-sm"
              >
                {/* LEFT COLUMN - PROJECT NAME */}
                <div className="flex items-center border-r border-[var(--border)]">
                  {/* PROJECT TITLE BUTTON */}
                  <button
                    onClick={() => setSelectedProjectId(project._id)}
                    className="font-medium text-[var(--accent-color)] cursor-pointer hover:underline"
                  >
                    {project.title}
                  </button>
                </div>
                {/* RIGHT COLUMN - OTHER INFO */}
                <div className="space-y-1 text-sm text-[var(--light-text)]">
                  {/* STATUS */}
                  <p>
                    <span className="font-semibold">Status: </span>
                    {project.status || "N/A"}
                  </p>
                  {/* DUE DATE */}
                  <p>
                    <span className="font-semibold">Due: </span>
                    {project.dueDate
                      ? new Date(project.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                  {/* IN CHARGE */}
                  <p>
                    <span className="font-semibold">In Charge: </span>
                    {project.inChargeName || "N/A"}
                  </p>
                  {/* ACTION DROPDOWN */}
                  <div className="relative">
                    {/* DROPDOWN BUTTON */}
                    <button onClick={() => toggleSmDropdown(project._id)}>
                      <MoreHorizontal
                        size={18}
                        className="text-[var(--light-text)] cursor-pointer mt-1"
                      />
                    </button>
                    {/* MOBILE DROPDOWN MENU */}
                    {isSmScreenDropdownOpen == project._id && (
                      <div
                        className="absolute top-6 z-50 bg-[var(--bg)] left-0 shadow-lg rounded-md border border-[var(--border)]"
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
      <footer className="flex justify-between items-center mt-6 text-sm text-[var(--light-text)]">
        {/* PREVIOUS BUTTON */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-[var(--border)] cursor-pointer rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        {/* PAGE NUMBERS */}
        {currentProjects.length > 0 && (
          <div className="flex gap-2">
            {/* MAPPING THROUGH PAGES */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              // PAGE NUMBER BUTTON
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded-lg border border-[var(--border)] cursor-pointer ${
                  num === currentPage
                    ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)]"
                    : "hover:bg-[var(--hover-bg)]"
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
          className="px-3 py-1 border border-[var(--border)] cursor-pointer rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default ListModeProjects;
