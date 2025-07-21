// src/hooks/useMovies.js
import { useState } from 'react';

export function useMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
  const BASE_URL = 'https://www.omdbapi.com/';

  const searchMovies = async (query, page = 1) => {
    if (!query.trim()) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
      );
      
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
        setTotalResults(parseInt(data.totalResults));
        setCurrentPage(page);
      } else {
        setMovies([]);
        setError(data.Error || 'No movies found');
      }
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMovieDetails = async (id) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`
      );
      
      const data = await response.json();

      if (data.Response === 'True') {
        return data;
      } else {
        setError(data.Error || 'Movie details not found');
        return null;
      }
    } catch (err) {
      setError('Failed to fetch movie details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    movies,
    error,
    isLoading,
    totalResults,
    currentPage,
    searchMovies,
    getMovieDetails,
  };
}