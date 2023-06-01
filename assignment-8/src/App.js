import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddBook from "components/AddBook/AddBook";
import Books from "components/Books/Books";
import EditBook from "components/EditBook/EditBook";
import Navbar from "components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="books/add" element={<AddBook />} />
        <Route path="books/edit/:id" element={<EditBook />} />
      </Routes>

      {/* toastify */}
      <ToastContainer />
    </Router>
  );
}

export default App;
