import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { accessToken, user } = useSelector((state) => state.auth);

  if (accessToken) {
    if (user?.role === "student") {
      return <Navigate to="/course-player" />;
    }
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/notfound" />;
  }
  return children;
};

export default PublicRoute;
