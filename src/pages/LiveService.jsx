import React from "react";

const LiveService = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Live Service</h1>

      {/* Embed YouTube Live Stream */}
      <div className="w-full md:w-3/4 aspect-video">
        <iframe
          className="w-full h-full rounded shadow-lg"
          src="https://www.youtube.com/embed/YOUR_LIVE_VIDEO_ID?autoplay=1"
          title="Live Service"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <p className="mt-4 text-center text-gray-800 text-3xl">
        Join us live for worship and messages
      </p>
    </div>
  );
};

export default LiveService;