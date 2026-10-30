import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminNav from '../../components/AdminNav';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        if (res.data) {
          setStats(res.data.stats);
          setRecentBookings(res.data.recentBookings || []);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="text-white fw-bold mb-0">IMovies Admin Dashboard</h2>
          <p className="text-secondary small">System statistics and real-time cinema operations</p>
        </div>
        <span className="badge bg-danger p-2">
          <i className="bi bi-shield-lock-fill me-1"></i>Administrator Mode
        </span>
      </div>

      <AdminNav />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-secondary mt-2">Loading system telemetry...</p>
        </div>
      ) : (
        <>
          {/* Key Metric Stat Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-4 col-sm-6">
              <div className="stat-card">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small fw-bold text-uppercase">Total Revenue</span>
                  <div className="stat-icon-wrapper bg-success bg-opacity-10 text-success">
                    <i className="bi bi-currency-rupee"></i>
                  </div>
                </div>
                <h3 className="text-white fw-bold mb-1">₹{stats?.totalRevenue || 0}</h3>
                <span className="text-success small">
                  <i className="bi bi-graph-up-arrow me-1"></i>Confirmed Bookings
                </span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="stat-card">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small fw-bold text-uppercase">Total Bookings</span>
                  <div className="stat-icon-wrapper bg-danger bg-opacity-10 text-danger">
                    <i className="bi bi-ticket-perforated"></i>
                  </div>
                </div>
                <h3 className="text-white fw-bold mb-1">{stats?.totalBookings || 0}</h3>
                <span className="text-secondary small">
                  {stats?.confirmedBookings || 0} active • {stats?.cancelledBookings || 0} cancelled
                </span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="stat-card">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small fw-bold text-uppercase">Movies in Catalog</span>
                  <div className="stat-icon-wrapper bg-warning bg-opacity-10 text-warning">
                    <i className="bi bi-film"></i>
                  </div>
                </div>
                <h3 className="text-white fw-bold mb-1">{stats?.totalMovies || 0}</h3>
                <span className="text-secondary small">Now showing & upcoming</span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="stat-card">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small fw-bold text-uppercase">Partner Theatres</span>
                  <div className="stat-icon-wrapper bg-info bg-opacity-10 text-info">
                    <i className="bi bi-buildings"></i>
                  </div>
                </div>
                <h3 className="text-white fw-bold mb-1">{stats?.totalTheatres || 0}</h3>
                <span className="text-secondary small">Cinema complexes active</span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="stat-card">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small fw-bold text-uppercase">Scheduled Shows</span>
                  <div className="stat-icon-wrapper bg-primary bg-opacity-10 text-primary">
                    <i className="bi bi-clock-history"></i>
                  </div>
                </div>
                <h3 className="text-white fw-bold mb-1">{stats?.totalShows || 0}</h3>
                <span className="text-secondary small">Upcoming cinema screenings</span>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="stat-card">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small fw-bold text-uppercase">Registered Users</span>
                  <div className="stat-icon-wrapper bg-secondary bg-opacity-25 text-white">
                    <i className="bi bi-people"></i>
                  </div>
                </div>
                <h3 className="text-white fw-bold mb-1">{stats?.totalUsers || 0}</h3>
                <span className="text-secondary small">Customers registered</span>
              </div>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="p-4 rounded-4 border border-secondary" style={{ backgroundColor: '#131620' }}>
            <h5 className="text-white fw-bold mb-3">Recent Bookings</h5>

            {recentBookings.length === 0 ? (
              <p className="text-secondary small mb-0">No bookings recorded yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead className="table-secondary text-uppercase small text-secondary">
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Movie</th>
                      <th>Theatre</th>
                      <th>Seats</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b) => (
                      <tr key={b._id}>
                        <td className="font-monospace small text-danger">{b.bookingId}</td>
                        <td>
                          <div className="text-white fw-semibold">{b.user?.name || 'Customer'}</div>
                          <div className="text-secondary small">{b.user?.email}</div>
                        </td>
                        <td className="text-white">{b.movie?.title}</td>
                        <td className="text-secondary small">{b.theatre?.name}</td>
                        <td className="text-danger fw-bold">{b.seats?.join(', ')}</td>
                        <td className="text-white fw-bold">₹{b.totalAmount}</td>
                        <td>
                          <span className={`badge ${b.status === 'confirmed' ? 'bg-success' : 'bg-danger'}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
