function JobDetailsHeader({ job, onBack }) {
  return (
    <div className="mb-6">
      <button onClick={onBack} className="mb-4 text-sm text-[#2f6b46] hover:underline">
        ← חזרה לכל המשרות
      </button>
      <h1 className="text-2xl font-extrabold text-gray-800">{job.title}</h1>
      <p className="mt-1 text-base font-medium text-[#2f6b46]">{job.organization}</p>
    </div>
  );
}

export default JobDetailsHeader;
