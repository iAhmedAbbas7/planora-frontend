// <== IMPORTS ==>
import { JSX } from "react";
import Trash from "./pages/Trash";
import Projects from "./pages/Projects";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import GitHubPage from "./pages/GitHubPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";
import RootLayout from "./layouts/RootLayout";
import SettingsPage from "./pages/SettingsPage";
import AccessDenied from "./pages/AccessDenied";
import GitHubRepoPage from "./pages/GitHubRepoPage";
import GitHubFilesPage from "./pages/GitHubFilesPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import DashboardLayout from "./layouts/DashboardLayout";
import GitHubIssuesPage from "./pages/GitHubIssuesPage";
import GitHubCommitsPage from "./pages/GitHubCommitsPage";
import GitHubComparePage from "./pages/GitHubComparePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotificationsPage from "./pages/NotificationsPage";
import PublicRoute from "./components/common/PublicRoute";
import GitHubBranchesPage from "./pages/GitHubBranchesPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import GitHubPullRequestsPage from "./pages/GitHubPullRequestsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// <== APP ROUTER ==>
const appRouter = createBrowserRouter(
  [
    // <== ROOT LAYOUT ROUTE ==>
    {
      element: <RootLayout />,
      children: [
        // <== PUBLIC ROUTE ==>
        {
          path: "/",
          element: (
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          ),
        },
        // <== LOGIN ROUTE ==>
        {
          path: "/login",
          element: (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          ),
        },
        // <== SIGN UP ROUTE ==>
        {
          path: "/register",
          element: (
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          ),
        },
        // <== VERIFY EMAIL ROUTE ==>
        {
          path: "/verify-email",
          element: (
            <PublicRoute>
              <VerifyEmailPage />
            </PublicRoute>
          ),
        },
        // <== FORGOT PASSWORD ROUTE ==>
        {
          path: "/forgot-password",
          element: (
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          ),
        },
        // <== TERMS OF SERVICE ROUTE ==>
        {
          path: "/terms-of-service",
          element: (
            <PublicRoute>
              <TermsOfServicePage />
            </PublicRoute>
          ),
        },
        // <== PRIVACY POLICY ROUTE ==>
        {
          path: "/privacy-policy",
          element: (
            <PublicRoute>
              <PrivacyPolicyPage />
            </PublicRoute>
          ),
        },
        // <== ACCESS DENIED ROUTE ==>
        {
          path: "/access-denied",
          element: <AccessDenied />,
        },
        // <== DASHBOARD LAYOUT ROUTE ==>
        {
          element: (
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          ),
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
            // <== GITHUB ROUTE ==>
            {
              path: "/github",
              element: <GitHubPage />,
            },
            // <== GITHUB REPOSITORY DETAILS ROUTE ==>
            {
              path: "/github/:owner/:repo",
              element: <GitHubRepoPage />,
            },
            // <== GITHUB REPOSITORY FILES ROUTE ==>
            {
              path: "/github/:owner/:repo/files",
              element: <GitHubFilesPage />,
            },
            // <== GITHUB REPOSITORY COMMITS ROUTE ==>
            {
              path: "/github/:owner/:repo/commits",
              element: <GitHubCommitsPage />,
            },
            // <== GITHUB REPOSITORY COMPARE ROUTE ==>
            {
              path: "/github/:owner/:repo/compare",
              element: <GitHubComparePage />,
            },
            // <== GITHUB REPOSITORY BRANCHES ROUTE ==>
            {
              path: "/github/:owner/:repo/branches",
              element: <GitHubBranchesPage />,
            },
            // <== GITHUB REPOSITORY PULL REQUESTS ROUTE ==>
            {
              path: "/github/:owner/:repo/pulls",
              element: <GitHubPullRequestsPage />,
            },
            // <== GITHUB ISSUES ROUTE ==>
            {
              path: "/github/:owner/:repo/issues",
              element: <GitHubIssuesPage />,
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
      ],
    },
  ],
  {
    // DISABLE SCROLL RESTORATION TO PREVENT PRESERVING SCROLL POSITION
    future: {
      v7_startTransition: true,
    },
  }
);

// <== APP COMPONENT ==>
const App = (): JSX.Element => {
  // RETURNING THE APP COMPONENT
  return (
    // APP MAIN CONTAINER
    <RouterProvider router={appRouter}></RouterProvider>
  );
};

export default App;
