// FavoritesPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import MovieList from "../components/MovieList";
import addRecentActivity from "../utils/addRecentActivity"; // ✅ fixed import

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = async (movie) => {
    const exists = favorites.some((fav) => fav.imdbID === movie.imdbID);
    const updated = exists
      ? favorites.filter((fav) => fav.imdbID !== movie.imdbID)
      : [...favorites, movie];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));

    // ✅ fixed function call
    if (user?.uid) {
      await addRecentActivity(
        user.uid,
        exists ? "removed favorite" : "added favorite",
        movie.Title || movie.title
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">
          ❤️ Your Favorite Movies
        </h1>
        <p className="text-center text-gray-600 mb-6">
          These are the movies you've marked as favorites. You can remove them anytime.
        </p>

        {favorites.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            You haven't added any favorite movies yet.
          </div>
        ) : (
          <MovieList
            movies={favorites}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
      </div>
    </main>
  );
}

export default FavoritesPage;
