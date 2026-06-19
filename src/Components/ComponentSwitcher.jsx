import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

import HomePage            from "../Features/HomePage/HomePage";
import JobDetailsPage      from "../Features/JobDetailsPage/JobDetailsPage";
import AdminDashboard      from "../Features/AdminDashboard/AdminDashboard";
import PostJobPage         from "../Features/PostJobPage/PostJobPage";
import AboutPage           from "../Features/AboutPage/AboutPage";
import FAQPage             from "../Features/FAQPage/FAQPage";
import SearchPage          from "../Features/SearchPage/SearchPage";
import LoginPage           from "../Features/AuthPage/LoginPage";
import JobSeekerDashboard  from "../Features/JobSeekerDashboard/JobSeekerDashboard";

function ComponentSwitcher() {
  const { isUser, isAdmin } = useAuth();
  const [activePage, setActivePage] = useState("home");
  const [selectedJob, setSelectedJob] = useState(null);

  const goHome      = () => setActivePage("home");
  const goAdmin     = () => {
    if (isAdmin) { setActivePage("admin");     return; }
    if (isUser)  { setActivePage("dashboard"); return; }
    setActivePage("login");
  };
  const goPostJob   = () => setActivePage("postJob");
  const goAbout     = () => setActivePage("about");
  const goFaq       = () => setActivePage("faq");
  const goSearch    = () => setActivePage("search");
  const goDashboard = () => setActivePage("dashboard");

  const nav = {
    onHome:      goHome,
    onSearch:    goSearch,
    onAbout:     goAbout,
    onFaq:       goFaq,
    onAdmin:     goAdmin,
    onDashboard: goDashboard,
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setActivePage("details");
  };

  const handleAuthSuccess = (type) => {
    if (type === "admin") setActivePage("admin");
    else                  setActivePage("dashboard");
  };

  if (activePage === "login")
    return <LoginPage {...nav} onSuccess={handleAuthSuccess} onClose={goHome} />;

  if (activePage === "details")
    return <JobDetailsPage job={selectedJob} onBack={goHome} />;

  if (activePage === "admin")
    return <AdminDashboard {...nav} onBack={goHome} onPostJob={goPostJob} />;

  if (activePage === "postJob")
    return <PostJobPage onBack={() => setActivePage("admin")} />;

  if (activePage === "dashboard")
    return <JobSeekerDashboard {...nav} />;

  if (activePage === "about")
    return <AboutPage {...nav} />;

  if (activePage === "faq")
    return <FAQPage {...nav} />;

  if (activePage === "search")
    return <SearchPage {...nav} onSelectJob={openJobDetails} />;

  return <HomePage {...nav} onSelectJob={openJobDetails} />;
}

export default ComponentSwitcher;
