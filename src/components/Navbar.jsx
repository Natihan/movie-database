import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const movieLinks = {
    Popular: "/movies/popular",
    "Now Playing": "/movies/now-playing",
    Upcoming: "/movies/upcoming",
    "Top Rated": "/movies/top-rated",
  };

  const tvLinks = {
    Popular: "/tv/popular",
    "Airing Today": "/tv/airing-today",
    "On TV": "/tv/on-tv",
    "Top Rated": "/tv/top-rated",
  };

  const peopleLinks = {
    "Popular People": "/person/popular",
  };

  const renderDropdown = (links) => (
    <ul className="absolute left-0 mt-2 bg-white text-black shadow rounded py-2 w-44 z-10">
      {Object.entries(links).map(([label, path]) => (
        <li key={label} className="px-4 py-2 hover:bg-gray-100">
          <Link to={path} onClick={() => setOpenDropdown(null)}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="bg-[#032541] text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link to="/">TMDB</Link>
      </h1>

      <ul className="flex items-center space-x-6 relative">
        {/* Movies Dropdown */}
        <li className="relative">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "movies" ? null : "movies")
            }
            className="hover:underline"
          >
            Movies
          </button>
          {openDropdown === "movies" && renderDropdown(movieLinks)}
        </li>

        {/* TV Shows Dropdown */}
        <li className="relative">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "tv" ? null : "tv")
            }
            className="hover:underline"
          >
            TV Shows
          </button>
          {openDropdown === "tv" && renderDropdown(tvLinks)}
        </li>

        {/* People Dropdown */}
        <li className="relative">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "people" ? null : "people")
            }
            className="hover:underline"
          >
            People
          </button>
          {openDropdown === "people" && renderDropdown(peopleLinks)}
        </li>

        {/* Favorites */}
        <li>
          <Link to="/favorites" className="hover:underline">
            Favorites
          </Link>
        </li>
      </ul>
    </nav>
  );
}
