import { useEffect, useState } from "react";
import { ExternalLink, PlayCircle, Clock, User, Loader2 } from "lucide-react";

export default function SermonsPage() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const res = await fetch(
          "https://backend-heritage-6.onrender.com/api/messages/pastor"
        );
        if (!res.ok) throw new Error("Failed to fetch sermons");
        const data = await res.json();
        setSermons(data.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load sermons. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSermons();
  }, []);

  // Optional: format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero / Header Section */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white">
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-20 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Pastor's Sermons
            </h1>
            <p className="text-lg md:text-xl text-blue-100 opacity-90 max-w-2xl">
              Inspiring messages, timeless truths, and practical teachings to
              strengthen your walk with God.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-5 py-12 md:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-700 font-medium text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        ) : sermons.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-medium">No sermons available yet</p>
            <p className="mt-2">Check back soon for new teachings!</p>
          </div>
        ) : (
          <div className="grid gap-5 md:gap-6">
            {sermons.map((sermon) => (
              <div
                key={sermon.videoId || sermon._id || Math.random()}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-300 overflow-hidden"
              >
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
                  {/* Thumbnail / Play icon area */}
                  <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                    {sermon.thumbnailUrl ? (
                      <img
                        src={sermon.thumbnailUrl}
                        alt={sermon.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-16 h-16 text-blue-500 opacity-70" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {sermon.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <User size={16} className="text-gray-500" />
                        <span>{sermon.snippet?.channelTitle || "Pastor"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-gray-500" />
                        <span>{formatDate(sermon.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Description (if available) */}
                    {sermon.snippet?.description && (
                      <p className="mt-3 text-gray-600 line-clamp-2">
                        {sermon.snippet.description}
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 mt-4 sm:mt-0">
                    <a
                      href={`https://www.youtube.com/watch?v=${sermon.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <PlayCircle size={18} />
                      Watch Sermon
                    </a>

                    <a
                      href={`https://www.youtube.com/watch?v=${sermon.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                    >
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}