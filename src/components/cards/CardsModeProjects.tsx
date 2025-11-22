// <== IMPORTS ==>
import {
  useState,
  useRef,
  useEffect,
  JSX,
  Dispatch,
  SetStateAction,
} from "react";
import ProjectDetails from "../projects/ProjectDetails";
import { MoreHorizontal, FolderPlus } from "lucide-react";
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
        {/* CHECK IF NO PROJECTS */}
        {currentProjects.length === 0 && totalPages === 1 ? (
          // EMPTY STATE
          <div className="col-span-full flex flex-col items-center justify-center py-8 gap-3">
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
          </div>
        ) : (
          // MAPPING THROUGH PROJECTS
          currentProjects.map((item, index) => (
            // PROJECT CARD
            <div
              key={item._id || index}
              className={`flex flex-col gap-3 rounded-xl p-4 shadow-sm transition ${
                index % 2 === 0
                  ? "bg-[var(--cards-bg)] border border-[var(--border)]"
                  : "bg-[var(--bg)] border border-[var(--border)]"
              }`}
            >
              {/* CARD HEADER */}
              <header className="flex justify-between items-center">
                {/* PROJECT TITLE BUTTON */}
                <button
                  className="font-medium text-base text-left hover:underline cursor-pointer"
                  onClick={() => setSelectedProjectId(item._id)}
                >
                  {item.title}
                </button>
                {/* CARD ACTIONS CONTAINER */}
                <div className="flex gap-2 justify-center items-center">
                  {/* STATUS BADGE */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "Completed"
                        ? "bg-green-100 text-green-600 border border-gray-200"
                        : item.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-600 border border-gray-200"
                        : "bg-gray-300 text-gray-800 border border-gray-200"
                    }`}
                  >
                    {item.status || "N/A"}
                  </span>
                  {/* DROPDOWN CONTAINER */}
                  <div
                    className="relative"
                    onClick={() => toggleDropdown(item._id)}
                  >
                    {/* DROPDOWN BUTTON */}
                    <button className="cursor-pointer">
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
                </div>
              </header>
              {/* CARD INFO SECTION */}
              <section className="grid grid-cols-2 gap-3 text-sm">
                {/* INCHARGE INFO */}
                <div>
                  {/* INCHARGE LABEL */}
                  <p className="text-[var(--light-text)]">Incharge</p>
                  {/* INCHARGE VALUE */}
                  <p className="font-medium">{item.inChargeName || "N/A"}</p>
                </div>
                {/* ROLE INFO */}
                <div>
                  {/* ROLE LABEL */}
                  <p className="text-[var(--light-text)]">Role</p>
                  {/* ROLE VALUE */}
                  <p className="font-medium">{item.role || "N/A"}</p>
                </div>
                {/* TASKS INFO */}
                <div>
                  {/* TASKS LABEL */}
                  <p className="text-[var(--light-text)]">Tasks</p>
                  {/* TASKS VALUE */}
                  <p className="font-medium">
                    {item.completedTasks || 0}/{item.totalTasks || 0}
                  </p>
                </div>
                {/* DEADLINE INFO */}
                <div>
                  {/* DEADLINE LABEL */}
                  <p className="text-gray-500">Deadline</p>
                  {/* DEADLINE VALUE */}
                  <p className="font-medium">
                    {item.dueDate
                      ? new Date(item.dueDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </section>
              {/* PROGRESS SECTION */}
              <div>
                {/* PROGRESS HEADER */}
                <div className="flex justify-between items-center text-sm mb-1">
                  {/* PROGRESS LABEL */}
                  <p className="text-[var(--light-text)]">Progress</p>
                  {/* PROGRESS PERCENTAGE */}
                  <p className="font-medium">
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
              <footer className="flex gap-2 mt-2">
                {/* VIEW DETAILS BUTTON */}
                <button
                  className="flex-1 border border-[var(--border)] rounded-lg py-2 text-sm hover:bg-[var(--hover-bg)] cursor-pointer"
                  onClick={() => setSelectedProjectId(item._id)}
                >
                  View Details
                </button>
                {/* EDIT INFO BUTTON */}
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 border relative border-[var(--border)] text-[var(--accent-color)] rounded-lg py-2 text-sm hover:bg-[var(--accent-btn-hover-color)] cursor-pointer hover:text-white"
                >
                  Edit Info
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
        <div className="flex gap-2">
          {/* MAPPING THROUGH PAGES */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            // PAGE NUMBER BUTTON
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded-lg border border-[var(--border)] cursor-pointer ${
                num === currentPage
                  ? "bg-[var(--accent-color)] text-white border-[var(--accent-btn-hover-color)]"
                  : "hover:bg-[var(--hover-bg)]"
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
          className="px-3 py-1 border border-[var(--border)] cursor-pointer rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default CardsModeProjects;
