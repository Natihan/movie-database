import { useState } from "react";
import { useMovieTrailer } from "../hooks/useMovieTrailer";

const TrailerCard = ({ movie }) => {
  const { trailerKey } = useMovieTrailer(movie.id);
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-72 rounded-xl overflow-hidden shadow-lg bg-gray-900 text-white cursor-pointer transition-transform duration-300 transform hover:scale-105 hover:rounded-xl"
      onClick={() => setShowModal(true)}
    >
      {trailerKey ? (
        <iframe
          className="w-full h-40"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0`}
          title={movie.title}
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="w-full h-40 flex items-center justify-center bg-gray-700 text-gray-300">
          No Trailer
        </div>
      )}
      <div className="p-3">
        <h3 className="text-md font-semibold truncate">{movie.title}</h3>
        <p className="text-sm text-gray-400 truncate">{movie.overview}</p>
      </div>
    </div>
  );
};

export default TrailerCard;
