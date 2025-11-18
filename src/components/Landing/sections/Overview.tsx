// <== IMPORTS ==>
import { JSX } from "react";
import DASHBOARD_IMAGE from "../../../assets/images/DASHBOARD.png";

// <== OVERVIEW COMPONENT ==>
const Overview = (): JSX.Element => {
  // RETURNING THE OVERVIEW COMPONENT
  return (
    // OVERVIEW MAIN CONTAINER
    <div className="px-6 md:px-26 lg:px-10 xl:px-10 2xl:px-28">
      {/* OVERVIEW IMAGE CONTAINER */}
      <img
        src={DASHBOARD_IMAGE}
        alt="PlanOra Dashboard Overview"
        className="rounded-2xl w-[100%] h-auto"
      />
    </div>
  );
};

export default Overview;

