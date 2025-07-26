import { useState, useEffect } from "react";

function SearchBar({ onSearch, initialQuery = "", minimal = false }) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex justify-center px-4 ${
        minimal ? "py-2" : "mt-32 mb-6"
      }`}
    >
      <div className={`relative w-full max-w-4xl`}>
        {minimal && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {/* Search icon SVG */}
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className={`w-full h-11 pl-6 pr-36 rounded-full border ${
            minimal
              ? "border-transparent bg-transparent text-gray-600 placeholder-gray-400 focus:ring-0 focus:outline-none"
              : "border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          } ${minimal ? "pl-10" : ""}`}
          style={{ transition: "background-color 0.3s" }}
        />
        {!minimal && (
          <button
            type="submit"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-300 to-white hover:from-purple-400 hover:to-white text-white px-8 py-2 rounded-full shadow-lg font-light text-base tracking-wide transition"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
}

export default SearchBar;
