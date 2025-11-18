// <== IMPORTS ==>
import { JSX } from "react";
import Trash from "./pages/Trash";
import Projects from "./pages/Projects";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardLayout from "./layouts/DashboardLayout";
import NotificationsPage from "./pages/NotificationsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// <== APP ROUTER ==>
const appRouter = createBrowserRouter([
  // <== PUBLIC ROUTE ==>
  {
    path: "/",
    element: <LandingPage />,
  },
  // <== LOGIN ROUTE ==>
  {
    path: "/login",
    element: <LoginPage />,
  },
  // <== SIGN UP ROUTE ==>
  {
    path: "/register",
    element: <SignUpPage />,
  },
  // <== DASHBOARD LAYOUT ROUTE ==>
  {
    element: <DashboardLayout />,
    children: [
      // <== DASHBOARD ROUTE ==>
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      // <== PROJECTS ROUTE ==>
      {
        path: "/projects",
        element: <Projects />,
      },
      // <== TASKS ROUTE ==>
      {
        path: "/tasks",
        element: <TasksPage />,
      },
      // <== TRASH ROUTE ==>
      {
        path: "/trash",
        element: <Trash />,
      },
      // <== SETTINGS ROUTE ==>
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      // <== NOTIFICATIONS ROUTE ==>
      {
        path: "/notifications",
        element: <NotificationsPage />,
      },
    ],
  },
]);

// <== APP COMPONENT ==>
const App = (): JSX.Element => {
  // RETURNING THE APP COMPONENT
  return (
    // APP MAIN CONTAINER
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  );
};

export default App;
