import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SkeletonDetail from './SkeletonDetail';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${
            import.meta.env.VITE_OMDB_API_KEY
          }&i=${id}&plot=full`
        );
        const data = await response.json();

        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError(data.Error || 'Movie not found');
        }
      } catch (err) {
        setError('Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

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
            <p className="text-gray-600 mb-4">{movie.Year} • {movie.Runtime}</p>
            <p className="mb-4"><strong>Plot:</strong> {movie.Plot}</p>
            <p><strong>Director:</strong> {movie.Director}</p>
            <p><strong>Cast:</strong> {movie.Actors}</p>
            <p><strong>Rating:</strong> {movie.imdbRating}/10</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;