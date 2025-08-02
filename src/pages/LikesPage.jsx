import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import MovieList from "../components/MovieList";
import addRecentActivity from "../utils/addRecentActivity";

export default function LikesPage() {
  const [likes, setLikes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem("likes");
    if (stored) setLikes(JSON.parse(stored));
  }, []);

  const toggleLike = async (movie) => {
    const exists = likes.some((m) => m.imdbID === movie.imdbID);
    const updated = exists
      ? likes.filter((m) => m.imdbID !== movie.imdbID)
      : [...likes, movie];

    setLikes(updated);
    localStorage.setItem("likes", JSON.stringify(updated));

    if (user?.uid && !exists) {
      await addRecentActivity(user.uid, "liked", movie.Title || movie.title);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-center text-pink-700 mb-4">
          💖 Your Liked Movies
        </h1>
        <p className="text-center text-gray-600 mb-6">
          These are the movies you've liked. Click again to unlike.
        </p>

        {likes.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            You haven't liked any movies yet.
          </div>
        ) : (
          <MovieList
            movies={likes}
            favorites={likes}
            toggleFavorite={toggleLike}
          />
        )}
      </div>
    </main>
  );
}
