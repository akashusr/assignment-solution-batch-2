import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddTask from "components/AddTask/AddTask";
import Navbar from "components/Navbar";
import Home from "pages/Home";
import EditTask from "components/EditTask/EditTask";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="create-task" element={<AddTask />} />
        <Route path="edit-task/:id" element={<EditTask />} />
      </Routes>

      {/* toastify */}
      <ToastContainer />
    </Router>
  );
}

export default App;
