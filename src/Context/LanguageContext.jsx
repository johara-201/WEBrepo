import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  he: {
    nav: {
      home: "דף הבית",
      search: "חיפוש משרות",
      about: "אודות",
      faq: "שאלות ותשובות",
      aiChat: "צ׳אט AI",
      login: "התחברות",
      logout: "יציאה",
      dark: "Dark",
      light: "Light",
      switchLanguage: "العربية",
    },
    auth: {
        backHome: "חזרה לדף הבית",
        welcome: "ברוכים הבאים",
        continueLogin: "התחברו כדי להמשיך",
        jobSeeker: "מחפש/ת עבודה",
        admin: "מנהל/ת",

        sideTitle: "יחד מחזקים\nאת החינוך\nבקהילה שלנו",
        sideSubtitle: "הזדמנויות לחיים, פלטפורמת משרות בחינוך, נוער וקהילה באזור בית הכרם.",

        fullName: "שם מלא *",
        fullNamePlaceholder: "ישראל ישראלי",
        phone: "טלפון",
        phonePlaceholder: "050-0000000",
        email: "דוא״ל",
        password: "סיסמה",
        username: "שם משתמש",
        usernamePlaceholder: "שם המשתמש שלך",

        login: "התחבר",
        register: "הירשם",
        adminLogin: "כניסה כמנהל",

        noAccount: "אין לך חשבון?",
        alreadyRegistered: "כבר רשום?",
        registerHere: "הירשם כאן",

        error: "שגיאה",
        emailAlreadyRegistered: "האימייל כבר רשום",
        emailAlreadyRegisteredText: "האימייל הזה כבר קיים במערכת. אפשר להתחבר לחשבון הקיים או להשתמש באימייל אחר.",
        fullNameRequired: "שם מלא הוא שדה חובה",
    },
    home: {
      heroTitle: "הזדמנויות לחיים",
      heroSubtitle: "פלטפורמת משרות בחינוך, נוער וקהילה",
      searchPlaceholder: "מה אתם מחפשים?",
      allTowns: "כל הישובים",
      allRoles: "כל התפקידים",
      searchJobs: "חפש משרות",
      topCategories: "קטגוריות מובילות",
      allCategories: "לכל הקטגוריות",
      latestJobs: "משרות אחרונות",
      jobsFound: (count) => `${count} משרות נמצאו`,
      loadingJobs: "טוען משרות...",
      noJobs: "לא נמצאו משרות להצגה כרגע.",
      footer: "הזדמנויות לחיים | משרות בחינוך, נוער וקהילה",
      categories: {
        youthCoordinator: "רכז/ת נוער",
        guide: "מדריך/ה",
        communityWorker: "עובד/ת קהילה",
        programManager: "מנהל/ת תוכנית",
        socialMentor: "חונך/ת חברתי",
        manager: "מנהל/ת",
      },
    },
  },

  ar: {
    nav: {
      home: "الصفحة الرئيسية",
      search: "البحث عن وظائف",
      about: "من نحن",
      faq: "أسئلة شائعة",
      aiChat: "دردشة AI",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      dark: "داكن",
      light: "فاتح",
      switchLanguage: "עברית",
    },

    home: {
      heroTitle: "فرص للحياة",
      heroSubtitle: "منصة وظائف في التربية، الشباب والمجتمع",
      searchPlaceholder: "ما الذي تبحثون عنه؟",
      allTowns: "كل البلدات",
      allRoles: "كل الوظائف",
      searchJobs: "ابحث عن وظائف",
      topCategories: "الفئات الرئيسية",
      allCategories: "كل الفئات",
      latestJobs: "أحدث الوظائف",
      jobsFound: (count) => `تم العثور على ${count} وظيفة`,
      loadingJobs: "جارٍ تحميل الوظائف...",
      noJobs: "لا توجد وظائف للعرض حاليًا.",
      footer: "فرص للحياة | وظائف في التربية، الشباب والمجتمع",
      categories: {
        youthCoordinator: "مركّز/ة شباب",
        guide: "مرشد/ة",
        communityWorker: "عامل/ة مجتمع",
        programManager: "مدير/ة برنامج",
        socialMentor: "مرشد/ة اجتماعي",
        manager: "مدير/ة",
      },
    },
    auth: {
  backHome: "العودة إلى الصفحة الرئيسية",
  welcome: "أهلًا وسهلًا",
  continueLogin: "سجّلوا الدخول للمتابعة",
  jobSeeker: "باحث/ة عن عمل",
  admin: "مدير/ة",

  sideTitle: "معًا نقوّي\nالتعليم\nفي مجتمعنا",
  sideSubtitle: "فرص للحياة، منصة وظائف في التربية، الشباب والمجتمع في منطقة بيت الكرم.",

  fullName: "الاسم الكامل *",
  fullNamePlaceholder: "مثال: أحمد محمد",
  phone: "رقم الهاتف",
  phonePlaceholder: "050-0000000",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  username: "اسم المستخدم",
  usernamePlaceholder: "اسم المستخدم الخاص بك",

  login: "تسجيل الدخول",
  register: "إنشاء حساب",
  adminLogin: "الدخول كمدير",

  noAccount: "ليس لديك حساب؟",
  alreadyRegistered: "هل لديك حساب؟",
  registerHere: "سجّل هنا",

  error: "خطأ",
  emailAlreadyRegistered: "البريد الإلكتروني مسجّل مسبقًا",
  emailAlreadyRegisteredText: "هذا البريد الإلكتروني موجود في النظام. يمكن تسجيل الدخول للحساب الحالي أو استخدام بريد آخر.",
  fullNameRequired: "الاسم الكامل مطلوب",
}
  },
};

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem("language");
  return savedLanguage === "ar" ? "ar" : "he";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "rtl";
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((current) => (current === "he" ? "ar" : "he"));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}