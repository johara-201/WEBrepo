import { useState } from "react";
import { createManualJob } from "../../Services/ManualJobsService";
import { useLanguage } from "../../Context/LanguageContext";

const POST_JOB_TEXT = {
  he: {
    back: "חזרה",
    section: "ניהול משרות",
    title: "פרסום משרה חדשה",
    subtitle:
      "פרסמי משרה בתחומי נוער, חינוך בלתי פורמלי, קהילה ומנהיגות באזור אשכול בית הכרם.",

    labels: {
      title: "שם המשרה",
      organization: "ארגון מגייס",
      organizationType: "סוג ארגון",
      city: "יישוב",
      jobType: "סוג תפקיד",
      employmentPercent: "אחוז משרה",
      distanceMinutes: "מרחק נסיעה בדקות",
      description: "תיאור המשרה",
      applyUrl: "קישור להגשת מועמדות",
      suitableForStudents: "מתאים לסטודנטים",
      suitableForStudentsDesc:
        "סמני אם המשרה מתאימה לסטודנטים ובוגרי תואר.",
    },

    placeholders: {
      title: "לדוגמה: רכז/ת נוער, מדריך/ה, מנחה קבוצות...",
      organization: "שם הארגון / הרשות",
      organizationType: "בחרי סוג ארגון",
      city: "לדוגמה: כרמיאל, סח'נין, משגב...",
      jobType: "בחרי סוג תפקיד",
      employmentPercent: "לדוגמה: 50",
      distanceMinutes: "לדוגמה: 15",
      description:
        "כתבי כאן את תיאור המשרה, דרישות התפקיד ופרטים חשובים נוספים...",
      applyUrl: "https://...",
    },

    buttons: {
      cancel: "ביטול",
      publish: "פרסם משרה",
    },

    alerts: {
      success: "המשרה נשמרה בהצלחה",
      error: "אירעה שגיאה בשמירת המשרה",
    },

    organizationTypes: {
      localAuthority: "רשות מקומית",
      youthDepartment: "מחלקת נוער",
      communityCenter: 'מתנ"ס / מרכז קהילתי',
      youthMovement: "תנועת נוער / ארגון נוער",
      nonprofit: "עמותה",
      foundation: "קרן / תוכנית חינוכית",
      government: "משרד ממשלתי",
      other: "אחר",
    },

    jobTypes: {
      guide: "מדריך/ה",
      youthCoordinator: "רכז/ת נוער",
      communityCoordinator: "רכז/ת קהילה",
      groupFacilitator: "מנחה קבוצות",
      programManager: "מנהל/ת תוכנית",
      youthWorker: "עובד/ת נוער",
      informalEducation: "איש/אישה חינוך בלתי פורמלי",
      departmentManager: "מנהל/ת מחלקה",
      other: "אחר",
    },
  },

  ar: {
    back: "رجوع",
    section: "إدارة الوظائف",
    title: "نشر وظيفة جديدة",
    subtitle:
      "انشري وظيفة في مجالات الشباب، التربية غير الرسمية، المجتمع والقيادة في منطقة عنقود بيت الكرم.",

    labels: {
      title: "اسم الوظيفة",
      organization: "الجهة المشغّلة",
      organizationType: "نوع الجهة",
      city: "البلدة",
      jobType: "نوع الوظيفة",
      employmentPercent: "نسبة الوظيفة",
      distanceMinutes: "مدة السفر بالدقائق",
      description: "وصف الوظيفة",
      applyUrl: "رابط تقديم الطلب",
      suitableForStudents: "مناسبة للطلاب",
      suitableForStudentsDesc:
        "حددي هذا الخيار إذا كانت الوظيفة مناسبة للطلاب والخريجين.",
    },

    placeholders: {
      title: "مثال: مركّز/ة شباب، مرشد/ة، موجّه/ة مجموعات...",
      organization: "اسم المنظمة / السلطة",
      organizationType: "اختاري نوع الجهة",
      city: "مثال: كرميئيل، سخنين، مسغاف...",
      jobType: "اختاري نوع الوظيفة",
      employmentPercent: "مثال: 50",
      distanceMinutes: "مثال: 15",
      description:
        "اكتبي هنا وصف الوظيفة، متطلبات الدور وتفاصيل مهمة إضافية...",
      applyUrl: "https://...",
    },

    buttons: {
      cancel: "إلغاء",
      publish: "نشر الوظيفة",
    },

    alerts: {
      success: "تم حفظ الوظيفة بنجاح",
      error: "حدث خطأ أثناء حفظ الوظيفة",
    },

    organizationTypes: {
      localAuthority: "سلطة محلية",
      youthDepartment: "قسم الشباب",
      communityCenter: "مركز جماهيري / مركز مجتمعي",
      youthMovement: "حركة شبابية / منظمة شبابية",
      nonprofit: "جمعية",
      foundation: "صندوق / برنامج تربوي",
      government: "وزارة حكومية",
      other: "آخر",
    },

    jobTypes: {
      guide: "مرشد/ة",
      youthCoordinator: "مركّز/ة شباب",
      communityCoordinator: "مركّز/ة مجتمع",
      groupFacilitator: "موجّه/ة مجموعات",
      programManager: "مدير/ة برنامج",
      youthWorker: "عامل/ة شباب",
      informalEducation: "عامل/ة في التربية غير الرسمية",
      departmentManager: "مدير/ة قسم",
      other: "آخر",
    },
  },
};

