import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} MovieDB. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link to="/" className="hover:underline text-sm">
            Home
          </Link>
          <Link to="/movies/popular" className="hover:underline text-sm">
            Movies
          </Link>
          <Link to="/tv/popular" className="hover:underline text-sm">
            TV Shows
          </Link>
          <Link to="/profile" className="hover:underline text-sm">
            Profile
          </Link>
        </div>
      </div>
    </footer>
  );
}
