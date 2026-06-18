function JobCard({ job, onSelect }) {
  return (
    <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-5 transition hover:shadow-md hover:border-[#2f6b46]/40">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-800">{job.title}</h2>
        <p className="text-sm font-medium text-[#2f6b46]">{job.organization}</p>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {job.city && <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-gray-700">📍 {job.city}</span>}
        {job.jobType && <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-gray-700">{job.jobType}</span>}
        {job.employmentPercent && <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-gray-700">{job.employmentPercent}% משרה</span>}
        {job.distanceMinutes && <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-gray-700">עד {job.distanceMinutes} דק' נסיעה</span>}
        {job.suitableForStudents && <span className="rounded-full bg-[#e9f1ea] px-2.5 py-1 text-xs text-[#2f6b46]">מתאים לסטודנטים</span>}
      </div>

      <p className="mb-4 grow text-sm text-gray-600 line-clamp-2">{job.description}</p>

      <div className="mt-auto flex items-center justify-between gap-3">
        <span className="text-xs text-gray-400">{job.source === "manual" ? "פרסום עצמאי" : job.sourceName}</span>
        <button
          onClick={() => onSelect(job)}
          className="rounded-lg bg-[#2f6b46] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#245539]"
        >
          לפרטים והגשת מועמדות
        </button>
      </div>
    </div>
  );
}

export default JobCard;