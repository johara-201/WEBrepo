import { useState } from "react";
import logoImg from "../../assets/logo.png";
import { useLanguage } from "../../Context/LanguageContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ADMIN_SETUP_TEXT = {
  he: {
    logoAlt: "לוגו",
    title: "הגדרה ראשונית של המערכת",
    subtitleLine1: "הגדירי שם משתמש וסיסמה לשני המנהלים הראשיים.",
    subtitleLine2: "דף זה יופיע פעם אחת בלבד.",

    firstAdmin: "מנהל ראשי #1 (יארה)",
    secondAdmin: "מנהל ראשי #2 (רכזת משאבי אנוש)",

    username: "שם משתמש",
    password: "סיסמה",
    usernamePlaceholder1: "לדוגמה: yara",
    usernamePlaceholder2: "לדוגמה: hr_coordinator",
    passwordPlaceholder: "לפחות 6 תווים",

    defaultError: "שגיאה",
    loading: "יוצר חשבונות...",
    submit: "צור חשבונות ✓",
  },

  ar: {
    logoAlt: "الشعار",
    title: "الإعداد الأولي للنظام",
    subtitleLine1: "حددي اسم مستخدم وكلمة مرور للمديرين الرئيسيين.",
    subtitleLine2: "ستظهر هذه الصفحة مرة واحدة فقط.",

    firstAdmin: "مدير رئيسي #1 (يارا)",
    secondAdmin: "مدير رئيسي #2 (منسقة الموارد البشرية)",

    username: "اسم المستخدم",
    password: "كلمة المرور",
    usernamePlaceholder1: "مثال: yara",
    usernamePlaceholder2: "مثال: hr_coordinator",
    passwordPlaceholder: "على الأقل 6 أحرف",

    defaultError: "خطأ",
    loading: "جارٍ إنشاء الحسابات...",
    submit: "إنشاء الحسابات ✓",
  },
};

function AdminSetupPage({ onDone }) {
  const { language } = useLanguage();
  const text = ADMIN_SETUP_TEXT[language] || ADMIN_SETUP_TEXT.he;

  const [form, setForm] = useState({
    username: "",
    password: "",
    secondUsername: "",
    secondPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/admin/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || text.defaultError);
      }

      onDone();
    } catch (err) {
      setError(err.message || text.defaultError);
    } finally {
      setLoading(false);
    }
  }

  const field = (label, key, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="mb-1 block text-xs font-semibold text-gray-500">
        {label}
      </label>

      <input
        type={type}
        value={form[key]}
        required
        onChange={(e) => update(key, e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#4f46e5] focus:outline-none"
      />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f8f4] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <img
            src={logoImg}
            alt={text.logoAlt}
            className="mx-auto mb-4 h-14"
          />

          <h1 className="text-2xl font-extrabold text-gray-900">
            {text.title}
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            {text.subtitleLine1}
            <br />
            {text.subtitleLine2}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded-2xl bg-[#f0f0fe] p-5">
            <h2 className="text-sm font-bold text-[#4f46e5]">
              {text.firstAdmin}
            </h2>

            {field(text.username, "username", "text", text.usernamePlaceholder1)}
            {field(text.password, "password", "password", text.passwordPlaceholder)}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-[#f0f0fe] p-5">
            <h2 className="text-sm font-bold text-[#4f46e5]">
              {text.secondAdmin}
            </h2>

            {field(text.username, "secondUsername", "text", text.usernamePlaceholder2)}
            {field(text.password, "secondPassword", "password", text.passwordPlaceholder)}
          </div>

          {error && (
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#4f46e5] py-3 font-bold text-white transition hover:bg-[#4338ca] disabled:opacity-60"
          >
            {loading ? text.loading : text.submit}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminSetupPage;