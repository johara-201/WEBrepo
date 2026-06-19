import { useState } from "react";
import logoImg from "../../assets/logo.png";

const FAQ_SECTIONS = [
  {
    category: "מחפשי עבודה",
    emoji: "🔍",
    items: [
      {
        q: "איך מחפשים משרה באתר?",
        a: "בדף הבית תוכלו להקליד מילת חיפוש, לסנן לפי יישוב או סוג תפקיד וללחוץ על 'חפש משרות'. תוכלו גם לעיין לפי קטגוריה.",
      },
      {
        q: "אילו סוגי משרות ניתן למצוא?",
        a: "הפלטפורמה מתמקדת במשרות בתחום הנוער, החינוך הבלתי פורמלי, הקהילה והמעורבות החברתית — מדריכים, רכזי נוער, עובדי קהילה, מנהלי תוכניות ועוד.",
      },
      {
        q: "לאיזה אזור גיאוגרפי מיועדות המשרות?",
        a: "הפלטפורמה מתמקדת באזור אשכול בית הכרם — כרמיאל, סח'נין, מג'ד אל-כרום, דיר אל-אסד, בענה, נחף, ראמה, סאג'ור, שעב, משגב ועוד. משרות עד כשעת נסיעה מהאזור.",
      },
      {
        q: "איך מגישים מועמדות?",
        a: "לוחצים על כרטיס המשרה, עוברים לדף הפרטים ולוחצים על 'הגשת מועמדות'. ממלאים שם, אימייל, טלפון והודעה — וזהו.",
      },
      {
        q: "האם השירות בחינם?",
        a: "כן, הפלטפורמה חינמית לחלוטין עבור מחפשי עבודה.",
      },
    ],
  },
  {
    category: "מפרסמי משרות",
    emoji: "📢",
    items: [
      {
        q: "מי יכול לפרסם משרה?",
        a: "רשויות מקומיות, מחלקות נוער, מתנ\"סים, מרכזים קהילתיים, תנועות נוער, עמותות וארגונים חינוכיים הפועלים באזור.",
      },
      {
        q: "איך מפרסמים משרה?",
        a: "כניסה דרך כפתור 'התחברות' בניווט העליון, ואז ממשק הניהול מאפשר הוספת משרה חדשה עם כל הפרטים הנדרשים.",
      },
      {
        q: "איך רואים מועמדויות שהתקבלו?",
        a: "בממשק הניהול, תחת לשונית 'מועמדויות', ניתן לצפות בכל המועמדויות שהוגשו לכל משרה.",
      },
      {
        q: "האם ניתן לערוך או למחוק משרה לאחר פרסומה?",
        a: "כן, ממשק הניהול מאפשר עריכה, עדכון ומחיקה של משרות בכל עת.",
      },
    ],
  },
  {
    category: "כללי",
    emoji: "💡",
    items: [
      {
        q: "האם האתר מותאם לטלפון נייד?",
        a: "כן, הפלטפורמה מותאמת לכל המכשירים — מחשב, טאבלט וטלפון נייד.",
      },
      {
        q: "האם הפלטפורמה נגישה לדוברי ערבית?",
        a: "כרגע הפלטפורמה זמינה בעברית. תמיכה בערבית נמצאת בתכנון לגרסאות הבאות.",
      },
    ],
  },
];

