import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movieService, showService } from '../services/api';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [theatresWithShows, setTheatresWithShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Generate 7 days starting today
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      dates.push({ iso, label: dayName, subLabel: `${dayNum} ${month}` });
    }
    return dates;
  };

  const datesList = generateDates();
  const [selectedDate, setSelectedDate] = useState(datesList[0].iso);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await movieService.getById(id);
        setMovie(res.data?.movie);
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    const fetchShows = async () => {
      if (!id) return;
      setShowsLoading(true);
      try {
        const res = await showService.getForMovie(id, selectedDate);
        setTheatresWithShows(res.data?.theatres || []);
      } catch (err) {
        console.error('Failed to load shows for movie:', err);
      } finally {
        setShowsLoading(false);
      }
    };

    fetchShows();
  }, [id, selectedDate]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  if (loading) {
    return (
      <div className="text-center py-5 vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-white">Movie Not Found</h3>
        <Link to="/movies" className="btn btn-imovies mt-3">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div className="movie-details-page pb-5">
      {/* Movie Hero Header */}
      <div
        className="position-relative py-5"
        style={{
          background: `linear-gradient(180deg, rgba(11, 12, 16, 0.8) 0%, #0b0c10 100%), url(${movie.bannerUrl || movie.posterUrl}) center/cover no-repeat`,
          borderBottom: '1px solid #1f2330'
        }}
      >
        <div className="container py-3">
          <div className="row g-4 align-items-center">
            {/* Poster */}
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg border border-secondary"
                style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Info */}
            <div className="col-md-8 col-lg-9">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge bg-danger text-uppercase px-2 py-1">{movie.certificate || 'UA'}</span>
                <span className="badge bg-secondary text-uppercase px-2 py-1">{movie.language}</span>
                <span className="badge-rating">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  {movie.rating?.toFixed(1)} / 10
                </span>
              </div>

              <h1 className="display-5 fw-bold text-white mb-2">{movie.title}</h1>

              <div className="d-flex align-items-center gap-3 text-secondary mb-3 small">
                <span><i className="bi bi-clock me-1 text-danger"></i>{movie.duration} minutes</span>
                <span>•</span>
                <span><i className="bi bi-calendar3 me-1 text-danger"></i>{new Date(movie.releaseDate).toLocaleDateString()}</span>
                <span>•</span>
                <span><i className="bi bi-film me-1 text-danger"></i>{movie.genre?.join(', ')}</span>
              </div>

              <p className="text-light lead mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                {movie.description}
              </p>

              <div className="row g-3 mb-4 small text-secondary">
                <div className="col-sm-6">
                  <strong className="text-white d-block">Director:</strong>
                  {movie.director || 'N/A'}
                </div>
                <div className="col-sm-6">
                  <strong className="text-white d-block">Cast:</strong>
                  {movie.cast?.join(', ') || 'N/A'}
                </div>
              </div>

              {movie.trailerUrl && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="btn btn-imovies-outline me-3"
                >
                  <i className="bi bi-play-circle fs-5 me-1 text-danger"></i>Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Date & Showtime Booking Section */}
      <div className="container my-5">
        <div className="border-bottom border-secondary pb-3 mb-4">
          <h3 className="text-white fw-bold">Select Date & Theatres</h3>
          <p className="text-secondary small mb-0">Choose your preferred cinema hall and showtime</p>
        </div>

        {/* Date Selector Tabs */}
        <div className="d-flex gap-2 overflow-auto pb-3 mb-4">
          {datesList.map((d) => (
            <button
              key={d.iso}
              onClick={() => setSelectedDate(d.iso)}
              className={`btn px-3 py-2 text-center rounded-3 transition-all ${
                selectedDate === d.iso
                  ? 'btn-danger shadow'
                  : 'btn-dark border border-secondary text-secondary'
              }`}
              style={{ minWidth: '95px' }}
            >
              <div className="small fw-bold text-uppercase">{d.label}</div>
              <div className="fs-6 fw-semibold">{d.subLabel}</div>
            </button>
          ))}
        </div>

        {/* Theatres and Showtimes List */}
        {showsLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="text-secondary mt-2">Checking available showtimes...</p>
          </div>
        ) : theatresWithShows.length === 0 ? (
          <div className="p-5 text-center bg-dark rounded-4 border border-secondary">
            <i className="bi bi-calendar-x text-secondary display-4 d-block mb-3"></i>
            <h5 className="text-white">No Shows Scheduled for this Date</h5>
            <p className="text-secondary small">
              Please choose another date or check back later. Administrators can schedule shows in the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {theatresWithShows.map(({ theatre, shows }) => (
              <div
                key={theatre._id}
                className="p-4 rounded-4 border border-secondary"
                style={{ backgroundColor: '#131620' }}
              >
                <div className="row g-3 align-items-center mb-3">
                  <div className="col-md-6">
                    <h5 className="text-white fw-bold mb-1">
                      <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                      {theatre.name}
                    </h5>
                    <p className="text-secondary small mb-0">
                      {theatre.location}, {theatre.city}
                    </p>
                  </div>
                  <div className="col-md-6 text-md-end text-secondary small">
                    <span className="badge bg-dark border border-secondary me-2">M-Ticket Available</span>
                    <span className="badge bg-dark border border-secondary">Food & Beverage</span>
                  </div>
                </div>

                <hr className="border-secondary my-3" />

                {/* Showtimes Pills */}
                <div className="d-flex flex-wrap gap-3">
                  {shows.map((show) => (
                    <button
                      key={show._id}
                      onClick={() => navigate(`/book/${show._id}`)}
                      className="btn btn-dark border border-secondary p-2 text-start rounded-3 hover-shadow"
                      style={{ minWidth: '130px', transition: 'all 0.2s ease' }}
                    >
                      <div className="text-white fw-bold fs-6">{show.showTime}</div>
                      <div className="d-flex justify-content-between align-items-center mt-1 text-secondary" style={{ fontSize: '0.75rem' }}>
                        <span className="badge bg-danger" style={{ fontSize: '0.65rem' }}>{show.format}</span>
                        <span className="text-white fw-bold">₹{show.price}</span>
                      </div>
                      <div className="mt-1" style={{ fontSize: '0.7rem', color: show.availableSeatsCount > 10 ? '#10b981' : '#f59e0b' }}>
                        {show.availableSeatsCount} seats left
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Trailer Modal */}
      {showTrailerModal && movie.trailerUrl && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(5px)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark border border-secondary text-white">
              <div className="modal-header border-secondary py-2">
                <h6 className="modal-title fw-bold">
                  <i className="bi bi-youtube text-danger me-2"></i>
                  {movie.title} – Official Trailer
                </h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowTrailerModal(false)}
                ></button>
              </div>
              <div className="modal-body p-0" style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src={getYouTubeEmbedUrl(movie.trailerUrl)}
                  title="Movie Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0
                  }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
