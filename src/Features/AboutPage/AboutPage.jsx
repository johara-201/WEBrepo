import heroIllustration from "../../assets/hero-illustration.png";
import NavBar from "../../Components/NavBar";

const VALUES = [
  { emoji: "🌱", title: "צמיחה קהילתית",    desc: "פיתוח יוזמות המחזקות את הקהילה." },
  { emoji: "🤝", title: "שיתוף פעולה",       desc: "חיבור בין אנשים, ארגונים ורשויות." },
  { emoji: "❤️", title: "מעורבות חברתית",    desc: "עידוד תרומה והשפעה חיובית." },
  { emoji: "📈", title: "פיתוח הזדמנויות",   desc: "יצירת מרחב לצמיחה אישית ומקצועית." },
];

const STEPS = [
  { num: "1", text: "פרסום משרה או יוזמה" },
  { num: "2", text: "חיפוש וסינון לפי תחום ויישוב" },
  { num: "3", text: "יצירת קשר עם המפרסם" },
  { num: "4", text: "חיבור לקהילה והשפעה" },
];

const KPIS = [
  { num: "350+", label: "משרות ויוזמות פעילות" },
  { num: "40+",  label: "ארגונים שותפים" },
  { num: "1,000+", label: "משתמשים רשומים" },
  { num: "15",   label: "יישובים באזור" },
];

function AboutPage({ onHome, onAdmin, onSearch, onAbout, onFaq }) {
  const onBack = onHome;
  return (
    <div dir="rtl" className="min-h-screen bg-white text-right text-gray-800 font-sans">

      <NavBar activePage="about" onHome={onHome} onSearch={onSearch} onAbout={onAbout} onFaq={onFaq} onAdmin={onAdmin} />

      {/* ───── HERO ───── */}
      <section
        className="relative w-full overflow-hidden flex flex-col md:flex-row items-center gap-10 px-6 py-16 max-w-7xl mx-auto"
      >
        {/* טקסט */}
        <div className="flex-1 order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            מחברים בין אנשים,<br />
            <span className="text-[#2f6b46]">קהילות והזדמנויות</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
            הזדמנויות לחיים היא פלטפורמה קהילתית המחברת בין תושבים, ארגונים,
            רשויות ובעלי תפקידים באזור בית הכרם, במטרה לחזק את החוסן הקהילתי
            ולעודד מעורבות חברתית משמעותית.
          </p>
        </div>
        {/* תמונה */}
        <div className="flex-1 order-1 md:order-2">
          <img
            src={heroIllustration}
            alt="קהילה"
            className="w-full max-w-lg rounded-3xl object-cover mx-auto"
          />
        </div>
      </section>

      {/* ───── הסיפור שלנו ───── */}
      <section className="bg-[#f9f8f4] py-16 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">הסיפור שלנו</h2>
          <h3 className="text-lg font-semibold text-[#2f6b46] mb-3">מי אנחנו?</h3>
          <p className="text-gray-600 leading-relaxed mb-5">
            אשכול בית הכרם פועל לחיזוק הקשרים בין יישובי האזור באמצעות יוזמות
            קהילתיות, התנדבות, תעסוקה חברתית ויצירת הזדמנויות לשיתוף פעולה בין
            תושבים וארגונים.
          </p>
          <p className="text-gray-600 leading-relaxed">
            המטרה שלנו היא להנגיש חיבורים משמעותיים ולסייע לכל אדם למצוא את
            המקום שבו יוכל להשפיע, לתרום ולהתפתח.
          </p>
        </div>
      </section>

      {/* ───── הערכים שלנו ───── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">הערכים שלנו</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-3 hover:shadow-md transition"
            >
              <div className="text-4xl">{v.emoji}</div>
              <h3 className="font-bold text-gray-800">{v.title}</h3>
              <p className="text-sm text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── איך הפלטפורמה עובדת ───── */}
      <section className="bg-[#f9f8f4] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">איך הפלטפורמה עובדת</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex sm:flex-col items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-[#2f6b46] text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                  {step.num}
                </div>
                <p className="text-sm font-semibold text-gray-700 text-center">{step.text}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block flex-1 h-0.5 bg-[#2f6b46]/30 w-full mt-6 absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── נתונים ───── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">במספרים</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {KPIS.map((k) => (
            <div
              key={k.label}
              className="bg-[#f9f8f4] rounded-2xl p-8 text-center border border-gray-100"
            >
              <p className="text-4xl font-extrabold text-[#2f6b46] mb-2">{k.num}</p>
              <p className="text-sm text-gray-500 font-medium">{k.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="bg-[#2f6b46] py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-3">רוצים להיות חלק מהעשייה?</h2>
        <p className="text-white/80 text-lg mb-8">
          מצאו משרות, פרסמו יוזמות וצרו קשרים משמעותיים בקהילה.
        </p>
        <button
          onClick={onBack}
          className="bg-white text-[#2f6b46] font-bold px-10 py-4 rounded-2xl text-lg hover:bg-gray-50 transition shadow-lg"
        >
          התחילו עכשיו
        </button>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 py-6">
        הזדמנויות לחיים | משרות בחינוך, נוער וקהילה
      </footer>
    </div>
  );
}

export default AboutPage;
