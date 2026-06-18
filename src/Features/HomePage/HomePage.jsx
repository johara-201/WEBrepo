import { useState, useEffect } from "react";
import { getJobs } from "./homeService";
import { filterJobs } from "../../Services/JobsService";
import JobList from "./JobList";

const CATEGORIES = [
  { label: "רכז/ת נועי",    value: "רכז",         emoji: "👥", iconBg: "#FFB74D" },
  { label: "מדריך/ה",        value: "מדריך",        emoji: "🧭", iconBg: "#FFD54F" },
  { label: "עובד/ת קהילה",   value: "עובד קהילה",   emoji: "🌱", iconBg: "#81C784" },
  { label: "מנהל/ת תוכנית", value: "מנהל תוכנית", emoji: "📋", iconBg: "#64B5F6" },
  { label: "חונך/ת חברתי",  value: "חונך",         emoji: "🤝", iconBg: "#F48FB1" },
  { label: "מנהל/ת",         value: "מנהל",         emoji: "🏢", iconBg: "#B39DDB" },
];

const NAV_LINKS = [
  { label: "דף הבית",       page: "home" },
  { label: "חיפוש משרות",   page: "home" },
  { label: "אודות",          page: "about" },
  { label: "שאלות ותשובות", page: "faq" },
];

/* ── איור Hero בSVG ── */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 380" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
      {/* שמיים */}
      <rect width="480" height="380" fill="#EBF5EB" rx="24"/>

      {/* שמש */}
      <circle cx="390" cy="60" r="38" fill="#FFF176" opacity="0.9"/>
      <circle cx="390" cy="60" r="28" fill="#FFD54F"/>

      {/* עננים */}
      <ellipse cx="120" cy="70" rx="45" ry="22" fill="white" opacity="0.85"/>
      <ellipse cx="150" cy="62" rx="35" ry="20" fill="white" opacity="0.85"/>
      <ellipse cx="95"  cy="65" rx="30" ry="18" fill="white" opacity="0.85"/>

      <ellipse cx="270" cy="50" rx="35" ry="17" fill="white" opacity="0.7"/>
      <ellipse cx="295" cy="43" rx="28" ry="15" fill="white" opacity="0.7"/>

      {/* הרים/גבעות רקע */}
      <ellipse cx="80"  cy="220" rx="120" ry="90" fill="#A5D6A7"/>
      <ellipse cx="400" cy="230" rx="130" ry="80" fill="#81C784"/>
      <ellipse cx="240" cy="200" rx="150" ry="100" fill="#C8E6C9"/>

      {/* בתים */}
      {/* בית 1 */}
      <rect x="60" y="190" width="55" height="45" fill="#FFCC80" rx="3"/>
      <polygon points="60,190 87,165 115,190" fill="#EF9A9A"/>
      <rect x="76" y="208" width="14" height="27" fill="#A5D6A7"/>
      <rect x="63" y="196" width="13" height="11" fill="#81D4FA" rx="2"/>
      <rect x="97" y="196" width="13" height="11" fill="#81D4FA" rx="2"/>

      {/* בית 2 */}
      <rect x="310" y="185" width="60" height="50" fill="#F8BBD9" rx="3"/>
      <polygon points="310,185 340,158 370,185" fill="#CE93D8"/>
      <rect x="328" y="206" width="16" height="29" fill="#A5D6A7"/>
      <rect x="313" y="192" width="14" height="12" fill="#81D4FA" rx="2"/>
      <rect x="342" y="192" width="14" height="12" fill="#81D4FA" rx="2"/>

      {/* בית 3 קטן */}
      <rect x="195" y="195" width="42" height="38" fill="#FFFDE7" rx="3"/>
      <polygon points="195,195 216,175 237,195" fill="#FFAB40"/>
      <rect x="210" y="212" width="11" height="21" fill="#A5D6A7"/>

      {/* עצים */}
      <rect x="148" y="210" width="7" height="30" fill="#795548"/>
      <ellipse cx="151" cy="200" rx="18" ry="22" fill="#388E3C"/>
      <ellipse cx="151" cy="193" rx="13" ry="16" fill="#43A047"/>

      <rect x="268" y="205" width="7" height="28" fill="#795548"/>
      <ellipse cx="271" cy="195" rx="16" ry="20" fill="#2E7D32"/>
      <ellipse cx="271" cy="188" rx="12" ry="15" fill="#388E3C"/>

      <rect x="430" y="215" width="6" height="25" fill="#795548"/>
      <ellipse cx="433" cy="207" rx="15" ry="18" fill="#388E3C"/>

      <rect x="25" y="218" width="6" height="22" fill="#795548"/>
      <ellipse cx="28" cy="211" rx="13" ry="16" fill="#43A047"/>

      {/* דשא */}
      <ellipse cx="240" cy="310" rx="240" ry="80" fill="#66BB6A"/>
      <rect x="0" y="295" width="480" height="85" fill="#66BB6A"/>
      <ellipse cx="240" cy="295" rx="240" ry="30" fill="#81C784"/>

      {/* דמויות */}
      {/* דמות 1 - עומדת שמאל */}
      <circle cx="145" cy="258" r="14" fill="#FFCC80"/>
      <rect x="136" y="272" width="18" height="32" fill="#1565C0" rx="4"/>
      <line x1="136" y1="278" x2="124" y2="295" stroke="#FFCC80" strokeWidth="5" strokeLinecap="round"/>
      <line x1="154" y1="278" x2="164" y2="292" stroke="#FFCC80" strokeWidth="5" strokeLinecap="round"/>
      <rect x="137" y="304" width="7" height="20" fill="#424242" rx="3"/>
      <rect x="147" y="304" width="7" height="20" fill="#424242" rx="3"/>

      {/* דמות 2 - יושבת מרכז */}
      <circle cx="230" cy="280" r="13" fill="#FFAB91"/>
      <rect x="221" y="293" width="18" height="24" fill="#E91E63" rx="4"/>
      <line x1="221" y1="298" x2="210" y2="312" stroke="#FFAB91" strokeWidth="5" strokeLinecap="round"/>
      <line x1="239" y1="298" x2="248" y2="310" stroke="#FFAB91" strokeWidth="5" strokeLinecap="round"/>
      <rect x="218" y="317" width="22" height="8" fill="#795548" rx="4"/>

      {/* דמות 3 - עומדת ימין */}
      <circle cx="320" cy="255" r="15" fill="#FFE0B2"/>
      <rect x="310" y="270" width="20" height="34" fill="#FF7043" rx="4"/>
      <line x1="310" y1="276" x2="297" y2="293" stroke="#FFE0B2" strokeWidth="5" strokeLinecap="round"/>
      <line x1="330" y1="276" x2="342" y2="290" stroke="#FFE0B2" strokeWidth="5" strokeLinecap="round"/>
      <rect x="311" y="304" width="8" height="22" fill="#37474F" rx="3"/>
      <rect x="322" y="304" width="8" height="22" fill="#37474F" rx="3"/>

      {/* פרחים */}
      {[60,110,175,260,350,410,450].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={310 + (i%3)*4} r="5" fill={["#FF8A65","#FFD54F","#F06292","#AED581","#4FC3F7","#CE93D8","#FF8A65"][i]}/>
          <rect x={x-1} y={312+(i%3)*4} width="2" height="8" fill="#66BB6A"/>
        </g>
      ))}
    </svg>
  );
}

