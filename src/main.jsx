//This file starts the React application

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'

import { AuthProvider } from './Context/AuthContext.jsx'
import { ThemeProvider } from './Context/ThemeContext.jsx'
import { LanguageProvider } from './Context/LanguageContext.jsx'

//Render the application inside the root element
createRoot(document.getElementById('root')).render(

  //Enable extra checks during development
  <StrictMode>

    {/*Make the selected language available to all components*/}
    <LanguageProvider>

      {/*Make the selected theme available to all components*/}
      <ThemeProvider>

        {/*Make the logged-in user data available to all components*/}
        <AuthProvider>

          <App />

        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>

  </StrictMode>,
)