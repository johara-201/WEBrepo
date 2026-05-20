function JobCard({ job, openJobDetails }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start gap-3 mb-3">
        <h4 className="text-xl font-bold text-green-700">
          {job.title}
        </h4>

        <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
          {job.status}
        </span>
      </div>

      <p className="text-gray-600 mb-2">
        יישוב: {job.village}
      </p>

      <p className="text-gray-600 mb-2">
        תחום: {job.field}
      </p>

      <p className="text-gray-600 mb-2">
        השכלה: {job.education}
      </p>

      <p className="text-gray-600 mb-2">
        ניסיון: {job.experience}
      </p>

      <p className="text-gray-500 text-sm mb-4">
        מקור פרסום: {job.source}
      </p>

      <button
        onClick={() => openJobDetails(job.id)}
        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        צפייה בפרטים והגשה
      </button>
    </div>
  );
}

export default JobCard;