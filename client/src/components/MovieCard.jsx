import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const isUpcoming = movie.status === 'upcoming';

  return (
    <div className="col">
      <div className="movie-card">
        <div className="movie-poster-wrapper">
          <img
            src={movie.posterUrl || 'https://via.placeholder.com/300x450/14161d/ffffff?text=No+Poster'}
            alt={movie.title}
            className="movie-poster-img"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
            }}
          />
          {movie.rating && (
            <div className="movie-card-rating">
              <i className="bi bi-star-fill text-warning me-1"></i>
              {movie.rating.toFixed(1)}
            </div>
          )}
          {isUpcoming && (
            <div className="movie-card-badge bg-warning text-dark">
              Upcoming
            </div>
          )}
        </div>

        <div className="movie-card-body">
          <h5 className="movie-title" title={movie.title}>
            {movie.title}
          </h5>

          <div className="d-flex align-items-center gap-2 mb-2 text-secondary small">
            <span><i className="bi bi-clock me-1"></i>{movie.duration}m</span>
            <span>•</span>
            <span className="text-uppercase">{movie.language}</span>
            <span>•</span>
            <span className="badge bg-secondary" style={{ fontSize: '0.65rem' }}>{movie.certificate || 'UA'}</span>
          </div>

          <div className="d-flex flex-wrap gap-1 mb-3">
            {movie.genre?.slice(0, 2).map((g, index) => (
              <span key={index} className="badge-genre">
                {g}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-2">
            <Link
              to={`/movies/${movie._id}`}
              className={`btn w-100 ${isUpcoming ? 'btn-imovies-outline' : 'btn-imovies'}`}
            >
              {isUpcoming ? (
                <>
                  <i className="bi bi-info-circle me-1"></i>Details
                </>
              ) : (
                <>
                  <i className="bi bi-ticket-perforated-fill me-1"></i>Book Tickets
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
