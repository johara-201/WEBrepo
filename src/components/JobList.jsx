import JobCard from "./JobCard";

function JobList({ jobs, openJobDetails }) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 text-center text-gray-600">
        לא נמצאו משרות מתאימות.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          openJobDetails={openJobDetails}
        />
      ))}
    </div>
  );
}

export default JobList;