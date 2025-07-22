import { useState, useEffect } from "react";

const defaultSearches = [
  "Oppenheimer",
  "Barbie",
  "Dune",
  "Spider-Man",
  "The Batman",
  "John Wick",
  "Inside Out",
  "Deadpool",
  "Top Gun",
  "Avatar"
];

export function useTrendingMovies() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [errorTrending, setErrorTrending] = useState("");

  useEffect(() => {
    const fetchTrending = async () => {
      setLoadingTrending(true);
      try {
        const results = await Promise.all(
          defaultSearches.map(async (query) => {
            const res = await fetch(
              `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&s=${query}`
            );
            const data = await res.json();
            if (data.Response === "True") {
              return data.Search[0]; // Grab the first result for simplicity
            }
            return null;
          })
        );
        setTrendingMovies(results.filter(Boolean));
      } catch (err) {
        setErrorTrending("Failed to fetch trending movies.");
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrending();
  }, []);

  return {
    trendingMovies,
    loadingTrending,
    errorTrending
  };
}
