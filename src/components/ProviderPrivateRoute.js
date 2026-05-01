import { Navigate } from "react-router-dom";

function ProviderPrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "provider") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProviderPrivateRoute;