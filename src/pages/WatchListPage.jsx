import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../context/AuthContext";
import addRecentActivity from "../utils/addRecentActivity";

function WatchListPage() {
  const [watchlist, setWatchlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    setWatchlist(stored ? JSON.parse(stored) : []);
  }, []);

  const toggleWatchlist = async (movie) => {
    const alreadyInWatchlist = watchlist.some((m) => m.id === movie.id);
    const updated = alreadyInWatchlist
      ? watchlist.filter((m) => m.id !== movie.id)
      : [...watchlist, movie];

    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));

    if (!alreadyInWatchlist && user?.uid) {
      try {
        await addRecentActivity(user.uid, "watchlisted", movie.title || movie.Title);
      } catch (err) {
        console.error("Failed to add recent activity:", err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          You haven't added any movies or shows to your watchlist yet.
        </p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={false}
              toggleFavorite={() => {}}
              isInWatchlist={true}
              toggleWatchlist={toggleWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchListPage;
