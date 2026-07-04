import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useLanguage } from "../../Context/LanguageContext";
import { useConfirm } from "../../Components/ConfirmDialog";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ADMIN_MANAGEMENT_TEXT = {
  he: {
    profile: {
      title: "הפרטים שלי",
      mustChange:
        "⚠️ עליך לשנות את שם המשתמש והסיסמה לפני שתוכל להמשיך.",
      username: "שם משתמש",
      email: "אימייל",
      emailPlaceholder: "הזן כתובת אימייל",
      currentPassword: "סיסמה נוכחית",
      currentPasswordPlaceholder: "הכנס סיסמה נוכחית לאימות",
      newPassword: "סיסמה חדשה (אופציונלי)",
      newPasswordPlaceholder: "השאר ריק אם אינך רוצה לשנות",
      save: "שמור שינויים",
      saving: "שומר...",
      success: "פרטים עודכנו בהצלחה ✓",
      error: "שגיאה",
      noChanges: "לא בוצעו שינויים.",
    },

    admins: {
      title: "ניהול מנהלים",
      addAdmin: "+ הוסף מנהל חדש",
      successCreate: "מנהל חדש נוצר בהצלחה!",
      confirmDelete: "למחוק מנהל זה?",
      loading: "טוען...",
      mainAdmin: "מנהל ראשי",
      admin: "מנהל",
      mustChangePassword: "טרם שינה סיסמה",
      tempPassword: "סיסמה זמנית:",
      active: "פעיל",
      delete: "מחיקה",

      saveCredsTitle: "⚠️ שמור פרטים אלו — הם יוצגו פעם אחת בלבד!",
      username: "שם משתמש:",
      password: "סיסמה:",
      newAdminNote:
        "המנהל החדש יתבקש לשנות פרטים אלו בכניסה הראשונה.",
      closeCreds: "סגור (וודא שהעתקת את הפרטים!)",
    },
  },

  ar: {
    profile: {
      title: "بياناتي",
      mustChange:
        "⚠️ عليك تغيير اسم المستخدم وكلمة المرور قبل أن تتمكن/ي من المتابعة.",
      username: "اسم المستخدم",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل/ي عنوان البريد الإلكتروني",
      currentPassword: "كلمة المرور الحالية",
      currentPasswordPlaceholder: "أدخل/ي كلمة المرور الحالية للتأكيد",
      newPassword: "كلمة مرور جديدة (اختياري)",
      newPasswordPlaceholder: "اترك/ي الحقل فارغًا إذا لم ترغب/ي بالتغيير",
      save: "حفظ التغييرات",
      saving: "جارٍ الحفظ...",
      success: "تم تحديث البيانات بنجاح ✓",
      error: "خطأ",
      noChanges: "لم يتم إجراء أي تغييرات.",
    },

    admins: {
      title: "إدارة المديرين",
      addAdmin: "+ إضافة مدير جديد",
      successCreate: "تم إنشاء مدير جديد بنجاح!",
      confirmDelete: "هل تريد/ين حذف هذا المدير؟",
      loading: "جارٍ التحميل...",
      mainAdmin: "مدير رئيسي",
      admin: "مدير",
      mustChangePassword: "لم يغيّر كلمة المرور بعد",
      tempPassword: "كلمة المرور المؤقتة:",
      active: "فعّال",
      delete: "حذف",

      saveCredsTitle:
        "⚠️ احفظ/ي هذه التفاصيل — سيتم عرضها مرة واحدة فقط!",
      username: "اسم المستخدم:",
      password: "كلمة المرور:",
      newAdminNote:
        "سيُطلب من المدير الجديد تغيير هذه التفاصيل عند تسجيل الدخول لأول مرة.",
      closeCreds: "إغلاق (تأكد/ي من نسخ التفاصيل!)",
    },
  },
};

