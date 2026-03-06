import React from "react";
import { NavLink } from "react-router-dom";
import { Church, Users, Heart, Users2, UserCircle } from "lucide-react";

const FellowshipHeader = () => {
  const fellowshipLinks = [
    {
      name: "Youth & Adult",
      path: "/fellowships/youth-and-adult",
      icon: Users,
      color: "amber",
    },
    {
      name: "Teenagers",
      path: "/fellowships/teenagers",
      icon: Heart,
      color: "rose",
    },
    {
      name: "Women",
      path: "/fellowships/women-fellowship",
      icon: Users2,
      color: "purple",
    },
    {
      name: "Men",
      path: "/fellowships/men-fellowship",
      icon: UserCircle,
      color: "blue",
    },
  ];

  return (
    <header className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 md:py-5 gap-5 md:gap-0">
          {/* Logo / Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-3 group transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="bg-amber-500 p-2.5 rounded-xl shadow-md group-hover:rotate-6 transition-transform">
              <Church size={28} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl md:text-2xl tracking-tight text-amber-400">
                GRACE FELLOWSHIP
              </span>
              <span className="text-xs md:text-sm text-slate-300 font-medium -mt-1">
                Building Community • Growing in Faith
              </span>
            </div>
          </NavLink>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-2 sm:gap-3 md:gap-5 lg:gap-7">
            {fellowshipLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-medium text-sm md:text-base transition-all duration-300 ${
                    isActive
                      ? `bg-white/15 text-white border-b-4 border-${item.color}-400 shadow-sm`
                      : `text-slate-300 hover:text-white hover:bg-white/10`
                  }`
                }
              >
                <item.icon
                  size={20}
                  className={`transition-transform group-hover:scale-110 ${
                    item.color === "amber"
                      ? "text-amber-400"
                      : item.color === "rose"
                      ? "text-rose-400"
                      : item.color === "purple"
                      ? "text-purple-400"
                      : "text-blue-400"
                  }`}
                />
                <span>{item.name}</span>

                {/* Subtle underline animation for hover */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-${item.color}-400 to-transparent transition-all duration-400 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Optional thin accent line at bottom */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 opacity-80" />
    </header>
  );
};

export default FellowshipHeader;