import { useState, useEffect } from "react";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "90cd69f91f7a0b42cc0e7cba956bea78"; // Your TMDB API key

export function useTrendingTmdb() {
  const [tmdbTrending, setTmdbTrending] = useState([]);
  const [loadingTmdb, setLoadingTmdb] = useState(true);
  const [errorTmdb, setErrorTmdb] = useState(null);

  const fetchTrending = async (timeframe = "week") => {
    setLoadingTmdb(true);
    setErrorTmdb(null);

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/trending/movie/${timeframe}?api_key=${TMDB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.results) {
        setTmdbTrending(data.results);
      } else {
        setErrorTmdb("No trending movies found from TMDB.");
      }
    } catch (error) {
      setErrorTmdb(error.message || "Failed to fetch TMDB trending movies.");
    } finally {
      setLoadingTmdb(false);
    }
  };

  // Fetch trending movies for default timeframe on mount
  useEffect(() => {
    fetchTrending();
  }, []);

  return { tmdbTrending, loadingTmdb, errorTmdb, fetchTrending };
}
