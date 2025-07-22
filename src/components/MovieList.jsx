import MovieCard from "./MovieCard";

function MovieList({ movies, favorites = [], toggleFavorite, searchQuery }) {
  if (!movies.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {movies.map((movie) => {
        const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
        return (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            searchQuery={searchQuery} // Pass down here
          />
        );
      })}
    </div>
  );
}

export default MovieList;
