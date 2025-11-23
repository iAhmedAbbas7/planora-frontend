// <== IMPORTS ==>
import { JSX } from "react";
import { AxiosError } from "axios";
import useTitle from "../hooks/useTitle";
import { useProjects } from "../hooks/useProjects";
import ProjectCards from "../components/cards/ProjectCards";
import DashboardHeader from "../components/layout/DashboardHeader";
import ProjectsOverview from "../components/cards/ProjectsOverview";
import ProjectsSkeleton from "../components/skeletons/ProjectsSkeleton";

// <== PROJECTS PAGE COMPONENT ==>
const Projects = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Projects");
  // FETCH PROJECTS DATA
  const { isLoading, isError, projectsError } = useProjects();
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    return <ProjectsSkeleton />;
  }
  // IF ERROR, SHOW ERROR MESSAGE
  if (isError && projectsError) {
    // GET AXIOS ERROR
    const axiosError = projectsError as AxiosError<{ message?: string }>;
    // GET ERROR MESSAGE
    const errorMessage =
      axiosError?.response?.data?.message ||
      axiosError?.message ||
      "Unknown error";
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text-primary)",
        }}
      >
        <div className="text-center">
          <p className="text-lg font-medium text-red-500 mb-2">
            Error loading projects data
          </p>
          <p className="text-sm text-[var(--light-text)]">{errorMessage}</p>
        </div>
      </div>
    );
  }
  // RETURNING THE PROJECTS PAGE COMPONENT
  return (
    // PROJECTS PAGE MAIN CONTAINER
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* PAGE HEADER */}
      <DashboardHeader
        title="Projects"
        subtitle="Track and organize all your projects at one place"
        showSearch={false}
      />
      {/* OVERVIEW SECTION */}
      <div className="">
        <ProjectsOverview />
      </div>
      {/* PROJECTS LIST/CARDS SECTION */}
      <div className="flex flex-col p-4 pt-0">
        <ProjectCards />
      </div>
    </div>
  );
};

export default Projects;
