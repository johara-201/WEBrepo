//This file manages the website language

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

//Static translations for main texts in the website.
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

      forgotPassword: "שכחתי סיסמה",
      forgotPasswordTitle: "שחזור סיסמה",
      forgotPasswordDesc: "הזן את האימייל שלך ונשלח לך קישור לאיפוס הסיסמה.",
      forgotPasswordDescAdmin: "הזן את שם המשתמש שלך ונשלח קישור לאיפוס לאימייל המקושר.",
      sendResetLink: "שלח קישור לאיפוס",
      resetLinkSent: "אם הפרטים נמצאו, ישלח קישור לאיפוס לאימייל.",
      backToLogin: "חזרה להתחברות",

      resetPasswordTitle: "הגדרת סיסמה חדשה",
      newPassword: "סיסמה חדשה",
      confirmPassword: "אימות סיסמה",
      resetPassword: "שמור סיסמה חדשה",
      resetSuccess: "הסיסמה אופסה בהצלחה! כעת ניתן להתחבר.",
      resetError: "הקישור פג תוקף או לא תקין. נסה שוב.",
      passwordMismatch: "הסיסמאות אינן תואמות.",
      passwordTooShort: "הסיסמה חייבת להכיל לפחות 6 תווים.",
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
    ai: {
      initial: "שלום! אני עוזר AI לחיפוש משרות בחינוך, נוער וקהילה. איך אפשר לעזור?",
      title: "צ׳אט AI לחיפוש משרות",
      subtitle: "עוזר למשתמשים להבין איך למצוא משרה מתאימה באתר",
      placeholder: "כתבי שאלה על חיפוש משרה...",
      thinking: "חושב..."
    }
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

      forgotPassword: "نسيت كلمة المرور",
      forgotPasswordTitle: "استعادة كلمة المرور",
      forgotPasswordDesc: "أدخل/ي بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.",
      forgotPasswordDescAdmin: "أدخل/ي اسم المستخدم وسنرسل رابطًا إلى البريد الإلكتروني المرتبط.",
      sendResetLink: "إرسال رابط الاستعادة",
      resetLinkSent: "إذا تم العثور على البيانات، سيتم إرسال رابط إعادة التعيين إلى البريد الإلكتروني.",
      backToLogin: "العودة إلى تسجيل الدخول",

      resetPasswordTitle: "تعيين كلمة مرور جديدة",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      resetPassword: "حفظ كلمة المرور الجديدة",
      resetSuccess: "تم إعادة تعيين كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن.",
      resetError: "انتهت صلاحية الرابط أو أنه غير صحيح. حاول/ي مرة أخرى.",
      passwordMismatch: "كلمتا المرور غير متطابقتين.",
      passwordTooShort: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.",
    },
    ai: {
      initial: "مرحبًا! أنا مساعد AI للبحث عن وظائف في التربية، الشباب والمجتمع. كيف يمكنني المساعدة؟",
      title: "دردشة AI للبحث عن وظائف",
      subtitle: "يساعد المستخدمين على فهم كيفية العثور على وظيفة مناسبة في الموقع",
      placeholder: "اكتبي سؤالًا حول البحث عن وظيفة...",
      thinking: "يفكّر..."
    }
  },
};

//Dictionary for translating dynamic Hebrew UI texts to Arabic
const uiDictionaryAr = {
  "ניהול משרות": "إدارة الوظائف",
  "מועמדויות": "طلبات التقديم",
  "משרה חדשה": "وظيفة جديدة",
  "פרסום משרה": "نشر وظيفة",
  "פרסום משרה חדשה": "نشر وظيفة جديدة",
  "שם משרה": "اسم الوظيفة",
  "שם המשרה": "اسم الوظيفة",
  "יישוב": "البلدة",
  "ארגון": "الجهة",
  "ארגון מגייס": "الجهة المشغّلة",
  "סוג תפקיד": "نوع الوظيفة",
  "אחוז משרה": "نسبة الوظيفة",
  "היקף משרה": "نسبة الوظيفة",
  "פעולות": "إجراءات",
  "עריכה": "تعديل",
  "מחיקה": "حذف",
  "שמור": "حفظ",
  "שומר...": "جارٍ الحفظ...",
  "ביטול": "إلغاء",
  "עדכון": "تحديث",
  "טוען נתונים...": "جارٍ تحميل البيانات...",
  "טוען...": "جارٍ التحميل...",
  "אין נתונים": "لا توجد بيانات",
  "אין עדיין משרות במערכת.": "لا توجد وظائف في النظام بعد.",
  "כן": "نعم",
  "לא": "لا",

  "לוח בקרה": "لوحة التحكم",
  "הפרטים שלי": "بياناتي",
  "פרטים אישיים": "بيانات شخصية",
  "שינוי סיסמה": "تغيير كلمة المرور",
  "קורות חיים": "السيرة الذاتية",
  "המשרות שהגשתי": "الوظائف التي تقدمت لها",
  "הפרטים האישיים שלי": "بياناتي الشخصية",
  "קורות החיים שלי": "سيرتي الذاتية",
  "לא הוזן": "لم يتم إدخال قيمة",
  "עיר מגורים": "بلدة السكن",
  "תחום עיסוק": "المجال المهني",
  "קצת עליי": "نبذة عني",
  "כמה מילים על עצמך...": "اكتب/ي بضع كلمات عن نفسك...",
  "פרטים עודכנו בהצלחה ✓": "تم تحديث البيانات بنجاح ✓",
  "שגיאה בעדכון פרטים": "حدث خطأ أثناء تحديث البيانات",

  "סיסמה נוכחית": "كلمة المرور الحالية",
  "סיסמה חדשה": "كلمة مرور جديدة",
  "אימות סיסמה חדשה": "تأكيد كلمة المرور الجديدة",
  "עדכן סיסמה": "تحديث كلمة المرور",
  "מעדכן...": "جارٍ التحديث...",
  "הסיסמה עודכנה בהצלחה ✓": "تم تحديث كلمة المرور بنجاح ✓",

  "הגשת מועמדות": "تقديم طلب",
  "שליחת מועמדות": "إرسال الطلب",
  "שולח...": "جارٍ الإرسال...",
  "המועמדות נשלחה!": "تم إرسال الطلب!",
  "שם מלא": "الاسم الكامل",
  "אימייל": "البريد الإلكتروني",
  "טלפון": "رقم الهاتف",
  "מסר / מכתב מוטיבציה": "رسالة / خطاب دافع",

  "חיפוש": "بحث",
  "חיפוש משרות": "البحث عن وظائف",
  "חפש משרות": "ابحث عن وظائف",
  "מה אתם מחפשים?": "ما الذي تبحثون عنه؟",
  "כל הישובים": "كل البلدات",
  "כל התפקידים": "كل الوظائف",
  "כל הארגונים": "كل الجهات",
  "כל האחוזים": "كل النسب",
  "סינון תוצאות": "تصفية النتائج",
  "נקה סינון": "مسح التصفية",
  "הצג תוצאות": "عرض النتائج",
  "לא נמצאו משרות התואמות את החיפוש.": "لم يتم العثور على وظائف تطابق البحث.",
  "לא נמצאו משרות התואמות את הסינון.": "لم يتم العثور على وظائف تطابق التصفية.",

  "צ׳אט AI לחיפוש משרות": "دردشة AI للبحث عن وظائف",
  "עוזר למשתמשים להבין איך למצוא משרה מתאימה באתר": "يساعد المستخدمين على فهم كيفية العثور على وظيفة مناسبة في الموقع",
  "חושב...": "يفكّر...",
  "כתבי שאלה על חיפוש משרה...": "اكتبي سؤالًا حول البحث عن وظيفة...",
  "כל יישוב": "كل البلدات",
  "כל ארגון": "كل الجهات",
  "כל היקף": "كل النسب",
  "סוג משרה": "نوع الوظيفة",
  "מיין: חדש ← ישן": "ترتيب: الأحدث ← الأقدم",
  "מיין: ישן ← חדש": "ترتيب: الأقدم ← الأحدث",
  "לפרטים": "للتفاصيل",
  "פורסם": "نُشر",
  "תיאור התפקיד": "وصف الوظيفة",
  "פרטי המשרה": "تفاصيل الوظيفة",
  "חזרה לכל המשרות": "الرجوع إلى كل الوظائف",
  "הגשה באתר המקור": "التقديم في موقع المصدر",
  "הגשת מועמדות דרך המערכת": "تقديم طلب عبر النظام",
};

//Create the opposite dictionary, from Arabic back to Hebrew
const uiDictionaryHe = Object.fromEntries(
  Object.entries(uiDictionaryAr).map(([he, ar]) => [ar, he])
);

//Make text cleaner before comparing it with the dictionary
function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

//Translate text only if it exists in the dynamic dictionary
function translateDynamicText(text, language) {
  const trimmed = normalizeText(text);

  if (!trimmed) return text;

  //Choose the correct dictionary according to the selected language
  const dict = language === "ar" ? uiDictionaryAr : uiDictionaryHe;

  if (dict[trimmed]) {
    //Replace only the normalized part and keep the original text structure
    return String(text).replace(trimmed, dict[trimmed]);
  }

  return text;
}

//Get the saved language from localStorage
function getInitialLanguage() {
  const savedLanguage = localStorage.getItem("language");

  return savedLanguage === "ar" ? "ar" : "he";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  //Update the HTML language settings and save the selected language
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "rtl";
    localStorage.setItem("language", language);
  }, [language]);

  //Watch the page and translate dynamic texts when the language changes
  useEffect(() => {
    const root = document.getElementById("root");

    if (!root) return undefined;

    let frame = null;

    const runTranslation = () => {
      if (frame) cancelAnimationFrame(frame);

      //Wait for React to finish updating the page before translating
      frame = requestAnimationFrame(() => {
        translateElementTree(root, language);
      });
    };

    runTranslation();

    //Watch changes in the page content
    const observer = new MutationObserver(runTranslation);

    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "alt", "aria-label"],
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [language]);

  //Switch between Hebrew and Arabic
  const toggleLanguage = () => {
    setLanguage((current) => (current === "he" ? "ar" : "he"));
  };

  //Save the context value and update it only when language changes
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: translations[language],
      translateText: (text) => translateDynamicText(text, language),
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

//Hook for using the language context in components
export function useLanguage() {
  return useContext(LanguageContext);
}

//Translate text that already exists inside the page
function translateElementTree(root, language) {
  if (!root) return;

  //Attributes that may also contain visible text
  const attributes = ["placeholder", "title", "alt", "aria-label"];

  //Find all text nodes inside the page
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;

      //Do not translate code, style, or textarea content
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }

      //Translate only real text, not empty spaces
      return normalizeText(node.nodeValue)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  const textNodes = [];

  //Save all text nodes before changing them
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  //Translate every text node if it exists in the dictionary
  textNodes.forEach((node) => {
    const next = translateDynamicText(node.nodeValue, language);

    if (next !== node.nodeValue) {
      node.nodeValue = next;
    }
  });

  //Translate text inside important HTML attributes
  root.querySelectorAll("*").forEach((el) => {
    attributes.forEach((attr) => {
      if (!el.hasAttribute(attr)) return;

      const current = el.getAttribute(attr);
      const next = translateDynamicText(current, language);

      if (next !== current) {
        el.setAttribute(attr, next);
      }
    });
  });
}