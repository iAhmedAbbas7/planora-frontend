// <== IMPORTS ==>
import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

// <== PUBLIC ROUTE PROPS TYPE ==>
type PublicRouteProps = {
  // <== CHILDREN ==>
  children: JSX.Element;
};

// <== PUBLIC ROUTE COMPONENT ==>
const PublicRoute = ({ children }: PublicRouteProps): JSX.Element => {
  // AUTH STORE
  const { isAuthenticated } = useAuthStore();
  // IF AUTHENTICATED, REDIRECT TO DASHBOARD
  if (isAuthenticated) {
    // REDIRECT TO DASHBOARD
    return <Navigate to="/dashboard" replace />;
  }
  // RETURN CHILDREN IF NOT AUTHENTICATED
  return children;
};

export default PublicRoute;
