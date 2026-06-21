// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Navbar and Footer
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";

// Public pages
import Home from './pages/Home';
import AboutUs from './pages/information/AboutUs';
import OurJourney from './pages/information/OurJourney';
import HeritageInNumber from './pages/information/HeritageInNumbers';
import OurLeadership from './pages/information/OurShepherds';
import WhatWeBelieve from './pages/information/WhatWeBelieve';
import MissionVision from './pages/information/OurPurpose';
import Sermons from './pages/Sermons';
import ExploreHeritage from './pages/explore/ExploreHeritage';
import AmNewHere from './pages/explore/AmNewHere';
import Testimony from './pages/explore/Testimony';
import ContactUs from './pages/explore/ContactUs';
import PrayerRequest from './pages/explore/PrayerRequest';
import Counselling from './pages/explore/Counselling';
import UpdateProfilePage from './pages/explore/UpdateProfilePage';
import Birthday from './pages/explore/Birthday';
import Giving from './pages/Giving';
import Icare from './pages/Icare';
import LiveService from './pages/LiveService';
import FellowshipPage from './pages/Fellowship';
import Tech from "./pages/Tech";
import AttendancePage from "./pages/AttendacePage";

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PrivateAdminRoute from './pages/admin/PrivateAdminroute';
import ResetPassword from './pages/ResetPassword';
import SuperAdminAuth from './pages/admin/SuperAdminAuth';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import PrivateSuperAdminRoute from './pages/admin/SuperAdminRoute';
import TechCohortDashboard from "./pages/admin/TechDashboard";
import TechApplicantDetail from "./pages/admin/TechDetails";

// Layout for public pages only
const PublicLayout = () => (
  <div className="app-wrapper">
    <Navbar />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public routes — WITH Navbar & Footer ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/information" element={<AboutUs />}>
            <Route path="journey" element={<OurJourney />} />
            <Route path="heritage-in-number" element={<HeritageInNumber />} />
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
          <Route path="/pages/tech" element={<Tech />} />
          <Route path="/giving" element={<Giving />} />
          <Route path="/fellowships/:type" element={<FellowshipPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* ── Admin routes — NO Navbar/Footer ── */}
        <Route path="/Admin/login" element={<Login />} />
        <Route path="/Admin/dashboard" element={
          <PrivateAdminRoute><Dashboard /></PrivateAdminRoute>
        } />
        <Route path="/Admin/cohort" element={
          <PrivateAdminRoute><TechCohortDashboard /></PrivateAdminRoute>
        } />
        <Route path="/Admin/cohort/:id" element={
          <PrivateAdminRoute><TechApplicantDetail /></PrivateAdminRoute>
        } />

        {/* ── Super Admin routes — NO Navbar/Footer ── */}
        <Route path="/superadmin/login" element={<SuperAdminAuth />} />
        <Route path="/superadmin/dashboard" element={
          <PrivateSuperAdminRoute><SuperAdminDashboard /></PrivateSuperAdminRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;