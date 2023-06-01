import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useAuthCheck from "hooks/useAuthCheck";
import LoadingSpinner from "components/shared/LoadingSpinner";
import Login from "components/shared/Login";
import StudentRoute from "components/ProtectedRoutes/StudentRoute";
import AdminRoute from "components/ProtectedRoutes/AdminRoute";
import PublicRoute from "components/ProtectedRoutes/PublicRoute";
import CoursePlayer from "components/StudentPortal/CoursePlayer/CoursePlayer";
import LeaderBoard from "components/StudentPortal/LeaderBoard/LeaderBoard";
import StudentRegistration from "components/StudentPortal/StudentRegistration/StudentRegistration";
import Dashboard from "components/AdminDashboard/Dashboard";
import Assignments from "components/AdminDashboard/Assignments/Assignments";
import AssignmentMarks from "components/AdminDashboard/AssignmentMarks/AssignmentMarks";
import Quizzes from "components/AdminDashboard/Quizzes/Quizzes";
import Videos from "components/AdminDashboard/Videos/Videos";
import Quiz from "components/StudentPortal/Quiz/Quiz";
import NotFound from "components/shared/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const isAuthChecked = useAuthCheck();

  const routes = [
    {
      path: "/",
      component: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "admin",
      component: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "register",
      component: (
        <PublicRoute>
          <StudentRegistration />
        </PublicRoute>
      ),
    },
    {
      path: "course-player",
      component: (
        <StudentRoute>
          <CoursePlayer />
        </StudentRoute>
      ),
    },
    {
      path: "video-quiz/:videoId",
      component: (
        <StudentRoute>
          <Quiz />
        </StudentRoute>
      ),
    },
    {
      path: "leaderboard",
      component: (
        <StudentRoute>
          <LeaderBoard />
        </StudentRoute>
      ),
    },
    {
      path: "admin/dashboard",
      component: (
        <AdminRoute>
          <Dashboard />
        </AdminRoute>
      ),
    },
    {
      path: "admin/assignment",
      component: (
        <AdminRoute>
          <Assignments />
        </AdminRoute>
      ),
    },
    {
      path: "admin/assignment-mark",
      component: (
        <AdminRoute>
          <AssignmentMarks />
        </AdminRoute>
      ),
    },
    {
      path: "admin/quizzes",
      component: (
        <AdminRoute>
          <Quizzes />
        </AdminRoute>
      ),
    },
    {
      path: "admin/videos",
      component: (
        <AdminRoute>
          <Videos />
        </AdminRoute>
      ),
    },
  ];

  if (!isAuthChecked) {
    return <LoadingSpinner isInitialLoading />;
  }
  return (
    <BrowserRouter>
      <Routes>
        {routes?.map(({ path, component }) => (
          <Route path={path} key={path} element={component} />
        ))}
        <Route path="notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* toastify */}
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
