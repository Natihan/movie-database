// src/components/SidebarFilters.jsx
import React from "react";

const allGenres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Documentary", "Drama", "Family", "Fantasy", "History",
  "Horror", "Music", "Mystery", "Romance", "Science Fiction",
  "TV Movie", "Thriller", "War", "Western"
];

export default function SidebarFilters({
  selectedGenres, setSelectedGenres,
  seenFilter, setSeenFilter,
  releaseFrom, setReleaseFrom,
  releaseTo, setReleaseTo,
  onApplyFilters,
}) {
  return (
    <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-lg p-6 sticky top-24 h-fit">
      <h3 className="text-xl font-semibold mb-4">🎛 Filters</h3>

      {/* Watch Status */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Watch Status</label>
        <select
          className="w-full border border-gray-300 rounded px-2 py-1"
          value={seenFilter}
          onChange={(e) => setSeenFilter(e.target.value)}
        >
          <option value="all">Everything</option>
          <option value="unseen">Shows I Haven't Seen</option>
          <option value="seen">Shows I Have Seen</option>
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

      {/* Apply Filters Button */}
      <button
        onClick={onApplyFilters}
        className="w-full bg-[#032541] text-white py-2 rounded-lg hover:bg-[#04375c] transition"
      >
        Search
      </button>
    </aside>
  );
}
