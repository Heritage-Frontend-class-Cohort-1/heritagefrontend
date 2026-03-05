// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Navbar and Footer
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";

// Public pages
import Home from './pages/Home';
import AboutUs from './pages/information/AboutUs';
import OurJourney from './pages/information/OurJourney';
import HeritageInNumber  from './pages/information/HeritageInNumbers';
import OurLeadership from './pages/information/OurShepherds';
import WhatWeBelieve from './pages/information/WhatWeBelieve';
import MissionVision from './pages/information/OurPurpose';

import Sermons from './pages/Sermons';
import ExploreHeritage from './pages/Explore/ExploreHeritage';
import AmNewHere from './pages/Explore/AmNewHere';
import Testimony from './pages/Explore/Testimony';
import ContactUs from './pages/Explore/ContactUs';
import PrayerRequest from './pages/Explore/PrayerRequest';
import Counselling from './pages/Explore/Counselling';
import UpdateProfilePage from './pages/Explore/UpdateProfilePage';
import Birthday from './pages/Explore/Birthday';
import Giving from './pages/Giving';
import Icare from './pages/Icare';
import LiveService from './pages/LiveService';
import FellowshipPage from './pages/Fellowship';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/information" element={<AboutUs />}>
              <Route path="journey" element={<OurJourney />} />
              <Route path="heritage-in-number" element={<HeritageInNumber/>} />
              <Route path="leadership" element={<OurLeadership />} />
              <Route path="believe" element={<WhatWeBelieve />} />
              <Route path="mission-vision" element={<MissionVision />} />
            </Route>

            <Route path="/sermons" element={<Sermons />} />
            <Route path="/live-service" element={<LiveService />} />
            <Route path="/explore-heritage" element={<ExploreHeritage />}>
              <Route path="am-new-here" element={<AmNewHere />} />
              <Route path="testimony" element={<Testimony />} />
              <Route path="contact-us" element={<ContactUs />} />
              <Route path="prayer-request" element={<PrayerRequest />} />
              <Route path="birthday" element={<Birthday />} />
              <Route path="update-profile" element={<UpdateProfilePage />} />
              <Route path="counselling" element={<Counselling />} />
            </Route>

            <Route path="/icare" element={<Icare />} />
            <Route path="/giving" element={<Giving />} />
            <Route path="/fellowships/:type" element={<FellowshipPage />} />

            {/* Admin routes */}
            <Route path="/Admin/login" element={<Login />} />
            <Route
              path="/Admin/dashboard"
              element={
                <PrivateAdminRoute>
                  <Dashboard />
                </PrivateAdminRoute>
              }
            />
            {/* <Route
              path="/Admin/testimony"
              element={
                <PrivateAdminRoute>
                  <Testimony />
                </PrivateAdminRoute>
              }
            /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;