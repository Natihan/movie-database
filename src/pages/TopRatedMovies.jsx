import React, { useEffect, useState, useCallback } from "react";
import { useTrendingMovies } from "../hooks/useTrendingMovies";
import MovieList from "../components/MovieList";
import SidebarFilters from "../components/SidebarFilters";
import Drawer from "../components/Drawer";

export default function TopRatedMovies() {
  const {
    popularMovies,
    loadingPopular,
    errorPopular,
    fetchPopularMovies,
    genreMap,
  } = useTrendingMovies();

  const [favorites, setFavorites] = useState([]);
  const [seenFilter, setSeenFilter] = useState("all"); // all, seen, unseen
  const [releaseFrom, setReleaseFrom] = useState("");
  const [releaseTo, setReleaseTo] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  // Prevent scroll when mobile drawer is open
  useEffect(() => {
    if (showFiltersMobile) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showFiltersMobile]);

  // Fetch top rated movies when page changes
  useEffect(() => {
    fetchPopularMovies(page, "movie", "top_rated"); // third param is category/type for top rated
  }, [page, fetchPopularMovies]);

  // Initially show all fetched movies
  useEffect(() => {
    setFilteredMovies(popularMovies);
  }, [popularMovies]);

  // Apply filters
  const applyFilters = useCallback(() => {
    setPage(1); // reset pagination on filter apply

    const filtered = popularMovies.filter((movie) => {
      if (!movie.release_date) return false;

      const releaseDate = new Date(movie.release_date);
      const fromDate = releaseFrom ? new Date(releaseFrom) : null;
      const toDate = releaseTo ? new Date(releaseTo) : null;

      const matchesSeen =
        seenFilter === "all" ||
        (seenFilter === "seen" && favorites.some((f) => f.id === movie.id)) ||
        (seenFilter === "unseen" && !favorites.some((f) => f.id === movie.id));

      const matchesRelease =
        (!fromDate || releaseDate >= fromDate) &&
        (!toDate || releaseDate <= toDate);

      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) =>
          movie.genre_ids?.includes(Number(genre))
        );

      return matchesSeen && matchesRelease && matchesGenre;
    });

    setFilteredMovies(filtered);
  }, [popularMovies, releaseFrom, releaseTo, selectedGenres, seenFilter, favorites]);

  // Toggle favorite movie
  const toggleFavorite = (movie) => {
    const exists = favorites.some((fav) => fav.id === movie.id);
    const updated = exists
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Load more movies (pagination)
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const genreOptions = Object.entries(genreMap).map(([id, name]) => ({
    id: Number(id),
    name,
  }));

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 space-y-8 lg:space-y-0 lg:space-x-8">
      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h2 className="text-2xl font-bold">⭐ Top Rated Movies</h2>
          <button
            className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm"
            onClick={() => setShowFiltersMobile(true)}
            aria-label="Show filters"
          >
            Show Filters
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-4 hidden lg:block">⭐ Top Rated Movies</h2>

        {loadingPopular && page === 1 && <p>Loading...</p>}
        {errorPopular && <p className="text-red-500">{errorPopular}</p>}

        <MovieList
          movies={filteredMovies}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />

        {!loadingPopular && filteredMovies.length > 0 && (
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

      {/* Sidebar filters for desktop */}
      <div className="hidden lg:block">
        <SidebarFilters
          genres={genreOptions}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          seenFilter={seenFilter}
          setSeenFilter={setSeenFilter}
          releaseFrom={releaseFrom}
          setReleaseFrom={setReleaseFrom}
          releaseTo={releaseTo}
          setReleaseTo={setReleaseTo}
          onApplyFilters={applyFilters}
        />
      </div>

      {/* Drawer filters for mobile */}
      <Drawer
        isOpen={showFiltersMobile}
        onClose={() => setShowFiltersMobile(false)}
        title="Filters"
        from="left"
        backdropClassName="bg-black bg-opacity-90"
      >
        <SidebarFilters
          genres={genreOptions}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          seenFilter={seenFilter}
          setSeenFilter={setSeenFilter}
          releaseFrom={releaseFrom}
          setReleaseFrom={setReleaseFrom}
          releaseTo={releaseTo}
          setReleaseTo={setReleaseTo}
          onApplyFilters={() => {
            applyFilters();
            setShowFiltersMobile(false);
          }}
        />
      </Drawer>
    </div>
  );
}
