import { useLanguage } from "../../Context/LanguageContext";

const JOBS_TABLE_TEXT = {
  he: {
    empty: "אין עדיין משרות במערכת.",
    title: "שם משרה",
    organization: "ארגון",
    city: "יישוב",
    jobType: "סוג תפקיד",
    employmentPercent: "אחוז משרה",
    source: "מקור",
    students: "סטודנטים",
    actions: "פעולות",
    manualSource: "פרסום עצמאי",
    yes: "כן",
    no: "לא",
    edit: "עריכה",
    delete: "מחיקה",
  },

  ar: {
    empty: "لا توجد وظائف في النظام بعد.",
    title: "اسم الوظيفة",
    organization: "الجهة",
    city: "البلدة",
    jobType: "نوع الوظيفة",
    employmentPercent: "نسبة الوظيفة",
    source: "المصدر",
    students: "مناسب للطلاب",
    actions: "إجراءات",
    manualSource: "نشر ذاتي",
    yes: "نعم",
    no: "لا",
    edit: "تعديل",
    delete: "حذف",
  },
};

const VALUE_TRANSLATIONS = {
  ar: {
    "מדריך": "مرشد",
    "מדריכה": "مرشدة",
    "מדריך/ה": "مرشد/ة",
    "רכז": "مركّز",
    "רכזת": "مركّزة",
    "רכז/ת": "مركّز/ة",
    "עובד קהילה": "عامل مجتمعي",
    "עובדת קהילה": "عاملة مجتمعية",
    "עובד/ת קהילה": "عامل/ة مجتمعي/ة",
    "חינוך": "تربية",
    "ניהול": "إدارة",
    "אחר": "آخر",
    "פרסום עצמאי": "نشر ذاتي",
  },
};

function translateValue(value, language) {
  if (!value) return "";

  if (language === "ar" && VALUE_TRANSLATIONS.ar[value]) {
    return VALUE_TRANSLATIONS.ar[value];
  }

  return value;
}

function JobsTable({ jobs, onEdit, onDelete }) {
  const { language } = useLanguage();
  const text = JOBS_TABLE_TEXT[language] || JOBS_TABLE_TEXT.he;

  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        {text.empty}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-right text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3">{text.title}</th>
            <th className="px-4 py-3">{text.organization}</th>
            <th className="px-4 py-3">{text.city}</th>
            <th className="px-4 py-3">{text.jobType}</th>
            <th className="px-4 py-3">{text.employmentPercent}</th>
            <th className="px-4 py-3">{text.source}</th>
            <th className="px-4 py-3">{text.students}</th>
            <th className="px-4 py-3">{text.actions}</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-t border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-800">
                {job.title}
              </td>

              <td className="px-4 py-3">
                {job.organization}
              </td>

              <td className="px-4 py-3">
                {job.city}
              </td>

              <td className="px-4 py-3">
                {translateValue(job.jobType, language)}
              </td>

              <td className="px-4 py-3">
                {job.employmentPercent}%
              </td>

              <td className="px-4 py-3">
                {job.source === "manual"
                  ? text.manualSource
                  : translateValue(job.sourceName, language)}
              </td>

              <td className="px-4 py-3">
                {job.suitableForStudents ? text.yes : text.no}
              </td>

              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(job)}
                    className="rounded-md bg-stone-100 px-3 py-1 text-xs text-gray-700 hover:bg-stone-200"
                  >
                    ✏️ {text.edit}
                  </button>

                  <button
                    onClick={() => onDelete(job)}
                    className="rounded-md bg-red-50 px-3 py-1 text-xs text-red-600 hover:bg-red-100"
                  >
                    🗑️ {text.delete}
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