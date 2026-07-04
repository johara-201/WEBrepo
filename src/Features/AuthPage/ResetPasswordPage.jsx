import { useState } from "react";
import axios from "axios";
import { useLanguage } from "../../Context/LanguageContext";
import logoImg from "../../assets/logo.png";

const BASE_URL = import.meta.env.VITE_API_URL || "";

function ResetPasswordPage({ resetToken, resetType, onDone }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAdmin = resetType === "admin";
  const accentColor = isAdmin ? "#4f46e5" : "#2f6b46";
  const accentHover = isAdmin ? "#4338ca" : "#245539";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.newPassword.length < 6) {
      setError(t.auth.passwordTooShort);
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      const endpoint = isAdmin
        ? `${BASE_URL}/api/auth/admin/reset-password`
        : `${BASE_URL}/api/auth/reset-password`;
      await axios.post(endpoint, { token: resetToken, newPassword: form.newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || t.auth.resetError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f8f4] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logoImg} alt="לוגו" className="h-14 w-auto" />
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-xl px-8 py-9">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">
            {t.auth.resetPasswordTitle}
          </h1>

          {success ? (
            <div className="flex flex-col items-center gap-5 mt-4">
              <div className="text-5xl">✅</div>
              <p className="text-sm text-gray-600 text-center leading-6">
                {t.auth.resetSuccess}
              </p>
              <button
                onClick={onDone}
                className="text-sm font-bold py-3 px-6 rounded-xl text-white transition"
                style={{ background: accentColor }}
                onMouseEnter={e => (e.target.style.background = accentHover)}
                onMouseLeave={e => (e.target.style.background = accentColor)}
              >
                {t.auth.login}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  {t.auth.newPassword}
                </label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  {t.auth.confirmPassword}
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-3 rounded-xl transition disabled:opacity-60 text-sm mt-1"
                style={{ background: accentColor }}
              >
                {loading ? "..." : t.auth.resetPassword}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
