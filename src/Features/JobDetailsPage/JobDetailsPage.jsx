import { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import NavBar from "../../Components/NavBar";
import { useLanguage } from "../../Context/LanguageContext";
import { useAuth } from "../../Context/AuthContext";
import { autoApplyToJob } from "../../Services/ApplicationsService";
import { useToast } from "../../Components/Toast";

const JOB_DETAILS_TEXT = {
  he: {
    notFound: "לא נמצאה משרה.",
    backToJobs: "← חזרה לכל המשרות",
    employmentWord: "משרה",
    upTo: "עד",
    minutesDrive: "דק' נסיעה",
    suitableForStudents: "מתאים לסטודנטים",
    descriptionTitle: "תיאור התפקיד",
    source: "מקור:",
    manualSource: "פרסום עצמאי",
    openOriginalSource: "פתיחת המקור המקורי ↗",
    applyExternal: "הגשה באתר המקור",
    applySystem: "הגשת מועמדות דרך המערכת",
    autoApply: "הגשה אוטומטית",
    autoApplying: "מגיש אוטומטית...",
    autoApplySuccess: "המועמדות נשלחה אוטומטית בהצלחה!",
    loginRequiredAuto: "כדי להשתמש בהגשה אוטומטית צריך להתחבר למערכת.",
    alreadyApplied: "כבר הגשת מועמדות למשרה הזאת.",
    autoApplyError: "לא ניתן לבצע הגשה אוטומטית כרגע.",
  },

  ar: {
    notFound: "لم يتم العثور على الوظيفة.",
    backToJobs: "← الرجوع إلى كل الوظائف",
    employmentWord: "وظيفة",
    upTo: "حتى",
    minutesDrive: "دقيقة سفر",
    suitableForStudents: "مناسب للطلاب",
    descriptionTitle: "وصف الوظيفة",
    source: "المصدر:",
    manualSource: "نشر ذاتي",
    openOriginalSource: "فتح المصدر الأصلي ↗",
    applyExternal: "التقديم في موقع المصدر",
    applySystem: "تقديم طلب عبر النظام",
    autoApply: "تقديم تلقائي",
    autoApplying: "جارٍ التقديم تلقائيًا...",
    autoApplySuccess: "تم إرسال الطلب تلقائيًا بنجاح!",
    loginRequiredAuto: "لاستخدام التقديم التلقائي يجب تسجيل الدخول.",
    alreadyApplied: "لقد قدّمت طلبًا لهذه الوظيفة من قبل.",
    autoApplyError: "لا يمكن تنفيذ التقديم التلقائي الآن.",
  },
};

const VALUE_TRANSLATIONS = {
  ar: {
    מדריך: "مرشد",
    מדריכה: "مرشدة",
    "מדריך/ה": "مرشد/ة",
    רכז: "مركّز",
    רכזת: "مركّزة",
    "רכז/ת": "مركّز/ة",
    "רכז/ת נוער": "مركّز/ة شباب",
    "רכז/ת קהילה": "مركّز/ة مجتمع",
    "עובד קהילה": "عامل مجتمعي",
    "עובדת קהילה": "عاملة مجتمعية",
    "עובד/ת קהילה": "عامل/ة مجتمع",
    חינוך: "تربية",
    "חינוך והדרכה": "تربية وإرشاد",
    "ליווי משפחות": "مرافقة عائلات",
    "מנהל/ת תוכנית": "مدير/ة برنامج",
    "מנחה קבוצות": "موجّه/ة مجموعات",
    "עובד/ת נוער": "عامل/ة شباب",
    "איש/אישה חינוך בלתי פורמלי": "عامل/ة في التربية غير الرسمية",
    "מנהל/ת מחלקה": "مدير/ة قسم",
    אחר: "آخر",
  },
};

function translateValue(value, language) {
  if (!value) return "";

  if (language === "ar" && VALUE_TRANSLATIONS.ar[value]) {
    return VALUE_TRANSLATIONS.ar[value];
  }

  return value;
}

function JobDetailsPage({
  job,
  onBack,
  onHome,
  onSearch,
  onAbout,
  onFaq,
  onAdmin,
  onDashboard,
  onAIChat,
}) {
  const { language } = useLanguage();
  const showToast = useToast();
  const text = JOB_DETAILS_TEXT[language] || JOB_DETAILS_TEXT.he;
  const { isUser } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [autoSubmitting, setAutoSubmitting] = useState(false);

  const handleAutoApply = async () => {
    if (!isUser) {
      showToast(text.loginRequiredAuto, "info");
      return;
    }

    setAutoSubmitting(true);

    try {
      await autoApplyToJob(job._id, language);

      showToast(text.autoApplySuccess, "success");
    } catch (err) {
      const status = err?.response?.status;

      if (status === 409) {
        showToast(text.alreadyApplied, "info");
      } else if (status === 400) {
        showToast(err?.response?.data?.error || text.autoApplyError, "error");
        setShowForm(true);
      } else {
        showToast(err?.message || text.autoApplyError, "error");
      }
    } finally {
      setAutoSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div dir="rtl" className="p-6 text-center">
        <p>{text.notFound}</p>
      </div>
    );
  }

  const hasApplyUrl = job.applyUrl && job.applyUrl.trim() !== "";

  return (
    <div dir="rtl" className="min-h-screen bg-[#f6f5ef] text-right">
      <NavBar
        activePage="details"
        onHome={onHome}
        onSearch={onSearch}
        onAbout={onAbout}
        onFaq={onFaq}
        onAdmin={onAdmin}
        onDashboard={onDashboard}
        onAIChat={onAIChat}
      />

      <div className="max-w-4xl mx-auto px-4 pt-4">
        <button
          onClick={onBack}
          className="text-sm text-[#2f6b46] hover:underline"
        >
          {text.backToJobs}
        </button>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-2xl font-extrabold text-gray-800">
            {job.title}
          </h1>

          <p className="mb-5 text-base font-medium text-[#2f6b46]">
            {job.organization}
          </p>

          <div className="mb-6 flex flex-wrap gap-2">
            {job.city && (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">
                📍 {job.city}
              </span>
            )}

            {job.jobType && (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">
                {translateValue(job.jobType, language)}
              </span>
            )}

            {job.employmentPercent && (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">
                {job.employmentPercent}% {text.employmentWord}
              </span>
            )}

            {job.distanceMinutes && (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-gray-700">
                {text.upTo} {job.distanceMinutes} {text.minutesDrive}
              </span>
            )}

            {job.suitableForStudents && (
              <span className="rounded-full bg-[#e9f1ea] px-3 py-1 text-sm text-[#2f6b46]">
                {text.suitableForStudents}
              </span>
            )}
          </div>

          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">
              {text.descriptionTitle}
            </h2>

            <p className="leading-8 text-gray-700">{job.description}</p>
          </div>

          {job.sourceName && (
            <div className="mb-6 rounded-xl bg-stone-50 p-4 text-sm text-gray-600">
              <span className="font-medium">{text.source} </span>

              {job.source === "manual" ? text.manualSource : job.sourceName}

              {hasApplyUrl && (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-3 text-[#2f6b46] hover:underline"
                >
                  {text.openOriginalSource}
                </a>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            {hasApplyUrl && (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[#2f6b46] px-6 py-3 text-center text-sm font-medium text-[#2f6b46] transition hover:bg-[#e9f1ea]"
              >
                {text.applyExternal}
              </a>
            )}

            {isUser && (
              <button
                type="button"
                onClick={handleAutoApply}
                disabled={autoSubmitting}
                className="rounded-lg bg-[#1f5135] px-6 py-3 text-center font-medium text-white transition hover:bg-[#173c28] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {autoSubmitting ? text.autoApplying : text.autoApply}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#2f6b46] px-6 py-3 text-center font-medium text-white transition hover:bg-[#245539]"
            >
              {text.applySystem}
            </button>
          </div>
        </div>
      </main>

      {showForm && (
        <ApplicationForm job={job} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

export default JobDetailsPage;