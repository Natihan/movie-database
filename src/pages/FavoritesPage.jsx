// src/pages/FavoritesPage.jsx
import { useEffect, useState } from "react";
import MovieList from "../components/MovieList";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (movie) => {
    const exists = favorites.some((fav) => fav.imdbID === movie.imdbID);
    const updated = exists
      ? favorites.filter((fav) => fav.imdbID !== movie.imdbID)
      : [...favorites, movie];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">❤️ Your Favorite Movies</h1>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-600">No favorites yet.</p>
      ) : (
        <MovieList
          movies={favorites}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      )}
    </main>
  );
}

export default FavoritesPage;
