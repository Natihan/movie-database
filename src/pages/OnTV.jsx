import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import SidebarFilters from "../components/SidebarFilters";
import { useTrendingMovies } from "../hooks/useTrendingMovies";

export default function OnTV() {
  const {
    onTVShows,
    loadingOnTV,
    errorOnTV,
    fetchOnTVShows,
    genreMap,
  } = useTrendingMovies();

  const [favorites, setFavorites] = useState([]);
  const [seenFilter, setSeenFilter] = useState("all");
  const [releaseFrom, setReleaseFrom] = useState("");
  const [releaseTo, setReleaseTo] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Separate raw shows with genres and filtered shows
  const [showsWithGenres, setShowsWithGenres] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);

  // Fetch shows once on mount and whenever genreMap is ready
  useEffect(() => {
    // Only fetch if genres are loaded
    if (Object.keys(genreMap).length > 0) {
      fetchOnTVShows();
    }
  }, [genreMap]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  // When onTVShows or genreMap changes, enrich shows with genre names
  useEffect(() => {
    if (onTVShows.length === 0) {
      setShowsWithGenres([]);
      setFilteredShows([]);
      return;
    }

    const shows = onTVShows.map((show) => ({
      ...show,
      genre_names: show.genre_ids?.map((id) => genreMap[id]).filter(Boolean) || [],
    }));

    setShowsWithGenres(shows);
    setFilteredShows(shows); // Initialize filtered shows to all shows
  }, [onTVShows, genreMap]);

  // Apply filters whenever any filter or favorites or showsWithGenres changes
  useEffect(() => {
    const filtered = showsWithGenres.filter((show) => {
      const releaseDate = new Date(show.first_air_date || show.release_date || "");
      const fromDate = releaseFrom ? new Date(releaseFrom) : null;
      const toDate = releaseTo ? new Date(releaseTo) : null;

      const matchesSeen =
        seenFilter === "all" ||
        (seenFilter === "seen" && favorites.some((f) => f.id === show.id)) ||
        (seenFilter === "unseen" && !favorites.some((f) => f.id === show.id));

      const matchesRelease =
        (!fromDate || releaseDate >= fromDate) &&
        (!toDate || releaseDate <= toDate);

      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) => show.genre_names.includes(genre));

      return matchesSeen && matchesRelease && matchesGenre;
    });

    setFilteredShows(filtered);
  }, [seenFilter, releaseFrom, releaseTo, selectedGenres, favorites, showsWithGenres]);

  // Toggle favorite and sync localStorage
  const toggleFavorite = (show) => {
    const exists = favorites.some((fav) => fav.id === show.id);
    const updated = exists
      ? favorites.filter((fav) => fav.id !== show.id)
      : [...favorites, show];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 space-y-8 lg:space-y-0 lg:space-x-8">
      {/* Main Content */}
      <main className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Currently On TV</h2>
        {loadingOnTV && <p>Loading...</p>}
        {errorOnTV && <p className="text-red-500">{errorOnTV}</p>}

        {!loadingOnTV && filteredShows.length === 0 && <p>No shows found.</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredShows.map((show) => (
            <MovieCard
              key={show.id}
              movie={show}
              type="tv"
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.some((fav) => fav.id === show.id)}
            />
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
        onApplyFilters={() => {}} // filters apply automatically
        genres={Object.values(genreMap)}
      />
    </div>
  );
}
