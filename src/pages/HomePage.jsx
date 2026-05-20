import { useState } from "react";

import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import JobList from "../components/JobList";

import { jobsData } from "../data/jobsData";
import { filterJobs } from "../services/JobsService";

function HomePage({ openJobDetails }) {
  const [jobs, setJobs] = useState(jobsData);

  const [filters, setFilters] = useState({
    search: "",
    village: "all",
    field: "all",
    education: "all",
    experience: "all",
  });

  function handleSearch() {
    const filteredJobs = filterJobs(filters);
    setJobs(filteredJobs);
  }

  function resetFilters() {
    const resetData = {
      search: "",
      village: "all",
      field: "all",
      education: "all",
      experience: "all",
    };

    setFilters(resetData);
    setJobs(jobsData);
  }

  return (
    <div>
      <div className="bg-green-700 text-white rounded-2xl p-8 mb-8 shadow-md">
        <h2 className="text-2xl font-bold mb-3">
          מציאת משרות בתחום הנוער והחינוך הבלתי פורמלי
        </h2>

        <p className="max-w-3xl leading-7">
          האתר מרכז משרות מרשויות וגופים במרחב, ומאפשר חיפוש נוח לפי יישוב,
          תחום תפקיד, רמת השכלה וניסיון מקצועי.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">
          חיפוש וסינון משרות
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <SearchBar filters={filters} setFilters={setFilters} />

          <Filters filters={filters} setFilters={setFilters} />
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-5">
          <button
            onClick={handleSearch}
            className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            חפש משרות
          </button>

          <button
            onClick={resetFilters}
            className="px-5 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            איפוס סינון
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">משרות זמינות</h3>

        <p className="text-gray-600">
          נמצאו {jobs.length} משרות
        </p>
      </div>

      <JobList jobs={jobs} openJobDetails={openJobDetails} />
    </div>
  );
}

export default HomePage;