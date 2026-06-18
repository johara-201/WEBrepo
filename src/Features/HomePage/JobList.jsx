import JobCard from "./JobCard";

// מקבל מערך משרות (כבר מסונן ב-HomePage) ומציג כרטיס לכל אחת.
// אם אין תוצאות - מציג הודעה מתאימה במקום רשימה ריקה.

function JobList({ jobs, onSelectJob }) {
  // רינדור מותנה: מצב "אין תוצאות"
  if (jobs.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        לא נמצאו משרות התואמות את החיפוש.
      </p>
    );
  }

  // רשת כרטיסים - כרטיס לכל משרה
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} onSelect={onSelectJob} />
      ))}
    </div>
  );
}

export default JobList;