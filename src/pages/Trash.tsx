// <== IMPORTS ==>
import { JSX } from "react";
import useTitle from "@/hooks/useTitle";
import TrashSection from "../components/sections/TrashSection";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== TRASH PAGE COMPONENT ==>
const Trash = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Trash");
  // RETURNING THE TRASH PAGE COMPONENT
  return (
    // TRASH PAGE MAIN CONTAINER
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* PAGE HEADER */}
      <DashboardHeader
        title="Trash"
        subtitle="View, restore, or permanently delete items."
        showSearch={false}
      />
      {/* TRASH SECTION */}
      <div className="p-4">
        <TrashSection />
      </div>
    </div>
  );
};

export default Trash;
