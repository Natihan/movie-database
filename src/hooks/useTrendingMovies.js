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

  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);
  const [errorUpcoming, setErrorUpcoming] = useState("");

  const [airingTodayShows, setAiringTodayShows] = useState([]);
  const [loadingAiringToday, setLoadingAiringToday] = useState(false);
  const [errorAiringToday, setErrorAiringToday] = useState("");

  const [onTVShows, setOnTVShows] = useState([]);
  const [loadingOnTV, setLoadingOnTV] = useState(false);
  const [errorOnTV, setErrorOnTV] = useState("");

  const [popularPeople, setPopularPeople] = useState([]);
  const [loadingPopularPeople, setLoadingPopularPeople] = useState(false);
  const [errorPopularPeople, setErrorPopularPeople] = useState("");

  const [topRatedTVShows, setTopRatedTVShows] = useState([]);
  const [loadingTopRatedTV, setLoadingTopRatedTV] = useState(false);
  const [errorTopRatedTV, setErrorTopRatedTV] = useState("");

  const [genreMap, setGenreMap] = useState({});

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

  const fetchPopularMovies = async (page = 1, type = "movie", category = "popular") => {
    setLoadingPopular(true);
    setErrorPopular("");
    try {
      const url = new URL(`${TMDB_BASE_URL}/${type}/${category}`);
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
      setErrorPopular(`Failed to fetch ${category} ${type}s.`);
    } finally {
      setLoadingPopular(false);
    }
  };

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

  const fetchUpcomingMovies = async (page = 1) => {
    setLoadingUpcoming(true);
    setErrorUpcoming("");
    try {
      const url = new URL(`${TMDB_BASE_URL}/movie/upcoming`);
      url.searchParams.set("api_key", TMDB_API_KEY);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("page", page);
      url.searchParams.set("region", "US");

      const res = await fetch(url);
      const data = await res.json();

      const now = new Date();

      const filtered = (data.results || []).filter(movie => {
        const releaseDate = new Date(movie.release_date || "");
        return releaseDate > now;
      });

      const normalized = filtered.map((item) => ({
        ...item,
        title: item.title || item.name || "",
        release_date: item.release_date || item.first_air_date || "",
        genre_names: item.genre_ids?.map((id) => genreMap[id]) || [],
        poster_url: item.poster_path
          ? `${IMAGE_BASE_URL}${item.poster_path}`
          : null,
      }));

      setUpcomingMovies((prev) =>
        page === 1 ? normalized : [...prev, ...normalized]
      );
    } catch (err) {
      setErrorUpcoming("Failed to fetch upcoming movies.");
    } finally {
      setLoadingUpcoming(false);
    }
  };

  const fetchAiringTodayShows = async (page = 1) => {
    setLoadingAiringToday(true);
    setErrorAiringToday("");

    try {
      const url = new URL(`${TMDB_BASE_URL}/tv/airing_today`);
      url.searchParams.set("api_key", TMDB_API_KEY);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("page", page);

      const res = await fetch(url);
      const data = await res.json();

      const normalized = (data.results || []).map((item) => ({
        ...item,
        title: item.name || item.title || "",
        release_date: item.first_air_date || item.release_date || "",
        genre_names: [],
        poster_url: item.poster_path
          ? `${IMAGE_BASE_URL}${item.poster_path}`
          : null,
      }));

      setAiringTodayShows((prev) =>
        page === 1 ? normalized : [...prev, ...normalized]
      );
    } catch (err) {
      setErrorAiringToday("Failed to fetch TV shows airing today.");
    } finally {
      setLoadingAiringToday(false);
    }
  };

  const fetchOnTVShows = async (page = 1) => {
    if (Object.keys(genreMap).length === 0) return;
    setLoadingOnTV(true);
    setErrorOnTV("");
    try {
      const url = new URL(`${TMDB_BASE_URL}/tv/on_the_air`);
      url.searchParams.set("api_key", TMDB_API_KEY);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("page", page);

      const res = await fetch(url);
      const data = await res.json();

      const normalized = (data.results || []).map((item) => ({
        ...item,
        title: item.name || item.title || "",
        release_date: item.first_air_date || item.release_date || "",
        genre_names: item.genre_ids?.map((id) => genreMap[id]) || [],
        poster_url: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
      }));

      setOnTVShows((prev) => (page === 1 ? normalized : [...prev, ...normalized]));
    } catch (err) {
      setErrorOnTV("Failed to fetch currently on TV shows.");
    } finally {
      setLoadingOnTV(false);
    }
  };

  const fetchPopularPeople = async (page = 1) => {
    setLoadingPopularPeople(true);
    setErrorPopularPeople("");
    try {
      const url = new URL(`${TMDB_BASE_URL}/person/popular`);
      url.searchParams.set("api_key", TMDB_API_KEY);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("page", page);

      const res = await fetch(url);
      const data = await res.json();

      const normalized = (data.results || []).map((person) => ({
        id: person.id,
        name: person.name,
        profile_url: person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : null,
        known_for: person.known_for || [],
      }));

      setPopularPeople((prev) => (page === 1 ? normalized : [...prev, ...normalized]));
    } catch (err) {
      setErrorPopularPeople("Failed to fetch popular people.");
    } finally {
      setLoadingPopularPeople(false);
    }
  };

  const fetchTopRatedTVShows = async (page = 1) => {
    setLoadingTopRatedTV(true);
    setErrorTopRatedTV("");
    try {
      const url = new URL(`${TMDB_BASE_URL}/tv/top_rated`);
      url.searchParams.set("api_key", TMDB_API_KEY);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("page", page);

      const res = await fetch(url);
      const data = await res.json();

      const normalized = (data.results || []).map((item) => ({
        ...item,
        title: item.name || item.title || "",
        release_date: item.first_air_date || item.release_date || "",
        genre_names: item.genre_ids?.map((id) => genreMap[id]) || [],
        poster_url: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
      }));

      setTopRatedTVShows((prev) => (page === 1 ? normalized : [...prev, ...normalized]));
    } catch (err) {
      setErrorTopRatedTV("Failed to fetch top-rated TV shows.");
    } finally {
      setLoadingTopRatedTV(false);
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
    fetchInTheaterMovies,

    upcomingMovies,
    loadingUpcoming,
    errorUpcoming,
    fetchUpcomingMovies,

    airingTodayShows,
    loadingAiringToday,
    errorAiringToday,
    fetchAiringTodayShows,

    onTVShows,
    loadingOnTV,
    errorOnTV,
    fetchOnTVShows,

    popularPeople,
    loadingPopularPeople,
    errorPopularPeople,
    fetchPopularPeople,

    topRatedTVShows,
    loadingTopRatedTV,
    errorTopRatedTV,
    fetchTopRatedTVShows,

    genreMap,
  };
}
