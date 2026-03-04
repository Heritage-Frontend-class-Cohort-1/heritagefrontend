import React from "react";
import { Outlet } from "react-router-dom";

const WhoWeAre = () => {
  return (
    /** * min-h-screen: ensures the background covers the whole page
     * pt-20: prevents your content from being hidden behind the fixed navbar
     * pb-12: adds breathing room at the bottom
     */
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* This Outlet is where History.jsx, Leadership.jsx, etc. 
            will render their specific sections (Hero, Story, Grid).
        */}
        <Outlet />
      </div>
    </div>
  );
};

export default WhoWeAre;