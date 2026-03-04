// src/components/Footer.jsx
import { Link } from "react-router-dom";
import {
  Church,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Quick-Facts", path: "/who-we-are/facts" },
    { name: "Our Sermons", path: "/sermons" },
    { name: "PrayerRequest", path: "/explore-heritage/prayer-request" },
    { name: "Contact Us", path: "/explore-heritage/contact" },
    { name: "iCare Welfare", path: "/icare" },
  ];

  return (
    <footer className="bg-blue-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Church className="h-10 w-10 text-amber-400" />
              <span className="font-serif text-2xl font-bold text-amber-400">
                Lord's Heritage House
              </span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
             Discover Your Purpose. Deepen Your Faith. Experience The Heritage. 
             Join us this Sunday as we encounter
              the presence of God and build a future rooted in His love
            </p>

            {/* Social Links */}
            <div className="flex gap-5">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl font-semibold text-amber-400 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="font-serif text-xl font-semibold text-amber-400 mb-6">
              Service Times
            </h4>
            <ul className="space-y-5 text-gray-300 text-sm">
              <li>
                <span className="block font-medium text-white">Sunday Service</span>
                9:00 AM 
              </li>
              <li>
                <span className="block font-medium text-white"> Bible Study</span>
                 Tuesday 6:00 PM
              </li>
              <li>
                <span className="block font-medium text-white">Faith Clinic </span>
                Thursday at 6:00 PM
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-xl font-semibold text-amber-400 mb-6">
              Contact Us
            </h4>
            <ul className="space-y-5 text-gray-300 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                   338, Sagamu Road,<br />
                 Beside MRS Filling Station Opposite UBA Odogunyan Ikorodu-Lagos
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-400 shrink-0" />
                <span>+234 905 915 6800</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-400 shrink-0" />
                <span>hello@lordsheritagehouse.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Lord's Heritage House. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;