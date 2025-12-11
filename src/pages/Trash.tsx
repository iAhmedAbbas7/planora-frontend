// <== IMPORTS ==>
import { JSX } from "react";
import { AxiosError } from "axios";
import useTitle from "../hooks/useTitle";
import { useTrash } from "../hooks/useTrash";
import TrashSection from "../components/sections/TrashSection";
import TrashSkeleton from "../components/skeletons/TrashSkeleton";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== TRASH PAGE COMPONENT ==>
const Trash = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Trash");
  // GET TRASH DATA FROM HOOK
  const { isLoading, isError, trashError } = useTrash();
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    return <TrashSkeleton />;
  }
  // IF ERROR, SHOW ERROR MESSAGE
  if (isError && trashError) {
    // GET AXIOS ERROR
    const axiosError = trashError as AxiosError<{ message?: string }>;
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
            Error loading trash data
          </p>
          <p className="text-sm text-[var(--light-text)]">{errorMessage}</p>
        </div>
      </div>
    );
  }
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
      />
      {/* TRASH SECTION */}
      <div className="p-4">
        <TrashSection />
      </div>
    </div>
  );
};

export default Trash;
