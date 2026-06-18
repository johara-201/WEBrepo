import { useState, useEffect } from "react";
import { getJobs } from "./homeService";
import { filterJobs } from "../../Services/JobsService";

import SearchBar from "./SearchBar";
import Filters from "./Filters";
import JobList from "./JobList";

const categories = [
  { label: "הכל", value: "all" },
  { label: "רכז נוער", value: "רכז" },
  { label: "מדריך/ה", value: "מדריך" },
  { label: "עובד/ת קהילה", value: "עובד קהילה" },
];

function HomePage({ onSelectJob, onAdminClick }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchText: "", city: "all", jobType: "all",
    employmentPercent: "all", organization: "all",
    distanceMinutes: "all", forStudents: false,
  });

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const data = await getJobs();
        setJobs(data);
        setError(null);
      } catch (err) {
        setError("אירעה שגיאה בטעינת המשרות. נסו לרענן את הדף.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const visibleJobs = filterJobs(jobs, filters);
  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div dir="rtl" className="min-h-screen bg-[#f6f5ef] text-right text-gray-800">
      {/* כותרת עליונה */}
      <header className="sticky top-0 z-20 bg-[#f6f5ef]/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <div className="leading-tight">
              <p className="font-extrabold text-[#2f6b46]">אשכול בית הכרם</p>
              <p className="text-[11px] text-gray-500">חינוך · קהילה · מנהיגות</p>
            </div>
          </div>
          <button
            onClick={onAdminClick}
            className="text-sm font-medium border border-[#2f6b46] text-[#2f6b46] hover:bg-[#2f6b46] hover:text-white px-4 py-1.5 rounded-lg transition"
          >
            כניסת מנהל
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero ירוק מעוצב */}
       <section className="relative overflow-hidden rounded-3xl mb-8 bg-linear-to-bl from-[#5a9e74] via-[#6fb088] to-[#4a8c63] text-white">
          {/* עיגולים זוהרים לרקע */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative px-6 sm:px-12 py-14 max-w-2xl">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium mb-4">
              🌿 פלטפורמה אזורית
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-snug">
              מוצאים הזדמנויות בחינוך הבלתי פורמלי באזור בית הכרם
            </h1>
            <p className="mt-3 text-white/95">
              משרות שמחברות אנשים, קהילות וערכים — במקום אחד.
            </p>
            <div className="mt-6">
              <SearchBar
                value={filters.searchText}
                onChange={(text) => updateFilter("searchText", text)}
              />
            </div>
          </div>
        </section>

        {/* צ'יפים של תחומים */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((c) => {
            const active = filters.jobType === c.value;
            return (
              <button
                key={c.value}
                onClick={() => updateFilter("jobType", c.value)}
                className={
                  "px-4 py-1.5 rounded-full text-sm border transition " +
                  (active
                    ? "bg-[#2f6b46] text-white border-[#2f6b46] shadow-sm"
                    : "bg-white text-gray-700 border-stone-200 hover:border-[#2f6b46]")
                }
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* כרטיס סינון */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 shadow-sm">
          <Filters jobs={jobs} filters={filters} onChange={updateFilter} />
        </div>

        {/* תוצאות */}
        {loading && <p className="text-center text-gray-500 py-10">טוען משרות...</p>}
        {error && (
          <div className="text-center py-12">
            <p className="text-gray-600">לא נמצאו משרות להצגה כרגע.</p>
            <p className="text-sm text-gray-400 mt-1">ודאו שהשרת ומסד הנתונים פעילים.</p>
          </div>
        )}
        {!loading && !error && (
          <>
            <p className="text-sm text-gray-500 mb-3">נמצאו {visibleJobs.length} משרות</p>
            <JobList jobs={visibleJobs} onSelectJob={onSelectJob} />
          </>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-8">
        אשכול בית הכרם · פלטפורמת משרות בחינוך הבלתי פורמלי
      </footer>
    </div>
  );
}

export default HomePage;