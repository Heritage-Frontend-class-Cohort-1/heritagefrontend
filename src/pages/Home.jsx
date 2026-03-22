import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Heart, Users, BookOpen, Calendar, Speaker, Sparkles, Gift, MessageSquare, UserCheck, Send, Quote 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Assets
import heroImage from "../assets/heroImage.jpg";
import year2026 from "../assets/year2026.jpg";
import pic001 from "../assets/pic001.jpeg";
import pic002 from "../assets/pic002.jpeg";
import pic003 from "../assets/pic003.jpeg";

const colors = {
  deepNavy: "#0B1B3F",
  secondaryNavy: "#142A5A",
  softCream: "#FFF4E1",
  gold: "#FFD700",
  offWhite: "#F8F8F8",
};

const dailyVerses = [
  { v: "For I know the plans I have for you, declares the Lord.", r: "Jeremiah 29:11" },
  { v: "I can do all things through him who strengthens me.", r: "Philippians 4:13" },
  { v: "Trust in the Lord with all your heart.", r: "Proverbs 3:5" },
  { v: "But they who wait for the Lord shall renew their strength.", r: "Isaiah 40:31" },
  { v: "The Lord is my shepherd; I shall not want.", r: "Psalm 23:1" },
  { v: "Be strong and courageous. Do not be frightened, for the Lord your God is with you.", r: "Joshua 1:9" },
  { v: "Cast all your anxiety on him because he cares for you.", r: "1 Peter 5:7" },
  { v: "And we know that in all things God works for the good of those who love him.", r: "Romans 8:28" },
  { v: "The name of the Lord is a strong tower; the righteous run into it and are safe.", r: "Proverbs 18:10" },
  { v: "Do not be anxious about anything, but in everything by prayer let your requests be made known to God.", r: "Philippians 4:6" },
  { v: "God is our refuge and strength, a very present help in trouble.", r: "Psalm 46:1" },
  { v: "The Lord will fight for you; you need only to be still.", r: "Exodus 14:14" },
  { v: "Your word is a lamp to my feet and a light to my path.", r: "Psalm 119:105" },
  { v: "For God has not given us a spirit of fear, but of power, love and a sound mind.", r: "2 Timothy 1:7" },
  { v: "Give thanks to the Lord, for he is good; his love endures forever.", r: "1 Chronicles 16:34" },
  { v: "Let everything that has breath praise the Lord.", r: "Psalm 150:6" },
  { v: "He gives power to the weak and strength to the powerless.", r: "Isaiah 40:29" },
  { v: "The joy of the Lord is your strength.", r: "Nehemiah 8:10" },
  { v: "Ask and it will be given to you; seek and you will find.", r: "Matthew 7:7" },
  { v: "I will praise you, for I am fearfully and wonderfully made.", r: "Psalm 139:14" }
];

const services = [
  {
    day: "Sundays",
    items: [
      { name: "Sunday Service", time: "8:00 AM" },
      { name: "Thanksgiving Service", time: "8:00 AM", note: "1st Sunday" },
      { name: "Communion Service", time: "5:00 PM", note: "1st Sunday" },
      { name: "Youth Sunday", time: "8:00 AM", note: "3rd Sunday" },
    ],
  },
  {
    day: "Tuesdays",
    items: [
      { name: "Digging Deep", time: "5:00 PM" },
    ],
  },
  {
    day: "Thursdays",
    items: [{ name: "Faith Clinic", time: "5:00 PM" }],
  },
  {
    day: "Fridays",
    items: [
      { name: "Congregational Vigil", time: "10:00 PM", note: "Last Friday" },
    ],
  },
  {
    day: "Sundays",
    items: [
      { name: "Women of Destiny Meeting", time: "12:00 PM", note: "3rd Sunday" },
    ],
  },
];

