import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieService } from '../services/api';
import MovieCard from '../components/MovieCard';
import { fallbackMovies } from '../data/fallbackMovies';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState(fallbackMovies);
  const [loading, setLoading] = useState(false);

  // Filter options
  const [availableGenres, setAvailableGenres] = useState([
    'All', 'Action', 'Sci-Fi', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Crime', 'Biography'
  ]);
  const [availableLanguages, setAvailableLanguages] = useState(['All', 'English', 'Hindi']);

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
        if (res.data && res.data.genres?.length > 0) {
          setAvailableGenres(['All', ...(res.data.genres || [])]);
          setAvailableLanguages(['All', ...(res.data.languages || [])]);
        }
      } catch (err) {
        // Keep defaults
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const params = {};
        if (search) params.search = search;
        if (selectedGenre && selectedGenre !== 'All') params.genre = selectedGenre;
        if (selectedLanguage && selectedLanguage !== 'All') params.language = selectedLanguage;
        if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;
        if (selectedSort) params.sort = selectedSort;

        const res = await movieService.getAll(params);
        if (res.data?.movies && res.data.movies.length > 0) {
          setMovies(res.data.movies);
          return;
        }
      } catch (err) {
        // Fallback filter
      }

      // Apply client-side filtering on fallback dataset
      let filtered = [...fallbackMovies];

      if (search) {
        filtered = filtered.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
      }
      if (selectedGenre && selectedGenre !== 'All') {
        filtered = filtered.filter(m => m.genre?.some(g => g.toLowerCase() === selectedGenre.toLowerCase()));
      }
      if (selectedLanguage && selectedLanguage !== 'All') {
        filtered = filtered.filter(m => m.language.toLowerCase() === selectedLanguage.toLowerCase());
      }
      if (selectedStatus && selectedStatus !== 'all') {
        filtered = filtered.filter(m => m.status === selectedStatus);
      }
      if (selectedSort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (selectedSort === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
      }

      setMovies(filtered);
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
              {availableGenres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
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
              {availableLanguages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
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
