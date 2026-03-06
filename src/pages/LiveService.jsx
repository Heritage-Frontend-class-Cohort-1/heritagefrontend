import React, { useState, useEffect } from "react";
import { Play, Calendar, Bell, Loader2, AlertCircle } from "lucide-react";

const LiveService = () => {
  const [isLive, setIsLive] = useState(false);      // You can make this dynamic later
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your actual YouTube channel's LIVE embed or video ID
  // For permanent "whatever is live now" → use: https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID
  // But most reliable = specific video ID when scheduled
  const LIVE_VIDEO_ID = "YOUR_LIVE_VIDEO_ID_HERE"; // ← change this!
  const CHANNEL_ID = "YOUR_CHANNEL_ID_HERE";       // optional for /live_stream

  const embedUrl = `https://www.youtube.com/embed/${LIVE_VIDEO_ID}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0`;

  // Simulate fetching live status (you can replace with real API call later)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Example: setIsLive(true) when you know it's live
      // For real check → use YouTube Data API v3 "liveBroadcasts" endpoint
      setIsLive(true); // ← for demo – make dynamic in production
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-5 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full">
            <Bell size={20} className="text-amber-400 animate-pulse" />
            <span className="font-medium text-amber-300">LIVE Worship Experience</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Join Us Live
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto opacity-90">
            Experience powerful worship, inspiring Word, and fellowship — right from your device.
          </p>

          {/* Service Times */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">
              <Calendar size={22} className="text-amber-400" />
              <span>Sundays • 8:00 AM & 10:00 AM</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">
              <Calendar size={22} className="text-amber-400" />
              <span>Tuesday Bible Study • 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={64} className="text-blue-600 animate-spin mb-6" />
            <p className="text-xl text-gray-600 font-medium">Connecting to live service...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-red-800 mb-3">Something went wrong</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
            >
              Try Again
            </button>
          </div>
        ) : isLive ? (
          <div className="space-y-10">
            {/* Video Player */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border-8 border-white/10">
              <div className="aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={embedUrl}
                  title="Lord's Heritage House Live Service"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Live Badge */}
              <div className="absolute top-4 left-4 px-4 py-1.5 bg-red-600 text-white text-sm font-bold rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                <span className="w-3 h-3 bg-white rounded-full"></span>
                LIVE
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
              <a
                href="#chat" // or link to live chat / WhatsApp
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100"
              >
                <Play size={40} className="text-blue-600" />
                <span className="font-semibold text-lg">Watch Live</span>
              </a>

              <a
                href="/giving"
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100"
              >
                <span className="text-3xl">🙏</span>
                <span className="font-semibold text-lg">Give Online</span>
              </a>

              <a
                href="https://wa.me/YOUR_NUMBER?text=I'm%20joining%20the%20live%20service!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100"
              >
                <span className="text-3xl">💬</span>
                <span className="font-semibold text-lg">Chat with Us</span>
              </a>
            </div>

            <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
              We're glad you're joining us today! Feel free to share this page with friends and family.
            </p>
          </div>
        ) : (
          /* Not live state */
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="max-w-lg mx-auto px-5">
              <h2 className="text-3xl font-bold text-gray-800 mb-5">
                No Live Service Right Now
              </h2>
              <p className="text-gray-600 text-lg mb-10">
                Our next live service is on Sunday at 8:00 AM & 10:00 AM WAT.
                <br />
                Come back soon or watch our recent sermons below.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/sermons"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-md"
                >
                  Watch Past Sermons
                </a>
                <a
                  href="/"
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition"
                >
                  Back to Homepage
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveService;