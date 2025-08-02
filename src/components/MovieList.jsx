import MovieCard from "./MovieCard";

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
      {movies.map((movie) => {
        const isFavorite = favorites.some(
          (fav) => fav.imdbID === movie.imdbID || fav.id === movie.id
        );

        return (
          <MovieCard
            key={movie.imdbID || movie.id}
            movie={movie}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            searchQuery={searchQuery}
          />
        );
      })}
    </div>
  );
}

export default MovieList;
