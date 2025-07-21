// src/components/MovieCard.jsx
function MovieCard({ movie }) {
  return (
    <div className="bg-white shadow-md rounded overflow-hidden">
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
  );
}

export default MovieCard;
