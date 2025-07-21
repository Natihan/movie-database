// src/components/MovieCard.jsx
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.imdbID}`}>
      <div className="bg-white shadow-md rounded overflow-hidden cursor-pointer hover:shadow-lg transition">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.png"}
          alt={movie.Title}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg">{movie.Title}</h3>
          <p className="text-sm text-gray-600">📅 {movie.Year}</p>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
