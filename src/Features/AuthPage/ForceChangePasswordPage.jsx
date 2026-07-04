import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useLanguage } from "../../Context/LanguageContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const TEXT = {
  he: {
    title: "ברוך הבא! שנה פרטי כניסה",
    subtitle:
      "בכניסה הראשונה עליך לבחור שם משתמש וסיסמה חדשים. הפרטים הזמניים יפוגו לאחר השינוי.",
    username: "שם משתמש חדש",
    password: "סיסמה חדשה",
    confirm: "אימות סיסמה",
    submit: "שמור והמשך",
    submitting: "שומר...",
    mismatch: "הסיסמאות אינן תואמות",
    minLength: "הסיסמה חייבת להכיל לפחות 6 תווים",
    success: "הפרטים עודכנו בהצלחה!",
    error: "שגיאה בעדכון הפרטים",
  },
  ar: {
    title: "مرحبًا! غيّر بيانات الدخول",
    subtitle:
      "عند تسجيل الدخول لأول مرة، يجب عليك اختيار اسم مستخدم وكلمة مرور جديدين. ستنتهي صلاحية البيانات المؤقتة بعد التغيير.",
    username: "اسم المستخدم الجديد",
    password: "كلمة المرور الجديدة",
    confirm: "تأكيد كلمة المرور",
    submit: "حفظ والمتابعة",
    submitting: "جارٍ الحفظ...",
    mismatch: "كلمتا المرور غير متطابقتين",
    minLength: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
    success: "تم تحديث البيانات بنجاح!",
    error: "خطأ في تحديث البيانات",
  },
};

export default function ForceChangePasswordPage() {
  const { token, admin, updateAdmin, logout } = useAuth();
  const { language } = useLanguage();
  const text = TEXT[language] || TEXT.he;

  const [form, setForm] = useState({
    username: admin?.username || "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError(text.minLength);
      return;
    }

    if (form.password !== form.confirm) {
      setError(text.mismatch);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/admins/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: form.username,
          newPassword: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || text.error);

      updateAdmin({ ...admin, username: form.username, mustChangePassword: false });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-4"
      dir={language === "ar" ? "rtl" : "rtl"}
    >
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-l from-[#4f46e5] to-[#6366f1] px-8 py-7 text-white">
            <div className="mb-3 text-4xl">🔐</div>
            <h1 className="text-2xl font-extrabold">{text.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              {text.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 px-8 py-7">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                {text.username}
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4f46e5] focus:bg-white focus:ring-2 focus:ring-[#4f46e5]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                {text.password}
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4f46e5] focus:bg-white focus:ring-2 focus:ring-[#4f46e5]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                {text.confirm}
              </label>
              <input
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4f46e5] focus:bg-white focus:ring-2 focus:ring-[#4f46e5]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#4f46e5] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#4338ca] disabled:opacity-60"
            >
              {loading ? text.submitting : text.submit}
            </button>

            <button
              type="button"
              onClick={logout}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600"
            >
              יציאה מהמערכת
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
