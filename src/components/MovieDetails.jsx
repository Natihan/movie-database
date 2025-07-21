// src/components/MovieDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setError("");
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=${id}&plot=full`
        );
        const data = await response.json();

        if (data.Response === "True") {
          setMovie(data);
        } else {
          setError(data.Error);
        }
      } catch (err) {
        setError("Failed to load movie details.");
      }
    };

    fetchMovie();
  }, [id]);

  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!movie) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link to="/" className="text-blue-600 underline mb-4 inline-block">
        ← Back to Search
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.png"}
          alt={movie.Title}
          className="w-full md:w-1/3 h-auto object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold mb-2">{movie.Title}</h2>
          <p className="text-gray-600 mb-2">📅 {movie.Released}</p>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Cast:</strong> {movie.Actors}</p>
          <p className="my-2"><strong>Plot:</strong> {movie.Plot}</p>
          <p><strong>Rating:</strong> {movie.imdbRating} / 10</p>
          <p><strong>Runtime:</strong> {movie.Runtime}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
