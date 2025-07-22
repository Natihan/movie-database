import { useEffect, useState } from "react";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export default function Hero() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [backgrounds, setBackgrounds] = useState([]);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const backdrops = data.results
            .filter(movie => movie.backdrop_path)
            .map(movie => IMAGE_BASE_URL + movie.backdrop_path);
          setBackgrounds(backdrops);
        }
      } catch (err) {
        console.error("Failed to fetch background images:", err);
      }
    }

    fetchTrending();
  }, []);

  useEffect(() => {
    if (backgrounds.length === 0) return;

    const interval = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgrounds]);

  const currentBackground =
    backgrounds.length > 0 ? backgrounds[backgroundIndex] : "/hero-bg.jpg";

  return (
    <section
      className="w-screen overflow-hidden text-white py-24 text-center bg-cover bg-center transition-all duration-1000"
      style={{
        backgroundImage: `url('${currentBackground}')`,
        backgroundColor: "#032541",
        backgroundBlendMode: "multiply",
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Welcome.</h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto">
          Millions of movies, TV shows and people to discover. Explore now.
        </p>
        <a
          href="/movies/popular"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Explore Movies
        </a>
      </div>
    </section>
  );
}
