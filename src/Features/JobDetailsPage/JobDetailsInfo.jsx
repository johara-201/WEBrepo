function JobDetailsInfo({ job }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {job.city && <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">📍 {job.city}</span>}
        {job.jobType && <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">{job.jobType}</span>}
        {job.employmentPercent && <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">{job.employmentPercent}% משרה</span>}
        {job.distanceMinutes && <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">עד {job.distanceMinutes} דק' נסיעה</span>}
        {job.suitableForStudents && <span className="rounded-full bg-[#e9f1ea] px-3 py-1 text-sm text-[#2f6b46]">מתאים לסטודנטים</span>}
      </div>
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">תיאור התפקיד</h2>
        <p className="leading-8 text-gray-700">{job.description}</p>
      </div>
    </div>
  );
}

export default JobDetailsInfo;
