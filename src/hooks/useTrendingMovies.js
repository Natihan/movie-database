import { useState, useEffect } from "react";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function useTrendingMovies() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [errorPopular, setErrorPopular] = useState("");

  const [inTheaterMovies, setInTheaterMovies] = useState([]);
  const [loadingInTheater, setLoadingInTheater] = useState(false);
  const [errorInTheater, setErrorInTheater] = useState("");

  const [genreMap, setGenreMap] = useState({});

  // Fetch genres for both movie and TV
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`),
          fetch(`${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`)
        ]);
        const movieData = await movieRes.json();
        const tvData = await tvRes.json();

        const combinedGenres = [...(movieData.genres || []), ...(tvData.genres || [])];
        const map = {};
        combinedGenres.forEach((g) => {
          map[g.id] = g.name;
        });
        setGenreMap(map);
      } catch (err) {
        console.error("Failed to load genres", err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch popular movies (or tv, or people)
  const fetchPopularMovies = async (page = 1, type = "movie") => {
    setLoadingPopular(true);
    setErrorPopular("");
    try {
      const url = new URL(`${TMDB_BASE_URL}/${type}/popular`);
      url.searchParams.set("api_key", TMDB_API_KEY);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("page", page);

      const res = await fetch(url);
      const data = await res.json();

      const results = data.results || [];

      const normalized = results.map((item) => ({
        ...item,
        release_date: item.release_date || item.first_air_date || "",
        title: item.title || item.name || "",
        genre_names: item.genre_ids?.map((id) => genreMap[id]) || [],
        poster_url: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null
      }));

      setPopularMovies((prev) =>
        page === 1 ? normalized : [...prev, ...normalized]
      );
    } catch (err) {
      setErrorPopular(`Failed to fetch popular ${type}s.`);
    } finally {
      setLoadingPopular(false);
    }
  };

  // Fetch now playing movies
  const fetchInTheaterMovies = async ({ region = "US", genreId = null } = {}) => {
    setLoadingInTheater(true);
    setErrorInTheater("");
    try {
      const url = new URL(`${TMDB_BASE_URL}/movie/now_playing`);
      url.searchParams.set("api_key", TMDB_API_KEY);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("page", 1);
      url.searchParams.set("region", region);

      const res = await fetch(url);
      const data = await res.json();

      let movies = data.results || [];

      if (genreId) {
        movies = movies.filter((m) => m.genre_ids.includes(genreId));
      }

      const normalized = movies.map((item) => ({
        ...item,
        title: item.title || item.name || "",
        release_date: item.release_date || item.first_air_date || "",
        genre_names: item.genre_ids?.map((id) => genreMap[id]) || [],
        poster_url: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null
      }));

      setInTheaterMovies(normalized);
    } catch (err) {
      setErrorInTheater("Failed to fetch in-theater movies.");
    } finally {
      setLoadingInTheater(false);
    }
  };

  return {
    popularMovies,
    loadingPopular,
    errorPopular,
    fetchPopularMovies,
    inTheaterMovies,
    loadingInTheater,
    errorInTheater,
    genreMap,
    fetchInTheaterMovies,
  };
}
