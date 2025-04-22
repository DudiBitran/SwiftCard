import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/auth.context";

function ProtectedRoute({ children, onlyBiz = false, onlyAdmin = false }) {
  const { pathname } = useLocation();

  const { user } = useAuth();
  if (!user || (onlyBiz && !user?.isBusiness && onlyAdmin && !user?.isAdmin)) {
    return <Navigate to="/sign-in" state={{ from: pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
