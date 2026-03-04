import React from "react";
import { useParams, NavLink } from "react-router-dom";
import { Users, UserCheck, Heart, Speaker, Church, ArrowUpRight } from "lucide-react";

const FellowshipPage = () => {
  const { type } = useParams();

  const navLinks = [
    { name: "Youth & Adult", path: "/fellowships/youth-and-adult" },
    { name: "Teenagers", path: "/fellowships/teenagers" },
    { name: "Women", path: "/fellowships/women-fellowship" },
    { name: "Men", path: "/fellowships/men-fellowship" },
  ];

  const data = {
    "youth-and-adult": {
      title: "Youth & Adult Fellowship",
      subtitle: "Empowering young adults to thrive",
      verse: "Let no one despise your youth, but be an example to the believers in word, in conduct, in love, in spirit, in faith, in purity.",
      reference: "1 Timothy 4:12",
      description: "Join a vibrant community of youth and adults growing together in Christ, leadership, and service.",
      content: ["Weekly Bible studies", "Community service", "Mentorship", "Social events"],
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
      icon: Users,
    },
    teenagers: {
      title: "Teenagers Fellowship",
      subtitle: "Fun and growth for our teens",
      verse: "How can a young person stay on the path of purity? By living according to your word.",
      reference: "Psalm 119:9",
      description: "A safe and exciting environment for teenagers to explore faith, make friends, and grow spiritually.",
      content: ["Friday evening meetings", "Interactive lessons", "Games", "Personal development"],
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=800&q=80",
      icon: UserCheck,
    },
    "women-fellowship": {
      title: "Women Fellowship",
      subtitle: "Building strong, faith-driven women",
      verse: "She is clothed with strength and dignity; she can laugh at the days to come.",
      reference: "Proverbs 31:25",
      description: "Empowering women through spiritual growth, mentorship, and community outreach.",
      content: ["Weekly prayer", "Workshops", "Support networks", "Charity projects"],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      icon: Heart,
    },
    "men-fellowship": {
      title: "Men Fellowship",
      subtitle: "Empowering men in leadership",
      verse: "As iron sharpens iron, so one person sharpens another.",
      reference: "Proverbs 27:17",
      description: "Helping men grow spiritually, lead responsibly, and serve with purpose.",
      content: ["Accountability sessions", "Leadership workshops", "Sports", "Volunteer programs"],
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
      icon: Speaker,
    },
  };

  const fellowship = data[type] || data["youth-and-adult"];

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Church className="text-amber-500" size={24} />
            <span className="font-bold tracking-tighter text-lg">FELLOWSHIP PORTAL</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-2 md:gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-amber-500 text-white shadow-lg" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 relative group">
            <div className="absolute -inset-1 bg-amber-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img
              src={fellowship.image}
              alt={fellowship.title}
              className="relative w-full h-[400px] md:h-[500px] rounded-3xl shadow-2xl object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>

          <div className="flex-1 text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                <fellowship.icon size={32} />
              </div>
              <span className="text-amber-600 font-black tracking-widest uppercase text-sm">Official Fellowship</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-2 tracking-tight">
              {fellowship.title}
            </h1>
            
            <p className="text-2xl text-gray-500 font-medium italic mb-6">
              "{fellowship.subtitle}"
            </p>

            {/* --- ADDED BIBLE VERSE DISPLAY SECTION --- */}
            <div className="mb-8 p-6 border-l-4 border-amber-500 bg-amber-50 rounded-r-2xl shadow-sm">
              <p className="text-xl text-gray-800 font-serif italic leading-relaxed">
                "{fellowship.verse}"
              </p>
              <p className="mt-3 text-amber-700 font-bold text-sm uppercase tracking-widest">
                — {fellowship.reference}
              </p>
            </div>
            {/* ---------------------------------------- */}

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {fellowship.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fellowship.content.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-gray-800 font-semibold text-sm">{item}</span>
                </div>
              ))}
            </div>
            
            <button className="mt-10 flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg active:scale-95">
              Join This Fellowship <ArrowUpRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FellowshipPage;