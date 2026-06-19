import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);   // מחפש עבודה
  const [admin, setAdmin] = useState(null);   // מנהל
  const [token, setToken] = useState(null);

  // טעינה מ-localStorage בעת פתיחה
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedType  = localStorage.getItem("authType");
    const savedData  = localStorage.getItem("authData");
    if (savedToken && savedData) {
      setToken(savedToken);
      const data = JSON.parse(savedData);
      if (savedType === "user")  setUser(data);
      if (savedType === "admin") setAdmin(data);
    }
  }, []);

  // ── כניסה מחפש עבודה ──────────────────────────────────────────────────────
  async function loginUser(email, password) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "שגיאה בכניסה");
    _saveSession("user", data.token, data.user);
    return data.user;
  }

  // ── רישום מחפש עבודה ──────────────────────────────────────────────────────
  async function registerUser(email, password, name, phone) {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "שגיאה ברישום");
    _saveSession("user", data.token, data.user);
    return data.user;
  }

  // ── כניסה מנהל ────────────────────────────────────────────────────────────
  async function loginAdmin(username, password) {
    const res = await fetch(`${API}/api/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "שגיאה בכניסה");
    _saveSession("admin", data.token, data.admin);
    return data.admin;
  }

  // ── התנתקות ───────────────────────────────────────────────────────────────
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("authType");
    localStorage.removeItem("authData");
    setToken(null);
    setUser(null);
    setAdmin(null);
  }

  // ── פונקציית עזר לשמירה ───────────────────────────────────────────────────
  function _saveSession(type, tok, data) {
    localStorage.setItem("token",    tok);
    localStorage.setItem("authType", type);
    localStorage.setItem("authData", JSON.stringify(data));
    setToken(tok);
    if (type === "user")  { setUser(data);  setAdmin(null); }
    if (type === "admin") { setAdmin(data); setUser(null);  }
  }

  // ── Header עם token ────────────────────────────────────────────────────────
  function authHeader() {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  return (
    <AuthContext.Provider value={{
      user, admin, token,
      isUser:  !!user,
      isAdmin: !!admin,
      isSuperAdmin: admin?.canSeeAll === true,
      loginUser, registerUser, loginAdmin, logout, authHeader,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
