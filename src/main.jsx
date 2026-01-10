import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { PatientProvider } from './context/PatientContext.jsx'

// Styles - modular CSS imports
import './styles/index.css'      // Base styles and legacy components
import './styles/navigation.css' // Nav bar and tab navigation
import './styles/tracking.css'   // Tracking/Care log page
import './styles/onboarding.css' // Patient onboarding wizard

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PatientProvider>
        <App />
      </PatientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
