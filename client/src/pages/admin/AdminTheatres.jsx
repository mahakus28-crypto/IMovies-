import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { theatreService } from '../../services/api';
import AdminNav from '../../components/AdminNav';

const AdminTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    location: '',
    screen1Name: 'Audi 1 - Laser 4K',
    screen1Rows: 6,
    screen1Cols: 10,
    screen2Name: 'Audi 2 - Dolby Atmos',
    screen2Rows: 6,
    screen2Cols: 10
  });

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      const res = await theatreService.getAll();
      setTheatres(res.data?.theatres || []);
    } catch (err) {
      toast.error('Failed to load theatres.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formData.name,
      city: formData.city,
      location: formData.location,
      screens: [
        {
          screenNumber: 1,
          name: formData.screen1Name,
          rows: Number(formData.screen1Rows),
          cols: Number(formData.screen1Cols),
          totalSeats: Number(formData.screen1Rows) * Number(formData.screen1Cols)
        },
        {
          screenNumber: 2,
          name: formData.screen2Name,
          rows: Number(formData.screen2Rows),
          cols: Number(formData.screen2Cols),
          totalSeats: Number(formData.screen2Rows) * Number(formData.screen2Cols)
        }
      ]
    };

    try {
      await theatreService.create(payload);
      toast.success('Theatre added successfully!');
      setModalOpen(false);
      setFormData({
        name: '',
        city: '',
        location: '',
        screen1Name: 'Audi 1 - Laser 4K',
        screen1Rows: 6,
        screen1Cols: 10,
        screen2Name: 'Audi 2 - Dolby Atmos',
        screen2Rows: 6,
        screen2Cols: 10
      });
      fetchTheatres();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add theatre.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? All shows in this theatre will also be removed.`)) {
      return;
    }
    try {
      await theatreService.delete(id);
      toast.success('Theatre deleted.');
      fetchTheatres();
    } catch (err) {
      toast.error('Failed to delete theatre.');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="text-white fw-bold mb-0">Theatre & Screen Management</h2>
          <p className="text-secondary small">Manage cinema locations and screening auditoriums</p>
        </div>
        <button className="btn btn-imovies" onClick={() => setModalOpen(true)}>
          <i className="bi bi-plus-circle me-1"></i>Add Theatre
        </button>
      </div>

      <AdminNav />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {theatres.map((t) => (
            <div key={t._id} className="col-md-6 col-lg-4">
              <div className="p-4 rounded-4 border border-secondary h-100 d-flex flex-direction-column justify-content-between" style={{ backgroundColor: '#131620' }}>
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-danger">{t.city}</span>
                    <button
                      className="btn btn-sm btn-outline-danger border-0 p-1"
                      onClick={() => handleDelete(t._id, t.name)}
                      title="Delete theatre"
                    >
                      <i className="bi bi-trash fs-5"></i>
                    </button>
                  </div>

                  <h5 className="text-white fw-bold mb-1">{t.name}</h5>
                  <p className="text-secondary small mb-3">
                    <i className="bi bi-geo-alt me-1 text-danger"></i>
                    {t.location}
                  </p>

                  <h6 className="text-white small fw-bold text-uppercase border-top border-secondary pt-2">
                    Screens ({t.screens?.length || 0})
                  </h6>
                  <div className="d-flex flex-column gap-2 mt-2">
                    {t.screens?.map((s) => (
                      <div key={s.screenNumber} className="p-2 rounded bg-dark border border-secondary small text-secondary">
                        <div className="d-flex justify-content-between text-white fw-semibold">
                          <span>Screen {s.screenNumber}: {s.name}</span>
                          <span className="badge bg-secondary">{s.totalSeats} seats</span>
                        </div>
                        <div style={{ fontSize: '0.75rem' }} className="text-secondary mt-1">
                          Layout: {s.rows} rows × {s.cols} seats per row
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Theatre Modal */}
      {modalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-secondary text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">Add Cinema Theatre</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalOpen(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Theatre Name *</label>
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary text-white"
                      placeholder="e.g. PVR Director's Cut"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-secondary">City *</label>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="e.g. Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-secondary">Address/Mall *</label>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="e.g. Palladium Mall"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded bg-black border border-secondary mb-3">
                    <h6 className="text-danger small fw-bold mb-2">Screen 1 Setup</h6>
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary text-white form-control-sm mb-2"
                      value={formData.screen1Name}
                      onChange={(e) => setFormData({ ...formData, screen1Name: e.target.value })}
                    />
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label text-secondary" style={{ fontSize: '0.75rem' }}>Rows</label>
                        <input
                          type="number"
                          className="form-control bg-dark border-secondary text-white form-control-sm"
                          value={formData.screen1Rows}
                          onChange={(e) => setFormData({ ...formData, screen1Rows: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary" style={{ fontSize: '0.75rem' }}>Seats Per Row</label>
                        <input
                          type="number"
                          className="form-control bg-dark border-secondary text-white form-control-sm"
                          value={formData.screen1Cols}
                          onChange={(e) => setFormData({ ...formData, screen1Cols: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-black border border-secondary">
                    <h6 className="text-danger small fw-bold mb-2">Screen 2 Setup</h6>
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary text-white form-control-sm mb-2"
                      value={formData.screen2Name}
                      onChange={(e) => setFormData({ ...formData, screen2Name: e.target.value })}
                    />
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label text-secondary" style={{ fontSize: '0.75rem' }}>Rows</label>
                        <input
                          type="number"
                          className="form-control bg-dark border-secondary text-white form-control-sm"
                          value={formData.screen2Rows}
                          onChange={(e) => setFormData({ ...formData, screen2Rows: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary" style={{ fontSize: '0.75rem' }}>Seats Per Row</label>
                        <input
                          type="number"
                          className="form-control bg-dark border-secondary text-white form-control-sm"
                          value={formData.screen2Cols}
                          onChange={(e) => setFormData({ ...formData, screen2Cols: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-imovies" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Save Theatre'}
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

export default AdminTheatres;
