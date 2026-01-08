/**
 * ADTreat - Alzheimer Care Support App
 * Main Application Component
 * Single page app focused on songs/sounds for calming
 */

import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home } from './pages';

function App() {
  return (
    <div className="app-container">
      {/* Global Navigation Bar - Always visible at top */}
      <Navbar />
      
      {/* Main Route - Home only */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
