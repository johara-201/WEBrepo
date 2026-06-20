import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import NavBar from "../../Components/NavBar";
import {
  getProfile, updateProfile,
  uploadCV, deleteCV, getCVUrl,
  getMyApplications, withdrawApplication,
  changePassword,
} from "./jobSeekerService";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ── פאנל: פרטים אישיים ───────────────────────────────────────────────────────
function ProfilePanel({ token }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({});
  const [msg,     setMsg]     = useState("");
  const [error,   setError]   = useState("");

  useEffect(() => {
    getProfile(token).then(p => { setProfile(p); setForm(p); }).catch(() => {});
  }, [token]);

  async function save() {
    setMsg(""); setError("");
    try {
      const updated = await updateProfile(token, {
        name: form.name, phone: form.phone, city: form.city,
        profession: form.profession, bio: form.bio,
      });
      setProfile(updated); setEditing(false); setMsg("פרטים עודכנו בהצלחה ✓");
    } catch { setError("שגיאה בעדכון פרטים"); }
  }

  if (!profile) return <div className="text-center py-10 text-gray-400">טוען...</div>;

  const field = (label, key, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
      {editing ? (
        <input
          type={type} value={form[key] || ""}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2f6b46]"
        />
      ) : (
        <p className="text-gray-800 text-sm py-2.5 px-1 border-b border-gray-100">
          {profile[key] || <span className="text-gray-300">לא הוזן</span>}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">פרטים אישיים</h2>
        {!editing
          ? <button onClick={() => setEditing(true)}
              className="text-sm text-[#2f6b46] font-semibold border border-[#2f6b46] px-4 py-1.5 rounded-xl hover:bg-[#f0faf4] transition">
              עריכה ✏️
            </button>
          : <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setForm(profile); }}
                className="text-sm text-gray-500 px-4 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50">
                ביטול
              </button>
              <button onClick={save}
                className="text-sm bg-[#2f6b46] text-white font-bold px-4 py-1.5 rounded-xl hover:bg-[#245539]">
                שמור
              </button>
            </div>
        }
      </div>
      {msg   && <p className="text-green-600 text-sm mb-4">{msg}</p>}
      {error && <p className="text-red-500  text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("שם מלא",          "name",       "text", "שמך המלא")}
        {field("אימייל",           "email",      "email")}
        {field("טלפון",            "phone",      "tel",  "050-0000000")}
        {field("עיר מגורים",       "city",       "text", "עיר")}
        {field("תחום עיסוק",       "profession", "text", "לדוגמה: חינוך, נוער")}
      </div>
      {editing
        ? <div className="mt-4">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">קצת עליי</label>
            <textarea value={form.bio || ""}
              onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              rows={3} placeholder="כמה מילים על עצמך..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2f6b46] resize-none"
            />
          </div>
        : profile.bio && (
            <div className="mt-4">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">קצת עליי</label>
              <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>
            </div>
          )
      }
    </div>
  );
}
// ── פאנל: שינוי סיסמה ───────────────────────────────────────────────────────
function PasswordPanel({ token }) {
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
      setError("יש למלא את כל השדות");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("הסיסמה החדשה חייבת להכיל לפחות 6 תווים");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("אימות הסיסמה אינו תואם לסיסמה החדשה");
      return;
    }

    try {
      setLoading(true);

      await changePassword(token, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setMsg("הסיסמה עודכנה בהצלחה ✓");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "שגיאה בשינוי הסיסמה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">שינוי סיסמה</h2>
        <p className="text-sm text-gray-400 mt-1">
          כאן ניתן לעדכן את סיסמת המשתמש שלך.
        </p>
      </div>

      {msg && <p className="text-green-600 text-sm mb-4">{msg}</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            סיסמה נוכחית
          </label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm((p) => ({ ...p, currentPassword: e.target.value }))
            }
            className={inputClass}
            placeholder="הכניסי סיסמה נוכחית"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            סיסמה חדשה
          </label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) =>
              setForm((p) => ({ ...p, newPassword: e.target.value }))
            }
            className={inputClass}
            placeholder="הכניסי סיסמה חדשה"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            אימות סיסמה חדשה
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((p) => ({ ...p, confirmPassword: e.target.value }))
            }
            className={inputClass}
            placeholder="הקלידי שוב את הסיסמה החדשה"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#2f6b46] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#245539] transition disabled:opacity-60"
        >
          {loading ? "מעדכן..." : "עדכן סיסמה"}
        </button>
      </form>
    </div>
  );
}

// ── פאנל: קורות חיים ─────────────────────────────────────────────────────────
function CVPanel({ token }) {
  const [profile,   setProfile]   = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg,       setMsg]       = useState("");
  const [error,     setError]     = useState("");
  const fileRef = useRef();

  useEffect(() => {
    getProfile(token).then(setProfile).catch(() => {});
  }, [token]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setMsg(""); setError("");
    try {
      await uploadCV(token, file);
      const updated = await getProfile(token);
      setProfile(updated);
      setMsg("קורות חיים הועלו בהצלחה ✓");
    } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  }

  async function handleDelete() {
    if (!confirm("למחוק את קורות החיים?")) return;
    setMsg(""); setError("");
    try {
      await deleteCV(token);
      const updated = await getProfile(token);
      setProfile(updated);
      setMsg("קורות חיים נמחקו");
    } catch { setError("שגיאה במחיקה"); }
  }

  const hasCv = !!profile?.cv?.filename;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">קורות חיים</h2>
      {msg   && <p className="text-green-600 text-sm mb-4">{msg}</p>}
      {error && <p className="text-red-500  text-sm mb-4">{error}</p>}

      {hasCv ? (
        <div className="flex items-center gap-4 p-4 bg-[#f0faf4] rounded-2xl border border-[#c3e6d3] mb-4">
          <div className="text-3xl">📄</div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">{profile.cv.filename}</p>
            <p className="text-xs text-gray-400">
              הועלה: {new Date(profile.cv.uploadedAt).toLocaleDateString("he-IL")}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`${API}/api/users/me/cv`}
              target="_blank" rel="noreferrer"
              onClick={e => {
                // מוסיפים token בheader לא עובד עם anchor tag — נפתח דרך fetch
                e.preventDefault();
                fetch(`${API}/api/users/me/cv`, { headers: { Authorization: `Bearer ${token}` }})
                  .then(r => r.blob())
                  .then(b => {
                    const url = URL.createObjectURL(b);
                    window.open(url, "_blank");
                  });
              }}
              className="text-xs text-[#2f6b46] font-semibold border border-[#2f6b46] px-3 py-1.5 rounded-xl hover:bg-[#2f6b46] hover:text-white transition"
            >
              צפייה
            </a>
            <button onClick={() => fileRef.current?.click()}
              className="text-xs text-gray-600 border border-gray-300 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition">
              עדכון
            </button>
            <button onClick={handleDelete}
              className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition">
              מחיקה
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center mb-4">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-gray-500 text-sm mb-4">לא הועלו קורות חיים עדיין</p>
          <button onClick={() => fileRef.current?.click()}
            className="bg-[#2f6b46] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#245539] transition">
            {uploading ? "מעלה..." : "העלאת קורות חיים"}
          </button>
        </div>
      )}

      <input
        ref={fileRef} type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleUpload}
      />
      <p className="text-xs text-gray-400">קבצים מותרים: PDF, Word. גודל מקסימלי: 5MB</p>
    </div>
  );
}

