import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { bookingService, authService } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data?.bookings || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await authService.updateProfile(formData);
      updateUser(res.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will release your seats.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await bookingService.cancel(bookingId);
      if (res.data?.success) {
        toast.success('Booking cancelled and seats released successfully.');
        // Refresh bookings
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* User Info Column */}
        <div className="col-lg-4">
          <div className="p-4 rounded-4 border border-secondary shadow" style={{ backgroundColor: '#131620' }}>
            <div className="text-center mb-4">
              <div
                className="rounded-circle bg-danger text-white mx-auto d-flex align-items-center justify-content-center mb-3 shadow"
                style={{ width: '80px', height: '80px', fontSize: '2rem', fontWeight: 'bold' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-white fw-bold mb-1">{user?.name}</h4>
              <p className="text-secondary small mb-2">{user?.email}</p>
              <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                {user?.role?.toUpperCase()} ACCOUNT
              </span>
            </div>

            <hr className="border-secondary" />

            {!isEditing ? (
              <div className="text-secondary small">
                <div className="d-flex justify-content-between py-2 border-bottom border-dark">
                  <span>Phone:</span>
                  <span className="text-white">{user?.phone || 'Not provided'}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom border-dark">
                  <span>Role:</span>
                  <span className="text-white text-capitalize">{user?.role}</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span>Total Bookings:</span>
                  <span className="text-white fw-bold">{bookings.length}</span>
                </div>

                <button
                  className="btn btn-outline-light w-100 mt-3 btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil-square me-1"></i>Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Full Name</label>
                  <input
                    type="text"
                    className="form-control bg-dark border-secondary text-white form-control-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Phone</label>
                  <input
                    type="text"
                    className="form-control bg-dark border-secondary text-white form-control-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary w-50"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-imovies w-50"
                    disabled={updatingProfile}
                  >
                    {updatingProfile ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bookings History Column */}
        <div className="col-lg-8">
          <div className="p-4 rounded-4 border border-secondary shadow" style={{ backgroundColor: '#131620' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-white fw-bold mb-0">
                <i className="bi bi-ticket-perforated-fill text-danger me-2"></i>
                Booking History
              </h4>
              <span className="badge bg-dark border border-secondary text-secondary">
                {bookings.length} Record{bookings.length === 1 ? '' : 's'}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status"></div>
                <p className="text-secondary mt-2">Loading your bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-calendar-x text-secondary display-4 d-block mb-3"></i>
                <h5 className="text-white">No Bookings Yet</h5>
                <p className="text-secondary small">You haven't booked any movie tickets yet.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {bookings.map((booking) => {
                  const isConfirmed = booking.status === 'confirmed';

                  return (
                    <div
                      key={booking._id}
                      className="p-3 rounded-3 border border-secondary"
                      style={{ backgroundColor: '#0d0f15' }}
                    >
                      <div className="row g-3 align-items-center">
                        {/* Poster thumbnail */}
                        <div className="col-3 col-sm-2">
                          <img
                            src={booking.movie?.posterUrl || 'https://via.placeholder.com/80x120'}
                            alt={booking.movie?.title}
                            className="img-fluid rounded border border-secondary"
                            style={{ maxHeight: '110px', objectFit: 'cover', width: '100%' }}
                          />
                        </div>

                        {/* Details */}
                        <div className="col-9 col-sm-6">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="badge bg-dark border border-secondary font-monospace" style={{ fontSize: '0.7rem' }}>
                              {booking.bookingId}
                            </span>
                            <span className={`badge ${isConfirmed ? 'bg-success' : 'bg-danger'}`}>
                              {booking.status?.toUpperCase()}
                            </span>
                          </div>

                          <h5 className="text-white fw-bold mb-1 text-truncate">
                            {booking.movie?.title}
                          </h5>

                          <div className="text-secondary small">
                            <i className="bi bi-geo-alt text-danger me-1"></i>
                            {booking.theatre?.name} • Screen {booking.show?.screenNumber || 1}
                          </div>

                          <div className="text-secondary small mt-1">
                            <span className="text-white fw-semibold me-2">{booking.show?.showDate}</span>
                            <span>{booking.show?.showTime}</span>
                          </div>

                          <div className="mt-2 text-secondary small">
                            Seats: <strong className="text-danger">{booking.seats?.join(', ')}</strong>
                          </div>
                        </div>

                        {/* Pricing & Actions */}
                        <div className="col-12 col-sm-4 text-sm-end pt-2 pt-sm-0 border-top border-sm-top-0 border-secondary">
                          <div className="fs-5 fw-bold text-white mb-1">
                            ₹{booking.totalAmount}
                          </div>
                          <div className="text-secondary small mb-3">
                            {booking.seats?.length} {booking.seats?.length === 1 ? 'ticket' : 'tickets'}
                          </div>

                          {isConfirmed && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={cancellingId === booking._id}
                            >
                              {cancellingId === booking._id ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-x-circle me-1"></i>Cancel Booking
                                </>
                              )}
                            </button>
                          )}
                          {!isConfirmed && (
                            <span className="text-danger small fst-italic">
                              Cancelled on {new Date(booking.cancelledAt || booking.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
