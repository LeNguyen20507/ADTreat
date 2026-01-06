/**
 * ADTreat - Alzheimer Care Support App
 * Main Application Component with Routing
 */

import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home, Reminders, Chat, Learn, Profile } from './pages';

function App() {
  return (
    <div className="app-container">
      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Bottom Navigation - Always visible */}
      <Navbar />
    </div>
  );
}

export default App;
