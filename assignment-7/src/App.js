import React from "react";
import Layout from "components/Layout";
import Jobs from "components/Jobs/Jobs";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddOrEditJob from "components/AddOrEditJob/AddOrEditJob";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="jobs/create" element={<AddOrEditJob />} />
          <Route path="jobs/edit/:id" element={<AddOrEditJob />} />
        </Routes>
      </Layout>

      {/* toastify */}
      <ToastContainer />
    </Router>
  );
}

export default App;
