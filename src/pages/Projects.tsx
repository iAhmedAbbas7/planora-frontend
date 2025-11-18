// <== IMPORTS ==>
import { JSX } from "react";
import ProjectCards from "../components/cards/ProjectCards";
import DashboardHeader from "../components/layout/DashboardHeader";
import ProjectsOverview from "../components/cards/ProjectsOverview";

// <== PROJECTS PAGE COMPONENT ==>
const Projects = (): JSX.Element => {
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
