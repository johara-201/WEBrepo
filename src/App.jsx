import { useState, useEffect } from "react";
import "./App.css"
import ComponentSwitcher from "./Components/ComponentSwitcher"
import AdminSetupPage from "./Features/AuthPage/AdminSetupPage"

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [needsSetup, setNeedsSetup] = useState(null); // null = טוען

  useEffect(() => {
    fetch(`${API}/api/auth/admin/needs-setup`)
      .then(r => r.json())
      .then(d => setNeedsSetup(d.needsSetup))
      .catch(() => setNeedsSetup(false));
  }, []);

  if (needsSetup === null) return null; // טוען
  if (needsSetup) return <AdminSetupPage onDone={() => setNeedsSetup(false)} />;
  return <ComponentSwitcher />;
}

export default App;