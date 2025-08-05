import { useState, useEffect, useCallback } from "react";

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
          fetch(`${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`),
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

  // Memoized fetchDiscover helper
  const fetchDiscover = useCallback(
    async ({ type = "movie", filters = {}, page = 1 }) => {
      const url = new URL(`${TMDB_BASE_URL}/discover/${type}`);
      url.searchParams.set("api_key", TMDB_API_KEY);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("page", page);

      Object.entries(filters).forEach(([key, value]) => {
        if (value != null && value !== "") {
          url.searchParams.set(key, value);
        }
      });

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch discover ${type} data`);
      const data = await res.json();

      return (data.results || []).map((item) => ({
        ...item,
        release_date: item.release_date || item.first_air_date || "",
        title: item.title || item.name || "",
        genre_names: item.genre_ids?.map((id) => genreMap[id]).filter(Boolean) || [],
        poster_url: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
      }));
    },
    [genreMap]
  );

  const fetchPopularMovies = useCallback(
    async (page = 1, filters = null) => {
      setLoadingPopular(true);
      setErrorPopular("");
      try {
        let normalized;
        if (filters && Object.keys(filters).length > 0) {
          normalized = await fetchDiscover({ type: "movie", filters, page });
        } else {
          const url = new URL(`${TMDB_BASE_URL}/movie/popular`);
          url.searchParams.set("api_key", TMDB_API_KEY);
          url.searchParams.set("language", "en-US");
          url.searchParams.set("page", page);

          const res = await fetch(url);
          const data = await res.json();
          const results = data.results || [];

          normalized = results.map((item) => ({
            ...item,
            release_date: item.release_date || item.first_air_date || "",
            title: item.title || item.name || "",
            genre_names: item.genre_ids?.map((id) => genreMap[id]).filter(Boolean) || [],
            poster_url: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
          }));
        }
        setPopularMovies(page === 1 ? normalized : (prev) => [...prev, ...normalized]);
      } catch (err) {
        setErrorPopular(err.message || "Failed to fetch popular movies.");
      } finally {
        setLoadingPopular(false);
      }
    },
    [fetchDiscover, genreMap]
  );

  const fetchInTheaterMovies = useCallback(
    async ({ region = "US", genreId = null, page = 1 } = {}) => {
      setLoadingInTheater(true);
      setErrorInTheater("");
      try {
        if (genreId) {
          const filters = {
            region,
            with_genres: genreId,
            "release_date.gte": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            "release_date.lte": new Date().toISOString().split("T")[0],
            sort_by: "popularity.desc",
          };
          const movies = await fetchDiscover({ type: "movie", filters, page });
          setInTheaterMovies(movies);
        } else {
          const url = new URL(`${TMDB_BASE_URL}/movie/now_playing`);
          url.searchParams.set("api_key", TMDB_API_KEY);
          url.searchParams.set("language", "en-US");
          url.searchParams.set("page", page);
          url.searchParams.set("region", region);

          const res = await fetch(url);
          const data = await res.json();
          const movies = (data.results || []).map((item) => ({
            ...item,
            title: item.title || item.name || "",
            release_date: item.release_date || item.first_air_date || "",
            genre_names: item.genre_ids?.map((id) => genreMap[id]).filter(Boolean) || [],
            poster_url: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
          }));
          setInTheaterMovies(movies);
        }
      } catch (err) {
        setErrorInTheater(err.message || "Failed to fetch in-theater movies.");
      } finally {
        setLoadingInTheater(false);
      }
    },
    [fetchDiscover, genreMap]
  );

  const fetchUpcomingMovies = useCallback(
    async (page = 1, filters = {}) => {
      setLoadingUpcoming(true);
      setErrorUpcoming("");
      try {
        if (!filters["release_date.gte"]) {
          filters["release_date.gte"] = new Date().toISOString().split("T")[0];
        }
        const movies = await fetchDiscover({ type: "movie", filters, page });
        setUpcomingMovies(page === 1 ? movies : (prev) => [...prev, ...movies]);
      } catch (err) {
        setErrorUpcoming(err.message || "Failed to fetch upcoming movies.");
      } finally {
        setLoadingUpcoming(false);
      }
    },
    [fetchDiscover]
  );

  const fetchAiringTodayShows = useCallback(
    async (page = 1) => {
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
          genre_names: item.genre_ids?.map((id) => genreMap[id]).filter(Boolean) || [],
          poster_url: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
        }));

        setAiringTodayShows(page === 1 ? normalized : (prev) => [...prev, ...normalized]);
      } catch (err) {
        setErrorAiringToday(err.message || "Failed to fetch TV shows airing today.");
      } finally {
        setLoadingAiringToday(false);
      }
    },
    [genreMap]
  );

  const fetchOnTVShows = useCallback(
    async (page = 1, filters = {}) => {
      if (Object.keys(genreMap).length === 0) return;
      setLoadingOnTV(true);
      setErrorOnTV("");
      try {
        if (filters && Object.keys(filters).length > 0) {
          const shows = await fetchDiscover({ type: "tv", filters, page });
          setOnTVShows(page === 1 ? shows : (prev) => [...prev, ...shows]);
        } else {
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
            genre_names: item.genre_ids?.map((id) => genreMap[id]).filter(Boolean) || [],
            poster_url: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
          }));

          setOnTVShows(page === 1 ? normalized : (prev) => [...prev, ...normalized]);
        }
      } catch (err) {
        setErrorOnTV(err.message || "Failed to fetch currently on TV shows.");
      } finally {
        setLoadingOnTV(false);
      }
    },
    [fetchDiscover, genreMap]
  );

  const fetchPopularPeople = useCallback(
    async (page = 1) => {
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
          known_for: (person.known_for || []).map((item) => ({
            id: item.id,
            title: item.title || item.name || "",
            poster_url: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
          })),
        }));

        setPopularPeople(page === 1 ? normalized : (prev) => [...prev, ...normalized]);
      } catch (err) {
        setErrorPopularPeople(err.message || "Failed to fetch popular people.");
      } finally {
        setLoadingPopularPeople(false);
      }
    },
    []
  );

  const fetchTopRatedTVShows = useCallback(
    async (page = 1) => {
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
          genre_names: item.genre_ids?.map((id) => genreMap[id]).filter(Boolean) || [],
          poster_url: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
        }));

        setTopRatedTVShows(page === 1 ? normalized : (prev) => [...prev, ...normalized]);
      } catch (err) {
        setErrorTopRatedTV(err.message || "Failed to fetch top rated TV shows.");
      } finally {
        setLoadingTopRatedTV(false);
      }
    },
    [genreMap]
  );

  // Optional: Load popular movies initially or other default data, for example:
  useEffect(() => {
    fetchPopularMovies();
  }, [fetchPopularMovies]);

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
