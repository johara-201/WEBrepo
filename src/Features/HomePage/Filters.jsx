function Filters({ jobs, filters, onChange }) {
  const cities = [...new Set(jobs.map((job) => job.city).filter(Boolean))];

  const jobTypes = [
    ...new Set(jobs.map((job) => job.jobType).filter(Boolean)),
  ];

  const organizations = [
    ...new Set(jobs.map((job) => job.organization).filter(Boolean)),
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {/* סינון לפי יישוב */}
      <div className="w-full">
        <label className="mb-1 block text-sm text-gray-600">יישוב</label>
        <select
          value={filters.city}
          onChange={(e) => onChange("city", e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
        >
          <option value="all">כל היישובים</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* סינון לפי סוג תפקיד */}
      <div className="w-full">
        <label className="mb-1 block text-sm text-gray-600">סוג תפקיד</label>
        <select
          value={filters.jobType}
          onChange={(e) => onChange("jobType", e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
        >
          <option value="all">כל התפקידים</option>
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* סינון לפי אחוז משרה */}
      <div className="w-full">
        <label className="mb-1 block text-sm text-gray-600">אחוז משרה</label>
        <select
          value={filters.employmentPercent}
          onChange={(e) => onChange("employmentPercent", e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
        >
          <option value="all">כל האחוזים</option>
          <option value="25">25% ומעלה</option>
          <option value="50">50% ומעלה</option>
          <option value="75">75% ומעלה</option>
          <option value="100">100%</option>
        </select>
      </div>

      {/* סינון לפי ארגון מגייס */}
      <div className="w-full">
        <label className="mb-1 block text-sm text-gray-600">ארגון מגייס</label>
        <select
          value={filters.organization}
          onChange={(e) => onChange("organization", e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
        >
          <option value="all">כל הארגונים</option>
          {organizations.map((organization) => (
            <option key={organization} value={organization}>
              {organization}
            </option>
          ))}
        </select>
      </div>

      {/* סינון לפי מרחק נסיעה */}
      <div className="w-full">
        <label className="mb-1 block text-sm text-gray-600">מרחק נסיעה</label>
        <select
          value={filters.distanceMinutes}
          onChange={(e) => onChange("distanceMinutes", e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
        >
          <option value="all">כל המרחקים</option>
          <option value="15">עד 15 דקות</option>
          <option value="30">עד 30 דקות</option>
          <option value="45">עד 45 דקות</option>
          <option value="60">עד שעה</option>
        </select>
      </div>

      {/* סינון עבודה לסטודנטים */}
      <div className="flex items-center gap-2 pt-6">
        <input
          id="forStudents"
          type="checkbox"
          checked={filters.forStudents || false}
          onChange={(e) => onChange("forStudents", e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="forStudents" className="text-sm text-gray-700">
          עבודה לסטודנטים
        </label>
      </div>
    </div>
  );
}

export default Filters;