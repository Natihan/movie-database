// src/App.jsx
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const fetchMovies = async (query) => {
    try {
      setError("");
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&s=${query}`
      );
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error);
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">🎬 Movie Database</h1>
      <SearchBar onSearch={fetchMovies} />
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      <MovieList movies={movies} />
    </div>
  );
}

export default App;
