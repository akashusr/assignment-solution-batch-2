import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { accessToken, user } = useSelector((state) => state.auth);

  if (accessToken && user?.role === "admin") {
    return children;
  }
  return <Navigate to="/admin" />;
};

export default AdminRoute;
