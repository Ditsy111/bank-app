import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !user) {
    return null;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}