import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { movieService } from '../../services/api';
import AdminNav from '../../components/AdminNav';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const initialFormState = {
    title: '',
    description: '',
    duration: '',
    genre: '',
    language: 'English',
    releaseDate: new Date().toISOString().split('T')[0],
    rating: 8.0,
    posterUrl: '',
    bannerUrl: '',
    trailerUrl: '',
    status: 'now_showing',
    director: '',
    cast: '',
    certificate: 'UA'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await movieService.getAll();
      setMovies(res.data?.movies || []);
    } catch (err) {
      toast.error('Failed to load movies.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const handleOpenEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      description: movie.description || '',
      duration: movie.duration || '',
      genre: movie.genre ? movie.genre.join(', ') : '',
      language: movie.language || 'English',
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
      rating: movie.rating || 8.0,
      posterUrl: movie.posterUrl || '',
      bannerUrl: movie.bannerUrl || '',
      trailerUrl: movie.trailerUrl || '',
      status: movie.status || 'now_showing',
      director: movie.director || '',
      cast: movie.cast ? movie.cast.join(', ') : '',
      certificate: movie.certificate || 'UA'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingMovie) {
        await movieService.update(editingMovie._id, formData);
        toast.success('Movie updated successfully!');
      } else {
        await movieService.create(formData);
        toast.success('Movie created successfully!');
      }
      setModalOpen(false);
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? All scheduled shows for this movie will also be removed.`)) {
      return;
    }

    try {
      await movieService.delete(id);
      toast.success('Movie deleted successfully!');
      fetchMovies();
    } catch (err) {
      toast.error('Failed to delete movie.');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="text-white fw-bold mb-0">Movie Management</h2>
          <p className="text-secondary small">Add, update, or remove movies from the catalog</p>
        </div>
        <button className="btn btn-imovies" onClick={handleOpenAddModal}>
          <i className="bi bi-plus-circle me-1"></i>Add New Movie
        </button>
      </div>

      <AdminNav />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
        </div>
      ) : (
        <div className="p-4 rounded-4 border border-secondary" style={{ backgroundColor: '#131620' }}>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="table-secondary text-uppercase small text-secondary">
                <tr>
                  <th>Poster</th>
                  <th>Title & Info</th>
                  <th>Genre</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id}>
                    <td style={{ width: '70px' }}>
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="rounded"
                        style={{ width: '50px', height: '70px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <div className="text-white fw-bold">{m.title}</div>
                      <div className="text-secondary small">
                        {m.duration}m • {m.language} • {m.certificate}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {m.genre?.map((g, idx) => (
                          <span key={idx} className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${m.status === 'now_showing' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {m.status === 'now_showing' ? 'Now Showing' : 'Upcoming'}
                      </span>
                    </td>
                    <td>
                      <span className="text-warning fw-bold">
                        <i className="bi bi-star-fill me-1"></i>{m.rating}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-light me-2"
                        onClick={() => handleOpenEditModal(m)}
                        title="Edit movie"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(m._id, m.title)}
                        title="Delete movie"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-dark border border-secondary text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">
                  {editingMovie ? 'Edit Movie' : 'Add New Movie'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalOpen(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small text-secondary">Title *</label>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-white"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Status *</label>
                      <select
                        className="form-select bg-dark border-secondary text-white"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="now_showing">Now Showing</option>
                        <option value="upcoming">Upcoming</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small text-secondary">Description *</label>
                      <textarea
                        className="form-control bg-dark border-secondary text-white"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-3 col-6">
                      <label className="form-label small text-secondary">Duration (mins) *</label>
                      <input
                        type="number"
                        className="form-control bg-dark border-secondary text-white"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-3 col-6">
                      <label className="form-label small text-secondary">Language *</label>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-white"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-3 col-6">
                      <label className="form-label small text-secondary">Rating (0 - 10)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control bg-dark border-secondary text-white"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3 col-6">
                      <label className="form-label small text-secondary">Certificate</label>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-white"
                        value={formData.certificate}
                        onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Genres (comma separated) *</label>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="Action, Sci-Fi, Adventure"
                        value={formData.genre}
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Release Date *</label>
                      <input
                        type="date"
                        className="form-control bg-dark border-secondary text-white"
                        value={formData.releaseDate}
                        onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Poster Image URL *</label>
                      <input
                        type="url"
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="https://..."
                        value={formData.posterUrl}
                        onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Banner Image URL</label>
                      <input
                        type="url"
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="https://..."
                        value={formData.bannerUrl}
                        onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Director</label>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-white"
                        value={formData.director}
                        onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Cast (comma separated)</label>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="Actor 1, Actor 2"
                        value={formData.cast}
                        onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small text-secondary">Trailer URL (YouTube)</label>
                      <input
                        type="url"
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.trailerUrl}
                        onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-imovies" disabled={submitting}>
                    {submitting ? 'Saving...' : editingMovie ? 'Update Movie' : 'Create Movie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
