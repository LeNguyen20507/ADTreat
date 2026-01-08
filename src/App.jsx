/**
 * ADTreat - Alzheimer Care Support App
 * Main Application Component
 * MCP + VAPI Integration for grounding conversations
 */

import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home } from './pages';
import VoiceSession from './components/VoiceSession';

function App() {
  return (
    <div className="app-container">
      {/* Global Navigation Bar - Always visible at top */}
      <Navbar />
      
      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/voice-session" element={<VoiceSession />} />
      </Routes>
    </div>
  );
}

export default App;
