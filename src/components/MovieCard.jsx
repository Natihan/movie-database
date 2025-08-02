import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaListUl,
  FaHeart,
  FaBookmark,
  FaStar,
  FaEllipsisV,
} from "react-icons/fa";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie, isFavorite, toggleFavorite, searchQuery }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const imgSrc =
    movie.poster_path
      ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
      : movie.backdrop_path
      ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}`
      : movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "/no-image.png";

  const movieId = movie.imdbID || movie.id;
  const title = movie.title || movie.name || movie.Title || "Untitled";
  const releaseDate = movie.release_date || movie.first_air_date || movie.Year;
  const formattedDate = releaseDate
    ? new Date(releaseDate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "N/A";

  const vote = movie.vote_average ? Math.round(movie.vote_average * 10) : null;

  const ratingColor =
    vote >= 75
      ? "border-green-500"
      : vote >= 60
      ? "border-yellow-400"
      : "border-red-500";

  // 📌 Watchlist logic
  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    const current = stored ? JSON.parse(stored) : [];
    const exists = current.some((item) => item.id === movie.id);
    setIsInWatchlist(exists);
  }, [movie.id]);

  const toggleWatchlist = () => {
    const stored = localStorage.getItem("watchlist");
    let current = stored ? JSON.parse(stored) : [];

    const exists = current.some((item) => item.id === movie.id);

    if (exists) {
      current = current.filter((item) => item.id !== movie.id);
    } else {
      current.push(movie);
    }

    localStorage.setItem("watchlist", JSON.stringify(current));
    setIsInWatchlist(!exists);
    setMenuOpen(false);
  };

  return (
    <div className="relative min-w-[160px] flex flex-col items-center pb-8">
      <div className="relative w-full flex flex-col items-center">
        <div className="relative z-20 w-full rounded-xl overflow-hidden shadow-lg">
          <Link to={`/movie/${movieId}`} state={{ movie, searchQuery }}>
            <img
              src={imgSrc}
              alt={title}
              className="w-full h-56 object-cover rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            />
          </Link>

          {/* Menu button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(!menuOpen);
            }}
            className="absolute top-2 right-2 z-30 text-white bg-black/60 p-1 rounded-full hover:bg-black/80"
          >
            <FaEllipsisV size={14} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <ul className="absolute top-10 right-2 bg-white text-sm rounded shadow-md w-44 z-40">
              <li
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                <FaListUl className="text-black" />
                Add to List
              </li>
              <li
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(movie);
                  setMenuOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                <FaHeart className="text-black" />
                Favorite
              </li>
              <li
                onClick={toggleWatchlist}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                <FaBookmark className="text-black" />
                {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </li>
              <li
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                <FaStar className="text-black" />
                Your Rating
              </li>
            </ul>
          )}
        </div>

        {/* Title & Release Date */}
        <div className="mt-8 text-center z-10 w-full">
          <h3 className="text-sm font-bold truncate max-w-[150px] mx-auto">
            {title}
          </h3>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>

        {/* Rating Circle */}
        {vote !== null && (
          <div
            className={`absolute left-2 w-10 h-10 rounded-full border-4 ${ratingColor} bg-black bg-opacity-80 text-white flex items-center justify-center text-xs font-bold z-30`}
            style={{ bottom: 45 }}
          >
            {vote}%
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
