// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const movieLinks = {
    Popular: "/movies/popular",
    "Now Playing": "/movies/now-playing",
    Upcoming: "/movies/upcoming",
    "Top Rated": "/movies/top-rated",
  };

  return (
    <nav className="bg-[#032541] text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link to="/">TMDB</Link>
      </h1>

      <ul className="flex items-center space-x-6">
        <li className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="hover:underline"
          >
            Movies
          </button>
          {dropdownOpen && (
            <ul className="absolute left-0 mt-2 bg-white text-black shadow rounded py-2 w-40 z-10">
              {Object.entries(movieLinks).map(([label, path]) => (
                <li key={label} className="px-4 py-2 hover:bg-gray-100">
                  <Link to={path}>{label}</Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* ✅ Updated routes to match your Router config */}
        <li>
          <Link to="/tv/popular?type=tv" className="hover:underline">
            TV Shows
          </Link>
        </li>
        <li>
          <Link to="/person/popular?type=person" className="hover:underline">
            People
          </Link>
        </li>
        <li>
          <Link to="/favorites" className="hover:underline">
            Favorites
          </Link>
        </li>
      </ul>
    </nav>
  );
}
