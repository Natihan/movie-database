import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SkeletonDetail from "./SkeletonDetail";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(location.state?.movie || null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!movie);

  // Favorites (store TMDB movie objects, key by 'id')
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const isFavorite = movie && favorites.some((fav) => fav.id === movie.id);

  const toggleFavorite = (movie) => {
    const exists = favorites.some((fav) => fav.id === movie.id);
    const updated = exists
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Watchlist (store TMDB movie IDs)
  const [watchlist, setWatchlist] = useState(() => {
    const stored = localStorage.getItem("watchlist");
    return stored ? JSON.parse(stored) : [];
  });
  const isInWatchlist = movie && watchlist.includes(movie.id);

  const toggleWatchlist = (id) => {
    const updated = watchlist.includes(id)
      ? watchlist.filter((wid) => wid !== id)
      : [...watchlist, id];
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  useEffect(() => {
    if (movie && movie.overview) {
      setIsLoading(false);
      return;
    }

    const fetchMovie = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
        );
        if (!res.ok) throw new Error("Failed to fetch movie details");
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError(err.message || "Failed to fetch movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (isLoading) return <SkeletonDetail />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!movie) return null;

  return (
    <div
      className="max-w-4xl mx-auto p-4 opacity-0 animate-fadeIn"
      style={{ animationFillMode: "forwards" }}
    >
      {/* Button Row */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 text-blue-700 bg-blue-100 rounded hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(movie)}
          className={`px-4 py-2 rounded transition ${
            isFavorite
              ? "bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-400"
              : "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-300"
          } focus:outline-none`}
        >
          {isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
        </button>

        {/* Watchlist Button */}
        <button
          onClick={() => toggleWatchlist(movie.id)}
          className={`px-4 py-2 rounded transition ${
            isInWatchlist
              ? "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400"
              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-300"
          } focus:outline-none`}
        >
          {isInWatchlist ? "✅ Remove from Watchlist" : "➕ Add to Watchlist"}
        </button>
      </div>

      {/* Movie Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden md:flex">
        <div className="md:w-1/3">
          <img
            src={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "/no-image.png"}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:w-2/3 space-y-2">
          <h2 className="text-2xl font-bold">{movie.title}</h2>
          <p className="text-gray-500">
            {movie.release_date} • {movie.runtime} min • {movie.status}
          </p>
          <p><strong>Rating:</strong> {movie.vote_average} / 10</p>
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ")}</p>
          <p><strong>Production Companies:</strong> {movie.production_companies?.map(pc => pc.name).join(", ")}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
