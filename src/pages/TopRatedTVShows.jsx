// src/pages/TopRatedTVShows.jsx
import React, { useEffect, useState } from "react";
import { useTrendingMovies } from "../hooks/useTrendingMovies";

export default function TopRatedTVShows() {
  const {
    popularMovies,
    loadingPopular,
    errorPopular,
    fetchPopularMovies,
    genreMap,
  } = useTrendingMovies();

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [watchStatus, setWatchStatus] = useState("all");
  const [releaseYearFilter, setReleaseYearFilter] = useState("");

  const [watchedShowIds] = useState(() => new Set([1399, 1412, 82856])); // Example TV IDs

  useEffect(() => {
    fetchPopularMovies(1, "tv", "top_rated");
  }, []);

  const filteredShows = popularMovies.filter((show) => {
    const matchesGenre = selectedGenre
      ? show.genre_names.includes(genreMap[selectedGenre])
      : true;

    const showYear = show.first_air_date
      ? parseInt(show.first_air_date.slice(0, 4), 10)
      : null;

    const matchesYear = releaseYearFilter
      ? showYear && showYear >= parseInt(releaseYearFilter, 10)
      : true;

    const isWatched = watchedShowIds.has(show.id);
    const matchesWatch =
      watchStatus === "watched"
        ? isWatched
        : watchStatus === "unwatched"
        ? !isWatched
        : true;

    return matchesGenre && matchesWatch && matchesYear;
  });

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-72 p-6 border-r bg-gray-50 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Genre</label>
          <select
            onChange={(e) =>
              setSelectedGenre(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full border p-2 rounded"
          >
            <option value="">All Genres</option>
            {Object.entries(genreMap).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Watch Status</label>
          <select
            onChange={(e) => setWatchStatus(e.target.value)}
            value={watchStatus}
            className="w-full border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="watched">Watched</option>
            <option value="unwatched">Unwatched</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Released After Year</label>
          <input
            type="number"
            placeholder="e.g. 2015"
            className="w-full border p-2 rounded"
            value={releaseYearFilter}
            onChange={(e) => setReleaseYearFilter(e.target.value)}
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6">Top Rated TV Shows</h1>

        {loadingPopular && <p>Loading shows...</p>}
        {errorPopular && <p className="text-red-500">{errorPopular}</p>}

        {filteredShows.length === 0 && (
          <p className="text-gray-500">No shows match your filters.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredShows.map((show) => (
            <div
              key={show.id}
              className="border rounded overflow-hidden shadow hover:shadow-lg transition"
            >
              {show.poster_url ? (
                <img
                  src={show.poster_url}
                  alt={show.name}
                  className="w-full h-72 object-cover"
                />
              ) : (
                <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="p-3">
                <h3 className="font-bold text-lg truncate">{show.name}</h3>
                <p className="text-sm text-gray-600">{show.first_air_date}</p>
                <p className="text-sm mb-1">
                  Genres: {show.genre_names.join(", ") || "N/A"}
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${
                    watchedShowIds.has(show.id)
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {watchedShowIds.has(show.id) ? "Watched" : "Unwatched"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
