import { useEffect, useState } from "react";
import heroIllustration from "../../assets/hero-illustration.png";
import NavBar from "../../Components/NavBar";
import { useLanguage } from "../../Context/LanguageContext";

const ABOUT_CONTENT = {
  he: {
    heroTitleLine1: "מחברים בין אנשים,",
    heroTitleHighlight: "קהילות והזדמנויות",
    heroText:
      "הזדמנויות לחיים היא פלטפורמה קהילתית המחברת בין תושבים, ארגונים, רשויות ובעלי תפקידים באזור בית הכרם, במטרה לחזק את החוסן הקהילתי ולעודד מעורבות חברתית משמעותית.",

    storyTitle: "הסיפור שלנו",
    whoTitle: "מי אנחנו?",
    storyP1:
      "אשכול בית הכרם פועל לחיזוק הקשרים בין יישובי האזור באמצעות יוזמות קהילתיות, התנדבות, תעסוקה חברתית ויצירת הזדמנויות לשיתוף פעולה בין תושבים וארגונים.",
    storyP2:
      "המטרה שלנו היא להנגיש חיבורים משמעותיים ולסייע לכל אדם למצוא את המקום שבו יוכל להשפיע, לתרום ולהתפתח.",

    valuesTitle: "הערכים שלנו",
    howTitle: "איך הפלטפורמה עובדת",
    numbersTitle: "במספרים",

    ctaTitle: "רוצים להיות חלק מהעשייה?",
    ctaText: "מצאו משרות, פרסמו יוזמות וצרו קשרים משמעותיים בקהילה.",
    ctaButton: "התחילו עכשיו",

    footer: "הזדמנויות לחיים | משרות בחינוך, נוער וקהילה",
    imageAlt: "קהילה",

    values: [
      { emoji: "🌱", title: "צמיחה קהילתית", desc: "פיתוח יוזמות המחזקות את הקהילה." },
      { emoji: "🤝", title: "שיתוף פעולה", desc: "חיבור בין אנשים, ארגונים ורשויות." },
      { emoji: "❤️", title: "מעורבות חברתית", desc: "עידוד תרומה והשפעה חיובית." },
      { emoji: "📈", title: "פיתוח הזדמנויות", desc: "יצירת מרחב לצמיחה אישית ומקצועית." },
    ],

    steps: [
      { num: "1", text: "פרסום משרה או יוזמה" },
      { num: "2", text: "חיפוש וסינון לפי תחום ויישוב" },
      { num: "3", text: "יצירת קשר עם המפרסם" },
      { num: "4", text: "חיבור לקהילה והשפעה" },
    ],

    kpis: {
      activeJobs: "משרות ויוזמות פעילות",
      organizations: "ארגונים שותפים",
      registeredUsers: "משתמשים רשומים",
      applications: "מועמדויות שהוגשו",
    },
  },

  ar: {
    heroTitleLine1: "نربط بين الناس،",
    heroTitleHighlight: "المجتمعات والفرص",
    heroText:
      "فرص للحياة هي منصة مجتمعية تربط بين السكان، المنظمات، السلطات وأصحاب الأدوار في منطقة بيت الكرم، بهدف تعزيز المناعة المجتمعية وتشجيع المشاركة الاجتماعية الهادفة.",

    storyTitle: "قصتنا",
    whoTitle: "من نحن؟",
    storyP1:
      "يعمل عنقود بيت الكرم على تعزيز الروابط بين بلدات المنطقة من خلال مبادرات مجتمعية، تطوع، تشغيل اجتماعي وخلق فرص للتعاون بين السكان والمنظمات.",
    storyP2:
      "هدفنا هو إتاحة روابط ذات معنى ومساعدة كل شخص على إيجاد المكان الذي يستطيع فيه التأثير، العطاء والتطور.",

    valuesTitle: "قيمنا",
    howTitle: "كيف تعمل المنصة",
    numbersTitle: "بالأرقام",

    ctaTitle: "هل تريدون أن تكونوا جزءًا من العمل؟",
    ctaText: "ابحثوا عن وظائف، انشروا مبادرات واصنعوا روابط ذات معنى في المجتمع.",
    ctaButton: "ابدأوا الآن",

    footer: "فرص للحياة | وظائف في التربية، الشباب والمجتمع",
    imageAlt: "مجتمع",

    values: [
      { emoji: "🌱", title: "نمو مجتمعي", desc: "تطوير مبادرات تقوّي المجتمع." },
      { emoji: "🤝", title: "تعاون", desc: "ربط بين الناس، المنظمات والسلطات." },
      { emoji: "❤️", title: "مشاركة اجتماعية", desc: "تشجيع العطاء والتأثير الإيجابي." },
      { emoji: "📈", title: "تطوير الفرص", desc: "خلق مساحة للنمو الشخصي والمهني." },
    ],

    steps: [
      { num: "1", text: "نشر وظيفة أو مبادرة" },
      { num: "2", text: "البحث والتصفية حسب المجال والبلدة" },
      { num: "3", text: "التواصل مع الناشر" },
      { num: "4", text: "الارتباط بالمجتمع والتأثير" },
    ],

    kpis: {
      activeJobs: "وظائف ومبادرات فعّالة",
      organizations: "منظمات شريكة",
      registeredUsers: "مستخدمون مسجّلون",
      applications: "طلبات تقديم أُرسلت",
    },
  },
};

