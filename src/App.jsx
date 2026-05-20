import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import JobDetailsPage from "./pages/JobDetailsPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedJobId, setSelectedJobId] = useState(null);

  function goToHome() {
    setCurrentPage("home");
    setSelectedJobId(null);
  }

  function goToAdmin() {
    setCurrentPage("admin");
    setSelectedJobId(null);
  }

  function openJobDetails(jobId) {
    setSelectedJobId(jobId);
    setCurrentPage("details");
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800" dir="rtl">
      <Header goToHome={goToHome} goToAdmin={goToAdmin} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === "home" && (
          <HomePage openJobDetails={openJobDetails} />
        )}

        {currentPage === "details" && (
          <JobDetailsPage jobId={selectedJobId} goToHome={goToHome} />
        )}

        {currentPage === "admin" && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;