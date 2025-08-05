import React from "react";

export default function SidebarFilters({
  genres = [],
  selectedGenres,
  setSelectedGenres,
  seenFilter,
  setSeenFilter,
  releaseFrom,
  setReleaseFrom,
  releaseTo,
  setReleaseTo,
  onApplyFilters,
}) {
  return (
    <aside
      className="w-full lg:w-80 bg-[#032541] text-white rounded-2xl shadow-lg p-6 h-fit transition-all duration-300"
      aria-label="Movie filters sidebar"
    >
      <h3 className="text-xl font-semibold mb-6">🎛 Filters</h3>

      {/* Watch Status */}
      <div className="mb-6">
        <label htmlFor="seen-filter" className="block font-medium mb-2">
          Watch Status
        </label>
        <select
          id="seen-filter"
          className="w-full bg-[#011d30] text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
          value={seenFilter}
          onChange={(e) => setSeenFilter(e.target.value)}
        >
          <option value="all">Everything</option>
          <option value="unseen">Shows I Haven't Seen</option>
          <option value="seen">Shows I Have Seen</option>
        </select>
      </div>

      {/* Release Date Range */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Release Date</label>
        <div className="flex space-x-3">
          <input
            type="date"
            className="w-1/2 bg-[#011d30] text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
            value={releaseFrom}
            onChange={(e) => setReleaseFrom(e.target.value)}
          />
          <input
            type="date"
            className="w-1/2 bg-[#011d30] text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
            value={releaseTo}
            onChange={(e) => setReleaseTo(e.target.value)}
          />
        </div>
      </div>

      {/* Genres */}
      <fieldset className="mb-8">
        <legend className="block font-medium mb-3">Genres</legend>
        <div
          className="max-h-48 overflow-y-auto space-y-2 rounded border border-gray-600 p-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 bg-[#011d30] text-white"
          tabIndex={0}
        >
          {genres.map((genre) => (
            <label
              key={genre.id}
              className="flex items-center text-sm cursor-pointer select-none"
              htmlFor={`genre-${genre.id}`}
            >
              <input
                id={`genre-${genre.id}`}
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={() =>
                  setSelectedGenres((prev) =>
                    prev.includes(genre.id)
                      ? prev.filter((g) => g !== genre.id)
                      : [...prev, genre.id]
                  )
                }
                className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#011d30] text-[#032541] focus:ring-2 focus:ring-white"
              />
              {genre.name}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Search Button */}
      <button
        onClick={onApplyFilters}
        className="w-full bg-white text-[#032541] py-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white transition"
      >
        Search
      </button>
    </aside>
  );
}
