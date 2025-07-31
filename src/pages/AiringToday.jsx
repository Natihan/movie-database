import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import SidebarFilters from "../components/SidebarFilters";  // import your new sidebar
import { useTrendingMovies } from "../hooks/useTrendingMovies";

export default function AiringToday() {
  const {
    airingTodayShows,
    loadingAiringToday,
    errorAiringToday,
    fetchAiringTodayShows,
  } = useTrendingMovies();

  const [favorites, setFavorites] = useState([]);
  const [seenFilter, setSeenFilter] = useState("all");
  const [releaseFrom, setReleaseFrom] = useState("");
  const [releaseTo, setReleaseTo] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);

  useEffect(() => {
    fetchAiringTodayShows();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  // Filtering logic
  const applyFilters = () => {
    const filtered = airingTodayShows.filter((show) => {
      const releaseDate = new Date(show.first_air_date || show.release_date);
      const fromDate = releaseFrom ? new Date(releaseFrom) : null;
      const toDate = releaseTo ? new Date(releaseTo) : null;

      const matchesSeen =
        seenFilter === "all" ||
        (seenFilter === "seen" && favorites.some(f => f.id === show.id)) ||
        (seenFilter === "unseen" && !favorites.some(f => f.id === show.id));

      const matchesRelease =
        (!fromDate || releaseDate >= fromDate) &&
        (!toDate || releaseDate <= toDate);

      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) =>
          show.genre_names?.includes(genre)
        );

      return matchesSeen && matchesRelease && matchesGenre;
    });

    setFilteredShows(filtered);
  };

  // Set filteredShows initially when airingTodayShows changes
  useEffect(() => {
    setFilteredShows(airingTodayShows);
  }, [airingTodayShows]);

  const toggleFavorite = (show) => {
    const exists = favorites.some(fav => fav.id === show.id);
    const updated = exists
      ? favorites.filter(fav => fav.id !== show.id)
      : [...favorites, show];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 space-y-8 lg:space-y-0 lg:space-x-8">
      {/* Main Content */}
      <main className="flex-1">
        <h2 className="text-2xl font-bold mb-4">TV Shows Airing Today</h2>
        {loadingAiringToday && <p>Loading...</p>}
        {errorAiringToday && <p className="text-red-500">{errorAiringToday}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredShows.map((show) => (
            <MovieCard key={show.id} movie={show} type="tv" toggleFavorite={toggleFavorite} />
          ))}
        </div>
      </main>

      {/* Sidebar Filters */}
      <SidebarFilters
        seenFilter={seenFilter}
        setSeenFilter={setSeenFilter}
        releaseFrom={releaseFrom}
        setReleaseFrom={setReleaseFrom}
        releaseTo={releaseTo}
        setReleaseTo={setReleaseTo}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        onApplyFilters={applyFilters}
      />
    </div>
  );
}
