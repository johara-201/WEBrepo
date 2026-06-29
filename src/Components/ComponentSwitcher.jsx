//This file decides which page to show in the application

import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

import HomePage from "../Features/HomePage/HomePage";
import JobDetailsPage from "../Features/JobDetailsPage/JobDetailsPage";
import AdminDashboard from "../Features/AdminDashboard/AdminDashboard";
import PostJobPage from "../Features/PostJobPage/PostJobPage";
import AboutPage from "../Features/AboutPage/AboutPage";
import FAQPage from "../Features/FAQPage/FAQPage";
import SearchPage from "../Features/SearchPage/SearchPage";
import LoginPage from "../Features/AuthPage/LoginPage";
import JobSeekerDashboard from "../Features/JobSeekerDashboard/JobSeekerDashboard";
import AIChat from "../Features/AIChat/AIChat";

function ComponentSwitcher() {
  //Check if the current logged-in account is a user or an admin
  const { isUser, isAdmin } = useAuth();

  //Save the page that is currently shown
  const [activePage, setActivePage] = useState("home");

  //Save the selected job for the details page
  const [selectedJob, setSelectedJob] = useState(null);

  const goHome = () => setActivePage("home");

  const goAdmin = () => {
    //Admins go to the admin dashboard
    if (isAdmin) {
      setActivePage("admin");
      return;
    }

    //Regular users go to their personal dashboard
    if (isUser) {
      setActivePage("dashboard");
      return;
    }

    //Guests must login first
    setActivePage("login");
  };

  const goPostJob = () => setActivePage("postJob");
  const goAbout = () => setActivePage("about");
  const goFaq = () => setActivePage("faq");
  const goSearch = () => setActivePage("search");
  const goDashboard = () => setActivePage("dashboard");
  const goAIChat = () => setActivePage("aiChat");

  //Navigation functions that are passed to pages
  const nav = {
    onHome: goHome,
    onSearch: goSearch,
    onAbout: goAbout,
    onFaq: goFaq,
    onAdmin: goAdmin,
    onDashboard: goDashboard,
    onAIChat: goAIChat,
  };

  //Open the details page for a selected job
  const openJobDetails = (job) => {
    setSelectedJob(job);
    setActivePage("details");
  };

  //Decide where to go after successful login
  const handleAuthSuccess = (type) => {
    if (type === "admin") {
      setActivePage("admin");
    } else {
      setActivePage("dashboard");
    }
  };

  if (activePage === "login") {
    return (
      <LoginPage
        {...nav}
        onSuccess={handleAuthSuccess}
        onClose={goHome}
      />
    );
  }

  if (activePage === "details") {
    return (
      <JobDetailsPage
        job={selectedJob}
        onBack={goSearch}
        {...nav}
        activePage="details"
      />
    );
  }

  if (activePage === "admin") {
    return (
      <AdminDashboard
        {...nav}
        onBack={goHome}
        onPostJob={goPostJob}
      />
    );
  }

  if (activePage === "postJob") {
    return (
      <PostJobPage
        onBack={() => setActivePage("admin")}
      />
    );
  }

  if (activePage === "dashboard") {
    return <JobSeekerDashboard {...nav} />;
  }

  if (activePage === "about") {
    return <AboutPage {...nav} />;
  }

  if (activePage === "faq") {
    return <FAQPage {...nav} />;
  }

  if (activePage === "search") {
    return (
      <SearchPage
        {...nav}
        onSelectJob={openJobDetails}
      />
    );
  }

  if (activePage === "aiChat") {
    return <AIChat {...nav} />;
  }

  return (
    <HomePage
      {...nav}
      onSelectJob={openJobDetails}
    />
  );
}

export default ComponentSwitcher;