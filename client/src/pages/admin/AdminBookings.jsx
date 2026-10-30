import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService, bookingService } from '../../services/api';
import AdminNav from '../../components/AdminNav';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await adminService.getAllBookings();
      setBookings(res.data?.bookings || []);
    } catch (err) {
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking and release its seats?')) {
      return;
    }
    setCancellingId(id);
    try {
      await bookingService.cancel(id);
      toast.success('Booking cancelled and seats released.');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="text-white fw-bold mb-0">Platform Bookings</h2>
          <p className="text-secondary small">Comprehensive log of all user ticket reservations</p>
        </div>
        <span className="badge bg-danger p-2 fs-6">
          {bookings.length} Total Bookings
        </span>
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
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Movie & Format</th>
                  <th>Theatre & Showtime</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="font-monospace small text-danger fw-bold">{b.bookingId}</td>
                    <td>
                      <div className="text-white fw-semibold">{b.user?.name || 'User'}</div>
                      <div className="text-secondary small">{b.user?.email}</div>
                    </td>
                    <td>
                      <div className="text-white">{b.movie?.title}</div>
                      <div className="text-secondary small">{b.movie?.duration}m</div>
                    </td>
                    <td>
                      <div className="text-white small">{b.theatre?.name}</div>
                      <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                        {b.show?.showDate} • {b.show?.showTime}
                      </div>
                    </td>
                    <td>
                      <span className="text-danger fw-bold">{b.seats?.join(', ')}</span>
                    </td>
                    <td>
                      <span className="text-white fw-bold">₹{b.totalAmount}</span>
                    </td>
                    <td>
                      <span className={`badge ${b.status === 'confirmed' ? 'bg-success' : 'bg-danger'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {b.status === 'confirmed' && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancelBooking(b._id)}
                          disabled={cancellingId === b._id}
                          title="Cancel booking"
                        >
                          {cancellingId === b._id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
