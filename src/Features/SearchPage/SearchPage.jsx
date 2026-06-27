import { useState, useEffect } from "react";
import { getJobs } from "../HomePage/homeService";
import { filterJobs } from "../../Services/JobsService";
import NavBar from "../../Components/NavBar";
import { useLanguage } from "../../Context/LanguageContext";

const CATEGORY_ICONS = ["👥", "🌱", "🧭", "📋", "🤝", "🏢", "❤️", "🌟", "🎯", "💼"];
const ICON_COLORS = ["#E8F5E9", "#FFF3E0", "#E3F2FD", "#FCE4EC", "#EDE7F6", "#FFF8E1", "#E0F7FA", "#F3E5F5"];

const SEARCH_TEXT = {
  he: {
    filtersTitle: "סינון תוצאות",
    clearFilters: "נקה סינון",
    searchLabel: "חיפוש",
    searchPlaceholder: "תפקיד, ארגון...",
    jobTypeLabel: "סוג משרה",
    cityLabel: "יישוב",
    organizationLabel: "ארגון",
    employmentLabel: "היקף משרה",
    allCities: "כל יישוב",
    allOrganizations: "כל ארגון",
    allEmployment: "כל היקף",
    applyFilters: "הצג תוצאות",

    pageTitle: "חיפוש משרות",
    foundJobs: (count) => `נמצאו ${count} משרות`,
    sortNewest: "מיין: חדש ← ישן",
    sortOldest: "מיין: ישן ← חדש",
    loadingJobs: "טוען משרות...",
    noResults: "לא נמצאו משרות התואמות את הסינון.",

    suitableForStudents: "מתאים לסטודנטים",
    employmentWord: "משרה",
    details: "לפרטים",
    published: "פורסם",
    footer: "הזדמנויות לחיים | משרות בחינוך, נוער וקהילה",

    loading: "טוען...",
    noData: "אין נתונים",

    today: "היום",
    oneDayAgo: "לפני יום",
    daysAgo: (days) => `לפני ${days} ימים`,
    oneWeekAgo: "לפני שבוע",
    weeksAgo: (weeks) => `לפני ${weeks} שבועות`,
    monthsAgo: (months) => `לפני ${months} חודשים`,

    employmentOptions: {
      all: "כל היקף",
      25: "25% ומעלה",
      50: "50% ומעלה",
      75: "75% ומעלה",
      100: "100%",
    },
  },

  ar: {
    filtersTitle: "تصفية النتائج",
    clearFilters: "مسح التصفية",
    searchLabel: "بحث",
    searchPlaceholder: "وظيفة، جهة...",
    jobTypeLabel: "نوع الوظيفة",
    cityLabel: "البلدة",
    organizationLabel: "الجهة",
    employmentLabel: "نسبة الوظيفة",
    allCities: "كل البلدات",
    allOrganizations: "كل الجهات",
    allEmployment: "كل النسب",
    applyFilters: "عرض النتائج",

    pageTitle: "البحث عن وظائف",
    foundJobs: (count) => `تم العثور على ${count} وظيفة`,
    sortNewest: "ترتيب: الأحدث ← الأقدم",
    sortOldest: "ترتيب: الأقدم ← الأحدث",
    loadingJobs: "جارٍ تحميل الوظائف...",
    noResults: "لم يتم العثور على وظائف تطابق التصفية.",

    suitableForStudents: "مناسب للطلاب",
    employmentWord: "وظيفة",
    details: "للتفاصيل",
    published: "نُشر",
    footer: "فرص للحياة | وظائف في التربية، الشباب والمجتمع",

    loading: "جارٍ التحميل...",
    noData: "لا توجد بيانات",

    today: "اليوم",
    oneDayAgo: "قبل يوم",
    daysAgo: (days) => `قبل ${days} أيام`,
    oneWeekAgo: "قبل أسبوع",
    weeksAgo: (weeks) => `قبل ${weeks} أسابيع`,
    monthsAgo: (months) => `قبل ${months} أشهر`,

    employmentOptions: {
      all: "كل النسب",
      25: "25% فأكثر",
      50: "50% فأكثر",
      75: "75% فأكثر",
      100: "100%",
    },
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
    "חינוך": "تربية",
    "חינוך והדרכה": "تربية وإرشاد",
    "ליווי משפחות": "مرافقة عائلات",
    "מנהל/ת תוכנית": "مدير/ة برنامج",
    "מנחה קבוצות": "موجّه/ة مجموعات",
    "עובד/ת נוער": "عامل/ة شباب",
    "איש/אישה חינוך בלתי פורמלי": "عامل/ة في التربية غير الرسمية",
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

  const text = SEARCH_TEXT[language] || SEARCH_TEXT.he;

  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return text.today;
  if (days === 1) return text.oneDayAgo;
  if (days < 7) return text.daysAgo(days);

  const weeks = Math.floor(days / 7);

  if (weeks === 1) return text.oneWeekAgo;
  if (weeks < 5) return text.weeksAgo(weeks);

  return text.monthsAgo(Math.floor(days / 30));
}

function JobRow({ job, onSelect, idx }) {
  const { language } = useLanguage();
  const text = SEARCH_TEXT[language] || SEARCH_TEXT.he;

  const ago = timeAgo(job.publishDate, language);
  const icon = CATEGORY_ICONS[idx % CATEGORY_ICONS.length];
  const bg = ICON_COLORS[idx % ICON_COLORS.length];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 flex gap-4 items-start">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-lg mb-1 leading-snug">
          {job.title}
        </h3>

        <p className="text-sm text-gray-400 mb-3">
          {[job.organization, job.city].filter(Boolean).join(" · ")}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.jobType && (
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
              {translateValue(job.jobType, language)}
            </span>
          )}

          {job.suitableForStudents && (
            <span className="text-xs bg-[#e9f5ef] text-[#2f6b46] rounded-full px-3 py-1">
              {text.suitableForStudents}
            </span>
          )}

          {job.employmentPercent && (
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
              {job.employmentPercent}% {text.employmentWord}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelect(job)}
            className="bg-[#2f6b46] text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#245539] transition"
          >
            {text.details}
          </button>

          {ago && (
            <span className="text-xs text-gray-400">
              {text.published} {ago}
            </span>
          )}
        </div>
      </div>

      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
        style={{ backgroundColor: bg }}
      >
        {icon}
      </div>
    </div>
  );
}

