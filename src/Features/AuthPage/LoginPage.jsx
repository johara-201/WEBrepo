import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import logoImg from "../../assets/logo.png";
import heroIllustration from "../../assets/hero-illustration.png";

// ── טאב: מחפש עבודה ──────────────────────────────────────────────────────────
function UserPanel({ onSuccess, onClose }) {
  const { loginUser, registerUser } = useAuth();
  const [mode,  setMode]  = useState("login"); // "login" | "register"
  const [form,  setForm]  = useState({ email: "", password: "", name: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        await loginUser(form.email, form.password);
      } else {
        if (!form.name) { setError("שם מלא הוא שדה חובה"); setLoading(false); return; }
        await registerUser(form.email, form.password, form.name, form.phone);
      }
      onSuccess("user");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === "register" && (
        <>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">שם מלא *</label>
            <input
              type="text" value={form.name} onChange={e => update("name", e.target.value)}
              placeholder="ישראל ישראלי"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f6b46]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">טלפון</label>
            <input
              type="tel" value={form.phone} onChange={e => update("phone", e.target.value)}
              placeholder="050-0000000"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f6b46]"
            />
          </div>
        </>
      )}
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">דוא"ל</label>
        <input
          type="email" value={form.email} onChange={e => update("email", e.target.value)}
          placeholder="your@email.com" required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f6b46]"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">סיסמה</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"} value={form.password}
            onChange={e => update("password", e.target.value)}
            placeholder="••••••••" required minLength={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f6b46] pl-10"
          />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
            {showPw ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-[#2f6b46] text-white font-bold py-3 rounded-xl hover:bg-[#245539] transition disabled:opacity-60 text-sm mt-1">
        {loading ? "..." : mode === "login" ? "התחבר" : "הירשם"}
      </button>

      <p className="text-center text-sm text-gray-500">
        {mode === "login" ? "אין לך חשבון?" : "כבר רשום?"}{" "}
        <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          className="text-[#2f6b46] font-semibold hover:underline">
          {mode === "login" ? "הירשם כאן" : "התחבר"}
        </button>
      </p>
    </form>
  );
}

// ── טאב: מנהל ────────────────────────────────────────────────────────────────
function AdminPanel({ onSuccess }) {
  const { loginAdmin } = useAuth();
  const [form,  setForm]  = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const adminData = await loginAdmin(form.username, form.password);
      onSuccess("admin", adminData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">שם משתמש</label>
        <input
          type="text" value={form.username} onChange={e => update("username", e.target.value)}
          placeholder="שם המשתמש שלך" required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4f46e5]"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">סיסמה</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"} value={form.password}
            onChange={e => update("password", e.target.value)}
            placeholder="••••••••" required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4f46e5] pl-10"
          />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
            {showPw ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-[#4f46e5] text-white font-bold py-3 rounded-xl hover:bg-[#4338ca] transition disabled:opacity-60 text-sm mt-1">
        {loading ? "..." : "כניסה כמנהל"}
      </button>
    </form>
  );
}

// ── דף ראשי ───────────────────────────────────────────────────────────────────
function LoginPage({ onSuccess, onClose, onHome }) {
  const [tab, setTab] = useState("user"); // "user" | "admin"

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f8f4] flex">

      {/* ─── פאנל שמאל: אילוסטרציה ─────────────────────────────────────── */}
      <div
  className="hidden md:flex flex-col w-[42%] relative overflow-hidden"
  style={{ background: "linear-gradient(135deg, #1a4d2e 0%, #2f6b46 60%, #4a9e6b 100%)" }}
>
  <div className="p-8 relative z-10">
    <button onClick={onHome || onClose}>
      <img src={logoImg} alt="לוגו" className="h-14 w-auto brightness-200 opacity-90" />
    </button>
  </div>

  <div className="px-10 pt-4 relative z-10 text-right">
    <h2 className="text-white text-4xl font-extrabold leading-tight mb-4">
      יחד מחזקים<br />את החינוך<br />בקהילה שלנו
    </h2>

    <p className="text-white/80 text-base leading-relaxed max-w-md">
      הזדמנויות לחיים, פלטפורמת משרות בחינוך, נוער וקהילה באזור בית הכרם.
    </p>
  </div>
        <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden opacity-20">
          <img src={heroIllustration} alt="" className="w-full object-cover object-top" />
        </div>
      </div>

      {/* ─── פאנל ימין: טפסים ───────────────────────────────────────────── */}
<div className="flex-1 flex justify-center items-center px-8 py-12">
  <div className="w-full max-w-md">

    {/* כפתור חזרה לדף הבית - קטן ובצד */}
    <div className="text-right mb-4">
      <button
        onClick={onHome || onClose}
        className="inline-flex items-center justify-center gap-2 bg-[#2f6b46] text-white font-bold px-4 py-2 rounded-xl hover:bg-[#245539] transition shadow-md text-xs"
      >
        <span>🏠</span>
        <span>חזרה לדף הבית</span>
      </button>
    </div>

    {/* כרטיסיית התחברות */}
    <div className="bg-white border border-gray-100 rounded-3xl shadow-xl px-8 py-9">

      <h1 className="text-3xl font-extrabold text-gray-900 mb-1 text-center">
        ברוכים הבאים
      </h1>

      <p className="text-gray-400 text-sm mb-7 text-center">
        התחברו כדי להמשיך
      </p>

      {/* טאבים */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
        <button
          onClick={() => setTab("user")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
            tab === "user"
              ? "bg-white text-[#2f6b46] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          מחפש/ת עבודה
        </button>

        <button
          onClick={() => setTab("admin")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
            tab === "admin"
              ? "bg-white text-[#4f46e5] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          מנהל/ת
        </button>
      </div>

      {tab === "user" && <UserPanel onSuccess={onSuccess} onClose={onClose} />}
      {tab === "admin" && <AdminPanel onSuccess={onSuccess} />}

    </div>
  </div>
</div>
    </div>
  );
}

export default LoginPage;
