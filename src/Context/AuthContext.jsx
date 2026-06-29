//This file keeps the login state for users and admins

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     //Job seeker
  const [admin, setAdmin] = useState(null);   //Admin
  const [token, setToken] = useState(null);

  //Load saved login data when the app opens
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedType = localStorage.getItem("authType");
    const savedData = localStorage.getItem("authData");

    if (savedToken && savedData) {
      setToken(savedToken);

      //Convert the saved text back to an object
      const data = JSON.parse(savedData);

      if (savedType === "user") setUser(data);
      if (savedType === "admin") setAdmin(data);
    }
  }, []);

  //Login a job seeker
  async function loginUser(email, password) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "שגיאה בכניסה");

    //Save the user login session
    _saveSession("user", data.token, data.user);

    return data.user;
  }

  //Register a new job seeker
  async function registerUser(email, password, name, phone) {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, phone }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "שגיאה ברישום");

    //Save the user login session
    _saveSession("user", data.token, data.user);

    return data.user;
  }

  //Login an admin
  async function loginAdmin(username, password) {
    const res = await fetch(`${API}/api/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "שגיאה בכניסה");

    //Save the admin login session
    _saveSession("admin", data.token, data.admin);

    return data.admin;
  }

  //Logout and clear the saved session
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("authType");
    localStorage.removeItem("authData");

    setToken(null);
    setUser(null);
    setAdmin(null);
  }

  //Save login data in localStorage and in React state
  function _saveSession(type, tok, data) {
    localStorage.setItem("token", tok);
    localStorage.setItem("authType", type);
    localStorage.setItem("authData", JSON.stringify(data));

    setToken(tok);

    //Keep only one account type active
    if (type === "user") {
      setUser(data);
      setAdmin(null);
    }

    if (type === "admin") {
      setAdmin(data);
      setUser(null);
    }
  }

  //Return the authorization header for protected API requests
  function authHeader() {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  return (
    <AuthContext.Provider value={{
      user, admin, token,
      isUser: !!user,
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