import JobCard from "./JobCard";
import { useLanguage } from "../../Context/LanguageContext";

const JOB_LIST_TEXT = {
  he: {
    noJobs: "לא נמצאו משרות התואמות את החיפוש.",
    changeFilters: "נסו לשנות את פרמטרי הסינון.",
  },

  ar: {
    noJobs: "لم يتم العثور على وظائف تطابق البحث.",
    changeFilters: "حاولوا تغيير إعدادات التصفية.",
  },
};

function JobList({ jobs, onSelectJob }) {
  const { language } = useLanguage();
  const text = JOB_LIST_TEXT[language] || JOB_LIST_TEXT.he;

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-4xl mb-3">🔍</div>

        <p>{text.noJobs}</p>

        <p className="text-sm mt-1">
          {text.changeFilters}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          onSelect={onSelectJob}
        />
      ))}
    </div>
  );
}

export default JobList;