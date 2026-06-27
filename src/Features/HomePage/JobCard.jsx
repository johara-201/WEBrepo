import { useLanguage } from "../../Context/LanguageContext";

const JOB_CARD_TEXT = {
  he: {
    today: "היום",
    oneDayAgo: "לפני יום",
    daysAgo: (days) => `לפני ${days} ימים`,
    oneWeekAgo: "לפני שבוע",
    weeksAgo: (weeks) => `לפני ${weeks} שבועות`,
    monthsAgo: (months) => `לפני ${months} חודשים`,
    employment: "משרה",
    suitableForStudents: "מתאים לסטודנטים",
    details: "לפרטים",
  },

  ar: {
    today: "اليوم",
    oneDayAgo: "قبل يوم",
    daysAgo: (days) => `قبل ${days} أيام`,
    oneWeekAgo: "قبل أسبوع",
    weeksAgo: (weeks) => `قبل ${weeks} أسابيع`,
    monthsAgo: (months) => `قبل ${months} أشهر`,
    employment: "وظيفة",
    suitableForStudents: "مناسب للطلاب",
    details: "للتفاصيل",
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
    "רכז/ת נוער": "مركّز/ة شباب",
    "רכז/ת קהילה": "مركّز/ة مجتمع",
    "עובד קהילה": "عامل مجتمعي",
    "עובדת קהילה": "عاملة مجتمعية",
    "עובד/ת קהילה": "عامل/ة مجتمع",
    "חינוך והדרכה": "تربية وإرشاد",
    "חינוך": "تربية",
    "מנהל/ת תוכנית": "مدير/ة برنامج",
    "מנחה קבוצות": "موجّه/ة مجموعات",
    "אחר": "آخر",
  },
};

function translateValue(value, language) {
  if (!value) return "";

  if (language === "ar" && VALUE_TRANSLATIONS.ar[value]) {
    return VALUE_TRANSLATIONS.ar[value];
  }

  return value;
}

function timeAgo(dateStr, language) {
  if (!dateStr) return null;

  const text = JOB_CARD_TEXT[language] || JOB_CARD_TEXT.he;

  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return text.today;
  if (days === 1) return text.oneDayAgo;
  if (days < 7) return text.daysAgo(days);

  const weeks = Math.floor(days / 7);

  if (weeks === 1) return text.oneWeekAgo;
  if (weeks < 5) return text.weeksAgo(weeks);

  const months = Math.floor(days / 30);
  return text.monthsAgo(months);
}

function JobCard({ job, onSelect }) {
  const { language } = useLanguage();
  const text = JOB_CARD_TEXT[language] || JOB_CARD_TEXT.he;

  const ago = timeAgo(job.publishDate, language);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-[#2f6b46]/30 transition cursor-pointer"
      onClick={() => onSelect(job)}
    >
      <div>
        <h3 className="font-bold text-gray-800 text-base leading-snug">
          {job.title}
        </h3>

        <p className="text-sm text-[#2f6b46] font-medium mt-0.5">
          {job.organization}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.city && (
          <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
            📍 {job.city}
          </span>
        )}

        {job.jobType && (
          <span className="text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
            {translateValue(job.jobType, language)}
          </span>
        )}

        {job.employmentPercent && (
          <span className="text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
            {job.employmentPercent}% {text.employment}
          </span>
        )}

        {job.suitableForStudents && (
          <span className="text-xs text-[#2f6b46] bg-[#e9f5ef] rounded-full px-2.5 py-1">
            {text.suitableForStudents}
          </span>
        )}
      </div>

      {job.description && (
        <p className="text-sm text-gray-500 line-clamp-2 grow">
          {job.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
        {ago && (
          <span className="text-xs text-gray-400">
            {ago}
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(job);
          }}
          className="bg-[#2f6b46] text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-[#245539] transition"
        >
          {text.details}
        </button>
      </div>
    </div>
  );
}

export default JobCard;