import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import SkeletonList from "../components/SkeletonList";
import { useMovies } from "../hooks/useMovies";
import { useTrendingMovies } from "../hooks/useTrendingMovies";
import { useTrendingTmdb } from "../hooks/useTrendingTmdb";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function Home() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [searchParams] = useSearchParams();
  const [heroIndex, setHeroIndex] = useState(0);

  const { movies, error, isLoading, totalResults, searchMovies } = useMovies();
  const { trendingMovies, loadingTrending, errorTrending } = useTrendingMovies();
  const { tmdbTrending, loadingTmdb, errorTmdb } = useTrendingTmdb();

  useEffect(() => {
    const paramQuery = searchParams.get("query") || "";
    if (paramQuery && paramQuery !== query) {
      setQuery(paramQuery);
      searchMovies(paramQuery);
    } else if (paramQuery) {
      searchMovies(paramQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!tmdbTrending.length) return;

    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % tmdbTrending.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [tmdbTrending]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    searchMovies(searchQuery);
  };

  const toggleFavorite = (movie) => {
    const exists = favorites.some(
      (fav) => fav.imdbID === movie.imdbID || fav.id === movie.id
    );
    const updated = exists
      ? favorites.filter(
          (fav) => fav.imdbID !== movie.imdbID && fav.id !== movie.id
        )
      : [...favorites, movie];

    setFavorites(updated);
  };

  const heroMovie = tmdbTrending.length > 0 ? tmdbTrending[heroIndex] : null;
  const heroBackground = heroMovie?.backdrop_path
    ? `${TMDB_IMAGE_BASE}${heroMovie.backdrop_path}`
    : "/hero-bg.jpg";

  return (
    <main className="w-full m-0 p-0 bg-gray-50">
      {/* Hero Section */}
      <header
        className="w-full m-0 p-0 relative py-20 text-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundBlendMode: "multiply",
          backgroundColor: "rgba(0,0,0,0.5)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s ease-in-out",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30" aria-hidden="true" />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-3">
            🎬 Movie Database
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Millions of movies, TV shows and people to discover. Explore now.
          </p>
        </div>
      </header>

      {/* Page Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 py-10">
        <SearchBar onSearch={handleSearch} initialQuery={query} />

        {(error || errorTrending || errorTmdb) && (
          <p className="text-red-500 text-center my-4">
            {error || errorTrending || errorTmdb}
          </p>
        )}

        {/* OMDb Trending */}
        {!query && !loadingTrending && trendingMovies.length > 0 && (
          <section className="my-8">
            <h2 className="text-2xl font-semibold mb-4">🔥 Trending on OMDb</h2>
            <MovieList
              movies={trendingMovies}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              searchQuery=""
            />
          </section>
        )}

        {/* TMDB Trending */}
        {!query && !loadingTmdb && tmdbTrending.length > 0 && (
          <section className="my-8">
            <h2 className="text-2xl font-semibold mb-4">🌟 Trending on TMDB</h2>
            <MovieList
              movies={tmdbTrending}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              searchQuery=""
            />
          </section>
        )}

        {/* Search Results */}
        {isLoading ? (
          <SkeletonList />
        ) : (
          <>
            {movies.length > 0 && (
              <p className="text-center text-gray-600 mb-4">
                Showing {movies.length} of {totalResults} results
              </p>
            )}
            <MovieList
              movies={movies}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              searchQuery={query}
            />
          </>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-2 text-center">
              ❤️ Your Favorites
            </h2>
            <MovieList
              movies={favorites}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          </section>
        )}
      </div>
    </main>
  );
}

export default Home;
