import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/auth";
import { Loader } from "@/components/loader";

export default function Protect({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <div className="text-red-500 p-4">Accès refusé.</div>;
  }

  return children;
}
