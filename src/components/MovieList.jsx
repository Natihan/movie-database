import MovieCard from "./MovieCard";

function MovieList({ movies, favorites = [], toggleFavorite, searchQuery, horizontal = false }) {
  if (!movies.length) return null;

  // Use flexbox with horizontal scrolling if horizontal=true, else grid layout
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
