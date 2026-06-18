import { useState } from "react";
import { submitApplication } from "../../Services/ApplicationsService";

function ApplicationForm({ job, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitApplication({
        ...formData,
        jobId: job._id,
        jobTitle: job.title,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("אירעה שגיאה בשליחת הטופס. נסה שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" dir="rtl">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {submitted ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">המועמדות נשלחה!</h2>
            <p className="text-gray-600 mb-6">
              תודה {formData.fullName}! קיבלנו את המועמדות שלך למשרת <strong>{job.title}</strong>.
            </p>
            <button onClick={onClose}
              className="rounded-lg bg-[#2f6b46] px-6 py-2 font-medium text-white hover:bg-[#245539]">
              סגירה
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">הגשת מועמדות</h2>
                <p className="text-sm text-[#2f6b46]">{job.title} · {job.organization}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-600">שם מלא *</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#2f6b46] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">אימייל *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#2f6b46] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">טלפון</label>
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#2f6b46] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">מסר / מכתב מוטיבציה</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={4}
                  placeholder="ספר/י קצת על עצמך ומדוע את/ה מתאים/ה לתפקיד..."
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#2f6b46] focus:outline-none" />
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={onClose}
                  className="rounded-lg border px-5 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  ביטול
                </button>
                <button type="submit" disabled={submitting}
                  className="rounded-lg bg-[#2f6b46] px-5 py-2 text-sm font-medium text-white hover:bg-[#245539] disabled:opacity-60">
                  {submitting ? "שולח..." : "שליחת מועמדות"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ApplicationForm;
