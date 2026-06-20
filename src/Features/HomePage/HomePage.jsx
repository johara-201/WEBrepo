import { useState, useEffect } from "react";
import { getJobs } from "./homeService";
import { filterJobs } from "../../Services/JobsService";
import JobList from "./JobList";
import heroIllustration from "../../assets/hero-illustration.png";
import NavBar from "../../Components/NavBar";
import icon1 from "../../assets/icon1.png";
import icon2 from "../../assets/icon2.png";
import icon3 from "../../assets/icon3.png";
import icon4 from "../../assets/icon4.png";
import icon5 from "../../assets/icon5.png";

/* אייקון SVG למנהל/ת */
function ManagerIcon() {
  return (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect x="6" y="28" width="36" height="16" rx="4" fill="#5C6BC0"/>
      <rect x="14" y="20" width="20" height="12" rx="3" fill="#7986CB"/>
      <circle cx="24" cy="14" r="8" fill="#9FA8DA"/>
      <rect x="20" y="32" width="8" height="8" rx="2" fill="#3F51B5"/>
    </svg>
  );
}

const CATEGORIES = [
  { label: "רכז/ת נוער",    value: "רכז",           icon: icon1 },
  { label: "מדריך/ה",        value: "מדריך",          icon: icon2 },
  { label: "עובד/ת קהילה",   value: "עובד קהילה",     icon: icon3 },
  { label: "מנהל/ת תוכנית", value: "מנהל תוכנית",   icon: icon4 },
  { label: "חונך/ת חברתי",  value: "חונך",           icon: icon5 },
  { label: "מנהל/ת",         value: "מנהל",           icon: null  }, // SVG
];

const NAV_LINKS = [
  { label: "דף הבית" },
  { label: "חיפוש משרות" },
  { label: "אודות" },
  { label: "שאלות ותשובות" },
];

function HomePage({ onSelectJob, onAdmin, onSearch, onAbout, onFaq, onHome, onDashboard }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchText: "",
    city: "all",
    jobType: "all",
    employmentPercent: "all",
    organization: "all",
    distanceMinutes: "all",
    forStudents: false,
  });
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const data = await getJobs();
        setJobs(data);
        setError(null);
      } catch (err) {
        setError("שגיאה בטעינה");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleCategoryClick = (cat) => {
    const next = activeCategory === cat.value ? null : cat.value;
    setActiveCategory(next);
    updateFilter("jobType", next ?? "all");
    document.getElementById("jobs-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const resetCategory = () => {
    setActiveCategory(null);
    updateFilter("jobType", "all");
  };

  const cities   = [...new Set(jobs.map((j) => j.city).filter(Boolean))];
  const jobTypes = [...new Set(jobs.map((j) => j.jobType).filter(Boolean))];
  const visibleJobs = filterJobs(jobs, filters);

  return (
    <div dir="rtl" className="min-h-screen bg-white text-right text-gray-800 font-sans">

      <NavBar activePage="home" onHome={onHome} onSearch={onSearch} onAbout={onAbout} onFaq={onFaq} onAdmin={onAdmin} onDashboard={onDashboard} />

      {/* ───── HERO (תמונת רקע מלאה) ───── */}
      <section
        className="relative w-full overflow-hidden flex flex-col justify-between"
        style={{
          backgroundImage: `url(${heroIllustration})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "460px",
        }}
      >
        {/* טקסט — גבוה ומרכזי */}
        <div className="flex-1 flex items-start justify-center px-6 pt-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-3 drop-shadow-sm">
              הזדמנויות לחיים
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-[#2f6b46] drop-shadow-sm">
              פלטפורמת משרות בחינוך, נוער וקהילה
            </p>
          </div>
        </div>

        {/* סרגל חיפוש בתחתית — לכל רוחב */}
        <div className="w-full bg-white/90 backdrop-blur-sm border-t border-gray-100 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-2 items-stretch">
            <input
              type="text"
              value={filters.searchText}
              onChange={(e) => updateFilter("searchText", e.target.value)}
              placeholder="מה אתם מחפשים?"
              className="flex-1 px-4 py-3 text-right text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none placeholder-gray-400"
            />
            <select
              value={filters.city}
              onChange={(e) => updateFilter("city", e.target.value)}
              className="px-3 py-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl focus:outline-none"
            >
              <option value="all">כל הישובים</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filters.jobType}
              onChange={(e) => updateFilter("jobType", e.target.value)}
              className="px-3 py-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl focus:outline-none"
            >
              <option value="all">כל התפקידים</option>
              {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button
              onClick={() => document.getElementById("jobs-section")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#2f6b46] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#245539] transition whitespace-nowrap"
            >
              חפש משרות
            </button>
          </div>
        </div>
      </section>

      {/* ───── CATEGORIES ───── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">קטגוריות מובילות</h2>
          <button
            onClick={resetCategory}
            className="bg-[#2f6b46] text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#245539] transition"
          >
            לכל הקטגוריות
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 bg-white transition hover:shadow-md ${
                  isActive
                    ? "border-[#2f6b46] shadow-md"
                    : "border-gray-100 hover:border-[#2f6b46]/40"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
                  {cat.icon
                    ? <img src={cat.icon} alt={cat.label} className="w-10 h-10 object-contain" />
                    : <ManagerIcon />
                  }
                </div>
                <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ───── JOBS ───── */}
      <section id="jobs-section" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">משרות אחרונות</h2>
          {!loading && !error && (
            <span className="text-sm text-gray-400">{visibleJobs.length} משרות נמצאו</span>
          )}
        </div>
        {loading && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">⏳</div>
            <p>טוען משרות...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">⚠️</div>
            <p>לא נמצאו משרות להצגה כרגע.</p>
          </div>
        )}
        {!loading && !error && <JobList jobs={visibleJobs} onSelectJob={onSelectJob} />}
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 py-6">
        הזדמנויות לחיים | משרות בחינוך, נוער וקהילה
      </footer>
    </div>
  );
}

export default HomePage;
