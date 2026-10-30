import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [resShowing, resUpcoming] = await Promise.all([
          movieService.getAll({ status: 'now_showing' }),
          movieService.getAll({ status: 'upcoming' })
        ]);

        const showingMovies = resShowing.data?.movies || [];
        setNowShowing(showingMovies);
        setUpcoming(resUpcoming.data?.movies || []);

        if (showingMovies.length > 0) {
          setFeaturedMovie(showingMovies[0]);
        }
      } catch (err) {
        console.error('Failed to load movies for home page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  return (
    <div className="home-page pb-5">
      {/* Hero Banner Section */}
      <div className="container pt-4">
        {featuredMovie ? (
          <div
            className="hero-banner shadow-lg"
            style={{
              backgroundImage: `url(${featuredMovie.bannerUrl || featuredMovie.posterUrl})`
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <span className="badge bg-danger text-uppercase px-3 py-2 mb-2 fw-bold">
                Featured Blockbuster
              </span>
              <h1 className="display-4 fw-bold text-white mb-2">
                {featuredMovie.title}
              </h1>
              <div className="d-flex align-items-center gap-3 text-secondary mb-3">
                <span className="badge-rating fs-6">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  {featuredMovie.rating?.toFixed(1)} / 10
                </span>
                <span>{featuredMovie.duration} mins</span>
                <span>•</span>
                <span>{featuredMovie.language}</span>
                <span>•</span>
                <span className="badge bg-dark border border-secondary">{featuredMovie.certificate || 'UA'}</span>
              </div>
              <p className="text-light mb-4 text-truncate-3" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                {featuredMovie.description}
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link
                  to={`/movies/${featuredMovie._id}`}
                  className="btn btn-imovies btn-lg px-4 d-flex align-items-center gap-2"
                >
                  <i className="bi bi-ticket-perforated-fill fs-5"></i>
                  Book Tickets
                </Link>
                {featuredMovie.trailerUrl && (
                  <button
                    onClick={() => setActiveTrailerUrl(featuredMovie.trailerUrl)}
                    className="btn btn-imovies-outline btn-lg px-4 d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-play-circle fs-5 text-danger"></i>
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 text-center bg-dark rounded-4 mb-4 border border-secondary">
            <h2 className="text-white">Welcome to IMovies</h2>
            <p className="text-secondary">Your premier destination for movie ticket bookings</p>
          </div>
        )}
      </div>

      {/* Now Showing Movies Section */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-white fw-bold mb-1">
              <span className="text-danger me-2">●</span>Now Showing
            </h2>
            <p className="text-secondary small mb-0">Catch the hottest films currently in theatres</p>
          </div>
          <Link to="/movies?status=now_showing" className="btn btn-sm btn-outline-danger">
            View All ({nowShowing.length}) <i className="bi bi-chevron-right ms-1"></i>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="text-secondary mt-2">Loading films...</p>
          </div>
        ) : nowShowing.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <p>No currently running movies found. Seed the database to load movies.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {nowShowing.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Movies Section */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-white fw-bold mb-1">
              <span className="text-warning me-2">●</span>Coming Soon
            </h2>
            <p className="text-secondary small mb-0">Anticipated blockbusters arriving soon</p>
          </div>
          <Link to="/movies?status=upcoming" className="btn btn-sm btn-outline-warning">
            View Upcoming <i className="bi bi-chevron-right ms-1"></i>
          </Link>
        </div>

        {upcoming.length > 0 && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {upcoming.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Cinema Experience Banner */}
      <div className="container my-5">
        <div className="p-4 p-md-5 rounded-4 border border-secondary" style={{ backgroundColor: '#131620' }}>
          <div className="row g-4 align-items-center">
            <div className="col-md-7">
              <span className="badge bg-danger mb-2">IMAX & Dolby Atmos</span>
              <h3 className="text-white fw-bold mb-3">Cinema Experience Like Never Before with IMovies</h3>
              <p className="text-secondary mb-4">
                Select your favorite recliner seats, choose your preferred audio format, and enjoy crystal-clear projection with zero wait times and paperless digital entry.
              </p>
              <div className="row g-3 text-white">
                <div className="col-6 col-sm-4">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-shield-check text-danger fs-4"></i>
                    <span className="small fw-semibold">Instant Ticket</span>
                  </div>
                </div>
                <div className="col-6 col-sm-4">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-cash-stack text-danger fs-4"></i>
                    <span className="small fw-semibold">Easy Refund</span>
                  </div>
                </div>
                <div className="col-6 col-sm-4">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-headset text-danger fs-4"></i>
                    <span className="small fw-semibold">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5 text-center">
              <img
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=80"
                alt="Cinema Hall"
                className="img-fluid rounded-4 shadow"
                style={{ maxHeight: '240px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Trailer Modal */}
      {activeTrailerUrl && (
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
                  {featuredMovie?.title} – Official Trailer
                </h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setActiveTrailerUrl(null)}
                ></button>
              </div>
              <div className="modal-body p-0" style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src={getYouTubeEmbedUrl(activeTrailerUrl)}
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

export default Home;
