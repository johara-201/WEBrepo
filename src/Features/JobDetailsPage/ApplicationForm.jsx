import { useEffect, useState } from "react";
import {submitApplication, updateApplication} from "../../Services/ApplicationsService";
import { useLanguage } from "../../Context/LanguageContext";
import { useAuth } from "../../Context/AuthContext";

const APPLICATION_FORM_TEXT = {
  he: {
    title: "הגשת מועמדות",
    successTitle: "המועמדות נשלחה!",
    successMessageStart: "תודה",
    successMessageMiddle: "קיבלנו את המועמדות שלך למשרת",
    close: "סגירה",

    duplicateMessage: "כבר הגשת מועמדות למשרה הזו. אפשר לעדכן את הפרטים או קורות החיים במקום לשלוח שוב.",
    updateDetails: "עדכון פרטים",
    cvLabel: "קורות חיים",
    cvFromProfile: "אם לא תבחרי קובץ חדש, נשתמש בקורות החיים ששמורים באזור האישי שלך.",

    labels: {
      fullName: "שם מלא *",
      email: "אימייל *",
      phone: "טלפון",
      message: "מסר / מכתב מוטיבציה",
    },

    placeholders: {
      message: "ספר/י קצת על עצמך ומדוע את/ה מתאים/ה לתפקיד...",
    },

    buttons: {
      cancel: "ביטול",
      submit: "שליחת מועמדות",
      submitting: "שולח...",
    },

    error: "אירעה שגיאה בשליחת הטופס. נסה שוב.",
  },

  ar: {
    title: "تقديم طلب",
    successTitle: "تم إرسال طلب التقديم!",
    successMessageStart: "شكرًا",
    successMessageMiddle: "استلمنا طلب تقديمك لوظيفة",
    close: "إغلاق",

    duplicateMessage: "لقد قدمت طلبًا لهذه الوظيفة من قبل. يمكنك تحديث التفاصيل أو السيرة الذاتية بدلًا من إرسال طلب جديد.",
    updateDetails: "تحديث التفاصيل",
    cvLabel: "السيرة الذاتية",
    cvFromProfile: "إذا لم تختاري ملفًا جديدًا، سنستخدم السيرة الذاتية المحفوظة في حسابك الشخصي.",

    labels: {
      fullName: "الاسم الكامل *",
      email: "البريد الإلكتروني *",
      phone: "رقم الهاتف",
      message: "رسالة / خطاب دافع",
    },

    placeholders: {
      message: "اكتب/ي قليلًا عن نفسك ولماذا أنت مناسب/ة لهذه الوظيفة...",
    },

    buttons: {
      cancel: "إلغاء",
      submit: "إرسال الطلب",
      submitting: "جارٍ الإرسال...",
    },

    error: "حدث خطأ أثناء إرسال النموذج. حاول/ي مرة أخرى.",
  },
};

function ApplicationForm({ job, onClose }) {
  const { language } = useLanguage();
  const { token, user } = useAuth();  
  const text = APPLICATION_FORM_TEXT[language] || APPLICATION_FORM_TEXT.he;
  const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  message: "",
  resumeFile: null,
});
useEffect(() => {
  if (!user) return;

  setFormData((prev) => ({
    ...prev,
    fullName: prev.fullName || user.name || "",
    email: prev.email || user.email || "",
    phone: prev.phone || user.phone || "",
  }));
}, [user]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedResumeName, setSelectedResumeName] = useState("");

  const handleChange = (e) => {
  const { name, value, files, type } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: type === "file" ? files[0] : value,
  }));
};

const handleFileChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const maxSize = 5 * 1024 * 1024;
  const allowedExtensions = [".pdf", ".doc", ".docx"];

  const fileName = file.name.toLowerCase();
  const isAllowed = allowedExtensions.some((ext) => fileName.endsWith(ext));

  if (file.size > maxSize) {
    setSelectedResumeName("");
    e.target.value = "";
    alert("הקובץ גדול מדי. אפשר להעלות קובץ עד 5MB.");
    return;
  }

  if (!isAllowed) {
    setSelectedResumeName("");
    e.target.value = "";
    alert("אפשר להעלות רק קובץ PDF / DOC / DOCX.");
    return;
  }

  setFormData((prev) => ({
    ...prev,
    resumeFile: file,
  }));

  setSelectedResumeName(file.name);
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  setSubmitting(true);

  try {
    if (isUpdateMode && existingApplication?._id) {
      await updateApplication(existingApplication._id, formData, token);      
      setSubmitted(true);
      return;
    }

    await submitApplication({
      ...formData,
      jobId: job._id,
      jobTitle: job.title,
    });

    setSubmitted(true);
  } catch (err) {
    console.error(err);

    if (err.response?.status === 409) {
      const existing = err.response.data?.application;

      if (existing) {
        setExistingApplication(existing);
        return;
      }

      alert(
        err.response.data?.error ||
          "כבר הגשת מועמדות למשרה הזו. ניתן לעדכן פרטים במקום לשלוח שוב."
      );
      return;
    }

    alert(text.error);
   } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="py-6 text-center">
            <div className="mb-4 text-5xl">✅</div>

            <h2 className="mb-2 text-xl font-bold text-gray-800">
              {text.successTitle}
            </h2>

            <p className="mb-6 text-gray-600">
              {text.successMessageStart} {formData.fullName}!{" "}
              {text.successMessageMiddle}{" "}
              <strong>{job.title}</strong>.
            </p>

            <button
              onClick={onClose}
              className="rounded-lg bg-[#2f6b46] px-6 py-2 font-medium text-white hover:bg-[#245539]"
            >
              {text.close}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {text.title}
                </h2>

                <p className="text-sm text-[#2f6b46]">
                  {job.title} · {job.organization}
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-xl text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {existingApplication && !isUpdateMode && (
  <div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
    <p className="mb-3 font-medium">
        {text.duplicateMessage}   
    </p>

    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => setExistingApplication(null)}
        className="rounded-lg border px-4 py-2 text-sm hover:bg-white"
      >
        {text.buttons.cancel}
      </button>

      <button
        type="button"
        onClick={() => {
          setFormData({
                    fullName: existingApplication.fullName || "",
                    email: existingApplication.email || "",
                    phone: existingApplication.phone || "",
                    message: existingApplication.message || "",
                    resumeFile: null,
          });

          setSelectedResumeName("");
          setIsUpdateMode(true);
        }}
        className="rounded-lg bg-[#2f6b46] px-4 py-2 text-sm font-medium text-white hover:bg-[#245539]"
      >
        {text.updateDetails}
      </button>
    </div>
  </div>
)}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  {text.labels.fullName}
                </label>

                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#2f6b46] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  {text.labels.email}
                </label>

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#2f6b46] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  {text.labels.phone}
                </label>

                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#2f6b46] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  {text.cvLabel}
                </label>

                <input
                  id="resumeFileInput"
                  name="resumeFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label
                  htmlFor="resumeFileInput"
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white p-3 text-sm transition hover:border-[#2f6b46] hover:bg-gray-50"
                  >
                  <span className="truncate text-gray-700">
                    {selectedResumeName || "בחרי קובץ קורות חיים"}
                  </span>

                  <span className="shrink-0 rounded-md bg-[#e9f5ef] px-3 py-1 text-xs font-semibold text-[#2f6b46]">
                     בחירת קובץ
                  </span>
                </label>

                {user && (
                  <p className="mt-2 text-xs text-gray-500">
                      {text.cvFromProfile}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  {text.labels.message}
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder={text.placeholders.message}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#2f6b46] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border px-5 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  {text.buttons.cancel}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#2f6b46] px-5 py-2 text-sm font-medium text-white hover:bg-[#245539] disabled:opacity-60"
                >
                  {submitting ? text.buttons.submitting
                    : isUpdateMode
                    ? text.updateDetails
                    : text.buttons.submit
                  }
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