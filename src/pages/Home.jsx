import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import SkeletonList from "../components/SkeletonList";
import TrailerCard from "../components/TrailerCard";
import { useMovies } from "../hooks/useMovies";
import { useTrendingMovies } from "../hooks/useTrendingMovies";
import { useTrendingTmdb } from "../hooks/useTrendingTmdb";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function Home() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [searchParams] = useSearchParams();
  const [heroIndex, setHeroIndex] = useState(0);
  const [tmdbTimeframe, setTmdbTimeframe] = useState("week");
  const [trailerCategory, setTrailerCategory] = useState("popular");
  const [trailerMovies, setTrailerMovies] = useState([]);
  const [trailerBgIndex, setTrailerBgIndex] = useState(0);

  const { movies, error, isLoading, totalResults, searchMovies } = useMovies();
  const {
    loadingTrending,
    errorTrending,
    popularMovies,
    inTheaterMovies,
    fetchPopularMovies,
    fetchInTheaterMovies,
  } = useTrendingMovies();
  const { tmdbTrending, loadingTmdb, errorTmdb, fetchTrending } = useTrendingTmdb();

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

  useEffect(() => {
    fetchTrending(tmdbTimeframe);
  }, [tmdbTimeframe]);

  useEffect(() => {
    if (trailerCategory === "popular") {
      fetchPopularMovies();
    } else {
      fetchInTheaterMovies();
    }
  }, [trailerCategory]);

  useEffect(() => {
    if (trailerCategory === "popular" && popularMovies.length > 0) {
      setTrailerMovies(popularMovies);
    } else if (trailerCategory === "intheaters" && inTheaterMovies.length > 0) {
      setTrailerMovies(inTheaterMovies);
    }
  }, [popularMovies, inTheaterMovies, trailerCategory]);

  useEffect(() => {
    if (!trailerMovies.length) return;
    const interval = setInterval(() => {
      setTrailerBgIndex((prev) => (prev + 1) % trailerMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [trailerMovies]);

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

  const trailerBgMovie = trailerMovies[trailerBgIndex];
  const trailerBgImage = trailerBgMovie?.backdrop_path
    ? `${TMDB_IMAGE_BASE}${trailerBgMovie.backdrop_path}`
    : "/no-image.png";

  return (
    <main className="w-full bg-gray-50">
      <header
        className="w-full relative py-20 text-center overflow-hidden"
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
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-3">
            Welcome
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Movies, TV shows and People to discover.
          </p>
          <SearchBar onSearch={handleSearch} initialQuery={query} />
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-0 py-10">
        {(error || errorTrending || errorTmdb) && (
          <p className="text-red-500 text-center my-4">
            {error || errorTrending || errorTmdb}
          </p>
        )}

        {!query && !loadingTmdb && tmdbTrending.length > 0 && (
          <section className="my-8 px-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-2xl font-semibold">🌟 Trending</h2>
              <div className="inline-flex rounded-full overflow-hidden border border-gray-300 shadow-sm">
                <button
                  onClick={() => setTmdbTimeframe("day")}
                  className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    tmdbTimeframe === "day"
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  🌞 Today
                </button>
                <button
                  onClick={() => setTmdbTimeframe("week")}
                  className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    tmdbTimeframe === "week"
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  📅 This Week
                </button>
              </div>
            </div>
            <MovieList
              movies={tmdbTrending}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              horizontal
            />
          </section>
        )}

        {!query && (
          <section
            className="relative my-10 overflow-hidden"
            aria-label="Movie Trailers"
            style={{
              backgroundImage: `url(${trailerBgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "background-image 1s ease-in-out",
            }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-20 max-w-7xl mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                <h2 className="text-2xl font-semibold text-white">🎬 Trailers</h2>
                <div className="inline-flex rounded-full overflow-hidden border border-gray-300 shadow-sm">
                  <button
                    onClick={() => setTrailerCategory("popular")}
                    className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                      trailerCategory === "popular"
                        ? "bg-purple-600 text-white"
                        : "text-gray-200 bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    Popular
                  </button>
                  <button
                    onClick={() => setTrailerCategory("intheaters")}
                    className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                      trailerCategory === "intheaters"
                        ? "bg-purple-600 text-white"
                        : "text-gray-200 bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    In Theaters
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 overflow-x-auto trailer-scroll pb-32">
                {trailerMovies.length === 0 && (
                  <p className="text-gray-300">Loading trailers...</p>
                )}
                {trailerMovies.map((movie) => (
                  <TrailerCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          </section>
        )}

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

        {favorites.length > 0 && (
          <section className="mt-10 px-4">
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