const ORGANIZATION_TYPE_OPTIONS = [
  { key: "localAuthority", value: "רשות מקומית" },
  { key: "youthDepartment", value: "מחלקת נוער" },
  { key: "communityCenter", value: 'מתנ"ס / מרכז קהילתי' },
  { key: "youthMovement", value: "תנועת נוער / ארגון נוער" },
  { key: "nonprofit", value: "עמותה" },
  { key: "foundation", value: "קרן / תוכנית חינוכית" },
  { key: "government", value: "משרד ממשלתי" },
  { key: "other", value: "אחר" },
];

const JOB_TYPE_OPTIONS = [
  { key: "guide", value: "מדריך/ה" },
  { key: "youthCoordinator", value: "רכז/ת נוער" },
  { key: "communityCoordinator", value: "רכז/ת קהילה" },
  { key: "groupFacilitator", value: "מנחה קבוצות" },
  { key: "programManager", value: "מנהל/ת תוכנית" },
  { key: "youthWorker", value: "עובד/ת נוער" },
  { key: "informalEducation", value: "איש/אישה חינוך בלתי פורמלי" },
  { key: "departmentManager", value: "מנהל/ת מחלקה" },
  { key: "other", value: "אחר" },
];

function PostJobPage({ onBack }) {
  const { language } = useLanguage();
  const text = POST_JOB_TEXT[language] || POST_JOB_TEXT.he;

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    organizationType: "",
    city: "",
    jobType: "",
    employmentPercent: "",
    distanceMinutes: "",
    suitableForStudents: false,
    description: "",
    applyUrl: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobToSend = {
      ...formData,
      employmentPercent: Number(formData.employmentPercent),
      distanceMinutes: Number(formData.distanceMinutes),
      source: "manual",
      sourceName: "פרסום עצמאי",
      publishDate: new Date(),
    };

    try {
      await createManualJob(jobToSend);

      alert(text.alerts.success);
      onBack();
    } catch (error) {
      console.error(error);
      alert(text.alerts.error);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-right text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#2f6b46] focus:bg-white focus:ring-2 focus:ring-[#2f6b46]/20";

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f8f5] px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#4f46e5]/20 bg-white px-4 py-2 text-sm font-semibold text-[#4f46e5] shadow-sm transition hover:bg-[#4f46e5] hover:text-white"
        >
          <span>→</span>
          <span>{text.back}</span>
        </button>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
          <div className="bg-gradient-to-l from-[#4f46e5] to-[#6366f1] px-8 py-7 text-white">
            <p className="mb-2 text-sm font-medium text-white/80">
              {text.section}
            </p>

            <h1 className="text-3xl font-extrabold">
              {text.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
              {text.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {text.labels.title}
                </label>

                <input
                  name="title"
                  placeholder={text.placeholders.title}
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {text.labels.organization}
                </label>

                <input
                  name="organization"
                  placeholder={text.placeholders.organization}
                  value={formData.organization}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {text.labels.organizationType}
                </label>

                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">
                    {text.placeholders.organizationType}
                  </option>

                  {ORGANIZATION_TYPE_OPTIONS.map((option) => (
                    <option key={option.key} value={option.value}>
                      {text.organizationTypes[option.key]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {text.labels.city}
                </label>

                <input
                  name="city"
                  placeholder={text.placeholders.city}
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {text.labels.jobType}
                </label>

                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">
                    {text.placeholders.jobType}
                  </option>

                  {JOB_TYPE_OPTIONS.map((option) => (
                    <option key={option.key} value={option.value}>
                      {text.jobTypes[option.key]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {text.labels.employmentPercent}
                </label>

                <input
                  name="employmentPercent"
                  type="number"
                  placeholder={text.placeholders.employmentPercent}
                  value={formData.employmentPercent}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {text.labels.distanceMinutes}
                </label>

                <input
                  name="distanceMinutes"
                  type="number"
                  placeholder={text.placeholders.distanceMinutes}
                  value={formData.distanceMinutes}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                {text.labels.description}
              </label>

              <textarea
                name="description"
                placeholder={text.placeholders.description}
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                {text.labels.applyUrl}
              </label>

              <input
                name="applyUrl"
                placeholder={text.placeholders.applyUrl}
                value={formData.applyUrl}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {text.labels.suitableForStudents}
                </p>

                <p className="text-xs text-gray-500">
                  {text.labels.suitableForStudentsDesc}
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="suitableForStudents"
                  checked={formData.suitableForStudents}
                  onChange={handleChange}
                  className="h-5 w-5 accent-[#2f6b46]"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={onBack}
                className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                {text.buttons.cancel}
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#2f6b46] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#245539]"
              >
                {text.buttons.publish}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostJobPage;