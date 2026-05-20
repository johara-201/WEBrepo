import { jobsData } from "../data/jobsData";

export function getAllJobs() {
  return jobsData;
}

export function getJobById(id) {
  return jobsData.find((job) => job.id === Number(id));
}

export function searchJobs(searchValue) {
  if (!searchValue) {
    return jobsData;
  }

  return jobsData.filter((job) =>
    job.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    job.description.toLowerCase().includes(searchValue.toLowerCase())
  );
}

export function filterJobs(filters) {
  return jobsData.filter((job) => {
    const matchesSearch =
      !filters.search ||
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesVillage =
      filters.village === "all" || job.village === filters.village;

    const matchesField =
      filters.field === "all" || job.field === filters.field;

    const matchesEducation =
      filters.education === "all" || job.education === filters.education;

    const matchesExperience =
      filters.experience === "all" || job.experience === filters.experience;

    return (
      matchesSearch &&
      matchesVillage &&
      matchesField &&
      matchesEducation &&
      matchesExperience
    );
  });
}