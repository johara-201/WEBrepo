function JobsTable({ jobs, onEdit, onDelete }) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        אין עדיין משרות במערכת.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-right text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3">שם משרה</th>
            <th className="px-4 py-3">ארגון</th>
            <th className="px-4 py-3">יישוב</th>
            <th className="px-4 py-3">סוג תפקיד</th>
            <th className="px-4 py-3">אחוז משרה</th>
            <th className="px-4 py-3">מקור</th>
            <th className="px-4 py-3">סטודנטים</th>
            <th className="px-4 py-3">פעולות</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-t border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-800">
                {job.title}
              </td>
              <td className="px-4 py-3">{job.organization}</td>
              <td className="px-4 py-3">{job.city}</td>
              <td className="px-4 py-3">{job.jobType}</td>
              <td className="px-4 py-3">{job.employmentPercent}%</td>
              <td className="px-4 py-3">
                {job.source === "manual" ? "פרסום עצמאי" : job.sourceName}
              </td>
              <td className="px-4 py-3">
                {job.suitableForStudents ? "כן" : "לא"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(job)}
                    className="rounded-md bg-stone-100 px-3 py-1 text-xs text-gray-700 hover:bg-stone-200">
                    ✏️ עריכה
                  </button>
                  <button onClick={() => onDelete(job)}
                    className="rounded-md bg-red-50 px-3 py-1 text-xs text-red-600 hover:bg-red-100">
                    🗑️ מחיקה
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobsTable;