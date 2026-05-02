import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const LOGO_URL = "https://rccgworld.org/rccg/assets/images/logos/rccg_logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  {
    name: "Information",
    path: "/information",
    children: [
      { name: "Our Journey", path: "/information/journey" },
      { name: "Heritage in Numbers", path: "/information/heritage-in-number" },
      { name: "Mission & Vision", path: "/information/mission-vision" },
      { name: "What We Believe", path: "/information/believe" },
      { name: "Our Leadership", path: "/information/leadership" },
    ],
  },
  { name: "Sermons", path: "/sermons" },
  { name: "icare", path: "/icare" },
  {
    name: "Explore Heritage",
    path: "/explore-heritage",
    children: [
      { name: "I'm New Here", path: "/explore-heritage/am-new-here" },
      { name: "Testimonies", path: "/explore-heritage/testimony" },
      { name: "Contact Us", path: "/explore-heritage/contact-us" },
      { name: "Prayer Request", path: "/explore-heritage/prayer-request" },
      { name: "Counselling", path: "/explore-heritage/counselling" },
      { name: "Birthday", path: "/explore-heritage/birthday" },
    ],
  },
  { name: "Giving", path: "/giving" },
];

const logoVariants = {
  animate: {
    x: [-6, 6, -6],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path, children) => {
    if (location.pathname === path) return true;
    if (children) return children.some((child) => location.pathname === child.path);
    return false;
  };

  const toggleMobileDropdown = (name) => {
    setActiveMobileDropdown(activeMobileDropdown === name ? null : name);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200/30 transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <nav
        className={`max-w-7xl mx-auto px-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-16" : "h-24"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <motion.img
            src={LOGO_URL}
            alt="Lord's Heritage House Logo"
            variants={logoVariants}
            animate="animate"
            className={`object-contain transition-all duration-300 ${
              scrolled ? "h-10 w-10" : "h-20 w-20"
            }`}
          />
          <span
            className={`font-bold text-blue-950 transition-all duration-300 ${
              scrolled ? "text-xl" : "text-2xl"
            }`}
          >
            Lord's Heritage House
          </span>
        </Link>

        {/* Desktop Menu */}
        <div
          className="hidden md:flex items-center gap-10"
          role="navigation"
          aria-label="Main navigation"
        >
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.name} className="relative group">
                <button
                  className={`flex items-center gap-1 text-base font-medium transition-colors duration-200 ${
                    isActive(link.path, link.children)
                      ? "text-amber-500"
                      : "text-gray-600 hover:text-blue-950"
                  }`}
                  aria-haspopup="true"
                  aria-label={`${link.name} submenu`}
                >
                  {link.name} <ChevronDown size={16} />
                </button>

                {/* Dropdown menu */}
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 p-3 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {link.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`block py-2 px-3 text-sm text-gray-600 hover:text-blue-950 rounded-md hover:bg-gray-50 ${
                        location.pathname === child.path
                          ? "text-amber-500 font-semibold bg-amber-50"
                          : ""
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-base font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "text-amber-500"
                    : "text-gray-600 hover:text-blue-950"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-blue-950"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
          className={`md:hidden bg-white border-t border-gray-200/30 shadow-lg overflow-y-auto max-h-[calc(100vh-${
            scrolled ? "64px" : "96px"
          })]`}
        >
          <div className="px-6 py-6 space-y-5">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.name} className="space-y-2">
                  <button
                    onClick={() => toggleMobileDropdown(link.name)}
                    className={`w-full text-left font-medium flex justify-between items-center ${
                      isActive(link.path, link.children)
                        ? "text-amber-500"
                        : "text-gray-600"
                    }`}
                    aria-expanded={activeMobileDropdown === link.name}
                    aria-haspopup="true"
                    aria-label={`${link.name} submenu`}
                  >
                    {link.name}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        activeMobileDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeMobileDropdown === link.name && (
                    <div className="pl-4 space-y-3 border-l-2 border-gray-100 mt-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setIsOpen(false)}
                          className={`block text-sm ${
                            location.pathname === child.path
                              ? "text-amber-500 font-semibold"
                              : "text-gray-500 hover:text-blue-950"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-amber-500"
                      : "text-gray-600 hover:text-blue-950"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;