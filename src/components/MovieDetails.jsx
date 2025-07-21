import { useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import SkeletonList from "./components/SkeletonList";

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (query) => {
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;

    if (!apiKey) {
      setError("OMDb API key is missing.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || "No results found.");
      }
    } catch (err) {
      setError("Failed to fetch movies. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-extrabold">🎬 Movie Database</h1>
        <p className="text-gray-600">Search and explore your favorite movies</p>
      </header>

      <SearchBar onSearch={fetchMovies} />

      {error && (
        <p className="text-red-600 text-center my-4 font-medium">{error}</p>
      )}

      {isLoading ? (
        <SkeletonList />
      ) : (
        <MovieList movies={movies} />
      )}
    </main>
  );
}

export default App;
