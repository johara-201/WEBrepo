import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useLanguage } from "../../Context/LanguageContext";
import NavBar from "../../Components/NavBar";
import {
  getProfile,
  updateProfile,
  uploadCV,
  deleteCV,
  getMyApplications,
  withdrawApplication,
  changePassword,
} from "./jobSeekerService";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DASHBOARD_TEXT = {
  he: {
    common: {
      loading: "טוען...",
      notProvided: "לא הוזן",
      cancel: "ביטול",
      save: "שמור",
      edit: "עריכה",
      delete: "מחיקה",
      logout: "יציאה",
      locale: "he-IL",
    },

    sidebar: {
      profile: "פרטים אישיים",
      password: "שינוי סיסמה",
      cv: "קורות חיים",
      applications: "המועמדיות שלי",
    },

    pageTitles: {
      profile: "הפרטים האישיים שלי",
      password: "שינוי סיסמה",
      cv: "קורות החיים שלי",
      applications: "המשרות שהגשתי",
    },

    profile: {
      title: "פרטים אישיים",
      edit: "עריכה ✏️",
      success: "פרטים עודכנו בהצלחה ✓",
      error: "שגיאה בעדכון פרטים",
      fields: {
        name: "שם מלא",
        email: "אימייל",
        phone: "טלפון",
        city: "עיר מגורים",
        profession: "תחום עיסוק",
        bio: "קצת עליי",
      },
      placeholders: {
        name: "שמך המלא",
        phone: "050-0000000",
        city: "עיר",
        profession: "לדוגמה: חינוך, נוער",
        bio: "כמה מילים על עצמך...",
      },
    },

    password: {
      title: "שינוי סיסמה",
      subtitle: "כאן ניתן לעדכן את סיסמת המשתמש שלך.",
      currentPassword: "סיסמה נוכחית",
      newPassword: "סיסמה חדשה",
      confirmPassword: "אימות סיסמה חדשה",
      currentPlaceholder: "הכניסי סיסמה נוכחית",
      newPlaceholder: "הכניסי סיסמה חדשה",
      confirmPlaceholder: "הקלידי שוב את הסיסמה החדשה",
      allRequired: "יש למלא את כל השדות",
      minLength: "הסיסמה החדשה חייבת להכיל לפחות 6 תווים",
      mismatch: "אימות הסיסמה אינו תואם לסיסמה החדשה",
      success: "הסיסמה עודכנה בהצלחה ✓",
      error: "שגיאה בשינוי הסיסמה",
      updating: "מעדכן...",
      submit: "עדכן סיסמה",
    },

    cv: {
      title: "קורות חיים",
      uploaded: "הועלה:",
      view: "צפייה",
      update: "עדכון",
      delete: "מחיקה",
      noCv: "לא הועלו קורות חיים עדיין",
      uploading: "מעלה...",
      upload: "העלאת קורות חיים",
      successUpload: "קורות חיים הועלו בהצלחה ✓",
      confirmDelete: "למחוק את קורות החיים?",
      successDelete: "קורות חיים נמחקו",
      errorDelete: "שגיאה במחיקה",
      allowedFiles: "קבצים מותרים: PDF, Word. גודל מקסימלי: 5MB",
    },

    applications: {
      title: "המשרות שהגשתי",
      confirmWithdraw: "להסיר מועמדות זו?",
      successWithdraw: "מועמדות הוסרה בהצלחה",
      errorWithdraw: "שגיאה בהסרת מועמדות",
      empty: "לא הגשת מועמדות עדיין",
      defaultJob: "משרה",
      removedBadge: "המשרה הוסרה",
      submitted: "הוגש:",
      removedMessage: "המשרה נמחקה על ידי המנהל ולכן כבר לא זמינה באתר.",
      removeFromList: "הסרה מהרשימה",
      remove: "הסרה",
    },
  },

  ar: {
    common: {
      loading: "جارٍ التحميل...",
      notProvided: "لم يتم إدخال قيمة",
      cancel: "إلغاء",
      save: "حفظ",
      edit: "تعديل",
      delete: "حذف",
      logout: "تسجيل الخروج",
      locale: "ar",
    },

    sidebar: {
      profile: "بيانات شخصية",
      password: "تغيير كلمة المرور",
      cv: "السيرة الذاتية",
      applications: "وظائفي",
    },

    pageTitles: {
      profile: "بياناتي الشخصية",
      password: "تغيير كلمة المرور",
      cv: "سيرتي الذاتية",
      applications: "الوظائف التي تقدمت لها",
    },

    profile: {
      title: "بيانات شخصية",
      edit: "تعديل ✏️",
      success: "تم تحديث البيانات بنجاح ✓",
      error: "حدث خطأ أثناء تحديث البيانات",
      fields: {
        name: "الاسم الكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        city: "بلدة السكن",
        profession: "المجال المهني",
        bio: "نبذة عني",
      },
      placeholders: {
        name: "اسمك الكامل",
        phone: "050-0000000",
        city: "البلدة",
        profession: "مثال: تربية، شباب",
        bio: "اكتب/ي بضع كلمات عن نفسك...",
      },
    },

    password: {
      title: "تغيير كلمة المرور",
      subtitle: "هنا يمكن تحديث كلمة مرور حسابك.",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة مرور جديدة",
      confirmPassword: "تأكيد كلمة المرور الجديدة",
      currentPlaceholder: "أدخل/ي كلمة المرور الحالية",
      newPlaceholder: "أدخل/ي كلمة مرور جديدة",
      confirmPlaceholder: "اكتب/ي كلمة المرور الجديدة مرة أخرى",
      allRequired: "يجب تعبئة جميع الحقول",
      minLength: "يجب أن تحتوي كلمة المرور الجديدة على 6 أحرف على الأقل",
      mismatch: "تأكيد كلمة المرور لا يطابق كلمة المرور الجديدة",
      success: "تم تحديث كلمة المرور بنجاح ✓",
      error: "حدث خطأ أثناء تغيير كلمة المرور",
      updating: "جارٍ التحديث...",
      submit: "تحديث كلمة المرور",
    },

    cv: {
      title: "السيرة الذاتية",
      uploaded: "تم الرفع:",
      view: "عرض",
      update: "تحديث",
      delete: "حذف",
      noCv: "لم يتم رفع سيرة ذاتية بعد",
      uploading: "جارٍ الرفع...",
      upload: "رفع السيرة الذاتية",
      successUpload: "تم رفع السيرة الذاتية بنجاح ✓",
      confirmDelete: "هل تريد/ين حذف السيرة الذاتية؟",
      successDelete: "تم حذف السيرة الذاتية",
      errorDelete: "حدث خطأ أثناء الحذف",
      allowedFiles: "الملفات المسموحة: PDF, Word. الحجم الأقصى: 5MB",
    },

    applications: {
      title: "الوظائف التي تقدمت لها",
      confirmWithdraw: "هل تريد/ين إزالة طلب التقديم هذا؟",
      successWithdraw: "تمت إزالة طلب التقديم بنجاح",
      errorWithdraw: "حدث خطأ أثناء إزالة طلب التقديم",
      empty: "لم تقدّم/ي لأي وظيفة بعد",
      defaultJob: "وظيفة",
      removedBadge: "تمت إزالة الوظيفة",
      submitted: "تم التقديم:",
      removedMessage: "تم حذف الوظيفة من قبل المدير، لذلك لم تعد متاحة في الموقع.",
      removeFromList: "إزالة من القائمة",
      remove: "إزالة",
    },
  },
};

// ── פאנל: פרטים אישיים ───────────────────────────────────────────────────────
function ProfilePanel({ token }) {
  const { language } = useLanguage();
  const text = DASHBOARD_TEXT[language] || DASHBOARD_TEXT.he;

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile(token)
      .then((profileData) => {
        setProfile(profileData);
        setForm(profileData);
      })
      .catch(() => {});
  }, [token]);

  async function save() {
    setMsg("");
    setError("");

    try {
      const updated = await updateProfile(token, {
        name: form.name,
        phone: form.phone,
        city: form.city,
        profession: form.profession,
        bio: form.bio,
      });

      setProfile(updated);
      setEditing(false);
      setMsg(text.profile.success);
    } catch {
      setError(text.profile.error);
    }
  }

  if (!profile) {
    return (
      <div className="py-10 text-center text-gray-400">
        {text.common.loading}
      </div>
    );
  }

  const field = (label, key, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="mb-1 block text-xs font-semibold text-gray-500">
        {label}
      </label>

      {editing ? (
        <input
          type={type}
          value={form[key] || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              [key]: e.target.value,
            }))
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#2f6b46] focus:outline-none"
        />
      ) : (
        <p className="border-b border-gray-100 px-1 py-2.5 text-sm text-gray-800">
          {profile[key] || (
            <span className="text-gray-300">
              {text.common.notProvided}
            </span>
          )}
        </p>
      )}
    </div>
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          {text.profile.title}
        </h2>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="rounded-xl border border-[#2f6b46] px-4 py-1.5 text-sm font-semibold text-[#2f6b46] transition hover:bg-[#f0faf4]"
          >
            {text.profile.edit}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditing(false);
                setForm(profile);
              }}
              className="rounded-xl border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
            >
              {text.common.cancel}
            </button>

            <button
              onClick={save}
              className="rounded-xl bg-[#2f6b46] px-4 py-1.5 text-sm font-bold text-white hover:bg-[#245539]"
            >
              {text.common.save}
            </button>
          </div>
        )}
      </div>

      {msg && (
        <p className="mb-4 text-sm text-green-600">
          {msg}
        </p>
      )}

      {error && (
        <p className="mb-4 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field(text.profile.fields.name, "name", "text", text.profile.placeholders.name)}
        {field(text.profile.fields.email, "email", "email")}
        {field(text.profile.fields.phone, "phone", "tel", text.profile.placeholders.phone)}
        {field(text.profile.fields.city, "city", "text", text.profile.placeholders.city)}
        {field(text.profile.fields.profession, "profession", "text", text.profile.placeholders.profession)}
      </div>

      {editing ? (
        <div className="mt-4">
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            {text.profile.fields.bio}
          </label>

          <textarea
            value={form.bio || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                bio: e.target.value,
              }))
            }
            rows={3}
            placeholder={text.profile.placeholders.bio}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#2f6b46] focus:outline-none"
          />
        </div>
      ) : (
        profile.bio && (
          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              {text.profile.fields.bio}
            </label>

            <p className="text-sm leading-relaxed text-gray-700">
              {profile.bio}
            </p>
          </div>
        )
      )}
    </div>
  );
}

