import axios from "axios";

export const getStats = async () => {
  const [jobsRes, appsRes] = await Promise.all([
    axios.get("/api/jobs"),
    axios.get("/api/applications"),
  ]);

  const jobs = jobsRes.data;
  const applications = appsRes.data;

  return {
    totalJobs: jobs.length,
    manualJobs: jobs.filter((j) => j.source === "manual").length,
    externalJobs: jobs.filter((j) => j.source === "external").length,
    studentJobs: jobs.filter((j) => j.suitableForStudents).length,
    totalApplications: applications.length,
  };
};
