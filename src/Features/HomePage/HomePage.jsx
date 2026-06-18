import { useState, useEffect } from "react";
import { getJobs } from "./homeService";
import { filterJobs } from "../../Services/JobsService";
import JobList from "./JobList";
import heroImg from "../../assets/hero.png";

const CATEGORIES = [
  { label: "רכז/ת נועי",      value: "רכז",           emoji: "👥", bg: "#FFF3E0", ring: "#FFB74D" },
  { label: "מדריך/ה",          value: "מדריך",          emoji: "🧭", bg: "#FFFDE7", ring: "#FFD54F" },
  { label: "עובד/ת קהילה",     value: "עובד קהילה",     emoji: "🌱", bg: "#E8F5E9", ring: "#81C784" },
  { label: "מנהל/ת תוכנית",   value: "מנהל תוכנית",   emoji: "📋", bg: "#E3F2FD", ring: "#64B5F6" },
  { label: "חונך/ת חברתי",    value: "חונך",           emoji: "🤝", bg: "#FCE4EC", ring: "#F48FB1" },
  { label: "מנהל/ת",           value: "מנהל",           emoji: "🏢", bg: "#EDE7F6", ring: "#B39DDB" },
];

const NAV_LINKS = [
  { label: "דף הבית",       page: "home" },
  { label: "חיפוש משרות",   page: "home" },
  { label: "פרסום משרה",    page: "postJob" },
  { label: "אודות",          page: "about" },
  { label: "שאלות ותשובות", page: "faq" },
];

function HomePage({ onSelectJob, onAdminClick, onPostJobClick }) {
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
    if (activeCategory === cat.value) {
      setActiveCategory(null);
      updateFilter("jobType", "all");
    } else {
      setActiveCategory(cat.value);
      updateFilter("jobType", cat.value);
    }
    // גלול למשרות
    document.getElementById("jobs-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (page) => {
    if (page === "postJob" && onPostJobClick) onPostJobClick();
  };

  const cities = [...new Set(jobs.map((j) => j.city).filter(Boolean))];
  const jobTypes = [...new Set(jobs.map((j) => j.jobType).filter(Boolean))];
  const visibleJobs = filterJobs(jobs, filters);

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f6f0] text-right text-gray-800 font-sans">

      {/* ───── HEADER ───── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* לוגו */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2f6b46] flex items-center justify-center text-white text-lg font-bold shadow">
              🌿
            </div>
            <div className="leading-tight">
              <p className="font-bold text-[#1a3d2b] text-[15px]">אשכול בית הכרם</p>
              <p className="text-[10px] text-gray-400 tracking-wide">חינוך · קהילה · מנהיגות</p>
            </div>
          </div>

          {/* ניווט */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.page)}
                className="text-sm text-gray-600 hover:text-[#2f6b46] font-medium transition"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* כניסת מנהל */}
          <button
            onClick={onAdminClick}
            className="text-sm font-semibold border-2 border-[#2f6b46] text-[#2f6b46] hover:bg-[#2f6b46] hover:text-white px-5 py-2 rounded-xl transition"
          >
            התחברות
          </button>
        </div>
      </header>

      {/* ───── HERO ───── */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-4 flex flex-col md:flex-row items-center gap-8">

        {/* טקסט */}
        <div className="flex-1 order-2 md:order-1">
          <p className="text-sm text-[#2f6b46] font-semibold mb-3 tracking-wide">
            🌿 הזדמנויות לחיים
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-4">
            מוצאים את המקום<br />
            <span className="text-[#2f6b46]">שבו החינוך פוגש שליחות</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            פלטפורמת החיפוש למשרות בחינוך הבלתי פורמלי<br />
            באזור בית הכרם
          </p>

          {/* שורת חיפוש */}
          <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row gap-2 border border-gray-100">
            <input
              type="text"
              value={filters.searchText}
              onChange={(e) => updateFilter("searchText", e.target.value)}
              placeholder="מה אתם מחפשים?"
              className="flex-1 px-4 py-3 text-right text-gray-800 bg-transparent focus:outline-none placeholder-gray-400"
            />
            <select
              value={filters.city}
              onChange={(e) => updateFilter("city", e.target.value)}
              className="px-3 py-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
            >
              <option value="all">כל הישובים</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filters.jobType}
              onChange={(e) => updateFilter("jobType", e.target.value)}
              className="px-3 py-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
            >
              <option value="all">כל התפקידים</option>
              {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button
              onClick={() => document.getElementById("jobs-section")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#2f6b46] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#245539] transition whitespace-nowrap"
            >
              🔍 חפש משרות
            </button>
          </div>
        </div>

        {/* תמונה */}
        <div className="flex-1 order-1 md:order-2 flex justify-center">
          <img
            src={heroImg}
            alt="חינוך בלתי פורמלי"
            className="w-full max-w-md rounded-3xl object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </section>

      {/* ───── CATEGORIES ───── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">קטגוריות מובילות</h2>
          <button
            onClick={() => { setActiveCategory(null); updateFilter("jobType", "all"); }}
            className="text-sm text-[#2f6b46] hover:underline"
          >
            ← לכל הקטגוריות
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition hover:shadow-md ${
                  isActive
                    ? "border-[#2f6b46] shadow-md"
                    : "border-transparent hover:border-gray-200"
                }`}
                style={{ backgroundColor: cat.bg }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{ backgroundColor: cat.ring + "55" }}
                >
                  {cat.emoji}
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
      <footer className="bg-white border-t border-gray-100 text-center text-xs text-gray-400 py-6">
        הזדמנויות לחיים | משרות בחינוך, נוער וקהילה · אשכול בית הכרם
      </footer>
    </div>
  );
}

export default HomePage;
