import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

function Layout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const dropdownStyle =
    "absolute left-0 top-full mt-2 w-48 bg-white border rounded shadow-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out";

  return (
    <>
      <nav className="bg-blue-950 shadow sticky top-0 z-50 text-white w-full">
        <div className="flex items-center justify-between px-6 py-6">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            🎬 MovieDB
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 font-medium text-lg">
            {/* Movies */}
            <li className="relative group">
              <span className="hover:text-blue-400 cursor-pointer">Movies</span>
              <div className={dropdownStyle}>
                <Link to="/movies/popular" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Popular
                </Link>
                <Link to="/movies/now-playing" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Now Playing
                </Link>
                <Link to="/movies/upcoming" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Upcoming
                </Link>
                <Link to="/movies/top-rated" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Top Rated
                </Link>
              </div>
            </li>

            {/* TV Shows */}
            <li className="relative group">
              <span className="hover:text-blue-400 cursor-pointer">TV Shows</span>
              <div className={dropdownStyle}>
                <Link to="/tv/popular" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Popular
                </Link>
                <Link to="/tv/airing-today" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Airing Today
                </Link>
                <Link to="/tv/on-tv" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  On TV
                </Link>
                <Link to="/tv/top-rated" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Top Rated
                </Link>
              </div>
            </li>

            {/* People */}
            <li className="relative group">
              <span className="hover:text-blue-400 cursor-pointer">People</span>
              <div className={dropdownStyle}>
                <Link to="/person/popular" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Popular People
                </Link>
              </div>
            </li>

            {/* More */}
            <li className="relative group">
              <span className="hover:text-blue-400 cursor-pointer">More</span>
              <div className={dropdownStyle}>
                <Link to="/favorites" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Favorites
                </Link>
                <Link to="/watchlist" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Watchlist
                </Link>
                <Link to="/reviews" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Reviews
                </Link>
                <Link to="/likes" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Likes
                </Link>
              </div>
            </li>
          </ul>

          {/* Auth Links Desktop */}
          <div className="hidden md:flex space-x-6 items-center text-lg">
            {!user ? (
              <>
                <Link to="/login" className="text-white hover:text-blue-400 font-medium">
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-white bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 font-medium"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none cursor-pointer">
                  <img
                    src={
                      user.photoURL ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <span className="text-white hover:text-blue-400 font-medium">
                    {user.username || user.email}
                  </span>
                </button>

                {/* Profile Dropdown */}
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out"
                >
                  <Link to="/" className="block px-4 py-2 hover:bg-gray-100 text-black">
                    Home
                  </Link>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-black">
                    Profile
                  </Link>
                  <Link to="/reviews" className="block px-4 py-2 hover:bg-gray-100 text-black">
                    Reviews
                  </Link>
                  <Link to="/watchlist" className="block px-4 py-2 hover:bg-gray-100 text-black">
                    Watchlist
                  </Link>
                  <Link to="/likes" className="block px-4 py-2 hover:bg-gray-100 text-black">
                    Likes
                  </Link>
                  <Link to="/favorites" className="block px-4 py-2 hover:bg-gray-100 text-black">
                    Favorites
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex items-center focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-950 px-6 pb-6 space-y-4 text-white text-lg">
            {/* Movies */}
            <div className="relative group">
              <details>
                <summary className="cursor-pointer py-2">Movies</summary>
                <div className="pl-4 mt-2 space-y-1">
                  <Link
                    to="/movies/popular"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Popular
                  </Link>
                  <Link
                    to="/movies/now-playing"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Now Playing
                  </Link>
                  <Link
                    to="/movies/upcoming"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Upcoming
                  </Link>
                  <Link
                    to="/movies/top-rated"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Top Rated
                  </Link>
                </div>
              </details>
            </div>

            {/* TV Shows */}
            <div className="relative group">
              <details>
                <summary className="cursor-pointer py-2">TV Shows</summary>
                <div className="pl-4 mt-2 space-y-1">
                  <Link
                    to="/tv/popular"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Popular
                  </Link>
                  <Link
                    to="/tv/airing-today"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Airing Today
                  </Link>
                  <Link
                    to="/tv/on-tv"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    On TV
                  </Link>
                  <Link
                    to="/tv/top-rated"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Top Rated
                  </Link>
                </div>
              </details>
            </div>

            {/* People */}
            <div className="relative group">
              <details>
                <summary className="cursor-pointer py-2">People</summary>
                <div className="pl-4 mt-2 space-y-1">
                  <Link
                    to="/person/popular"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Popular People
                  </Link>
                </div>
              </details>
            </div>

            {/* More */}
            <div className="relative group">
              <details>
                <summary className="cursor-pointer py-2">More</summary>
                <div className="pl-4 mt-2 space-y-1">
                  <Link
                    to="/favorites"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Favorites
                  </Link>
                  <Link
                    to="/watchlist"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Watchlist
                  </Link>
                  <Link
                    to="/reviews"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reviews
                  </Link>
                  <Link
                    to="/likes"
                    className="block py-1 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Likes
                  </Link>
                </div>
              </details>
            </div>

            {/* Auth Links Mobile */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="block py-2 hover:text-blue-400 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 bg-blue-700 rounded text-center font-medium hover:bg-blue-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="block py-2 hover:text-blue-400 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/reviews"
                  className="block py-2 hover:text-blue-400 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Reviews
                </Link>
                <Link
                  to="/watchlist"
                  className="block py-2 hover:text-blue-400 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Watchlist
                </Link>
                <Link
                  to="/likes"
                  className="block py-2 hover:text-blue-400 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Likes
                </Link>
                <Link
                  to="/favorites"
                  className="block py-2 hover:text-blue-400 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Favorites
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Outlet renders the matched child route */}
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