function HomePage({ onSelectJob, onAdminClick }) {
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

  const cities    = [...new Set(jobs.map((j) => j.city).filter(Boolean))];
  const jobTypes  = [...new Set(jobs.map((j) => j.jobType).filter(Boolean))];
  const visibleJobs = filterJobs(jobs, filters);

  return (
    <div dir="rtl" className="min-h-screen bg-[#f5f0e8] text-right text-gray-800 font-sans">

      {/* ───── HEADER ───── */}
      <header className="sticky top-0 z-30 bg-[#f5f0e8]/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* לוגו */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2f6b46] flex items-center justify-center text-white text-lg shadow">
              🌿
            </div>
            <div className="leading-tight">
              <p className="font-bold text-[#1a3d2b] text-[15px]">אשכול בית הכרם</p>
              <p className="text-[10px] text-gray-500 tracking-wide">חינוך · קהילה · מנהיגות</p>
            </div>
          </div>

          {/* ניווט */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                className="text-sm text-gray-600 hover:text-[#2f6b46] font-medium transition"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* התחברות */}
          <button
            onClick={onAdminClick}
            className="text-sm font-semibold border-2 border-[#2f6b46] text-[#2f6b46] hover:bg-[#2f6b46] hover:text-white px-5 py-2 rounded-xl transition"
          >
            התחברות
          </button>
        </div>
      </header>

      {/* ───── HERO ───── */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6 flex flex-col md:flex-row items-center gap-10">
        {/* טקסט */}
        <div className="flex-1 order-2 md:order-1">
          <p className="text-sm text-[#2f6b46] font-semibold mb-3 tracking-wide">
            🌿 הזדמנויות לחיים
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-4">
            מוצאים את המקום<br />
            <span className="text-[#2f6b46]">שבו החינוך פוגש שליחות</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            פלטפורמת החיפוש למשרות בחינוך הבלתי פורמלי<br />
            באזור בית הכרם
          </p>

          {/* שורת חיפוש */}
          <div className="bg-white rounded-2xl shadow-md p-2 flex flex-col sm:flex-row gap-2 border border-stone-200">
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
              className="px-3 py-3 text-sm text-gray-600 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
            >
              <option value="all">כל הישובים</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filters.jobType}
              onChange={(e) => updateFilter("jobType", e.target.value)}
              className="px-3 py-3 text-sm text-gray-600 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
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

        {/* איור */}
        <div className="flex-1 order-1 md:order-2 flex justify-center">
          <HeroIllustration />
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
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition hover:shadow-md bg-[#f5f0e8] ${
                  isActive
                    ? "border-[#2f6b46] shadow-md"
                    : "border-stone-200 hover:border-[#2f6b46]/50"
                }`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{ backgroundColor: cat.iconBg + "55" }}
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
      <footer className="bg-white border-t border-stone-200 text-center text-xs text-gray-400 py-6">
        הזדמנויות לחיים | משרות בחינוך, נוער וקהילה · אשכול בית הכרם
      </footer>
    </div>
  );
}

export default HomePage;
