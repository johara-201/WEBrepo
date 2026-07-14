import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import logoImg from "../../assets/logo.png";
import heroIllustration from "../../assets/hero-illustration.png";
import { useLanguage } from "../../Context/LanguageContext";

const BASE_URL = import.meta.env.VITE_API_URL || "";

// ── שחזור סיסמה ───────────────────────────────────────────────────────────────
function ForgotPasswordPanel({ type = "user", onBack }) {
  const { t, language } = useLanguage();
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = type === "admin"
        ? `${BASE_URL}/api/auth/admin/forgot-password`
        : `${BASE_URL}/api/auth/forgot-password`;
      const body = type === "admin"
        ? { username: value, language }
        : { email: value, language };
      await axios.post(endpoint, body);
      setSent(true);
    } catch {
      setSent(true); // show same message regardless to avoid email enumeration
    } finally {
      setLoading(false);
    }
  }

  const accentColor = type === "admin" ? "#4f46e5" : "#2f6b46";
  const desc = type === "admin" ? t.auth.forgotPasswordDescAdmin : t.auth.forgotPasswordDesc;

  if (sent) {
    return (
      <div className="flex flex-col gap-5 text-center">
        <div className="text-5xl">📧</div>
        <p className="text-sm text-gray-600 leading-6">{t.auth.resetLinkSent}</p>
        <button type="button" onClick={onBack}
          className="text-sm font-semibold hover:underline" style={{ color: accentColor }}>
          {t.auth.backToLogin}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="flex flex-col gap-4">
      <p className="text-sm text-gray-500 leading-6">{desc}</p>
      <input
        type={type === "admin" ? "text" : "email"}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={type === "admin" ? t.auth.usernamePlaceholder : "your@email.com"}
        required
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
        style={{ "--tw-ring-color": accentColor }}
      />
      <button type="submit" disabled={loading}
        className="w-full text-white font-bold py-3 rounded-xl transition disabled:opacity-60 text-sm"
        style={{ background: accentColor }}>
        {loading ? "..." : t.auth.sendResetLink}
      </button>
      <button type="button" onClick={onBack}
        className="text-sm text-center font-semibold hover:underline" style={{ color: accentColor }}>
        {t.auth.backToLogin}
      </button>
    </form>
  );
}

// ── טאב: מחפש עבודה ──────────────────────────────────────────────────────────
function UserPanel({ onSuccess, onClose }) {
  const { loginUser, registerUser } = useAuth();
  const { t } = useLanguage();
  const [mode,  setMode]  = useState("login"); // "login" | "register" | "forgot"
  const [form,  setForm]  = useState({ email: "", password: "", name: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isEmailAlreadyRegistered = error.includes("אימייל כבר רשום");

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        await loginUser(form.email, form.password);
      } else {
        if (!form.name) { setError(t.auth.fullNameRequired); setLoading(false); return; }
        await registerUser(form.email, form.password, form.name, form.phone);
      }
      onSuccess("user");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (mode === "forgot") {
    return <ForgotPasswordPanel type="user" onBack={() => setMode("login")} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === "register" && (
        <>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              {t.auth.fullName}
            </label>
            <input
              type="text" value={form.name} onChange={e => update("name", e.target.value)}
              placeholder={t.auth.fullNamePlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f6b46]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.auth.phone}</label>
            <input
              type="tel" value={form.phone} onChange={e => update("phone", e.target.value)}
              placeholder={t.auth.phonePlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f6b46]"
            />
          </div>
        </>
      )}
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.auth.email}</label>
        <input
          type="email" value={form.email} onChange={e => update("email", e.target.value)}
          placeholder="your@email.com" required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f6b46]"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.auth.password}</label>
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
        {mode === "login" && (
          <div className="text-left mt-1">
            <button type="button" onClick={() => { setMode("forgot"); setError(""); }}
              className="text-xs text-[#2f6b46] hover:underline">
              {t.auth.forgotPassword}
            </button>
          </div>
        )}
      </div>

      {error && (
  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-right shadow-sm">
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
        ⚠️
      </div>

      <div className="flex-1">
        <p className="text-sm font-bold text-red-700">
          {isEmailAlreadyRegistered ? "האימייל כבר רשום" : "שגיאה"}
        </p>

        <p className="mt-1 text-xs leading-5 text-red-600">
          {isEmailAlreadyRegistered
            ? "האימייל הזה כבר קיים במערכת. אפשר להתחבר לחשבון הקיים או להשתמש באימייל אחר."
            : error}
        </p>
      </div>
    </div>
  </div>
)}

      <button type="submit" disabled={loading}
        className="w-full bg-[#2f6b46] text-white font-bold py-3 rounded-xl hover:bg-[#245539] transition disabled:opacity-60 text-sm mt-1">
        {loading ? "..." : mode === "login" ? t.auth.login : t.auth.register}
      </button>

      <p className="text-center text-sm text-gray-500">
        {mode === "login" ? t.auth.noAccount : t.auth.alreadyRegistered}{" "}
        <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          className="text-[#2f6b46] font-semibold hover:underline">
          {mode === "login" ? t.auth.registerHere : t.auth.login}
        </button>
      </p>
    </form>
  );
}

// ── טאב: מנהל ────────────────────────────────────────────────────────────────
function AdminPanel({ onSuccess }) {
  const { loginAdmin } = useAuth();
  const { t } = useLanguage();
  const [mode,  setMode]  = useState("login"); // "login" | "forgot"
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

  if (mode === "forgot") {
    return <ForgotPasswordPanel type="admin" onBack={() => setMode("login")} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.auth.username}</label>
        <input
          type="text" value={form.username} onChange={e => update("username", e.target.value)}
          placeholder={t.auth.usernamePlaceholder} required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4f46e5]"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.auth.password}</label>
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
        <div className="text-left mt-1">
          <button type="button" onClick={() => { setMode("forgot"); setError(""); }}
            className="text-xs text-[#4f46e5] hover:underline">
            {t.auth.forgotPassword}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-[#4f46e5] text-white font-bold py-3 rounded-xl hover:bg-[#4338ca] transition disabled:opacity-60 text-sm mt-1">
        {loading ? "..." : t.auth.adminLogin}
      </button>
    </form>
  );
}

// ── דף ראשי ───────────────────────────────────────────────────────────────────
function LoginPage({ onSuccess, onClose, onHome }) {
  const [tab, setTab] = useState("user"); // "user" | "admin"
  const { t } = useLanguage();

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
      {t.auth.sideTitle.split("\n").map((line) => (
  <span key={line}>
    {line}
    <br />
  </span>
))}
    </h2>

    <p className="text-white/80 text-base leading-relaxed max-w-md">
      {t.auth.sideSubtitle}
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
        <span>{t.auth.backHome}</span>
      </button>
    </div>

    {/* כרטיסיית התחברות */}
    <div className="bg-white border border-gray-100 rounded-3xl shadow-xl px-8 py-9">

      <h1 className="text-3xl font-extrabold text-gray-900 mb-1 text-center">
        {t.auth.welcome}
      </h1>

      <p className="text-gray-400 text-sm mb-7 text-center">
        {t.auth.continueLogin}
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
          {t.auth.jobSeeker} 
        </button>

        <button
          onClick={() => setTab("admin")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
            tab === "admin"
              ? "bg-white text-[#4f46e5] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t.auth.admin}
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
