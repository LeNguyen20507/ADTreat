/**
 * ADTreat - Alzheimer Care Support App
 * Main Application Component
 * MCP + VAPI Integration for grounding conversations
 */

import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home } from './pages';
import VoiceCallTest from './components/VoiceCallTest';

function App() {
  return (
    <div className="app-container">
      {/* Global Navigation Bar - Always visible at top */}
      <Navbar />
      
      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test-call" element={<VoiceCallTest />} />
      </Routes>
    </div>
  );
}

export default App;