// ── פאנל עדכון פרטי המנהל עצמו ───────────────────────────────────────────────
export function AdminProfilePanel() {
  const { token, admin } = useAuth();
  const { language } = useLanguage();
  const text = ADMIN_MANAGEMENT_TEXT[language] || ADMIN_MANAGEMENT_TEXT.he;

  const [form, setForm] = useState({
    username: "",
    email: "",
    newPassword: "",
    currentPassword: "",
  });

  const [initialEmail, setInitialEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    if (!admin) return;
    setForm((prev) => ({ ...prev, username: admin.username || "" }));

    // Fetch full profile to get email (not stored in auth context)
    fetch(`${API}/api/admins/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const email = data.email || "";
        setInitialEmail(email);
        setForm((prev) => ({ ...prev, email }));
      })
      .catch(() => {});
  }, [admin, token]);

  async function save(e) {
    e.preventDefault();

    setMsg("");
    setError("");

    const usernameChanged = form.username.trim() !== (admin?.username || "");
    const emailChanged = form.email.trim() !== initialEmail;
    const hasNewPassword = !!form.newPassword;

    if (!usernameChanged && !emailChanged && !hasNewPassword) {
      setError(text.profile.noChanges);
      return;
    }

    setLoading(true);

    try {
      const body = {
        username: form.username,
        email: form.email.trim(),
      };

      if (hasNewPassword) {
        body.newPassword = form.newPassword;
      }

      if (form.currentPassword) {
        body.currentPassword = form.currentPassword;
      }

      const res = await fetch(`${API}/api/admins/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || text.profile.error);
      }

      setMsg(text.profile.success);
      setInitialEmail(form.email.trim());

      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-gray-800">
        {text.profile.title}
      </h2>

      {admin?.mustChangePassword && (
        <div className="mb-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          {text.profile.mustChange}
        </div>
      )}

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

      <form onSubmit={save} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            {text.profile.username}
          </label>

          <input
            value={form.username}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#4f46e5] focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            {text.profile.email}
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder={text.profile.emailPlaceholder}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#4f46e5] focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            {text.profile.currentPassword}
          </label>

          <div className="relative">
            <input
              type={showCurrentPw ? "text" : "password"}
              value={form.currentPassword}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              placeholder={text.profile.currentPasswordPlaceholder}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pl-10 text-sm focus:border-[#4f46e5] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPw((v) => !v)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-base"
            >
              {showCurrentPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            {text.profile.newPassword}
          </label>

          <div className="relative">
            <input
              type={showNewPw ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              placeholder={text.profile.newPasswordPlaceholder}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pl-10 text-sm focus:border-[#4f46e5] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowNewPw((v) => !v)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-base"
            >
              {showNewPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#4f46e5] py-2.5 text-sm font-bold text-white transition hover:bg-[#4338ca] disabled:opacity-60"
        >
          {loading ? text.profile.saving : text.profile.save}
        </button>
      </form>
    </div>
  );
}

// ── כפתור הצגה/הסתרה של סיסמה זמנית ─────────────────────────────────────────
function TempPasswordDisplay({ password, label }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-1.5 text-xs text-yellow-800">
      <span className="font-medium">{label}</span>
      <span className="font-mono tracking-wide">
        {visible ? password : "••••••••"}
      </span>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-yellow-600 hover:text-yellow-800 text-sm leading-none"
      >
        {visible ? "🙈" : "👁️"}
      </button>
    </div>
  );
}

// ── פאנל ניהול מנהלים (super בלבד) ──────────────────────────────────────────
export function AdminsListPanel() {
  const { token } = useAuth();
  const { language } = useLanguage();
  const showConfirm = useConfirm();
  const text = ADMIN_MANAGEMENT_TEXT[language] || ADMIN_MANAGEMENT_TEXT.he;

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCreds, setNewCreds] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function loadAdmins() {
    try {
      const res = await fetch(`${API}/api/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setAdmins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function createAdmin() {
    setMsg("");
    setError("");
    setNewCreds(null);

    try {
      const res = await fetch(`${API}/api/admins`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setNewCreds(data.credentials);
      setMsg(text.admins.successCreate);
      loadAdmins();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeAdmin(id) {
    if (!(await showConfirm(text.admins.confirmDelete))) return;

    try {
      const res = await fetch(`${API}/api/admins/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setAdmins((prev) => prev.filter((adminItem) => adminItem._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          {text.admins.title}
        </h2>

        <button
          onClick={createAdmin}
          className="flex items-center gap-2 rounded-xl bg-[#4f46e5] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#4338ca]"
        >
          {text.admins.addAdmin}
        </button>
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

      {newCreds && (
        <div className="mb-5 rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-5">
          <p className="mb-2 font-bold text-yellow-800">
            {text.admins.saveCredsTitle}
          </p>

          <p className="text-sm text-yellow-900">
            {text.admins.username}{" "}
            <strong>{newCreds.username}</strong>
          </p>

          <p className="text-sm text-yellow-900">
            {text.admins.password}{" "}
            <strong>{newCreds.password}</strong>
          </p>

          <p className="mt-2 text-xs text-yellow-700">
            {text.admins.newAdminNote}
          </p>

          <button
            onClick={() => setNewCreds(null)}
            className="mt-3 text-xs text-yellow-600 underline"
          >
            {text.admins.closeCreds}
          </button>
        </div>
      )}

      {loading && (
        <p className="py-8 text-center text-sm text-gray-400">
          {text.admins.loading}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {admins.map((adminItem) => (
          <div
            key={adminItem._id}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4 hover:bg-gray-50"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                adminItem.canSeeAll ? "bg-[#e8e7fc]" : "bg-gray-100"
              }`}
            >
              {adminItem.canSeeAll ? "⭐" : "👤"}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {adminItem.username}
              </p>

              <p className="text-xs text-gray-400">
                {adminItem.canSeeAll
                  ? text.admins.mainAdmin
                  : text.admins.admin}{" "}
                ·{" "}
                {adminItem.mustChangePassword ? (
                  <span className="text-yellow-600">
                    {text.admins.mustChangePassword}
                  </span>
                ) : (
                  text.admins.active
                )}
              </p>

              {adminItem.mustChangePassword && adminItem.tempPassword && (
                <TempPasswordDisplay
                  password={adminItem.tempPassword}
                  label={text.admins.tempPassword}
                />
              )}
            </div>

            {!adminItem.canSeeAll && (
              <button
                onClick={() => removeAdmin(adminItem._id)}
                className="rounded-xl border border-red-100 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
              >
                {text.admins.delete}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}