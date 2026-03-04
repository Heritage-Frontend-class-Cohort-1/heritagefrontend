// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Navbar and Footer
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";

// Public pages
import Home from './pages/Home';
// Fix: Import from 'About' folder and ensure component name matches usage below
import WhoWeAre from "./pages/About/AboutUs"; 
import OurHistory from './pages/About/OurJourney';
import QuickFacts from './pages/About/HeritageInNumbers';
import OurLeadership from './pages/About/OurShepherds';
import WhatWeBelieve from './pages/About/WhatWeBelieve';
import MissionVision from './pages/About/OurPurpose';

// ... (keep other imports the same)

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* The element name 'WhoWeAre' now matches the import above */}
            <Route path="/who-we-are" element={<WhoWeAre />}>
              <Route path="history" element={<OurHistory />} />
              <Route path="facts" element={<QuickFacts />} />
              <Route path="leadership" element={<OurLeadership />} />
              <Route path="believe" element={<WhatWeBelieve />} />
              <Route path="mission-vision" element={<MissionVision />} />
            </Route>

            {/* ... (rest of your routes) */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;