// <== IMPORTS ==>
import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/useAuthStore";
import { User, Settings, LogOut, Palette } from "lucide-react";

// <== DROPDOWN COMPONENT ==>
const Dropdown = (): JSX.Element => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // AUTH STORE
  const { user } = useAuthStore();
  // LOGOUT MUTATION
  const logoutMutation = useLogout();
  // DROPDOWN ITEMS ARRAY
  const items = [
    {
      name: "My Profile",
      icon: User,
      onClick: () => navigate("/settings?tab=Profile"),
    },
    {
      name: "Manage Account",
      icon: User,
      onClick: () => navigate("/settings?tab=Account"),
    },
    {
      name: "Settings",
      icon: Settings,
      onClick: () => navigate("/settings?tab=Profile"),
    },
    {
      name: "Theme",
      icon: Palette,
      onClick: () => navigate("/settings?tab=Appearance"),
    },
  ];
  // HANDLE LOGOUT FUNCTION
  const handleLogout = (): void => {
    // CALL LOGOUT MUTATION
    logoutMutation.mutate();
  };
  // RETURNING THE DROPDOWN COMPONENT
  return (
    // DROPDOWN MAIN CONTAINER
    <div className="w-56 sm:w-64 z-[60] bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden">
      {/* DROPDOWN HEADER */}
      <header className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-[var(--border)]">
        {/* USER AVATAR */}
        <span className="bg-[var(--accent-color)] w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 overflow-hidden aspect-square text-sm sm:text-base">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </span>
        {/* USER INFO CONTAINER */}
        <div className="flex flex-col min-w-0 flex-1">
          {/* USER NAME */}
          <p className="font-medium text-sm sm:text-base truncate">{user?.name || "User"}</p>
          {/* USER EMAIL */}
          <p className="text-[var(--light-text)] text-xs sm:text-sm truncate">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </header>
      {/* DROPDOWN MENU ITEMS */}
      <main className="p-1.5 sm:p-2">
        {/* MAPPING THROUGH ITEMS */}
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            // MENU ITEM BUTTON
            <button
              key={index}
              onClick={item.onClick}
              className="flex w-full items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer text-sm sm:text-base"
            >
              {/* MENU ITEM ICON */}
              <Icon size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
              {/* MENU ITEM TEXT */}
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </main>
      {/* DROPDOWN FOOTER */}
      <footer className="border-t border-[var(--border)] p-1.5 sm:p-2">
        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-red-600 hover:bg-[var(--hover-bg)] focus:bg-red-50 focus:outline-none cursor-pointer text-sm sm:text-base"
        >
          {/* LOGOUT ICON */}
          <LogOut size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
          {/* LOGOUT TEXT */}
          <span>Logout</span>
        </button>
      </footer>
    </div>
  );
};

export default Dropdown;
