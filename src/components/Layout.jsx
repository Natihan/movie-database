import { Outlet, Link, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();

  const dropdownStyle =
    "absolute left-0 top-full mt-2 w-48 bg-white border rounded shadow-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out";

  return (
    <>
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-800">
            🎬 MovieDB
          </Link>

          <ul className="flex space-x-6 text-gray-700 font-medium relative">
            {/* Movies */}
            <li className="relative group">
              <span className="hover:text-blue-600 cursor-pointer">Movies</span>
              <div className={dropdownStyle}>
                <Link to="/movies/popular" className="block px-4 py-2 hover:bg-gray-100">Popular</Link>
                <Link to="/movies/now-playing" className="block px-4 py-2 hover:bg-gray-100">Now Playing</Link>
                <Link to="/movies/upcoming" className="block px-4 py-2 hover:bg-gray-100">Upcoming</Link>
                <Link to="/movies/top-rated" className="block px-4 py-2 hover:bg-gray-100">Top Rated</Link>
              </div>
            </li>

            {/* TV Shows */}
            <li className="relative group">
              <span className="hover:text-blue-600 cursor-pointer">TV Shows</span>
              <div className={dropdownStyle}>
                <Link to="/tv/popular" className="block px-4 py-2 hover:bg-gray-100">Popular</Link>
                <Link to="/tv/airing-today" className="block px-4 py-2 hover:bg-gray-100">Airing Today</Link>
                <Link to="/tv/on-tv" className="block px-4 py-2 hover:bg-gray-100">On TV</Link>
                <Link to="/tv/top-rated" className="block px-4 py-2 hover:bg-gray-100">Top Rated</Link>
              </div>
            </li>

            {/* People */}
            <li className="relative group">
              <span className="hover:text-blue-600 cursor-pointer">People</span>
              <div className={dropdownStyle}>
                <Link to="/person/popular" className="block px-4 py-2 hover:bg-gray-100">Popular People</Link>
              </div>
            </li>

            {/* More */}
            <li className="relative group">
              <span className="hover:text-blue-600 cursor-pointer">More</span>
              <div className={dropdownStyle}>
                <Link to="/favorites" className="block px-4 py-2 hover:bg-gray-100">Favorites</Link>
                <Link to="/watchlist" className="block px-4 py-2 hover:bg-gray-100">Watchlist</Link>
                <Link to="/discussions" className="block px-4 py-2 hover:bg-gray-100">Discussions</Link>
                <Link to="/leaderboard" className="block px-4 py-2 hover:bg-gray-100">Leaderboard</Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <div className="px-4 py-6">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