/* איור SVG קהילתי */
function CommunityIllustration() {
  return (
    <svg viewBox="0 0 340 300" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm">
      {/* רקע */}
      <circle cx="170" cy="160" r="120" fill="#e8f5ee" opacity="0.6"/>

      {/* בועות שיחה */}
      <rect x="60" y="20" width="80" height="40" rx="12" fill="#2f6b46" opacity="0.9"/>
      <text x="100" y="46" textAnchor="middle" fill="white" fontSize="20">❓</text>
      <polygon points="80,60 95,60 88,72" fill="#2f6b46" opacity="0.9"/>

      <rect x="200" y="10" width="80" height="40" rx="12" fill="#4a9e6b" opacity="0.85"/>
      <text x="240" y="36" textAnchor="middle" fill="white" fontSize="20">💡</text>
      <polygon points="220,50 235,50 228,62" fill="#4a9e6b" opacity="0.85"/>

      <rect x="245" y="80" width="70" height="36" rx="10" fill="#81C784" opacity="0.8"/>
      <text x="280" y="103" textAnchor="middle" fill="white" fontSize="18">✅</text>
      <polygon points="255,116 268,116 262,128" fill="#81C784" opacity="0.8"/>

      {/* דמות 1 — שמאל */}
      <circle cx="100" cy="175" r="18" fill="#FFCC80"/>
      <rect x="88" y="193" width="24" height="38" rx="6" fill="#1565C0"/>
      <line x1="88" y1="200" x2="74" y2="218" stroke="#FFCC80" strokeWidth="6" strokeLinecap="round"/>
      <line x1="112" y1="200" x2="124" y2="215" stroke="#FFCC80" strokeWidth="6" strokeLinecap="round"/>
      <rect x="90" y="231" width="9" height="22" rx="4" fill="#0D47A1"/>
      <rect x="103" y="231" width="9" height="22" rx="4" fill="#0D47A1"/>

      {/* דמות 2 — מרכז */}
      <circle cx="170" cy="168" r="20" fill="#FFAB91"/>
      <rect x="157" y="188" width="26" height="40" rx="6" fill="#E91E63"/>
      <line x1="157" y1="196" x2="142" y2="214" stroke="#FFAB91" strokeWidth="6" strokeLinecap="round"/>
      <line x1="183" y1="196" x2="196" y2="212" stroke="#FFAB91" strokeWidth="6" strokeLinecap="round"/>
      <rect x="159" y="228" width="10" height="24" rx="4" fill="#880E4F"/>
      <rect x="173" y="228" width="10" height="24" rx="4" fill="#880E4F"/>

      {/* דמות 3 — ימין */}
      <circle cx="242" cy="175" r="18" fill="#FFE0B2"/>
      <rect x="230" y="193" width="24" height="38" rx="6" fill="#FF7043"/>
      <line x1="230" y1="200" x2="216" y2="216" stroke="#FFE0B2" strokeWidth="6" strokeLinecap="round"/>
      <line x1="254" y1="200" x2="266" y2="215" stroke="#FFE0B2" strokeWidth="6" strokeLinecap="round"/>
      <rect x="232" y="231" width="9" height="22" rx="4" fill="#BF360C"/>
      <rect x="245" y="231" width="9" height="22" rx="4" fill="#BF360C"/>

      {/* דשא */}
      <ellipse cx="170" cy="268" rx="150" ry="22" fill="#a5d6a7"/>
      <ellipse cx="170" cy="263" rx="150" ry="14" fill="#c8e6c9"/>

      {/* פרחים */}
      {[80,130,175,215,255].map((x,i) => (
        <g key={i}>
          <circle cx={x} cy={268} r="5" fill={["#FF8A65","#FFD54F","#F06292","#AED581","#4FC3F7"][i]}/>
          <rect x={x-1} y={270} width="2" height="7" fill="#66BB6A"/>
        </g>
      ))}
    </svg>
  );
}

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-white rounded-2xl border transition-all ${open ? "border-[#2f6b46]/30 shadow-md" : "border-gray-100 shadow-sm"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-right gap-4"
      >
        <span className="font-semibold text-gray-800 text-base">{q}</span>
        <span className={`text-[#2f6b46] text-xl font-bold shrink-0 transition-transform ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

function FAQPage({ onBack, onAdminClick }) {
  const [activeSection, setActiveSection] = useState(null);

  const displayed = activeSection
    ? FAQ_SECTIONS.filter((s) => s.category === activeSection)
    : FAQ_SECTIONS;

  return (
    <div dir="rtl" className="min-h-screen bg-white text-right text-gray-800 font-sans">

      {/* ───── HEADER ───── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <button onClick={onBack}>
            <img src={logoImg} alt="אשכול בית הכרם" className="h-14 w-auto" />
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {["דף הבית", "חיפוש משרות", "אודות", "שאלות ותשובות"].map((link) => (
              <button
                key={link}
                onClick={link === "דף הבית" ? onBack : undefined}
                className={`text-sm font-medium transition ${
                  link === "שאלות ותשובות"
                    ? "text-[#2f6b46] font-bold border-b-2 border-[#2f6b46] pb-0.5"
                    : "text-gray-600 hover:text-[#2f6b46]"
                }`}
              >
                {link}
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

      {/* ───── HERO ───── */}
      <section className="bg-[#f9f8f4] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 order-2 md:order-1">
            <p className="text-sm text-[#2f6b46] font-semibold mb-3">❓ שאלות ותשובות</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              כל מה שרציתם לדעת<br />
              <span className="text-[#2f6b46]">על הפלטפורמה</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
              מצאו תשובות מהירות לשאלות נפוצות בנושא חיפוש משרות, פרסום משרות, הגשת מועמדות וניהול החשבון.
            </p>
          </div>
          <div className="flex-1 order-1 md:order-2 flex justify-center">
            <CommunityIllustration />
          </div>
        </div>
      </section>

      {/* ───── FILTER TABS ───── */}
      <section className="max-w-4xl mx-auto px-6 pt-10 pb-4">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setActiveSection(null)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition border-2 ${
              !activeSection
                ? "bg-[#2f6b46] text-white border-[#2f6b46]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#2f6b46]"
            }`}
          >
            הכל
          </button>
          {FAQ_SECTIONS.map((s) => (
            <button
              key={s.category}
              onClick={() => setActiveSection(s.category === activeSection ? null : s.category)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition border-2 ${
                activeSection === s.category
                  ? "bg-[#2f6b46] text-white border-[#2f6b46]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#2f6b46]"
              }`}
            >
              {s.emoji} {s.category}
            </button>
          ))}
        </div>
      </section>

      {/* ───── ACCORDION ───── */}
      <section className="max-w-4xl mx-auto px-6 py-8 pb-20">
        {displayed.map((section) => (
          <div key={section.category} className="mb-8">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span>{section.emoji}</span> {section.category}
            </h2>
            <div className="flex flex-col gap-3">
              {section.items.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 py-6">
        הזדמנויות לחיים | משרות בחינוך, נוער וקהילה
      </footer>
    </div>
  );
}

export default FAQPage;
