import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { showService, movieService, theatreService } from '../../services/api';
import AdminNav from '../../components/AdminNav';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = {
    movie: '',
    theatre: '',
    screenNumber: 1,
    showDate: new Date().toISOString().split('T')[0],
    showTime: '06:00 PM',
    format: '2D',
    price: 250,
    vipPrice: 350
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        showService.getAll(),
        movieService.getAll({ status: 'now_showing' }),
        theatreService.getAll()
      ]);

      setShows(showsRes.data?.shows || []);
      setMovies(moviesRes.data?.movies || []);
      setTheatres(theatresRes.data?.theatres || []);

      if (moviesRes.data?.movies?.length > 0) {
        initialFormState.movie = moviesRes.data.movies[0]._id;
      }
      if (theatresRes.data?.theatres?.length > 0) {
        initialFormState.theatre = theatresRes.data.theatres[0]._id;
      }
      setFormData(initialFormState);
    } catch (err) {
      toast.error('Failed to load shows data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.movie || !formData.theatre) {
      toast.error('Please select both a movie and a theatre.');
      return;
    }

    setSubmitting(true);
    try {
      await showService.create(formData);
      toast.success('Showtime created successfully!');
      setModalOpen(false);
      // Refresh shows
      const refreshed = await showService.getAll();
      setShows(refreshed.data?.shows || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create show.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this show screening?')) {
      return;
    }

    try {
      await showService.delete(id);
      toast.success('Show screening deleted.');
      const refreshed = await showService.getAll();
      setShows(refreshed.data?.shows || []);
    } catch (err) {
      toast.error('Failed to delete show.');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="text-white fw-bold mb-0">Showtime Management</h2>
          <p className="text-secondary small">Schedule and manage movie screenings across theatres</p>
        </div>
        <button
          className="btn btn-imovies"
          onClick={() => setModalOpen(true)}
          disabled={movies.length === 0 || theatres.length === 0}
        >
          <i className="bi bi-calendar-plus me-1"></i>Schedule New Show
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
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Screen</th>
                  <th>Date & Time</th>
                  <th>Format</th>
                  <th>Price (Std / VIP)</th>
                  <th>Booked</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show) => (
                  <tr key={show._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={show.movie?.posterUrl || 'https://via.placeholder.com/40'}
                          alt={show.movie?.title}
                          className="rounded"
                          style={{ width: '36px', height: '50px', objectFit: 'cover' }}
                        />
                        <span className="text-white fw-bold">{show.movie?.title}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-white small">{show.theatre?.name}</div>
                      <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{show.theatre?.city}</div>
                    </td>
                    <td>Screen {show.screenNumber}</td>
                    <td>
                      <div className="text-white fw-semibold">{show.showDate}</div>
                      <div className="text-secondary small">{show.showTime}</div>
                    </td>
                    <td>
                      <span className="badge bg-danger">{show.format}</span>
                    </td>
                    <td>
                      <span className="text-white fw-bold">₹{show.price}</span> /{' '}
                      <span className="text-warning">₹{show.vipPrice || show.price + 100}</span>
                    </td>
                    <td>
                      <span className="badge bg-dark border border-secondary text-white">
                        {show.bookedSeats?.length || 0} / {show.totalSeats}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(show._id)}
                        title="Delete show"
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

      {/* Schedule Show Modal */}
      {modalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-secondary text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">Schedule Movie Show</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalOpen(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Select Movie *</label>
                    <select
                      className="form-select bg-dark border-secondary text-white"
                      value={formData.movie}
                      onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
                      required
                    >
                      {movies.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.title} ({m.language})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-secondary">Select Theatre *</label>
                    <select
                      className="form-select bg-dark border-secondary text-white"
                      value={formData.theatre}
                      onChange={(e) => setFormData({ ...formData, theatre: e.target.value })}
                      required
                    >
                      {theatres.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name} - {t.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-secondary">Screen *</label>
                      <select
                        className="form-select bg-dark border-secondary text-white"
                        value={formData.screenNumber}
                        onChange={(e) => setFormData({ ...formData, screenNumber: Number(e.target.value) })}
                      >
                        <option value={1}>Screen 1</option>
                        <option value={2}>Screen 2</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-secondary">Format *</label>
                      <select
                        className="form-select bg-dark border-secondary text-white"
                        value={formData.format}
                        onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                      >
                        <option value="2D">2D</option>
                        <option value="3D">3D</option>
                        <option value="IMAX 3D">IMAX 3D</option>
                        <option value="4DX">4DX</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-secondary">Show Date *</label>
                      <input
                        type="date"
                        className="form-control bg-dark border-secondary text-white"
                        value={formData.showDate}
                        onChange={(e) => setFormData({ ...formData, showDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-secondary">Show Time *</label>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="e.g. 06:45 PM"
                        value={formData.showTime}
                        onChange={(e) => setFormData({ ...formData, showTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small text-secondary">Standard Price (₹) *</label>
                      <input
                        type="number"
                        className="form-control bg-dark border-secondary text-white"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-secondary">VIP Row Price (₹)</label>
                      <input
                        type="number"
                        className="form-control bg-dark border-secondary text-white"
                        value={formData.vipPrice}
                        onChange={(e) => setFormData({ ...formData, vipPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-imovies" disabled={submitting}>
                    {submitting ? 'Scheduling...' : 'Schedule Show'}
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

export default AdminShows;
