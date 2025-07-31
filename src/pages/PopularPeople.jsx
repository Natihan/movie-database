// src/pages/PopularPeople.jsx
import React, { useEffect } from "react";
import { useTrendingMovies } from "../hooks/useTrendingMovies";

export default function PopularPeople() {
  const {
    popularPeople,
    loadingPopularPeople,
    errorPopularPeople,
    fetchPopularPeople,
  } = useTrendingMovies();

  useEffect(() => {
    fetchPopularPeople(1);
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Popular People</h1>

      {loadingPopularPeople && <p>Loading people...</p>}
      {errorPopularPeople && <p className="text-red-500">{errorPopularPeople}</p>}

      {popularPeople.length === 0 && !loadingPopularPeople && (
        <p className="text-gray-500">No people found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {popularPeople.map((person) => (
          <div
            key={person.id}
            className="border rounded overflow-hidden shadow hover:shadow-lg transition"
          >
            {person.profile_url ? (
              <img
                src={person.profile_url}
                alt={person.name}
                className="w-full h-72 object-cover"
              />
            ) : (
              <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <div className="p-3">
              <h3 className="font-bold text-lg truncate">{person.name}</h3>
              <p className="text-sm text-gray-600">
                Known for:{" "}
                {person.known_for.map((item) => item.title || item.name).join(", ") ||
                  "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
