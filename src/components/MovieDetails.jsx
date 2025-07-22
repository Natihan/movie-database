import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SkeletonDetail from "./SkeletonDetail";

function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(location.state?.movie || null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!movie || !movie.Plot);

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const hasFullDetails = movie && movie.Plot && movie.Plot !== "N/A";

  useEffect(() => {
    if (hasFullDetails) {
      setIsLoading(false);
      return;
    }

    const fetchMovie = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=${id}&plot=full`
        );
        const data = await res.json();
        if (data.Response === "True") {
          setMovie(data);
          setError("");
        } else {
          setError(data.Error);
        }
      } catch {
        setError("Failed to fetch movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id, hasFullDetails]);

  const toggleFavorite = (movie) => {
    const exists = favorites.some((fav) => fav.imdbID === movie.imdbID);
    const updated = exists
      ? favorites.filter((fav) => fav.imdbID !== movie.imdbID)
      : [...favorites, movie];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const isFavorite = movie && favorites.some((fav) => fav.imdbID === movie.imdbID);

  if (isLoading) return <SkeletonDetail />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!movie) return null;

  return (
    <div
      className="max-w-4xl mx-auto p-4 opacity-0 animate-fadeIn"
      style={{ animationFillMode: "forwards" }}
    >
      {/* Button Row */}
      <div className="flex justify-between items-center mb-4">
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
      </div>

      {/* Movie Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden md:flex">
        <div className="md:w-1/3">
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.png"}
            alt={movie.Title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:w-2/3 space-y-2">
          <h2 className="text-2xl font-bold">{movie.Title}</h2>
          <p className="text-gray-500">
            {movie.Year} • {movie.Runtime} • {movie.Rated}
          </p>
          <p>
            <strong>IMDb:</strong> {movie.imdbRating}/10
          </p>
          <p>
            <strong>Plot:</strong> {movie.Plot}
          </p>
          <p>
            <strong>Director:</strong> {movie.Director}
          </p>
          <p>
            <strong>Cast:</strong> {movie.Actors}
          </p>
          <p>
            <strong>Genre:</strong> {movie.Genre}
          </p>
          <p>
            <strong>Awards:</strong> {movie.Awards}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
