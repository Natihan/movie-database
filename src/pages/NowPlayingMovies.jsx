import React, { useEffect, useState, useCallback } from "react";
import { useTrendingMovies } from "../hooks/useTrendingMovies";
import SidebarFilters from "../components/SidebarFilters";
import Drawer from "../components/Drawer";
import MovieList from "../components/MovieList";

export default function NowPlayingMovies() {
  const {
    inTheaterMovies,
    loadingInTheater,
    errorInTheater,
    genreMap,
    fetchInTheaterMovies,
  } = useTrendingMovies();

  const [userRegion, setUserRegion] = useState("US");
  const [favorites, setFavorites] = useState([]);
  const [seenFilter, setSeenFilter] = useState("all");
  const [releaseFrom, setReleaseFrom] = useState("");
  const [releaseTo, setReleaseTo] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const MOVIES_PER_PAGE = 20;

  // Fetch region based on geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      fetchInTheaterMovies({ region: "US" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const countryCode = data.countryCode || "US";
          setUserRegion(countryCode);
          fetchInTheaterMovies({ region: countryCode });
        } catch {
          setUserRegion("US");
          fetchInTheaterMovies({ region: "US" });
        }
      },
      () => {
        setUserRegion("US");
        fetchInTheaterMovies({ region: "US" });
      }
    );
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    applyFilters();
  }, [inTheaterMovies, favorites, selectedGenres, releaseFrom, releaseTo, seenFilter]);

  const applyFilters = useCallback(() => {
    const fromDate = releaseFrom ? new Date(releaseFrom) : null;
    const toDate = releaseTo ? new Date(releaseTo) : null;

    const movies = inTheaterMovies.filter((movie) => {
      if (!movie.release_date) return false;

      const releaseDate = new Date(movie.release_date);

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
          movie.genre_ids?.includes(parseInt(genre))
        );

      return matchesSeen && matchesRelease && matchesGenre;
    });

    setFilteredMovies(movies);
    setPage(1);
  }, [inTheaterMovies, favorites, selectedGenres, releaseFrom, releaseTo, seenFilter]);

  const toggleFavorite = (movie) => {
    const exists = favorites.some(fav => fav.id === movie.id);
    const updated = exists
      ? favorites.filter(fav => fav.id !== movie.id)
      : [...favorites, movie];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const visibleMovies = filteredMovies.slice(0, page * MOVIES_PER_PAGE);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const genreOptions = Object.entries(genreMap).map(([id, name]) => ({ id, name }));

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 space-y-8 lg:space-y-0 lg:space-x-8">
      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h2 className="text-2xl font-bold">🎬 Now Playing Near You</h2>
          <button
            className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm"
            onClick={() => setShowFiltersMobile(true)}
            aria-label="Show filters"
          >
            Show Filters
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-4 hidden lg:block">🎬 Now Playing Near You</h2>

        {loadingInTheater && page === 1 && <p>Loading movies...</p>}
        {errorInTheater && <p className="text-red-600">{errorInTheater}</p>}

        <MovieList
          movies={visibleMovies}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />

        {!loadingInTheater && visibleMovies.length < filteredMovies.length && (
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

      {/* Sidebar Filters */}
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
