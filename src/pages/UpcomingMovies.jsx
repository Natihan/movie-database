import React, { useEffect, useState } from "react";
import { useTrendingMovies } from "../hooks/useTrendingMovies";

export default function UpcomingMovies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);

  const {
    upcomingMovies,
    loadingUpcoming,
    errorUpcoming,
    fetchUpcomingMovies,
    genreMap,
  } = useTrendingMovies();

  useEffect(() => {
    if (Object.keys(genreMap).length === 0) return;
    fetchUpcomingMovies(1);
  }, [genreMap]);

  const filteredMovies = upcomingMovies.filter((movie) => {
    const matchesGenre = selectedGenre
      ? movie.genre_names.includes(genreMap[selectedGenre])
      : true;
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-72 p-6 border-r bg-gray-50 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Search Movie</label>
          <input
            type="text"
            placeholder="Search..."
            className="w-full border p-2 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6">Upcoming Movies</h1>

        {loadingUpcoming && <p>Loading movies...</p>}
        {errorUpcoming && <p className="text-red-500">{errorUpcoming}</p>}

        {!loadingUpcoming && filteredMovies.length === 0 && (
          <p>No movies found matching your filters.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="border rounded overflow-hidden shadow hover:shadow-lg transition"
            >
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />
              ) : (
                <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="p-3">
                <h3 className="font-bold text-lg truncate">{movie.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{movie.release_date}</p>
                <p className="text-sm">
                  Genres: {movie.genre_names.join(", ") || "N/A"}
                </p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    movie.title + " trailer"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-600 hover:underline text-sm"
                >
                  Watch Trailer
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
