import React, { useEffect, useState } from "react";
import { useTrendingMovies } from "../hooks/useTrendingMovies";

export default function NowPlayingMovies() {
  const {
    inTheaterMovies,
    loadingInTheater,
    errorInTheater,
    genreMap,
    fetchInTheaterMovies,
  } = useTrendingMovies();

  const [userRegion, setUserRegion] = useState("US");
  const [selectedGenre, setSelectedGenre] = useState(null);

  // Get user country code from geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      fetchInTheaterMovies({ region: "US" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const countryCode = data.countryCode || "US";
          setUserRegion(countryCode);
          fetchInTheaterMovies({ region: countryCode, genreId: selectedGenre });
        } catch {
          setUserRegion("US");
          fetchInTheaterMovies({ region: "US", genreId: selectedGenre });
        }
      },
      () => {
        setUserRegion("US");
        fetchInTheaterMovies({ region: "US", genreId: selectedGenre });
      }
    );
  }, []);

  useEffect(() => {
    fetchInTheaterMovies({ region: userRegion, genreId: selectedGenre });
  }, [selectedGenre, userRegion]);

  return (
    <div className="p-6">
      <h2 className="text-3xl mb-4">Now Playing Near You</h2>

      <div className="mb-4">
        <label htmlFor="genre-select" className="mr-2 font-semibold">
          Filter by Genre:
        </label>
        <select
          id="genre-select"
          onChange={(e) =>
            setSelectedGenre(e.target.value ? Number(e.target.value) : null)
          }
          className="border p-2 rounded"
        >
          <option value="">All Genres</option>
          {Object.entries(genreMap).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {loadingInTheater && <p>Loading movies...</p>}
      {errorInTheater && <p className="text-red-600">{errorInTheater}</p>}

      <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {inTheaterMovies.map((movie) => (
          <li key={movie.id} className="border rounded p-2 shadow hover:shadow-lg transition">
            {movie.poster_url ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-auto mb-2 rounded"
              />
            ) : (
              <div className="bg-gray-200 h-64 mb-2 flex items-center justify-center text-sm text-gray-500 rounded">
                No Image
              </div>
            )}
            <h3 className="font-bold text-lg">{movie.title}</h3>
            <p className="text-sm text-gray-600">{movie.release_date}</p>
            <p className="text-sm">
              Genres: {movie.genre_names.join(", ") || "N/A"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
