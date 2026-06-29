//This is the main component of the application

import { useState, useEffect } from "react";

import "./App.css";

import ComponentSwitcher from "./Components/ComponentSwitcher";
import AdminSetupPage from "./Features/AuthPage/AdminSetupPage";

//Get the server URL from the environment variables
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {

  //Save whether the first admin setup is needed
  //null means the request is still loading
  const [needsSetup, setNeedsSetup] = useState(null);

  //Check if the system already has an admin
  //This runs only once when the app starts
  useEffect(() => {
    fetch(`${API}/api/auth/admin/needs-setup`)
      .then(r => r.json())
      .then(d => setNeedsSetup(d.needsSetup))

      //If the request fails, continue to the normal application
      .catch(() => setNeedsSetup(false));
  }, []);

  //Wait until the server returns a response
  if (needsSetup === null) return null;

  //Show the first admin setup page if no admin exists
  if (needsSetup)
    return <AdminSetupPage onDone={() => setNeedsSetup(false)} />;

  //Otherwise, open the main application
  return <ComponentSwitcher />;
}

export default App;