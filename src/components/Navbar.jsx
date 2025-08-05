import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) =>
    setOpenDropdown((prev) => (prev === name ? null : name));

  // Dropdown with blurred translucent backdrop behind text
  const renderDropdown = (links) => (
    <ul className="absolute left-6 mt-2 w-44 z-10 rounded overflow-hidden">
      {/* Backdrop blur + translucent bg */}
      <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-md -z-10 rounded"></div>
      {Object.entries(links).map(([label, path]) => (
        <li key={label} className="relative px-4 py-2 hover:bg-gray-100 z-20">
          <Link
            to={path}
            onClick={() => {
              setOpenDropdown(null);
              setMobileMenuOpen(false);
            }}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setMobileMenuOpen(false);
      setProfileMenuOpen(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const getProfileImage = () => {
    if (user?.photoURL) return user.photoURL;
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };

  const profileLinks = [
    { label: "Home", to: "/" },
    { label: "Profile", to: "/profile" },
    { label: "Reviews", to: "/profile/reviews" },
    { label: "Watched List", to: "/profile/watchlist" },
    { label: "Likes", to: "/profile/likes" },
  ];

  return (
    <nav
      className="bg-blue-950 text-white px-6 py-4 flex justify-between items-center relative"
      ref={dropdownRef}
    >
      <h1 className="text-2xl font-bold">
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          TMDB
        </Link>
      </h1>

      {/* Hamburger menu */}
      <button
        className="lg:hidden text-white text-3xl"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        ☰
      </button>

      {/* Main nav links */}
      <ul
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } lg:flex lg:items-center lg:space-x-6 absolute lg:static top-full left-0 w-full lg:w-auto bg-blue-950 text-white z-50 p-4 lg:p-0 space-y-4 lg:space-y-0`}
      >
        <li className="relative">
          <button
            onClick={() => toggleDropdown("movies")}
            className="hover:underline"
          >
            Movies
          </button>
          {openDropdown === "movies" && renderDropdown(movieLinks)}
        </li>

        <li className="relative">
          <button
            onClick={() => toggleDropdown("tv")}
            className="hover:underline"
          >
            TV Shows
          </button>
          {openDropdown === "tv" && renderDropdown(tvLinks)}
        </li>

        <li className="relative">
          <button
            onClick={() => toggleDropdown("people")}
            className="hover:underline"
          >
            People
          </button>
          {openDropdown === "people" && renderDropdown(peopleLinks)}
        </li>

        <li>
          <Link
            to="/profile/favorites"
            className="hover:underline"
            onClick={() => setMobileMenuOpen(false)}
          >
            Favorites
          </Link>
        </li>

        <li>
          <Link
            to="/profile/watchlist"
            className="hover:underline"
            onClick={() => setMobileMenuOpen(false)}
          >
            Watchlist
          </Link>
        </li>

        {!user ? (
          <>
            <li>
              <Link
                to="/login"
                className="hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </li>
          </>
        ) : (
          <li className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="focus:outline-none"
            >
              <img
                src={getProfileImage()}
                alt={user?.displayName || "User profile"}
                className="w-8 h-8 rounded-full object-cover border border-white"
              />
            </button>

            {profileMenuOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg z-50">
                {profileLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
