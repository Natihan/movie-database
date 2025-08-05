import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SkeletonDetail from "./SkeletonDetail";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const YOUTUBE_BASE = "https://www.youtube.com/embed/";
const TMDB_PERSON_BASE = "https://www.themoviedb.org/person/";

function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(location.state?.movie || null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!movie);

  const [recPage, setRecPage] = useState(0);
  const [showAllCast, setShowAllCast] = useState(false);
  const recPerPage = 4;

  const [activeTab, setActiveTab] = useState("similar"); // 'similar' | 'recommendations'

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const isFavorite = movie && favorites.some((fav) => fav.id === movie.id);
  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === movie.id);
      const updated = exists ? prev.filter((fav) => fav.id !== movie.id) : [...prev, movie];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const [watchlist, setWatchlist] = useState(() => {
    const stored = localStorage.getItem("watchlist");
    return stored ? JSON.parse(stored) : [];
  });
  const isInWatchlist = movie && watchlist.includes(movie.id);
  const toggleWatchlist = (id) => {
    setWatchlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id];
      localStorage.setItem("watchlist", JSON.stringify(updated));
      return updated;
    });
  };

  const [likes, setLikes] = useState(() => {
    const stored = localStorage.getItem("likes");
    return stored ? JSON.parse(stored) : [];
  });
  const isLiked = movie && likes.includes(movie.id);
  const toggleLike = (id) => {
    setLikes((prev) => {
      const updated = prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id];
      localStorage.setItem("likes", JSON.stringify(updated));
      return updated;
    });
  };

  const [wantToWatch, setWantToWatch] = useState(() => {
    const stored = localStorage.getItem("wantToWatch");
    return stored ? JSON.parse(stored) : [];
  });
  const isInWantToWatch = movie && wantToWatch.includes(movie.id);
  const toggleWantToWatch = (id) => {
    setWantToWatch((prev) => {
      const updated = prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id];
      localStorage.setItem("wantToWatch", JSON.stringify(updated));
      return updated;
    });
  };

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      setError("");
      try {
        const baseUrl = `https://api.themoviedb.org/3/movie/${id}`;
        const key = import.meta.env.VITE_TMDB_API_KEY;

        const [movieRes, creditsRes, videosRes, recRes, similarRes, keywordsRes] =
          await Promise.all([
            fetch(`${baseUrl}?api_key=${key}&language=en-US`),
            fetch(`${baseUrl}/credits?api_key=${key}`),
            fetch(`${baseUrl}/videos?api_key=${key}&language=en-US`),
            fetch(`${baseUrl}/recommendations?api_key=${key}&language=en-US`),
            fetch(`${baseUrl}/similar?api_key=${key}&language=en-US`),
            fetch(`${baseUrl}/keywords?api_key=${key}`),
          ]);

        if (!movieRes.ok) throw new Error("Failed to fetch movie details");

        const [movieData, creditsData, videoData, recData, similarData, keywordsData] =
          await Promise.all([
            movieRes.json(),
            creditsRes.json(),
            videosRes.json(),
            recRes.json(),
            similarRes.json(),
            keywordsRes.json(),
          ]);

        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videoData.results || []);
        setRecommendations(recData.results || []);
        setSimilarMovies(similarData.results || []);
        setKeywords(keywordsData.keywords || []);
      } catch (err) {
        setError(err.message || "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (isLoading) return <SkeletonDetail />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!movie) return null;

  const director = credits?.crew.find((p) => p.job === "Director");
  const displayedCast = showAllCast ? credits?.cast : credits?.cast?.slice(0, 5);
  const crewList = credits?.crew.slice(0, 10);
  const trailer = videos.find((v) => v.type === "Trailer" && v.site === "YouTube");

  const paginatedRecs = recommendations.slice(recPage * recPerPage, (recPage + 1) * recPerPage);

  const maxScroll = 200;
  const blurAmount = Math.min(scrollY / maxScroll, 1) * 10;
  const overlayOpacity = 0.3 * (blurAmount / 10);

  const backdropStyle = {
    backgroundImage: `url(${TMDB_BACKDROP_BASE}${movie.backdrop_path})`,
    filter: `blur(${blurAmount}px) brightness(${1 - overlayOpacity}) saturate(1.2)`,
    transition: "filter 0.3s ease",
  };

  return (
    <>
      {movie.backdrop_path && (
        <div
          className="fixed top-0 left-0 right-0 h-[60vh] w-screen -z-10 bg-cover bg-center"
          style={backdropStyle}
        >
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity, transition: "opacity 0.3s ease" }}
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-16 space-y-8 sm:space-y-10 relative z-10 text-sm sm:text-base">
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl font-medium drop-shadow">{movie.title}</h1>
          <p className="text-gray-300 text-sm">
            {movie.release_date} • {movie.runtime} min • {movie.status}
          </p>
          {movie.tagline && (
            <p className="italic mt-2 drop-shadow text-sm text-gray-400">{movie.tagline}</p>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
        >
          ← Go Back
        </button>

        <div className="bg-white shadow rounded-lg overflow-hidden md:flex">
          <div className="md:w-1/3 relative">
            <img
              src={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "/no-image.png"}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full bg-gray-100 py-2 flex justify-center gap-4">
              <button onClick={() => toggleFavorite(movie)} title="Favorite" className="text-xl">
                {isFavorite ? "❤️" : "🤍"}
              </button>
              <button onClick={() => toggleWatchlist(movie.id)} title="Watchlist" className="text-xl">
                {isInWatchlist ? "✅" : "➕"}
              </button>
              <button onClick={() => toggleWantToWatch(movie.id)} title="Want to Watch" className="text-xl">
                {isInWantToWatch ? "👁️" : "👁️‍🗨️"}
              </button>
              <button onClick={() => toggleLike(movie.id)} title="Like" className="text-xl">
                {isLiked ? "👍" : "👎"}
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6 md:w-2/3 space-y-2">
            <h2 className="text-lg sm:text-xl font-medium">{movie.title}</h2>
            <p className="text-gray-700">{movie.release_date} • {movie.runtime} min • {movie.status}</p>
            <p><strong>Rating:</strong> {movie.vote_average} / 10</p>
            {director && <p><strong>Director:</strong> {director.name}</p>}
            <p><strong>Genres:</strong> {movie.genres?.map((g) => g.name).join(", ")}</p>
            <p><strong>Production:</strong> {movie.production_companies?.map((pc) => pc.name).join(", ")}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-5 rounded shadow">
          <h3 className="text-base sm:text-lg font-medium mb-2">Overview</h3>
          <p>{movie.overview}</p>
        </div>

        {credits?.cast?.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base sm:text-lg font-medium">Top Cast</h3>
              <button
                onClick={() => setShowAllCast((prev) => !prev)}
                className="text-blue-600 hover:underline text-sm"
              >
                {showAllCast ? "Show Less" : "Show All"}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {displayedCast.map((actor) => (
                <a
                  key={actor.id}
                  href={`${TMDB_PERSON_BASE}${actor.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-3 rounded shadow text-center hover:shadow-md"
                >
                  <img
                    src={actor.profile_path ? `${TMDB_IMAGE_BASE}${actor.profile_path}` : "/no-image.png"}
                    alt={actor.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <p className="font-medium">{actor.name}</p>
                  <p className="text-sm text-gray-500">{actor.character}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {crewList?.length > 0 && (
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Crew</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {crewList.map((crew) => (
                <a
                  key={crew.id}
                  href={`${TMDB_PERSON_BASE}${crew.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[120px] text-center"
                >
                  <img
                    src={crew.profile_path ? `${TMDB_IMAGE_BASE}${crew.profile_path}` : "/no-image.png"}
                    alt={crew.name}
                    className="w-full h-28 object-cover rounded mb-1 shadow"
                  />
                  <p className="text-sm font-medium">{crew.name}</p>
                  <p className="text-xs text-gray-500">{crew.job}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {trailer && (
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Trailer</h3>
            <div className="w-full rounded overflow-hidden" style={{ height: "500px" }}>
              <iframe
                src={`${YOUTUBE_BASE}${trailer.key}`}
                title={trailer.name}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {keywords.length > 0 && (
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <span key={kw.id} className="px-2 py-1 bg-gray-200 text-sm rounded">
                  {kw.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs for Similar & Recommendations */}
        <div>
          <div className="flex gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-full ${activeTab === "similar" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setActiveTab("similar")}
            >
              Similar Movies
            </button>
            <button
              className={`px-4 py-2 rounded-full ${activeTab === "recommendations" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setActiveTab("recommendations")}
            >
              Recommendations
            </button>
          </div>

          {activeTab === "similar" && similarMovies.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {similarMovies.slice(0, 8).map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  state={{ movie }}
                  className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "/no-image.png"}
                    alt={movie.title}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="font-medium text-sm">{movie.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === "recommendations" && (
            <>
              {recommendations.length === 0 ? (
                <p className="text-sm text-gray-500">No recommendations available.</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {paginatedRecs.map((rec) => (
                      <Link
                        key={rec.id}
                        to={`/movie/${rec.id}`}
                        state={{ movie: rec }}
                        className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition"
                      >
                        <img
                          src={rec.poster_path ? `${TMDB_IMAGE_BASE}${rec.poster_path}` : "/no-image.png"}
                          alt={rec.title}
                          className="w-full h-60 object-cover"
                        />
                        <div className="p-2">
                          <h4 className="font-medium text-sm">{rec.title}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setRecPage((p) => Math.max(0, p - 1))}
                      disabled={recPage === 0}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setRecPage((p) =>
                          p < Math.floor(recommendations.length / recPerPage) ? p + 1 : p
                        )
                      }
                      disabled={recPage >= Math.floor(recommendations.length / recPerPage)}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MovieDetails;
