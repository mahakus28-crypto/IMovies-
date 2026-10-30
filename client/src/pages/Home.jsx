import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import MovieCard from '../components/MovieCard';
import { fallbackMovies, fallbackTheatres } from '../data/fallbackMovies';

const Home = () => {
  // Pre-seed with fallback movies so the UI is immediately interactive
  const defaultShowing = fallbackMovies.filter(m => m.status === 'now_showing');
  const defaultUpcoming = fallbackMovies.filter(m => m.status === 'upcoming');

  const [nowShowing, setNowShowing] = useState(defaultShowing);
  const [upcoming, setUpcoming] = useState(defaultUpcoming);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activeTrailerUrl, setActiveTrailerUrl] = useState(null);

  // Top featured movies for hero slider
  const featuredPool = nowShowing.slice(0, 4);
  const activeHero = featuredPool[heroIndex] || featuredPool[0] || defaultShowing[0];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [resShowing, resUpcoming] = await Promise.all([
          movieService.getAll({ status: 'now_showing' }),
          movieService.getAll({ status: 'upcoming' })
        ]);

        const showingMovies = resShowing.data?.movies;
        const upcomingMovies = resUpcoming.data?.movies;

        if (showingMovies && showingMovies.length > 0) {
          setNowShowing(showingMovies);
        }
        if (upcomingMovies && upcomingMovies.length > 0) {
          setUpcoming(upcomingMovies);
        }
      } catch (err) {
        // Keeps fallback movies if server is offline
        console.log('Using default movie dataset');
      }
    };

    fetchMovies();
  }, []);

  // Auto-slide hero banner every 6 seconds
  useEffect(() => {
    if (featuredPool.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % featuredPool.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredPool.length]);

  const genres = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Crime'];

  // Filter now showing by selected genre
  const filteredShowing = selectedGenre === 'All'
    ? nowShowing
    : nowShowing.filter(m => m.genre?.some(g => g.toLowerCase() === selectedGenre.toLowerCase()));

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  return (
    <div className="home-page pb-5">
      {/* Dynamic Hero Banner Slider */}
      <div className="container pt-4">
        {activeHero && (
          <div
            className="hero-banner shadow-lg position-relative"
            style={{
              backgroundImage: `url(${activeHero.bannerUrl || activeHero.posterUrl})`,
              minHeight: '500px',
              transition: 'background-image 0.5s ease-in-out'
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-danger text-uppercase px-3 py-1 fw-bold">
                  Featured #{heroIndex + 1}
                </span>
                <span className="badge bg-dark border border-secondary text-white">
                  IMAX & 3D
                </span>
              </div>

              <h1 className="display-4 fw-bold text-white mb-2">
                {activeHero.title}
              </h1>

              <div className="d-flex flex-wrap align-items-center gap-3 text-secondary mb-3">
                <span className="badge-rating fs-6">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  {activeHero.rating?.toFixed(1)} / 10
                </span>
                <span><i className="bi bi-clock me-1 text-danger"></i>{activeHero.duration} mins</span>
                <span>•</span>
                <span>{activeHero.language}</span>
                <span>•</span>
                <span className="badge bg-dark border border-secondary">{activeHero.certificate || 'UA'}</span>
              </div>

              <p className="text-light mb-4 text-truncate-3" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                {activeHero.description}
              </p>

              <div className="d-flex gap-3 flex-wrap align-items-center">
                <Link
                  to={`/movies/${activeHero._id}`}
                  className="btn btn-imovies btn-lg px-4 d-flex align-items-center gap-2"
                >
                  <i className="bi bi-ticket-perforated-fill fs-5"></i>
                  Book Tickets
                </Link>
                {activeHero.trailerUrl && (
                  <button
                    onClick={() => setActiveTrailerUrl(activeHero.trailerUrl)}
                    className="btn btn-imovies-outline btn-lg px-4 d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-play-circle fs-5 text-danger"></i>
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>

            {/* Carousel navigation dots */}
            <div className="position-absolute bottom-0 end-0 p-4 d-flex gap-2 z-3">
              {featuredPool.map((m, idx) => (
                <button
                  key={m._id}
                  onClick={() => setHeroIndex(idx)}
                  className={`btn p-0 rounded-pill transition-all ${
                    idx === heroIndex ? 'bg-danger' : 'bg-secondary bg-opacity-50'
                  }`}
                  style={{
                    width: idx === heroIndex ? '30px' : '10px',
                    height: '10px',
                    border: 'none'
                  }}
                  title={m.title}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Statistics Ribbon */}
      <div className="container my-4">
        <div className="row g-3 text-center text-white py-3 px-2 rounded-4 border border-secondary" style={{ backgroundColor: '#10131c' }}>
          <div className="col-6 col-md-3 border-end border-secondary border-opacity-25">
            <h4 className="fw-bold text-danger mb-0">12+</h4>
            <span className="text-secondary small">Blockbuster Movies</span>
          </div>
          <div className="col-6 col-md-3 border-end border-secondary border-opacity-25">
            <h4 className="fw-bold text-danger mb-0">5 Cities</h4>
            <span className="text-secondary small">Top Cinema Hubs</span>
          </div>
          <div className="col-6 col-md-3 border-end border-secondary border-opacity-25">
            <h4 className="fw-bold text-danger mb-0">4DX & IMAX</h4>
            <span className="text-secondary small">Laser 3D Screens</span>
          </div>
          <div className="col-6 col-md-3">
            <h4 className="fw-bold text-success mb-0">Instant</h4>
            <span className="text-secondary small">Digital Entry & M-Tickets</span>
          </div>
        </div>
      </div>

      {/* Now Showing Section with Interactive Genre Tabs */}
      <div className="container my-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="text-white fw-bold mb-1">
              <span className="text-danger me-2">●</span>Now Showing in Cinemas
            </h2>
            <p className="text-secondary small mb-0">Select a film to choose your theatre, date, and seats</p>
          </div>
          <Link to="/movies?status=now_showing" className="btn btn-sm btn-outline-danger align-self-start align-self-md-auto">
            View All ({nowShowing.length}) <i className="bi bi-chevron-right ms-1"></i>
          </Link>
        </div>

        {/* Interactive Genre Filter Pills */}
        <div className="d-flex gap-2 overflow-auto pb-3 mb-4">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold transition-all ${
                selectedGenre === g
                  ? 'btn-danger shadow'
                  : 'btn-dark border border-secondary text-secondary'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {filteredShowing.length === 0 ? (
          <div className="p-4 text-center bg-dark rounded-4 border border-secondary text-secondary">
            No movies found in this genre. Try selecting 'All'.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {filteredShowing.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Releases Section */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-white fw-bold mb-1">
              <span className="text-warning me-2">●</span>Coming Soon to IMovies
            </h2>
            <p className="text-secondary small mb-0">Anticipated blockbusters arriving in theatres soon</p>
          </div>
          <Link to="/movies?status=upcoming" className="btn btn-sm btn-outline-warning">
            All Upcoming <i className="bi bi-chevron-right ms-1"></i>
          </Link>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {upcoming.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>

      {/* Premium Partner Theatres Showcase */}
      <div className="container my-5">
        <div className="border-bottom border-secondary pb-3 mb-4">
          <h3 className="text-white fw-bold mb-1">
            <i className="bi bi-buildings text-danger me-2"></i>Partner Multiplexes & Theatres
          </h3>
          <p className="text-secondary small mb-0">Experience laser projection and Dolby Atmos sound across top cinema complexes</p>
        </div>

        <div className="row g-3">
          {fallbackTheatres.map((t) => (
            <div key={t.id} className="col-md-6 col-lg-4">
              <div className="p-3 rounded-4 border border-secondary h-100" style={{ backgroundColor: '#131620' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-danger">{t.city}</span>
                  <span className="badge bg-dark border border-secondary text-warning" style={{ fontSize: '0.7rem' }}>
                    {t.badge}
                  </span>
                </div>
                <h6 className="text-white fw-bold mb-2">{t.name}</h6>
                <div className="d-flex flex-wrap gap-1 mt-2">
                  {t.formats.map((f, i) => (
                    <span key={i} className="badge bg-black border border-secondary text-secondary" style={{ fontSize: '0.7rem' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
                  Official HD Movie Trailer
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