const Home = () => {
  const heroImages = [heroImage, pic001, pic002, pic003];
  const [currentImage, setCurrentImage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Welcome to the Lord's Heritage — A Place of Worship";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    setTimeout(() => setShowContent(true), 300);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    let index = 0;
    const typing = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(typing);
    }, 50);
    return () => clearInterval(typing);
  }, []);

  const quickLinks = [
    { title: "Am New Here", path: "/explore-heritage/am-new-here", icon: Speaker },
    { title: "Testimonies", path: "/explore-heritage/testimony", icon: BookOpen },
    { title: "iCare", path: "/icare", icon: Heart },
    { title: "Sermons", path: "/sermons", icon: BookOpen },
    { title: "Giving", path: "/giving", icon: Gift },
    { title: "Prayer Request", path: "/explore-heritage/prayer-request", icon: MessageSquare },
    { title: "Counselling", path: "/explore-heritage/counselling", icon: Users },
    { title: "Our Leadership", path: "/who-we-are/leadership", icon: UserCheck },
  ];

  const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "", prayerRequest: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleDecisionSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Decision Submitted:", formData);
  };

  const today = new Date();
  const verseIndex = (today.getDate() - 1) % dailyVerses.length;
  const dailyMessage = dailyVerses[verseIndex];

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative h-[90vh] md:min-h-[115vh] flex items-center justify-center overflow-hidden bg-black">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentImage ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            style={{ 
              backgroundImage: `url(${img})`, 
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.65) contrast(1.1)"
            }}
          />
        ))}

        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/90" />

        <div className={`relative text-center text-white px-4 md:px-6 z-10 w-full max-w-5xl transition-all duration-1000 ${showContent ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-serif font-bold mb-4 md:mb-6 drop-shadow-2xl leading-tight">
            {typedText}<span className="animate-pulse text-amber-400">|</span>
          </h1>

          <p className="text-base sm:text-lg md:text-2xl mb-8 md:mb-12 max-w-xs sm:max-w-md md:max-w-2xl mx-auto drop-shadow-lg font-medium opacity-95">
            Join our welcoming community as we <span className="text-amber-400 font-bold">grow together</span> in faith and love.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <Link to="/information/heritage-in-number" className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-amber-500 text-[#0B1B3F] font-black rounded-full hover:bg-amber-400 transition shadow-xl flex items-center justify-center">
              Learn More <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/live-service" className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 border-2 border-white/80 backdrop-blur-md bg-white/5 rounded-full hover:bg-white hover:text-[#0B1B3F] font-black transition-all shadow-lg flex items-center justify-center">
              JOIN LIVE SERVICE
            </Link>
          </div>
        </div>
      </section>

      {/* DAILY VERSE */}
      <section className="py-20 bg-[#FFF4E1]">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <div className="flex items-center justify-center gap-3 mb-6 text-amber-600 font-semibold uppercase tracking-widest">
            <Calendar size={18} /> <span>Daily Manna — {today.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
          </div>
          <Quote className="mx-auto mb-6 text-amber-200 w-16 h-16" />
          <h2 className="text-2xl md:text-4xl font-serif italic text-[#0B1B3F] mb-4">
            "{dailyMessage.v}"
          </h2>
          <p className="text-xl font-semibold text-amber-600">{dailyMessage.r}</p>
        </div>
      </section>

      {/* YEAR IMAGE */}
      <section className="py-12 text-center bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <img src={year2026} alt="Year 2026" className="rounded-2xl shadow-2xl mx-auto w-full" />
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="py-20 bg-[#142A5A]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-[#FFD700]">Explore More</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link key={idx} to={link.path} className="group flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:bg-amber-500 hover:-translate-y-2">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-white transition duration-300">
                    <Icon className="h-6 w-6 text-blue-900" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1B3F] group-hover:text-white">{link.title}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* GIVING */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Gift className="mx-auto text-amber-500 mb-6" size={48} />
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-blue-950 mb-6">Partner With Our Mission</h2>
              <p className="text-slate-600 text-lg leading-relaxed italic">
                "Each of you should give what you have decided in your heart to give..." 
                <span className="block font-bold mt-2">— 2 Corinthians 9:7</span>
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div whileHover={{ y: -10 }} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative group">
              <h3 className="text-sm font-black tracking-widest text-amber-600 uppercase mb-6">Tithes & Offerings</h3>
              <div className="space-y-4 text-blue-950">
                <p className="text-xs text-slate-400 uppercase font-bold">Bank Name: <span className="text-blue-950">UBA</span></p>
                <p className="text-xs text-slate-400 uppercase font-bold">Account Name</p>
                <p className="text-xl font-bold">The Lord's Heritage House</p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold">Account Number</p>
                  <p className="text-3xl font-serif font-black text-blue-900">1028674844</p>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-blue-950 p-10 rounded-[2.5rem] shadow-2xl text-white relative group">
              <h3 className="text-sm font-black tracking-widest text-amber-400 uppercase mb-6">Building & Projects</h3>
              <div className="space-y-4">
                <p className="text-xs text-white/40 uppercase font-bold">Bank Name: <span className="text-white">UBA Bank</span></p>
                <p className="text-xs text-white/40 uppercase font-bold">Account Name</p>
                <p className="text-xl font-bold">The Lord's Heritage House</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/40 uppercase font-bold">Account Number</p>
                  <p className="text-3xl font-serif font-black text-amber-400">1028674844</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR SERVICES — placed after Giving */}
      <section className="py-20 bg-[#0B1B3F] px-4 md:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white uppercase tracking-widest mb-4">
              Our Services
            </h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mb-6" />
            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
              We hold services on Sundays, Tuesdays, Thursdays and Fridays —
              designed to serve different needs of human existence.
            </p>
          </div>

          {/* Single rounded container — all days inside, separated by dividers */}
          <div className="rounded-3xl overflow-hidden border border-white/10">
            {services.map((col, colIdx) => (
              <div
                key={col.day}
                className={`px-8 md:px-14 py-8 md:py-10 ${
                  colIdx % 2 === 0 ? "bg-white/5" : "bg-white/[0.02]"
                } ${colIdx !== services.length - 1 ? "border-b border-white/10" : ""}`}
              >
                {/* Day label */}
                <p className="text-amber-400 text-xs font-black uppercase tracking-[0.2em] mb-5">
                  {col.day}
                </p>

                {/* Services — laid out horizontally, wraps on small screens */}
                <div className="flex flex-wrap gap-x-10 gap-y-6">
                  {col.items.map((item, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-white text-xl md:text-2xl font-semibold leading-snug">
                        {item.name}
                      </span>
                      {item.note && (
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/25 rounded px-2 py-0.5 w-fit">
                          {item.note}
                        </span>
                      )}
                      <span className="text-slate-400 text-base">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FELLOWSHIPS */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-blue-900 uppercase tracking-widest">
              Connect, Grow & Thrive
            </h2>
            <p className="text-slate-600 italic text-lg border-l-4 border-amber-500 pl-4 py-2 bg-amber-500/5 rounded-r-xl">
              "From him the whole body, joined and held together by every supporting ligament, 
              grows and builds itself up in love, as each part does its work."
              <span className="block font-bold mt-1 text-amber-700">— Ephesians 4:16</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Youth & Adult", icon: Users, link: "youth-and-adult" },
              { title: "Teenagers", icon: UserCheck, link: "teenagers" },
              { title: "Women Fellowship", icon: Heart, link: "women-fellowship" },
              { title: "Men Fellowship", icon: Speaker, link: "men-fellowship" },
            ].map((group, idx) => (
              <a 
                key={idx} 
                href={`/fellowships/${group.link}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center p-8 bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-amber-200 cursor-pointer"
              >
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-amber-400 transition-colors">
                  <group.icon className="h-8 w-8 text-amber-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 uppercase">{group.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* DECISION FORM */}
      <section className="py-16 bg-[#FFF4E1]">
        <div className="max-w-4xl mx-auto px-4 rounded-3xl shadow-xl p-8 md:p-12 border-t-8 border-[#FFD700] bg-white">
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 mx-auto mb-4 animate-pulse text-red-500" />
            <h2 className="text-3xl font-bold text-[#0B1B3F]">Give Your Life to Christ</h2>
          </div>

          {!submitted ? (
            <form onSubmit={handleDecisionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" required className="p-4 bg-slate-50 border rounded-lg outline-none w-full" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                <input type="text" placeholder="Last Name" required className="p-4 bg-slate-50 border rounded-lg outline-none w-full" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
              </div>
              <input type="tel" placeholder="Phone Number" required className="p-4 bg-slate-50 border rounded-lg outline-none w-full" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <textarea placeholder="Share your prayer request..." rows="3" className="p-4 bg-slate-50 border rounded-lg outline-none w-full" onChange={(e) => setFormData({ ...formData, prayerRequest: e.target.value })}></textarea>
              <button type="submit" className="w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 bg-[#0B1B3F] text-amber-400 hover:brightness-125 transition-all">
                <Send className="h-5 w-5" /> I GAVE MY LIFE TODAY
              </button>
            </form>
          ) : (
            <div className="text-center p-10">
              <h3 className="text-2xl font-bold mb-2 text-[#0B1B3F]">Hallelujah!</h3>
              <p className="text-[#0B1B3F] text-lg">Heaven is rejoicing over you, <strong>{formData.firstName}</strong>!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;