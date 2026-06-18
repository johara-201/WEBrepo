export const filterJobs = (jobs, filters) => {
  const {
    searchText = "",
    city = "all",
    jobType = "all",
    employmentPercent = "all",
    organization = "all",
    distanceMinutes = "all",
    forStudents = false,
  } = filters;

  const text = searchText.trim().toLowerCase();

  return jobs.filter((job) => {
    if (city !== "all" && job.city !== city) return false;

    if (jobType !== "all" && job.jobType !== jobType) return false;

    if (organization !== "all" && job.organization !== organization) {
      return false;
    }

    if (
      employmentPercent !== "all" &&
      Number(job.employmentPercent) < Number(employmentPercent)
    ) {
      return false;
    }

    if (
      distanceMinutes !== "all" &&
      Number(job.distanceMinutes) > Number(distanceMinutes)
    ) {
      return false;
    }

    if (forStudents && !job.suitableForStudents) return false;

    if (text) {
      const haystack = `
        ${job.title || ""}
        ${job.organization || ""}
        ${job.city || ""}
        ${job.jobType || ""}
        ${job.description || ""}
        ${job.sourceName || ""}
      `.toLowerCase();

      if (!haystack.includes(text)) return false;
    }

    return true;
  });
};