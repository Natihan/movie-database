import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import { v4 as uuidv4 } from "uuid"; // ✅ Use UUID to prevent duplicate keys

function MovieList({
  movies = [],
  favorites = [],
  toggleFavorite = () => {},
  searchQuery = "",
  horizontal = false,
  emptyMessage = "No movies to display.",
}) {
  if (!movies.length) {
    return (
      <div className="text-center text-gray-500 text-lg py-8">
        {emptyMessage}
      </div>
    );
  }

  const containerClass = horizontal
    ? "flex overflow-x-auto space-x-4 py-4"
    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6";

  return (
    <div className={containerClass}>
      {movies.map((movie, index) => {
        const isFavorite = favorites.some(
          (fav) => fav.imdbID === movie.imdbID || fav.id === movie.id
        );

        // ✅ Ensure key is always unique
        const movieKey = movie.id || movie.imdbID || uuidv4();
        const movieId = movie.id || movie.imdbID;

        return (
          <Link
            key={movieKey}
            to={`/movie/${movieId}`}
            state={{ movie, searchQuery }}
            className="hover:scale-105 transform transition"
          >
            <MovieCard
              movie={movie}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              searchQuery={searchQuery}
            />
          </Link>
        );
      })}
    </div>
  );
}

export default MovieList;
