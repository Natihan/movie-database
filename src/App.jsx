// src/App.jsx
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';
import SkeletonList from './components/SkeletonList';
import { useMovies } from './hooks/useMovies';

function App() {
  const [query, setQuery] = useState('');
  const { 
    movies, 
    error, 
    isLoading, 
    totalResults, 
    currentPage, 
    searchMovies 
  } = useMovies();

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    searchMovies(searchQuery);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🎬 Movie Database</h1>
      </header>
      
      <SearchBar onSearch={handleSearch} />
      
      {error && (
        <p className="text-red-500 text-center my-4">{error}</p>
      )}
      
      {isLoading ? (
        <SkeletonList />
      ) : (
        <>
          {movies.length > 0 && (
            <p className="text-center text-gray-600 mb-4">
              Showing {movies.length} of {totalResults} results
            </p>
          )}
          <MovieList movies={movies} />
        </>
      )}
    </main>
  );
}

export default App;