import { useState, useEffect } from "react";
import { getJobs } from "../HomePage/homeService";
import { filterJobs } from "../../Services/JobsService";
import logoImg from "../../assets/logo.png";

const JOB_TYPE_OPTIONS = [
  { value: "משרה מלאה",   label: "משרה מלאה" },
  { value: "משרה חלקית",  label: "משרה חלקית" },
  { value: "שעות",         label: "שעות" },
  { value: "התנדבות",      label: "התנדבות" },
  { value: "פרילנס",       label: "פרילנס" },
];

const CATEGORY_ICONS = ["👥","🌱","🧭","📋","🤝","🏢","❤️","🌟","🎯","💼"];

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "היום";
  if (days === 1) return "לפני יום";
  if (days < 7) return `לפני ${days} ימים`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "לפני שבוע";
  if (weeks < 5) return `לפני ${weeks} שבועות`;
  return `לפני ${Math.floor(days / 30)} חודשים`;
}

const ICON_COLORS = ["#E8F5E9","#FFF3E0","#E3F2FD","#FCE4EC","#EDE7F6","#FFF8E1","#E0F7FA","#F3E5F5"];

function JobRow({ job, onSelect, idx }) {
  const ago  = timeAgo(job.publishDate);
  const icon = CATEGORY_ICONS[idx % CATEGORY_ICONS.length];
  const bg   = ICON_COLORS[idx % ICON_COLORS.length];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 flex gap-4 items-start">
      {/* תוכן */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-lg mb-1 leading-snug">{job.title}</h3>
        <p className="text-sm text-gray-400 mb-3">
          {[job.organization, job.city].filter(Boolean).join(" · ")}
        </p>

        {/* תגיות */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.jobType && (
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">{job.jobType}</span>
          )}
          {job.suitableForStudents && (
            <span className="text-xs bg-[#e9f5ef] text-[#2f6b46] rounded-full px-3 py-1">מתאים לסטודנטים</span>
          )}
          {job.employmentPercent && (
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">{job.employmentPercent}% משרה</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelect(job)}
            className="bg-[#2f6b46] text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#245539] transition"
          >
            לפרטים
          </button>
          {ago && <span className="text-xs text-gray-400">פורסם {ago}</span>}
        </div>
      </div>

      {/* אייקון ימין */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
        style={{ backgroundColor: bg }}
      >
        {icon}
      </div>
    </div>
  );
}

function SearchPage({ onSelectJob, onBack, onAdminClick, onAboutClick, onFaqClick }) {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  const [pendingFilters, setPendingFilters] = useState({
    searchText: "", city: "all", jobType: "all",
    employmentPercent: "all", organization: "all",
    distanceMinutes: "all", forStudents: false,
    jobTypeChecks: [],
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...pendingFilters });

  useEffect(() => {
    getJobs()
      .then((data) => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cities        = [...new Set(jobs.map((j) => j.city).filter(Boolean))];
  const organizations = [...new Set(jobs.map((j) => j.organization).filter(Boolean))];

  const updatePending = (key, value) =>
    setPendingFilters((prev) => ({ ...prev, [key]: value }));

  const toggleJobType = (val) => {
    setPendingFilters((prev) => {
      const checks = prev.jobTypeChecks.includes(val)
        ? prev.jobTypeChecks.filter((v) => v !== val)
        : [...prev.jobTypeChecks, val];
      return { ...prev, jobTypeChecks: checks };
    });
  };

  const applyFilters = () => setAppliedFilters({ ...pendingFilters });

  const resetFilters = () => {
    const empty = {
      searchText: "", city: "all", jobType: "all",
      employmentPercent: "all", organization: "all",
      distanceMinutes: "all", forStudents: false, jobTypeChecks: [],
    };
    setPendingFilters(empty);
    setAppliedFilters(empty);
  };

  // סינון + מיון
  const filtersForService = {
    ...appliedFilters,
    jobType: appliedFilters.jobTypeChecks.length === 1
      ? appliedFilters.jobTypeChecks[0]
      : "all",
  };

  let visible = filterJobs(jobs, filtersForService);

  // סינון מרובה לסוג משרה
  if (appliedFilters.jobTypeChecks.length > 1) {
    visible = visible.filter((j) => appliedFilters.jobTypeChecks.includes(j.jobType));
  }

  // מיון
  visible = [...visible].sort((a, b) => {
    const da = new Date(a.publishDate || 0);
    const db = new Date(b.publishDate || 0);
    return sortOrder === "newest" ? db - da : da - db;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f8f4] text-right text-gray-800 font-sans">

      {/* ───── HEADER ───── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <button onClick={onBack}>
            <img src={logoImg} alt="אשכול בית הכרם" className="h-14 w-auto" />
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: "דף הבית",       fn: onBack },
              { label: "חיפוש משרות",   fn: null },
              { label: "אודות",          fn: onAboutClick },
              { label: "שאלות ותשובות", fn: onFaqClick },
            ].map(({ label, fn }) => (
              <button
                key={label}
                onClick={fn}
                className={`text-sm font-medium transition ${
                  label === "חיפוש משרות"
                    ? "text-[#2f6b46] font-bold border-b-2 border-[#2f6b46] pb-0.5"
                    : "text-gray-600 hover:text-[#2f6b46]"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <button
            onClick={onAdminClick}
            className="text-sm font-semibold border-2 border-[#2f6b46] text-[#2f6b46] hover:bg-[#2f6b46] hover:text-white px-5 py-2 rounded-xl transition"
          >
            התחברות
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6 items-start">

        {/* ───── SIDEBAR ───── */}
        <aside className="w-64 shrink-0 sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800">סינון תוצאות</h2>
              <button
                onClick={resetFilters}
                className="text-xs text-[#2f6b46] hover:underline font-medium"
              >
                נקה סינון
              </button>
            </div>

            {/* חיפוש טקסט */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">חיפוש</label>
              <input
                type="text"
                value={pendingFilters.searchText}
                onChange={(e) => updatePending("searchText", e.target.value)}
                placeholder="תפקיד, ארגון..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2f6b46]"
              />
            </div>

            {/* סוג משרה — checkboxes */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-2 block">סוג משרה</label>
              <div className="flex flex-col gap-2">
                {JOB_TYPE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pendingFilters.jobTypeChecks.includes(opt.value)}
                      onChange={() => toggleJobType(opt.value)}
                      className="accent-[#2f6b46] w-4 h-4 rounded"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* יישוב */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">יישוב</label>
              <select
                value={pendingFilters.city}
                onChange={(e) => updatePending("city", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2f6b46] bg-white"
              >
                <option value="all">כל יישוב</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* ארגון */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">ארגון</label>
              <select
                value={pendingFilters.organization}
                onChange={(e) => updatePending("organization", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2f6b46] bg-white"
              >
                <option value="all">כל ארגון</option>
                {organizations.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* היקף משרה */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">היקף משרה</label>
              <select
                value={pendingFilters.employmentPercent}
                onChange={(e) => updatePending("employmentPercent", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2f6b46] bg-white"
              >
                <option value="all">כל היקף</option>
                <option value="25">25% ומעלה</option>
                <option value="50">50% ומעלה</option>
                <option value="75">75% ומעלה</option>
                <option value="100">100%</option>
              </select>
            </div>

            {/* כפתור הגש */}
            <button
              onClick={applyFilters}
              className="w-full bg-[#2f6b46] text-white font-bold py-3 rounded-xl hover:bg-[#245539] transition text-sm"
            >
              הצג תוצאות
            </button>
          </div>
        </aside>

        {/* ───── RESULTS ───── */}
        <div className="flex-1 min-w-0">
          {/* כותרת + מיון */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-gray-900">חיפוש משרות</h1>
            <div className="flex items-center gap-3">
              {!loading && (
                <span className="text-sm text-gray-400">נמצאו {visible.length} משרות</span>
              )}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2f6b46]"
              >
                <option value="newest">מיין: חדש → ישן</option>
                <option value="oldest">מיין: ישן → חדש</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-3">⏳</div>
              <p>טוען משרות...</p>
            </div>
          )}

          {!loading && visible.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p>לא נמצאו משרות התואמות את הסינון.</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {visible.map((job, idx) => (
              <JobRow key={job._id} job={job} onSelect={onSelectJob} idx={idx} />
            ))}
          </div>
        </div>
      </div>

      {/* ───── FOOTER ───── */}
      <footer className="bg-white border-t border-gray-100 text-center text-xs text-gray-400 py-6 mt-10">
        הזדמנויות לחיים | משרות בחינוך, נוער וקהילה
      </footer>
    </div>
  );
}

export default SearchPage;
