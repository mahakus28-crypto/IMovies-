import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { bookingService } from '../services/api';

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking) {
      const fetchBooking = async () => {
        try {
          const res = await bookingService.getById(id);
          setBooking(res.data?.booking);
        } catch (err) {
          console.error('Failed to load booking:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [id, booking]);

  if (loading) {
    return (
      <div className="text-center py-5 vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-white">Booking Not Found</h4>
        <Link to="/" className="btn btn-imovies mt-3">Go to Home</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          {/* Success Banner */}
          <div className="text-center mb-4">
            <div
              className="rounded-circle bg-success bg-opacity-25 text-success d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '70px', height: '70px' }}
            >
              <i className="bi bi-check-circle-fill display-5"></i>
            </div>
            <h2 className="text-white fw-bold">Booking Confirmed!</h2>
            <p className="text-secondary">Your movie ticket has been booked successfully.</p>
          </div>

          {/* Ticket Card */}
          <div className="p-4 p-md-5 rounded-4 border border-secondary shadow-lg position-relative" style={{ backgroundColor: '#131620' }}>
            <div className="d-flex justify-content-between align-items-start border-bottom border-secondary pb-3 mb-4">
              <div>
                <span className="badge bg-danger mb-2">
                  <i className="bi bi-film me-1"></i>IMOVIES DIGITAL PASS
                </span>
                <h3 className="text-white fw-bold mb-1">{booking.movie?.title}</h3>
                <p className="text-secondary small mb-0">
                  {booking.theatre?.name} • Screen {booking.show?.screenNumber || 1}
                </p>
              </div>
              <div className="text-end">
                <span className="text-secondary small d-block">Booking Reference</span>
                <span className="badge bg-dark border border-secondary text-white font-monospace fs-6">
                  {booking.bookingId}
                </span>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6 col-sm-3">
                <span className="text-secondary small d-block">Date</span>
                <strong className="text-white">{booking.show?.showDate}</strong>
              </div>
              <div className="col-6 col-sm-3">
                <span className="text-secondary small d-block">Showtime</span>
                <strong className="text-white">{booking.show?.showTime}</strong>
              </div>
              <div className="col-6 col-sm-3">
                <span className="text-secondary small d-block">Seats</span>
                <strong className="text-danger fs-6">{booking.seats?.join(', ')}</strong>
              </div>
              <div className="col-6 col-sm-3">
                <span className="text-secondary small d-block">Total Paid</span>
                <strong className="text-white fs-6">₹{booking.totalAmount}</strong>
              </div>
            </div>

            {/* Digital Entry Pass Mockup */}
            <div className="p-3 rounded-3 bg-black border border-secondary d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mb-4">
              <div className="text-center text-sm-start">
                <span className="badge bg-success mb-1">Payment Completed</span>
                <div className="text-secondary small">
                  Transaction ID: <span className="text-white font-monospace">{booking.payment?.transactionId || 'TXN-PAID'}</span>
                </div>
                <div className="text-secondary small">
                  Method: <span className="text-capitalize text-white">{booking.payment?.paymentMethod?.replace('_', ' ') || 'Demo Card'}</span>
                </div>
              </div>
              {/* Barcode representation */}
              <div className="text-center font-monospace text-secondary p-2 bg-dark rounded border border-secondary" style={{ letterSpacing: '4px' }}>
                ||| | |||| | ||| |||| |
                <div style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>SCAN AT CINEMA GATE</div>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex flex-column flex-sm-row gap-3">
              <button
                className="btn btn-outline-light flex-grow-1"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer me-2"></i>Print Ticket
              </button>
              <Link to="/profile" className="btn btn-imovies flex-grow-1 text-center">
                <i className="bi bi-clock-history me-2"></i>View in My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
