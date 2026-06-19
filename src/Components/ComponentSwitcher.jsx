import { useState } from "react";

import HomePage     from "../Features/HomePage/HomePage";
import JobDetailsPage from "../Features/JobDetailsPage/JobDetailsPage";
import AdminDashboard from "../Features/AdminDashboard/AdminDashboard";
import PostJobPage  from "../Features/PostJobPage/PostJobPage";
import AboutPage    from "../Features/AboutPage/AboutPage";
import FAQPage      from "../Features/FAQPage/FAQPage";
import SearchPage   from "../Features/SearchPage/SearchPage";

function ComponentSwitcher() {
  const [activePage, setActivePage]   = useState("home");
  const [selectedJob, setSelectedJob] = useState(null);

  const goHome    = () => setActivePage("home");
  const goAdmin   = () => setActivePage("admin");
  const goPostJob = () => setActivePage("postJob");
  const goAbout   = () => setActivePage("about");
  const goFaq     = () => setActivePage("faq");
  const goSearch  = () => setActivePage("search");

  const nav = {
    onHome:   goHome,
    onSearch: goSearch,
    onAbout:  goAbout,
    onFaq:    goFaq,
    onAdmin:  goAdmin,
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setActivePage("details");
  };

  if (activePage === "details")  return <JobDetailsPage job={selectedJob} onBack={goHome} />;
  if (activePage === "admin")    return <AdminDashboard onBack={goHome} onPostJob={goPostJob} />;
  if (activePage === "postJob")  return <PostJobPage onBack={goAdmin} />;
  if (activePage === "about")    return <AboutPage  {...nav} />;
  if (activePage === "faq")      return <FAQPage    {...nav} />;
  if (activePage === "search")   return <SearchPage {...nav} onSelectJob={openJobDetails} />;

  return <HomePage {...nav} onSelectJob={openJobDetails} />;
}

export default ComponentSwitcher;
