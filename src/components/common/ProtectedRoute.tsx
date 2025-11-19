// <== IMPORTS ==>
import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

// <== PROTECTED ROUTE PROPS TYPE ==>
type ProtectedRouteProps = {
  // <== CHILDREN ==>
  children: JSX.Element;
};

// <== PROTECTED ROUTE COMPONENT ==>
const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  // AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    // IF LOGGING OUT, REDIRECT TO LOGIN (SMOOTH LOGOUT FLOW)
    if (isLoggingOut) {
      return <Navigate to="/login" replace />;
    }
    // OTHERWISE, REDIRECT TO ACCESS DENIED
    return <Navigate to="/access-denied" replace />;
  }
  // RETURN CHILDREN IF AUTHENTICATED
  return children;
};

export default ProtectedRoute;
