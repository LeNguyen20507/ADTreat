/**
 * ADTreat - Alzheimer Care Support App
 * Main Application Component
 * MCP + VAPI Integration for grounding conversations
 * 
 * Dual-App Design:
 * - Caregiver Mode: Full dashboard, patient management, activity reports
 * - Senior Mode: Voice-first, simplified UI, large buttons, daily check-ins
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components';
import { Home, SeniorHome, CaregiverDashboard, Learn, Reminders } from './pages';
import VoiceSession from './components/VoiceSession';
import { useRole } from './context/RoleContext';

function App() {
  const { currentRole, isSenior } = useRole();

  return (
    <div className="app-container" data-role={currentRole}>
      {/* Global Navigation Bar - Always visible at top */}
      <Navbar />
      
      {/* Main Routes - Role-based home experience */}
      <Routes>
        {/* Home route - different experience per role */}
        <Route 
          path="/" 
          element={isSenior ? <SeniorHome /> : <Home />} 
        />
        
        {/* Caregiver-specific routes */}
        <Route path="/dashboard" element={<CaregiverDashboard />} />
        
        {/* Shared routes */}
        <Route path="/learn" element={<Learn />} />
        <Route path="/reminders" element={<Reminders />} />
        
        {/* Voice session - available to both */}
        <Route path="/voice-session" element={<VoiceSession />} />
        
        {/* Legacy routes */}
        <Route path="/home" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
