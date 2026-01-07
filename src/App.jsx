/**
 * ADTreat - Alzheimer Care Support App
 * Main Application Component with Routing
 */

import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home, Learn, Profile } from './pages';

function App() {
  return (
    <div className="app-container">
      {/* Global Navigation Bar - Always visible at top */}
      <Navbar />
      
      {/* Main Routes - 2 tabs only */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