function AboutPage({ onHome, onAdmin, onSearch, onAbout, onFaq, onDashboard, onAIChat }) {
  const { language } = useLanguage();
  const content = ABOUT_CONTENT[language] || ABOUT_CONTENT.he;

  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [stats, setStats] = useState({
    activeJobs: 0,
    organizations: 0,
    registeredUsers: 0,
    applications: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`${API}/api/jobs/stats/summary`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to load about stats:", error);
      }
    }

    loadStats();

    const intervalId = setInterval(loadStats, 15000);

    let socket;

    try {
      const wsUrl = API.replace(/^http/, "ws");
      socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "statsUpdated") {
            loadStats();
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
    }

    return () => {
      clearInterval(intervalId);

      if (socket) {
        socket.close();
      }
    };
  }, [API]);

  const KPIS = [
    { num: stats.activeJobs, label: content.kpis.activeJobs, suffix: "+" },
    { num: stats.organizations, label: content.kpis.organizations, suffix: "+" },
    { num: stats.registeredUsers, label: content.kpis.registeredUsers, suffix: "+" },
    { num: stats.applications, label: content.kpis.applications, suffix: "+" },
  ];

  const numberLocale = language === "ar" ? "ar" : "he-IL";

  return (
    <div dir="rtl" className="min-h-screen bg-white text-right text-gray-800 font-sans">
      <NavBar
        activePage="about"
        onHome={onHome}
        onSearch={onSearch}
        onAbout={onAbout}
        onFaq={onFaq}
        onAdmin={onAdmin}
        onDashboard={onDashboard}
        onAIChat={onAIChat}
      />

      <section className="relative w-full overflow-hidden flex flex-col md:flex-row items-center gap-10 px-6 py-16 max-w-7xl mx-auto">
        <div className="flex-1 order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            {content.heroTitleLine1}
            <br />
            <span className="text-[#2f6b46]">{content.heroTitleHighlight}</span>
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
            {content.heroText}
          </p>
        </div>

        <div className="flex-1 order-1 md:order-2">
          <img
            src={heroIllustration}
            alt={content.imageAlt}
            className="w-full max-w-lg rounded-3xl object-cover mx-auto"
          />
        </div>
      </section>

      <section className="bg-[#f9f8f4] py-16 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {content.storyTitle}
          </h2>

          <h3 className="text-lg font-semibold text-[#2f6b46] mb-3">
            {content.whoTitle}
          </h3>

          <p className="text-gray-600 leading-relaxed mb-5">
            {content.storyP1}
          </p>

          <p className="text-gray-600 leading-relaxed">
            {content.storyP2}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          {content.valuesTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-3 hover:shadow-md transition"
            >
              <div className="text-4xl">{value.emoji}</div>
              <h3 className="font-bold text-gray-800">{value.title}</h3>
              <p className="text-sm text-gray-500">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f9f8f4] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">
            {content.howTitle}
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {content.steps.map((step, index) => (
              <div key={step.num} className="flex sm:flex-col items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-[#2f6b46] text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                  {step.num}
                </div>

                <p className="text-sm font-semibold text-gray-700 text-center">
                  {step.text}
                </p>

                {index < content.steps.length - 1 && (
                  <div className="hidden sm:block flex-1 h-0.5 bg-[#2f6b46]/30 w-full mt-6 absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          {content.numbersTitle}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {KPIS.map((kpi) => (
            <div
              key={kpi.label}
              className="group relative overflow-hidden rounded-3xl border border-[#dfe9df] bg-white px-8 py-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[#2f6b46]" />

              <p className="mb-2 text-5xl font-extrabold text-[#2f6b46]">
                {Number(kpi.num).toLocaleString(numberLocale)}
                <span className="text-3xl text-[#2f6b46]">{kpi.suffix}</span>
              </p>

              <p className="text-sm font-bold text-gray-700">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#2f6b46] py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-3">
          {content.ctaTitle}
        </h2>

        <p className="text-white/80 text-lg mb-8">
          {content.ctaText}
        </p>

        <button
          onClick={onHome}
          className="bg-white text-[#2f6b46] font-bold px-10 py-4 rounded-2xl text-lg hover:bg-gray-50 transition shadow-lg"
        >
          {content.ctaButton}
        </button>
      </section>

      <footer className="bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 py-6">
        {content.footer}
      </footer>
    </div>
  );
}

export default AboutPage;