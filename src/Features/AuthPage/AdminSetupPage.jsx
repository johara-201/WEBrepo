import { useState } from "react";
import logoImg from "../../assets/logo.png";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

function AdminSetupPage({ onDone }) {
  const [form, setForm] = useState({
    username: "", password: "",
    secondUsername: "", secondPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/admin/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה");
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const field = (label, key, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
      <input
        type={type} value={form[key]} required
        onChange={e => update(key, e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4f46e5]"
      />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f8f4] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 w-full max-w-xl">

        <div className="text-center mb-8">
          <img src={logoImg} alt="לוגו" className="h-14 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-gray-900">הגדרה ראשונית של המערכת</h1>
          <p className="text-gray-400 text-sm mt-2">
            הגדירי שם משתמש וסיסמה לשני המנהלים הראשיים.<br />
            דף זה יופיע פעם אחת בלבד.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* מנהל 1 */}
          <div className="bg-[#f0f0fe] rounded-2xl p-5 flex flex-col gap-3">
            <h2 className="font-bold text-[#4f46e5] text-sm">מנהל ראשי #1 (יארה)</h2>
            {field('שם משתמש', 'username',       'text',     'לדוגמה: yara')}
            {field('סיסמה',     'password',       'password', 'לפחות 6 תווים')}
          </div>

          {/* מנהל 2 */}
          <div className="bg-[#f0f0fe] rounded-2xl p-5 flex flex-col gap-3">
            <h2 className="font-bold text-[#4f46e5] text-sm">מנהל ראשי #2 (רכזת משאבי אנוש)</h2>
            {field('שם משתמש', 'secondUsername', 'text',     'לדוגמה: hr_coordinator')}
            {field('סיסמה',     'secondPassword', 'password', 'לפחות 6 תווים')}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-[#4f46e5] text-white font-bold py-3 rounded-xl hover:bg-[#4338ca] transition disabled:opacity-60">
            {loading ? "יוצר חשבונות..." : "צור חשבונות ✓"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminSetupPage;
