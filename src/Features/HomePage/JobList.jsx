import JobCard from "./JobCard";

function JobList({ jobs, onSelectJob }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-4xl mb-3">🔍</div>
        <p>לא נמצאו משרות התואמות את החיפוש.</p>
        <p className="text-sm mt-1">נסו לשנות את פרמטרי הסינון.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} onSelect={onSelectJob} />
      ))}
    </div>
  );
}

export default JobList;
