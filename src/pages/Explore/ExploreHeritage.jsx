import React from "react";
import { Outlet } from "react-router-dom";

const ExploreHeritage = () => {
  return (
    // The pt-16 ensures content starts below your fixed navbar
    // The animate-in adds a smooth transition when switching sub-pages
    <div className="min-h-screen bg-white pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Only the child components (Testimony, Prayer, etc.) render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default ExploreHeritage;