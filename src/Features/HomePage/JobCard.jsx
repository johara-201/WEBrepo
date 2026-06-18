function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "היום";
  if (days === 1) return "לפני יום";
  if (days < 7) return `לפני ${days} ימים`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "לפני שבוע";
  if (weeks < 5) return `לפני ${weeks} שבועות`;
  return `לפני ${Math.floor(days / 30)} חודשים`;
}

function JobCard({ job, onSelect }) {
  const ago = timeAgo(job.publishDate);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-[#2f6b46]/30 transition cursor-pointer"
      onClick={() => onSelect(job)}
    >
      {/* כותרת + ארגון */}
      <div>
        <h3 className="font-bold text-gray-800 text-base leading-snug">{job.title}</h3>
        <p className="text-sm text-[#2f6b46] font-medium mt-0.5">{job.organization}</p>
      </div>

      {/* תגיות */}
      <div className="flex flex-wrap gap-1.5">
        {job.city && (
          <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
            📍 {job.city}
          </span>
        )}
        {job.jobType && (
          <span className="text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
            {job.jobType}
          </span>
        )}
        {job.employmentPercent && (
          <span className="text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
            {job.employmentPercent}% משרה
          </span>
        )}
        {job.suitableForStudents && (
          <span className="text-xs text-[#2f6b46] bg-[#e9f5ef] rounded-full px-2.5 py-1">
            מתאים לסטודנטים
          </span>
        )}
      </div>

      {/* תיאור קצר */}
      {job.description && (
        <p className="text-sm text-gray-500 line-clamp-2 grow">{job.description}</p>
      )}

      {/* תחתית */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
        {ago && <span className="text-xs text-gray-400">{ago}</span>}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(job); }}
          className="bg-[#2f6b46] text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-[#245539] transition"
        >
          לפרטים
        </button>
      </div>
    </div>
  );
}

export default JobCard;
