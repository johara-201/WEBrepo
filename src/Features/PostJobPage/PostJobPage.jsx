import { useState } from "react";
import { createManualJob } from "../../Services/ManualJobsService";

function PostJobPage({ onBack }) {
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
      distanceMinutes:   Number(formData.distanceMinutes),
      source:            "manual",
      sourceName:        "פרסום עצמאי",
      publishDate:       new Date(),
    };

    try {
      await createManualJob(jobToSend);
      alert("המשרה נשמרה בהצלחה");
      onBack();
    } catch (error) {
      console.error(error);
      alert("אירעה שגיאה בשמירת המשרה");
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-right text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#2f6b46] focus:bg-white focus:ring-2 focus:ring-[#2f6b46]/20";

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f8f5] px-6 py-8">
      <div className="mx-auto max-w-5xl">

        {/* כפתור חזרה */}
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#4f46e5]/20 bg-white px-4 py-2 text-sm font-semibold text-[#4f46e5] shadow-sm transition hover:bg-[#4f46e5] hover:text-white"
        >
          <span>→</span>
          <span>חזרה</span>
        </button>

        {/* כרטיס ראשי */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">

          {/* כותרת עליונה */}
          <div className="bg-gradient-to-l from-[#4f46e5] to-[#6366f1] px-8 py-7 text-white">
            <p className="mb-2 text-sm font-medium text-white/80">
              ניהול משרות
            </p>
            <h1 className="text-3xl font-extrabold">
              פרסום משרה חדשה
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
              פרסמי משרה בתחומי נוער, חינוך בלתי פורמלי, קהילה ומנהיגות באזור אשכול בית הכרם.
            </p>
          </div>

          {/* טופס */}
          <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  שם המשרה
                </label>
                <input
                  name="title"
                  placeholder="לדוגמה: רכז/ת נוער, מדריך/ה, מנחה קבוצות..."
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  ארגון מגייס
                </label>
                <input
                  name="organization"
                  placeholder="שם הארגון / הרשות"
                  value={formData.organization}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  סוג ארגון
                </label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">בחרי סוג ארגון</option>
                  <option value="רשות מקומית">רשות מקומית</option>
                  <option value="מחלקת נוער">מחלקת נוער</option>
                  <option value='מתנ"ס / מרכז קהילתי'>מתנ"ס / מרכז קהילתי</option>
                  <option value="תנועת נוער / ארגון נוער">תנועת נוער / ארגון נוער</option>
                  <option value="עמותה">עמותה</option>
                  <option value="קרן / תוכנית חינוכית">קרן / תוכנית חינוכית</option>
                  <option value="משרד ממשלתי">משרד ממשלתי</option>
                  <option value="אחר">אחר</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  יישוב
                </label>
                <input
                  name="city"
                  placeholder="לדוגמה: כרמיאל, סח'נין, משגב..."
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  סוג תפקיד
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">בחרי סוג תפקיד</option>
                  <option value="מדריך/ה">מדריך/ה</option>
                  <option value="רכז/ת נוער">רכז/ת נוער</option>
                  <option value="רכז/ת קהילה">רכז/ת קהילה</option>
                  <option value="מנחה קבוצות">מנחה קבוצות</option>
                  <option value="מנהל/ת תוכנית">מנהל/ת תוכנית</option>
                  <option value="עובד/ת נוער">עובד/ת נוער</option>
                  <option value="איש/אישה חינוך בלתי פורמלי">איש/אישה חינוך בלתי פורמלי</option>
                  <option value="מנהל/ת מחלקה">מנהל/ת מחלקה</option>
                  <option value="אחר">אחר</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  אחוז משרה
                </label>
                <input
                  name="employmentPercent"
                  type="number"
                  placeholder="לדוגמה: 50"
                  value={formData.employmentPercent}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  מרחק נסיעה בדקות
                </label>
                <input
                  name="distanceMinutes"
                  type="number"
                  placeholder="לדוגמה: 15"
                  value={formData.distanceMinutes}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                תיאור המשרה
              </label>
              <textarea
                name="description"
                placeholder="כתבי כאן את תיאור המשרה, דרישות התפקיד ופרטים חשובים נוספים..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                קישור להגשת מועמדות
              </label>
              <input
                name="applyUrl"
                placeholder="https://..."
                value={formData.applyUrl}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  מתאים לסטודנטים
                </p>
                <p className="text-xs text-gray-500">
                  סמני אם המשרה מתאימה לסטודנטים ובוגרי תואר.
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
                ביטול
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#2f6b46] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#245539]"
              >
                פרסם משרה
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostJobPage;