import { Link } from "react-router-dom";

function MovieCard({ movie, isFavorite, toggleFavorite, searchQuery }) {
  return (
    <div className="relative">
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault(); // prevent navigation
          toggleFavorite(movie);
        }}
        className="absolute top-2 right-2 z-10 text-2xl"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      {/* Clickable Movie Card */}
      <Link to={`/movie/${movie.imdbID}`} state={{ movie, searchQuery }}>
        <div className="bg-white shadow-md rounded overflow-hidden hover:shadow-lg transition">
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.png"}
            alt={movie.Title}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold text-lg">{movie.Title}</h3>
            <p className="text-sm text-gray-600">{movie.Year}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;
