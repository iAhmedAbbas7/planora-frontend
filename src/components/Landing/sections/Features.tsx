// <== IMPORTS ==>
import {
  ClipboardList,
  BarChart3,
  Target,
  LayoutDashboard,
  Palette,
  CalendarDays,
} from "lucide-react";
import { JSX, ElementType } from "react";

// <== FEATURE TYPE INTERFACE ==>
type Feature = {
  // <== FEATURE ICON ==>
  icon: ElementType;
  // <== FEATURE TITLE ==>
  title: string;
  // <== FEATURE DESCRIPTION ==>
  desc: string;
};

// <== FEATURES COMPONENT ==>
const Features = (): JSX.Element => {
  // TOP ROW FEATURES ARRAY
  const featuresTop: Feature[] = [
    // <== FEATURE 1 ==>
    {
      icon: LayoutDashboard,
      title: "All-in-One Dashboard",
      desc: "Track your projects, deadlines, and progress all in one clean, unified workspace.",
    },
    // <== FEATURE 2 ==>
    {
      icon: ClipboardList,
      title: "Smart Task Management",
      desc: "Organize, prioritize, and focus on what truly matters with intuitive task controls.",
    },
    // <== FEATURE 3 ==>
    {
      icon: Target,
      title: "Goal & Habit Tracker",
      desc: "Set personal goals, build habits, and stay accountable with progress milestones.",
    },
  ];
  // BOTTOM ROW FEATURES ARRAY
  const featuresBottom: Feature[] = [
    // <== FEATURE 4 ==>
    {
      icon: CalendarDays,
      title: "Reminders & Scheduling",
      desc: "Stay on top of your day with smart reminders, recurring tasks, and calendar integration.",
    },
    // <== FEATURE 5 ==>
    {
      icon: BarChart3,
      title: "Progress Insights",
      desc: "Visualize your achievements with charts and analytics that keep you motivated.",
    },
    // <== FEATURE 6 ==>
    {
      icon: Palette,
      title: "Customizable Workspace",
      desc: "Switch between light or dark themes and personalize your setup for better focus.",
    },
  ];
  // RENDER CARD FUNCTION
  const renderCard = (feature: Feature, index: number): JSX.Element => {
    const Icon = feature.icon;
    return (
      // FEATURE CARD CONTAINER
      <div
        key={index}
        className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden border border-[var(--border)]"
      >
        {/* CURVED SHAPE WITH ICON INSIDE */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-violet-50 rounded-br-3xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-violet-500" />
        </div>
        {/* CARD CONTENT CONTAINER */}
        <div className="mt-16">
          {/* CARD TITLE */}
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            {feature.title}
          </h3>
          {/* CARD DESCRIPTION */}
          <p className="text-gray-600">{feature.desc}</p>
        </div>
      </div>
    );
  };
  // RETURNING THE FEATURES COMPONENT
  return (
    // FEATURES MAIN CONTAINER
    <section
      id="features"
      className="mt-10 mb-10 py-10 px-6 rounded-3xl w-[85%] mx-auto"
    >
      {/* HEADING CONTAINER */}
      <div className="text-center mb-14 flex flex-col items-center gap-2">
        {/* BADGE */}
        <p className="inline-block px-4 py-2 mb-4 border border-gray-300 text-violet-500 rounded-full text-sm font-medium">
          Features
        </p>
        {/* MAIN HEADING PART 1 */}
        <p className="text-5xl font-medium text-black leading-tight">
          Everything You Need to Manage
        </p>
        {/* MAIN HEADING PART 2 */}
        <p className="text-5xl font-medium text-black mb-4">
          Your Projects & Tasks
        </p>
        {/* DESCRIPTION TEXT */}
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-lg">
          From daily to-dos to major projects. PlanOra helps you organize,
          track, and achieve more with clarity and focus.
        </p>
      </div>
      {/* TOP ROW FEATURES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {featuresTop.map(renderCard)}
      </div>
      {/* BOTTOM ROW FEATURES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuresBottom.map(renderCard)}
      </div>
    </section>
  );
};

export default Features;