// ── פאנל: שינוי סיסמה ───────────────────────────────────────────────────────
function PasswordPanel({ token }) {
  const { language } = useLanguage();
  const text = DASHBOARD_TEXT[language] || DASHBOARD_TEXT.he;

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-right outline-none transition focus:border-[#2f6b46] focus:bg-white focus:ring-2 focus:ring-[#2f6b46]/20";

  async function handleSubmit(e) {
    e.preventDefault();

    setMsg("");
    setError("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError(text.password.allRequired);
      return;
    }

    if (form.newPassword.length < 6) {
      setError(text.password.minLength);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError(text.password.mismatch);
      return;
    }

    try {
      setLoading(true);

      await changePassword(token, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setMsg(text.password.success);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || text.password.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          {text.password.title}
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          {text.password.subtitle}
        </p>
      </div>

      {msg && (
        <p className="mb-4 text-sm text-green-600">
          {msg}
        </p>
      )}

      {error && (
        <p className="mb-4 text-sm text-red-500">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            {text.password.currentPassword}
          </label>

          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            className={inputClass}
            placeholder={text.password.currentPlaceholder}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            {text.password.newPassword}
          </label>

          <input
            type="password"
            value={form.newPassword}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            className={inputClass}
            placeholder={text.password.newPlaceholder}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            {text.password.confirmPassword}
          </label>

          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className={inputClass}
            placeholder={text.password.confirmPlaceholder}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#2f6b46] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#245539] disabled:opacity-60"
        >
          {loading ? text.password.updating : text.password.submit}
        </button>
      </form>
    </div>
  );
}

// ── פאנל: קורות חיים ─────────────────────────────────────────────────────────
function CVPanel({ token }) {
  const { language } = useLanguage();
  const text = DASHBOARD_TEXT[language] || DASHBOARD_TEXT.he;

  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef();

  useEffect(() => {
    getProfile(token)
      .then(setProfile)
      .catch(() => {});
  }, [token]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setMsg("");
    setError("");

    try {
      await uploadCV(token, file);

      const updated = await getProfile(token);

      setProfile(updated);
      setMsg(text.cv.successUpload);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(text.cv.confirmDelete)) return;

    setMsg("");
    setError("");

    try {
      await deleteCV(token);

      const updated = await getProfile(token);

      setProfile(updated);
      setMsg(text.cv.successDelete);
    } catch {
      setError(text.cv.errorDelete);
    }
  }

  const hasCv = !!profile?.cv?.filename;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-gray-800">
        {text.cv.title}
      </h2>

      {msg && (
        <p className="mb-4 text-sm text-green-600">
          {msg}
        </p>
      )}

      {error && (
        <p className="mb-4 text-sm text-red-500">
          {error}
        </p>
      )}

      {hasCv ? (
        <div className="mb-4 flex items-center gap-4 rounded-2xl border border-[#c3e6d3] bg-[#f0faf4] p-4">
          <div className="text-3xl">📄</div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">
              {profile.cv.filename}
            </p>

            <p className="text-xs text-gray-400">
              {text.cv.uploaded}{" "}
              {new Date(profile.cv.uploadedAt).toLocaleDateString(text.common.locale)}
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href={`${API}/api/users/me/cv`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.preventDefault();

                fetch(`${API}/api/users/me/cv`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then((response) => response.blob())
                  .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    window.open(url, "_blank");
                  });
              }}
              className="rounded-xl border border-[#2f6b46] px-3 py-1.5 text-xs font-semibold text-[#2f6b46] transition hover:bg-[#2f6b46] hover:text-white"
            >
              {text.cv.view}
            </a>

            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50"
            >
              {text.cv.update}
            </button>

            <button
              onClick={handleDelete}
              className="rounded-xl border border-red-200 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
            >
              {text.cv.delete}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <div className="mb-3 text-4xl">📁</div>

          <p className="mb-4 text-sm text-gray-500">
            {text.cv.noCv}
          </p>

          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-xl bg-[#2f6b46] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#245539]"
          >
            {uploading ? text.cv.uploading : text.cv.upload}
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleUpload}
      />

      <p className="text-xs text-gray-400">
        {text.cv.allowedFiles}
      </p>
    </div>
  );
}

// ── פאנל: מועמדויות ───────────────────────────────────────────────────────────
function ApplicationsPanel({ token, onViewJob }) {
  const { language } = useLanguage();
  const text = DASHBOARD_TEXT[language] || DASHBOARD_TEXT.he;

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getMyApplications(token)
      .then((applications) => {
        setApps(applications);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  async function withdraw(appId) {
    if (!confirm(text.applications.confirmWithdraw)) return;

    try {
      await withdrawApplication(token, appId);

      setApps((prev) => prev.filter((application) => application._id !== appId));
      setMsg(text.applications.successWithdraw);
    } catch {
      setMsg(text.applications.errorWithdraw);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-gray-800">
        {text.applications.title}
      </h2>

      {msg && (
        <p className="mb-4 text-sm text-green-600">
          {msg}
        </p>
      )}

      {loading && (
        <p className="py-8 text-center text-sm text-gray-400">
          {text.common.loading}
        </p>
      )}

      {!loading && apps.length === 0 && (
        <div className="py-12 text-center text-gray-400">
          <div className="mb-3 text-4xl">📋</div>
          <p>{text.applications.empty}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {apps.map((app) => {
          const removed = app.jobRemoved || app.jobExists === false;
          const title =
            app.jobTitle ||
            app.job?.title ||
            text.applications.defaultJob;

          return (
            <div
              key={app._id}
              className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                removed
                  ? "border-orange-200 bg-orange-50/70"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${
                  removed ? "bg-orange-100" : "bg-[#e9f5ef]"
                }`}
              >
                {removed ? "⚠️" : "💼"}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={`truncate text-sm font-semibold ${
                      removed ? "text-orange-800" : "text-gray-800"
                    }`}
                  >
                    {title}
                  </p>

                  {removed && (
                    <span className="rounded-full border border-orange-200 bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700">
                      {text.applications.removedBadge}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  {text.applications.submitted}{" "}
                  {new Date(app.submittedAt).toLocaleDateString(text.common.locale)}
                </p>

                {removed && (
                  <p className="mt-1 text-xs text-orange-700">
                    {text.applications.removedMessage}
                  </p>
                )}
              </div>

              <button
                onClick={() => withdraw(app._id)}
                className="shrink-0 rounded-xl border border-red-100 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
              >
                {removed
                  ? text.applications.removeFromList
                  : text.applications.remove}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── דף ראשי ───────────────────────────────────────────────────────────────────
function JobSeekerDashboard({
  onHome,
  onSearch,
  onAbout,
  onFaq,
  onAdmin,
  onDashboard,
  onAIChat,
}) {
  const { user, token, logout } = useAuth();
  const { language } = useLanguage();

  const text = DASHBOARD_TEXT[language] || DASHBOARD_TEXT.he;

  const [activeTab, setActiveTab] = useState("profile");

  const sidebarItems = [
    {
      key: "profile",
      label: text.sidebar.profile,
      emoji: "👤",
    },
    {
      key: "password",
      label: text.sidebar.password,
      emoji: "🔒",
    },
    {
      key: "cv",
      label: text.sidebar.cv,
      emoji: "📄",
    },
    {
      key: "applications",
      label: text.sidebar.applications,
      emoji: "💼",
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f8f4] text-right text-gray-800 font-sans">
      <NavBar
        activePage="dashboard"
        onHome={onHome}
        onSearch={onSearch}
        onAbout={onAbout}
        onFaq={onFaq}
        onAdmin={onAdmin}
        onDashboard={onDashboard}
        onAIChat={onAIChat}
      />

      <div className="mx-auto flex max-w-5xl items-start gap-6 px-6 py-8">
        <aside className="sticky top-24 w-52 shrink-0">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-5 border-b border-gray-100 pb-4 text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f5ef] text-2xl">
                👤
              </div>

              <p className="truncate text-sm font-bold text-gray-800">
                {user?.name}
              </p>

              <p className="truncate text-xs text-gray-400">
                {user?.email}
              </p>
            </div>

            <nav className="flex flex-col gap-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-right text-sm font-medium transition ${
                    activeTab === item.key
                      ? "bg-[#e9f5ef] font-bold text-[#2f6b46]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{item.emoji}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <button
                onClick={() => {
                  logout();
                  onHome();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-right text-sm text-red-500 transition hover:bg-red-50"
              >
                <span>🚪</span>
                {text.common.logout}
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            {text.pageTitles[activeTab]}
          </h1>

          {activeTab === "profile" && <ProfilePanel token={token} />}
          {activeTab === "password" && <PasswordPanel token={token} />}
          {activeTab === "cv" && <CVPanel token={token} />}
          {activeTab === "applications" && (
            <ApplicationsPanel token={token} onViewJob={onSearch} />
          )}
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;