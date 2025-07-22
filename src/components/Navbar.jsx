// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
              {["Popular", "Now Playing", "Upcoming", "Top Rated"].map((item) => (
                <li key={item} className="px-4 py-2 hover:bg-gray-100">
                  <Link to="#">{item}</Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li>
          <Link to="#" className="hover:underline">TV Shows</Link>
        </li>
        <li>
          <Link to="#" className="hover:underline">People</Link>
        </li>
        <li>
          <Link to="/favorites" className="hover:underline">Favorites</Link>
        </li>
      </ul>
    </nav>
  );
}
