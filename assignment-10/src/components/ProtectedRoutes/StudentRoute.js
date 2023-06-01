import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const StudentRoute = ({ children }) => {
  const { accessToken, user } = useSelector((state) => state.auth);

  if (accessToken && user?.role === "student") {
    return children;
  }
  return <Navigate to="/" />;
};

export default StudentRoute;
