import React from "react";
import { NavLink } from "react-router-dom";
import { Church } from "lucide-react";

const FellowshipHeader = () => {
  const navLinks = [
    { name: "Youth & Adult", path: "/fellowships/youth-and-adult" },
    { name: "Teenagers", path: "/fellowships/teenagers" },
    { name: "Women", path: "/fellowships/women-fellowship" },
    { name: "Men", path: "/fellowships/men-fellowship" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Main Logo / Home Link */}
        <NavLink to="/" className="flex items-center gap-2 text-amber-600 font-bold text-xl">
          <Church size={24} />
          <span className="text-gray-900">GRACE FELLOWSHIP</span>
        </NavLink>

        {/* The Navbar for Members */}
        <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-bold tracking-wide transition-all duration-200 pb-1 border-b-2 ${
                  isActive 
                    ? "text-amber-600 border-amber-600" 
                    : "text-gray-500 border-transparent hover:text-amber-500"
                }`
              }
            >
              {link.name.toUpperCase()}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default FellowshipHeader;