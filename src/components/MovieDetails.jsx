// src/components/MovieDetails.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SkeletonDetail from './SkeletonDetail';
import { useMovies } from '../hooks/useMovies';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const { error, isLoading, getMovieDetails } = useMovies();

  useEffect(() => {
    const fetchMovie = async () => {
      const movieData = await getMovieDetails(id);
      setMovie(movieData);
    };
    
    fetchMovie();
  }, [id, getMovieDetails]);

  if (isLoading) return <SkeletonDetail />;
  if (error) return <ErrorDisplay message={error} />;
  if (!movie) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        ← Back to Search
      </Link>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : '/no-image.png'}
              alt={movie.Title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6 md:w-2/3">
            <h2 className="text-2xl font-bold mb-2">{movie.Title}</h2>
            <p className="text-gray-600 mb-4">
              {movie.Year} • {movie.Runtime} • {movie.Rated}
            </p>
            
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2">
                IMDb: {movie.imdbRating}/10
              </div>
              {movie.Ratings?.map((rating, index) => (
                <div key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2">
                  {rating.Source}: {rating.Value}
                </div>
              ))}
            </div>
            
            <p className="mb-4"><strong>Plot:</strong> {movie.Plot}</p>
            <p><strong>Director:</strong> {movie.Director}</p>
            <p><strong>Cast:</strong> {movie.Actors}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Awards:</strong> {movie.Awards}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;