import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTrendingMovies } from "../hooks/useTrendingMovies";
import MovieList from "../components/MovieList";

const allGenres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Documentary", "Drama", "Family", "Fantasy", "History",
  "Horror", "Music", "Mystery", "Romance", "Science Fiction",
  "TV Movie", "Thriller", "War", "Western"
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PopularMovies() {
  const query = useQuery();
  const type = query.get("type") || "movie";

  const {
    fetchPopularMovies,
    popularMovies,
    loadingTrending,
    errorTrending
  } = useTrendingMovies();

  const [favorites, setFavorites] = useState([]);
  const [seenFilter, setSeenFilter] = useState("all");
  const [releaseFrom, setReleaseFrom] = useState("");
  const [releaseTo, setReleaseTo] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [page, setPage] = useState(1); // Pagination

  useEffect(() => {
    fetchPopularMovies(page, type);
  }, [page, type]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    setFilteredMovies(popularMovies);
  }, [popularMovies]);

  const toggleFavorite = (movie) => {
    const exists = favorites.some(fav => fav.id === movie.id);
    const updated = exists
      ? favorites.filter(fav => fav.id !== movie.id)
      : [...favorites, movie];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const applyFilters = () => {
    const movies = popularMovies.filter((movie) => {
      const releaseDate = new Date(movie.release_date);
      const fromDate = releaseFrom ? new Date(releaseFrom) : null;
      const toDate = releaseTo ? new Date(releaseTo) : null;

      const matchesSeen =
        seenFilter === "all" ||
        (seenFilter === "seen" && favorites.some(f => f.id === movie.id)) ||
        (seenFilter === "unseen" && !favorites.some(f => f.id === movie.id));

      const matchesRelease =
        (!fromDate || releaseDate >= fromDate) &&
        (!toDate || releaseDate <= toDate);

      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) =>
          movie.genre_names?.includes(genre)
        );

      return matchesSeen && matchesRelease && matchesGenre;
    });

    setFilteredMovies(movies);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const heading =
    type === "tv" ? "🔥 Popular TV Shows" :
    type === "person" ? "🌟 Popular People" :
    "🔥 Popular Movies";

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 space-y-8 lg:space-y-0 lg:space-x-8">
      {/* Movie List */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-4">{heading}</h2>
        {loadingTrending && page === 1 && <p>Loading...</p>}
        {errorTrending && <p className="text-red-500">{errorTrending}</p>}

        <MovieList
          movies={filteredMovies}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />

        {!loadingTrending && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Filters Panel (hide for people) */}
      {type !== "person" && (
        <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-lg p-6 sticky top-24 h-fit">
          <h3 className="text-xl font-semibold mb-4">🎛 Filters</h3>

          {/* Seen Filter */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Watch Status</label>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1"
              value={seenFilter}
              onChange={(e) => setSeenFilter(e.target.value)}
            >
              <option value="all">Everything</option>
              <option value="unseen">Movies I Haven't Seen</option>
              <option value="seen">Movies I Have Seen</option>
            </select>
          </div>

          {/* Release Date Range */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Release Date</label>
            <div className="flex space-x-2">
              <input
                type="date"
                className="w-1/2 border border-gray-300 rounded px-2 py-1"
                value={releaseFrom}
                onChange={(e) => setReleaseFrom(e.target.value)}
                placeholder="From"
              />
              <input
                type="date"
                className="w-1/2 border border-gray-300 rounded px-2 py-1"
                value={releaseTo}
                onChange={(e) => setReleaseTo(e.target.value)}
                placeholder="To"
              />
            </div>
          </div>

          {/* Genres */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Genres</label>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {allGenres.map((genre) => (
                <label key={genre} className="block text-sm">
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() =>
                      setSelectedGenres((prev) =>
                        prev.includes(genre)
                          ? prev.filter((g) => g !== genre)
                          : [...prev, genre]
                      )
                    }
                    className="mr-2"
                  />
                  {genre}
                </label>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={applyFilters}
            className="w-full bg-[#032541] text-white py-2 rounded-lg hover:bg-[#04375c] transition"
          >
            Search
          </button>
        </aside>
      )}
    </div>
  );
}
