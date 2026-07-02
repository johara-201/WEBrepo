import { useState } from "react";
import { updateJob } from "./adminService";
import { useLanguage } from "../../Context/LanguageContext";
import { useToast } from "../../Components/Toast";

const EDIT_JOB_TEXT = {
  he: {
    title: "עריכת משרה",
    placeholders: {
      title: "שם המשרה",
      organization: "ארגון מגייס",
      city: "יישוב",
      jobType: "סוג תפקיד",
      employmentPercent: "אחוז משרה",
      distanceMinutes: "מרחק נסיעה (דקות)",
      description: "תיאור המשרה",
      applyUrl: "קישור להגשת מועמדות",
    },
    suitableForStudents: "מתאים לסטודנטים",
    cancel: "ביטול",
    save: "שמור שינויים",
    saving: "שומר...",
    saveError: "אירעה שגיאה בשמירה",
  },

  ar: {
    title: "تعديل الوظيفة",
    placeholders: {
      title: "اسم الوظيفة",
      organization: "الجهة المشغّلة",
      city: "البلدة",
      jobType: "نوع الوظيفة",
      employmentPercent: "نسبة الوظيفة",
      distanceMinutes: "مدة السفر بالدقائق",
      description: "وصف الوظيفة",
      applyUrl: "رابط تقديم الطلب",
    },
    suitableForStudents: "مناسبة للطلاب",
    cancel: "إلغاء",
    save: "حفظ التغييرات",
    saving: "جارٍ الحفظ...",
    saveError: "حدث خطأ أثناء الحفظ",
  },
};

function EditJobModal({ job, onClose, onSaved }) {
  const { language } = useLanguage();
  const showToast = useToast();
  const text = EDIT_JOB_TEXT[language] || EDIT_JOB_TEXT.he;

  const [formData, setFormData] = useState({
    title: job.title || "",
    organization: job.organization || "",
    city: job.city || "",
    jobType: job.jobType || "",
    employmentPercent: job.employmentPercent || "",
    distanceMinutes: job.distanceMinutes || "",
    suitableForStudents: job.suitableForStudents || false,
    description: job.description || "",
    applyUrl: job.applyUrl || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      await updateJob(job._id, {
        ...formData,
        employmentPercent: Number(formData.employmentPercent),
        distanceMinutes: Number(formData.distanceMinutes),
      });

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      showToast(text.saveError, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      dir="rtl"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {text.title}
          </h2>

          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={text.placeholders.title}
            className="w-full rounded-lg border p-2.5 text-sm"
          />

          <input
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder={text.placeholders.organization}
            className="w-full rounded-lg border p-2.5 text-sm"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder={text.placeholders.city}
              className="w-full rounded-lg border p-2.5 text-sm"
            />

            <input
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              placeholder={text.placeholders.jobType}
              className="w-full rounded-lg border p-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="employmentPercent"
              type="number"
              value={formData.employmentPercent}
              onChange={handleChange}
              placeholder={text.placeholders.employmentPercent}
              className="w-full rounded-lg border p-2.5 text-sm"
            />

            <input
              name="distanceMinutes"
              type="number"
              value={formData.distanceMinutes}
              onChange={handleChange}
              placeholder={text.placeholders.distanceMinutes}
              className="w-full rounded-lg border p-2.5 text-sm"
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={text.placeholders.description}
            rows={4}
            className="w-full rounded-lg border p-2.5 text-sm"
          />

          <input
            name="applyUrl"
            value={formData.applyUrl}
            onChange={handleChange}
            placeholder={text.placeholders.applyUrl}
            className="w-full rounded-lg border p-2.5 text-sm"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="suitableForStudents"
              checked={formData.suitableForStudents}
              onChange={handleChange}
            />

            {text.suitableForStudents}
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              {text.cancel}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#2f6b46] px-4 py-2 text-sm font-medium text-white hover:bg-[#245539] disabled:opacity-60"
            >
              {saving ? text.saving : text.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJobModal;