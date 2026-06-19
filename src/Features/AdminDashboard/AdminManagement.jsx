import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ── פאנל עדכון פרטי המנהל עצמו ───────────────────────────────────────────────
export function AdminProfilePanel() {
  const { token, admin } = useAuth();
  const [form,  setForm]  = useState({ username: "", newPassword: "", currentPassword: "" });
  const [msg,   setMsg]   = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) setForm(p => ({ ...p, username: admin.username || "" }));
  }, [admin]);

  async function save(e) {
    e.preventDefault();
    setMsg(""); setError(""); setLoading(true);
    try {
      const body = { username: form.username };
      if (form.newPassword)     body.newPassword     = form.newPassword;
      if (form.currentPassword) body.currentPassword = form.currentPassword;

      const res = await fetch(`${API}/api/admins/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה");
      setMsg("פרטים עודכנו בהצלחה ✓");
      setForm(p => ({ ...p, currentPassword: "", newPassword: "" }));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
      <h2 className="text-lg font-bold text-gray-800 mb-6">הפרטים שלי</h2>
      {admin?.mustChangePassword && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 text-sm text-yellow-800">
          ⚠️ עליך לשנות את שם המשתמש והסיסמה לפני שתוכל להמשיך.
        </div>
      )}
      {msg   && <p className="text-green-600 text-sm mb-4">{msg}</p>}
      {error && <p className="text-red-500  text-sm mb-4">{error}</p>}
      <form onSubmit={save} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">שם משתמש</label>
          <input
            value={form.username}
            onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4f46e5]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">סיסמה נוכחית</label>
          <input
            type="password" value={form.currentPassword}
            onChange={e => setForm(p => ({ ...p, currentPassword: e.target.value }))}
            placeholder="הכנס סיסמה נוכחית לאימות"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4f46e5]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">סיסמה חדשה (אופציונלי)</label>
          <input
            type="password" value={form.newPassword}
            onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))}
            placeholder="השאר ריק אם אינך רוצה לשנות"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4f46e5]"
          />
        </div>
        <button type="submit" disabled={loading}
          className="bg-[#4f46e5] text-white font-bold py-2.5 rounded-xl hover:bg-[#4338ca] transition text-sm disabled:opacity-60">
          {loading ? "שומר..." : "שמור שינויים"}
        </button>
      </form>
    </div>
  );
}

// ── פאנל ניהול מנהלים (super בלבד) ──────────────────────────────────────────
export function AdminsListPanel() {
  const { token } = useAuth();
  const [admins,  setAdmins]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCreds, setNewCreds] = useState(null); // פרטי מנהל חדש שיש להציג פעם אחת
  const [msg,     setMsg]     = useState("");
  const [error,   setError]   = useState("");

  async function loadAdmins() {
    try {
      const res = await fetch(`${API}/api/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAdmins(data);
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { loadAdmins(); }, []);

  async function createAdmin() {
    setMsg(""); setError(""); setNewCreds(null);
    try {
      const res = await fetch(`${API}/api/admins`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewCreds(data.credentials);
      setMsg("מנהל חדש נוצר בהצלחה!");
      loadAdmins();
    } catch (err) { setError(err.message); }
  }

  async function removeAdmin(id) {
    if (!confirm("למחוק מנהל זה?")) return;
    try {
      const res = await fetch(`${API}/api/admins/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setAdmins(prev => prev.filter(a => a._id !== id));
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">ניהול מנהלים</h2>
        <button onClick={createAdmin}
          className="bg-[#4f46e5] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#4338ca] transition flex items-center gap-2">
          + הוסף מנהל חדש
        </button>
      </div>

      {msg   && <p className="text-green-600 text-sm mb-4">{msg}</p>}
      {error && <p className="text-red-500  text-sm mb-4">{error}</p>}

      {/* הצגת פרטי מנהל חדש (פעם אחת בלבד!) */}
      {newCreds && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 mb-5">
          <p className="font-bold text-yellow-800 mb-2">⚠️ שמור פרטים אלו — הם יוצגו פעם אחת בלבד!</p>
          <p className="text-sm text-yellow-900">שם משתמש: <strong>{newCreds.username}</strong></p>
          <p className="text-sm text-yellow-900">סיסמה: <strong>{newCreds.password}</strong></p>
          <p className="text-xs text-yellow-700 mt-2">המנהל החדש יתבקש לשנות פרטים אלו בכניסה הראשונה.</p>
          <button onClick={() => setNewCreds(null)} className="mt-3 text-xs text-yellow-600 underline">
            סגור (וודא שהעתקת את הפרטים!)
          </button>
        </div>
      )}

      {loading && <p className="text-gray-400 text-sm text-center py-8">טוען...</p>}

      <div className="flex flex-col gap-3">
        {admins.map(a => (
          <div key={a._id}
            className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
              a.canSeeAll ? "bg-[#e8e7fc]" : "bg-gray-100"}`}>
              {a.canSeeAll ? "⭐" : "👤"}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">{a.username}</p>
              <p className="text-xs text-gray-400">
                {a.canSeeAll ? "מנהל ראשי" : "מנהל"} ·{" "}
                {a.mustChangePassword ? <span className="text-yellow-600">טרם שינה סיסמה</span> : "פעיל"}
              </p>
            </div>
            {!a.canSeeAll && (
              <button onClick={() => removeAdmin(a._id)}
                className="text-xs text-red-500 border border-red-100 px-3 py-1.5 rounded-xl hover:bg-red-50 transition">
                מחיקה
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
