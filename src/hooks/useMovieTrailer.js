import { useState, useEffect } from "react";

export const useMovieTrailer = (movieId) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchTrailer = async () => {
      setLoading(true);
      setError(null);
      setTrailerKey(null);

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=90cd69f91f7a0b42cc0e7cba956bea78`
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        const trailer = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setTrailerKey(null);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch trailer");
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [movieId]);

  return { trailerKey, loading, error };
};
