import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieService } from '../services/api';
import MovieCard from '../components/MovieCard';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter lists
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  // Active filters
  const search = searchParams.get('search') || '';
  const selectedGenre = searchParams.get('genre') || 'All';
  const selectedLanguage = searchParams.get('language') || 'All';
  const selectedStatus = searchParams.get('status') || 'all';
  const selectedSort = searchParams.get('sort') || 'latest';

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await movieService.getFilters();
        if (res.data) {
          setAvailableGenres(['All', ...(res.data.genres || [])]);
          setAvailableLanguages(['All', ...(res.data.languages || [])]);
        }
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (selectedGenre && selectedGenre !== 'All') params.genre = selectedGenre;
        if (selectedLanguage && selectedLanguage !== 'All') params.language = selectedLanguage;
        if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;
        if (selectedSort) params.sort = selectedSort;

        const res = await movieService.getAll(params);
        setMovies(res.data?.movies || []);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [search, selectedGenre, selectedLanguage, selectedStatus, selectedSort]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="container py-4">
      {/* Title & Filter Bar */}
      <div className="mb-4">
        <h2 className="text-white fw-bold">Explore Movies</h2>
        <p className="text-secondary small">Filter by genre, language, or release status</p>
      </div>

      {/* Filter Controls Row */}
      <div className="p-3 mb-4 rounded-3 border border-secondary" style={{ backgroundColor: '#14161f' }}>
        <div className="row g-3 align-items-center">
          {/* Search box */}
          <div className="col-md-3">
            <label className="form-label text-secondary small mb-1">Search</label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark border-secondary text-white"
                placeholder="Search title..."
                value={search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
              {search && (
                <button
                  className="btn btn-dark border-secondary text-secondary"
                  type="button"
                  onClick={() => updateFilter('search', '')}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          {/* Genre Filter */}
          <div className="col-md-2 col-6">
            <label className="form-label text-secondary small mb-1">Genre</label>
            <select
              className="form-select form-select-sm bg-dark border-secondary text-white"
              value={selectedGenre}
              onChange={(e) => updateFilter('genre', e.target.value)}
            >
              {availableGenres.length > 0 ? (
                availableGenres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))
              ) : (
                <>
                  <option value="All">All Genres</option>
                  <option value="Action">Action</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Drama">Drama</option>
                  <option value="Comedy">Comedy</option>
                </>
              )}
            </select>
          </div>

          {/* Language Filter */}
          <div className="col-md-2 col-6">
            <label className="form-label text-secondary small mb-1">Language</label>
            <select
              className="form-select form-select-sm bg-dark border-secondary text-white"
              value={selectedLanguage}
              onChange={(e) => updateFilter('language', e.target.value)}
            >
              {availableLanguages.length > 0 ? (
                availableLanguages.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))
              ) : (
                <>
                  <option value="All">All Languages</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </>
              )}
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-md-2 col-6">
            <label className="form-label text-secondary small mb-1">Status</label>
            <select
              className="form-select form-select-sm bg-dark border-secondary text-white"
              value={selectedStatus}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="all">All Releases</option>
              <option value="now_showing">Now Showing</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="col-md-2 col-6">
            <label className="form-label text-secondary small mb-1">Sort By</label>
            <select
              className="form-select form-select-sm bg-dark border-secondary text-white"
              value={selectedSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="latest">Latest Released</option>
              <option value="rating">Top Rated</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="col-md-1 d-flex align-items-end">
            <button
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={handleResetFilters}
              title="Reset all filters"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Movie Results */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-secondary mt-3">Finding movies...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-5 bg-dark rounded-4 border border-secondary my-4">
          <i className="bi bi-film text-secondary display-3 mb-3 d-block"></i>
          <h4 className="text-white">No Movies Found</h4>
          <p className="text-secondary">Try adjusting your filters or search keywords.</p>
          <button className="btn btn-imovies mt-2" onClick={handleResetFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">
              Showing <strong>{movies.length}</strong> movies
            </span>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Movies;
