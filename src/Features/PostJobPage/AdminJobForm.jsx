// AdminJobForm - גרסה מלאה יותר של טופס פרסום משרה, מוכנה להרחבה
// כרגע PostJobPage.jsx עושה את העבודה. קומפוננט זה מוכן לשימוש עתידי.
import { useState } from "react";
import { createJob } from "./postJobService";

function AdminJobForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    city: "",
    jobType: "",
    employmentPercent: "",
    distanceMinutes: "",
    suitableForStudents: false,
    description: "",
    applyUrl: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createJob({
        ...formData,
        employmentPercent: Number(formData.employmentPercent),
        distanceMinutes: Number(formData.distanceMinutes),
        source: "manual",
        sourceName: "פרסום עצמאי",
        publishDate: new Date(),
      });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <input name="title" value={formData.title} onChange={handleChange}
        placeholder="שם המשרה" required className="w-full rounded-lg border p-3" />
      <input name="organization" value={formData.organization} onChange={handleChange}
        placeholder="ארגון מגייס" className="w-full rounded-lg border p-3" />
      <div className="grid grid-cols-2 gap-3">
        <input name="city" value={formData.city} onChange={handleChange}
          placeholder="יישוב" className="w-full rounded-lg border p-3" />
        <input name="jobType" value={formData.jobType} onChange={handleChange}
          placeholder="סוג תפקיד" className="w-full rounded-lg border p-3" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input name="employmentPercent" type="number" value={formData.employmentPercent} onChange={handleChange}
          placeholder="% משרה" className="w-full rounded-lg border p-3" />
        <input name="distanceMinutes" type="number" value={formData.distanceMinutes} onChange={handleChange}
          placeholder="מרחק נסיעה (דקות)" className="w-full rounded-lg border p-3" />
      </div>
      <textarea name="description" value={formData.description} onChange={handleChange}
        placeholder="תיאור המשרה" rows={5} className="w-full rounded-lg border p-3" />
      <input name="applyUrl" value={formData.applyUrl} onChange={handleChange}
        placeholder="קישור להגשת מועמדות (אופציונלי)" className="w-full rounded-lg border p-3" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="suitableForStudents"
          checked={formData.suitableForStudents} onChange={handleChange} />
        מתאים לסטודנטים
      </label>
      <div className="flex justify-end gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="rounded-lg border px-5 py-2 text-sm text-gray-600">ביטול</button>
        )}
        <button type="submit" disabled={saving}
          className="rounded-lg bg-[#2f6b46] px-5 py-2 text-sm font-medium text-white disabled:opacity-60">
          {saving ? "שומר..." : "פרסום משרה"}
        </button>
      </div>
    </form>
  );
}

export default AdminJobForm;
