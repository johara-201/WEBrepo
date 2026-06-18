import { useState } from "react";

import HomePage from "../Features/HomePage/HomePage";
import JobDetailsPage from "../Features/JobDetailsPage/JobDetailsPage";
import AdminDashboard from "../Features/AdminDashboard/AdminDashboard";
import PostJobPage from "../Features/PostJobPage/PostJobPage";

function ComponentSwitcher() {
  const [activePage, setActivePage] = useState("home");
  const [selectedJob, setSelectedJob] = useState(null);

  const goHome = () => setActivePage("home");
  const goAdmin = () => setActivePage("admin");
  const goPostJob = () => setActivePage("postJob");

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setActivePage("details");
  };

  if (activePage === "details") {
    return <JobDetailsPage job={selectedJob} onBack={goHome} />;
  }

  if (activePage === "admin") {
    return <AdminDashboard onBack={goHome} onPostJob={goPostJob} />;
  }

  if (activePage === "postJob") {
    return <PostJobPage onBack={goAdmin} />;
  }

  return (
    <HomePage
      onSelectJob={openJobDetails}
      onAdminClick={goAdmin}
    />
  );
}

export default ComponentSwitcher;