const EMPTY_FILTERS = {
  searchText: "",
  city: "all",
  selectedJobTypes: [],
  employmentPercent: "all",
  organization: "all",
};

function SearchPage({
  onSelectJob,
  onHome,
  onAdmin,
  onSearch,
  onAbout,
  onFaq,
  onDashboard,
  onAIChat,
}) {
  const { language } = useLanguage();
  const text = SEARCH_TEXT[language] || SEARCH_TEXT.he;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [pending, setPending] = useState({ ...EMPTY_FILTERS });
  const [applied, setApplied] = useState({ ...EMPTY_FILTERS });

  useEffect(() => {
    getJobs()
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cities = [...new Set(jobs.map((job) => job.city).filter(Boolean))].sort();
  const organizations = [...new Set(jobs.map((job) => job.organization).filter(Boolean))].sort();
  const jobTypes = [...new Set(jobs.map((job) => job.jobType).filter(Boolean))].sort();

  const update = (key, value) => {
    setPending((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleJobType = (val) => {
    setPending((prev) => {
      const current = prev.selectedJobTypes;

      return {
        ...prev,
        selectedJobTypes: current.includes(val)
          ? current.filter((item) => item !== val)
          : [...current, val],
      };
    });
  };

  const applyFilters = () => {
    setApplied({ ...pending });
  };

  const resetFilters = () => {
    setPending({ ...EMPTY_FILTERS });
    setApplied({ ...EMPTY_FILTERS });
  };

  let visible = filterJobs(jobs, {
    searchText: applied.searchText,
    city: applied.city,
    jobType: "all",
    employmentPercent: applied.employmentPercent,
    organization: applied.organization,
    distanceMinutes: "all",
    forStudents: false,
  });

  if (applied.selectedJobTypes.length > 0) {
    visible = visible.filter((job) =>
      applied.selectedJobTypes.includes(job.jobType)
    );
  }

  visible = [...visible].sort((a, b) => {
    const dateA = new Date(a.publishDate || 0);
    const dateB = new Date(b.publishDate || 0);

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f8f4] text-right text-gray-800 font-sans">
      <NavBar
        activePage="search"
        onHome={onHome}
        onSearch={onSearch}
        onAbout={onAbout}
        onFaq={onFaq}
        onAdmin={onAdmin}
        onDashboard={onDashboard}
        onAIChat={onAIChat}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6 items-start">
        <aside className="w-64 shrink-0 sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800">
                {text.filtersTitle}
              </h2>

              <button
                onClick={resetFilters}
                className="text-xs text-[#2f6b46] hover:underline font-medium"
              >
                {text.clearFilters}
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                {text.searchLabel}
              </label>

              <input
                type="text"
                value={pending.searchText}
                onChange={(e) => update("searchText", e.target.value)}
                placeholder={text.searchPlaceholder}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2f6b46]"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-2 block">
                {text.jobTypeLabel}
              </label>

              <div className="flex flex-col gap-2">
                {loading ? (
                  <p className="text-xs text-gray-400">
                    {text.loading}
                  </p>
                ) : jobTypes.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    {text.noData}
                  </p>
                ) : (
                  jobTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={pending.selectedJobTypes.includes(type)}
                        onChange={() => toggleJobType(type)}
                        className="accent-[#2f6b46] w-4 h-4 rounded"
                      />

                      {translateValue(type, language)}
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                {text.cityLabel}
              </label>

              <select
                value={pending.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2f6b46] bg-white"
              >
                <option value="all">
                  {text.allCities}
                </option>

                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                {text.organizationLabel}
              </label>

              <select
                value={pending.organization}
                onChange={(e) => update("organization", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2f6b46] bg-white"
              >
                <option value="all">
                  {text.allOrganizations}
                </option>

                {organizations.map((organization) => (
                  <option key={organization} value={organization}>
                    {organization}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                {text.employmentLabel}
              </label>

              <select
                value={pending.employmentPercent}
                onChange={(e) => update("employmentPercent", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2f6b46] bg-white"
              >
                <option value="all">
                  {text.employmentOptions.all}
                </option>

                <option value="25">
                  {text.employmentOptions[25]}
                </option>

                <option value="50">
                  {text.employmentOptions[50]}
                </option>

                <option value="75">
                  {text.employmentOptions[75]}
                </option>

                <option value="100">
                  {text.employmentOptions[100]}
                </option>
              </select>
            </div>

            <button
              onClick={applyFilters}
              className="w-full bg-[#2f6b46] text-white font-bold py-3 rounded-xl hover:bg-[#245539] transition text-sm"
            >
              {text.applyFilters}
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-gray-900">
              {text.pageTitle}
            </h1>

            <div className="flex items-center gap-3">
              {!loading && (
                <span className="text-sm text-gray-400">
                  {text.foundJobs(visible.length)}
                </span>
              )}

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2f6b46]"
              >
                <option value="newest">
                  {text.sortNewest}
                </option>

                <option value="oldest">
                  {text.sortOldest}
                </option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-3">⏳</div>
              <p>{text.loadingJobs}</p>
            </div>
          )}

          {!loading && visible.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p>{text.noResults}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {visible.map((job, idx) => (
              <JobRow
                key={job._id}
                job={job}
                onSelect={onSelectJob}
                idx={idx}
              />
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-100 text-center text-xs text-gray-400 py-6 mt-10">
        {text.footer}
      </footer>
    </div>
  );
}

export default SearchPage;