// ── פאנל: מועמדויות ───────────────────────────────────────────────────────────
function ApplicationsPanel({ token, onViewJob }) {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState("");

  useEffect(() => {
    getMyApplications(token).then(a => { setApps(a); setLoading(false); }).catch(() => setLoading(false));
  }, [token]);

  async function withdraw(appId) {
    if (!confirm("להסיר מועמדות זו?")) return;
    try {
      await withdrawApplication(token, appId);
      setApps(prev => prev.filter(a => a._id !== appId));
      setMsg("מועמדות הוסרה בהצלחה");
    } catch { setMsg("שגיאה בהסרת מועמדות"); }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">המשרות שהגשתי</h2>
      {msg && <p className="text-green-600 text-sm mb-4">{msg}</p>}
      {loading && <p className="text-gray-400 text-sm text-center py-8">טוען...</p>}
      {!loading && apps.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <p>לא הגשת מועמדות עדיין</p>
        </div>
      )}
    <div className="flex flex-col gap-3">
  {apps.map((app) => {
    const removed = app.jobRemoved || app.jobExists === false;
    const title = app.jobTitle || app.job?.title || "משרה";

    return (
      <div
        key={app._id}
        className={`flex items-center gap-4 p-4 rounded-2xl border transition ${
          removed
            ? "border-orange-200 bg-orange-50/70"
            : "border-gray-100 hover:bg-gray-50"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
            removed ? "bg-orange-100" : "bg-[#e9f5ef]"
          }`}
        >
          {removed ? "⚠️" : "💼"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={`font-semibold text-sm truncate ${
                removed ? "text-orange-800" : "text-gray-800"
              }`}
            >
              {title}
            </p>

            {removed && (
              <span className="text-[11px] font-bold text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full">
                המשרה הוסרה
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-1">
            הוגש: {new Date(app.submittedAt).toLocaleDateString("he-IL")}
          </p>

          {removed && (
            <p className="text-xs text-orange-700 mt-1">
              המשרה נמחקה על ידי המנהל ולכן כבר לא זמינה באתר.
            </p>
          )}
        </div>

        <button
          onClick={() => withdraw(app._id)}
          className="text-xs text-red-500 border border-red-100 px-3 py-1.5 rounded-xl hover:bg-red-50 transition shrink-0"
        >
          {removed ? "הסרה מהרשימה" : "הסרה"}
        </button>
      </div>
    );
  })}
</div>
    </div>
  );
}

// ── דף ראשי ───────────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { key: "profile",      label: "פרטים אישיים", emoji: "👤" },
  { key: "password",     label: "שינוי סיסמה",  emoji: "🔒" },
  { key: "cv",           label: "קורות חיים",   emoji: "📄" },
  { key: "applications", label: "המשרות שלי",   emoji: "💼" },
];

function JobSeekerDashboard({ onHome, onSearch, onAbout, onFaq, onAdmin, onDashboard }) {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f8f4] text-right text-gray-800 font-sans">
      <NavBar activePage="dashboard" onHome={onHome} onSearch={onSearch}
        onAbout={onAbout} onFaq={onFaq} onAdmin={onAdmin} onDashboard={onDashboard} />

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-6 items-start">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-center mb-5 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-[#e9f5ef] flex items-center justify-center text-2xl mx-auto mb-2">
                👤
              </div>
              <p className="font-bold text-gray-800 text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <nav className="flex flex-col gap-1">
              {SIDEBAR_ITEMS.map(item => (
                <button key={item.key} onClick={() => setActiveTab(item.key)}
                  className={`w-full text-right px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                    activeTab === item.key
                      ? "bg-[#e9f5ef] text-[#2f6b46] font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <span>{item.emoji}</span> {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => { logout(); onHome(); }}
                className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-2">
                <span>🚪</span> יציאה
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {activeTab === "profile"      && "הפרטים האישיים שלי"}
            {activeTab === "password"     && "שינוי סיסמה"}
            {activeTab === "cv"           && "קורות החיים שלי"}
            {activeTab === "applications" && "המשרות שהגשתי"}
          </h1>
          {activeTab === "profile"      && <ProfilePanel      token={token} />}
          {activeTab === "password"     && <PasswordPanel     token={token} />}
          {activeTab === "cv"           && <CVPanel           token={token} />}
          {activeTab === "applications" && <ApplicationsPanel token={token} onViewJob={onSearch} />}
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;
