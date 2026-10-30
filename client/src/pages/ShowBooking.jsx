import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { showService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';

const ShowBooking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [screenLayout, setScreenLayout] = useState({ rows: 6, cols: 10, totalSeats: 60 });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mock_card');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const res = await showService.getById(showId);
        if (res.data) {
          setShow(res.data.show);
          if (res.data.screenLayout) {
            setScreenLayout(res.data.screenLayout);
          }
        }
      } catch (err) {
        toast.error('Failed to load show details.');
        navigate('/movies');
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId, navigate]);

  // Handle seat click toggle (max 8 seats per booking)
  const handleSeatToggle = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        toast.warning('You can select a maximum of 8 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Pricing calculations
  const calculatePricing = () => {
    if (!show || selectedSeats.length === 0) {
      return { subtotal: 0, fee: 0, tax: 0, total: 0 };
    }

    const subtotal = selectedSeats.reduce((sum, seat) => {
      const row = seat.charAt(0).toUpperCase();
      const isVip = row === 'A' || row === 'B';
      const seatPrice = isVip ? (show.vipPrice || show.price + 100) : show.price;
      return sum + seatPrice;
    }, 0);

    const fee = 30 * selectedSeats.length;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + fee + tax;

    return { subtotal, fee, tax, total };
  };

  const pricing = calculatePricing();

  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to proceed with booking.');
      navigate('/login', { state: { from: `/book/${showId}` } });
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to proceed.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmBooking = async () => {
    setBookingInProgress(true);
    try {
      const res = await bookingService.create({
        showId: show._id,
        seats: selectedSeats,
        paymentMethod
      });

      if (res.data?.success) {
        toast.success('Booking confirmed successfully!');
        setShowPaymentModal(false);
        navigate(`/booking-confirmation/${res.data.booking._id}`, {
          state: { booking: res.data.booking }
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to complete booking. Please try again.';
      toast.error(message);
      // If conflict (409), reload show to refresh already booked seats
      if (err.response?.status === 409) {
        const refreshed = await showService.getById(showId);
        if (refreshed.data?.show) {
          setShow(refreshed.data.show);
          setSelectedSeats([]);
        }
      }
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-white">Show Not Found</h4>
        <Link to="/movies" className="btn btn-imovies mt-3">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div className="booking-page py-4">
      <div className="container">
        {/* Top Header info */}
        <div className="p-3 mb-4 rounded-3 border border-secondary" style={{ backgroundColor: '#131620' }}>
          <div className="row g-3 align-items-center">
            <div className="col-md-7">
              <h4 className="text-white fw-bold mb-1">{show.movie?.title}</h4>
              <p className="text-secondary small mb-0">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                {show.theatre?.name} • Screen {show.screenNumber} • {show.theatre?.city}
              </p>
            </div>
            <div className="col-md-5 text-md-end text-secondary small">
              <span className="badge bg-danger fs-6 me-2">{show.format}</span>
              <span className="text-white fw-bold me-3">
                <i className="bi bi-calendar3 me-1"></i>{show.showDate}
              </span>
              <span className="text-white fw-bold">
                <i className="bi bi-clock me-1"></i>{show.showTime}
              </span>
            </div>
          </div>
        </div>

        {/* Main interactive area: Seat layout + Order Summary */}
        <div className="row g-4">
          {/* Seat Grid Layout */}
          <div className="col-lg-8">
            <div className="p-4 rounded-4 border border-secondary" style={{ backgroundColor: '#131620' }}>
              <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-3 mb-3">
                <h5 className="text-white fw-bold mb-0">Select Seats</h5>
                <span className="text-secondary small">
                  Max 8 seats per booking
                </span>
              </div>

              {/* The visual seat grid component */}
              <SeatGrid
                rows={screenLayout.rows}
                cols={screenLayout.cols}
                bookedSeats={show.bookedSeats || []}
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
              />
            </div>
          </div>

          {/* Pricing & Booking Summary */}
          <div className="col-lg-4">
            <div className="order-summary-card shadow-lg sticky-top" style={{ top: '90px' }}>
              <h5 className="text-white fw-bold mb-3 border-bottom border-secondary pb-2">
                Booking Summary
              </h5>

              {/* Selected seats pills */}
              <div className="mb-3">
                <div className="text-secondary small mb-1">Selected Seats:</div>
                {selectedSeats.length === 0 ? (
                  <span className="text-muted fst-italic small">No seats selected yet</span>
                ) : (
                  <div className="d-flex flex-wrap gap-1">
                    {selectedSeats.map(s => (
                      <span key={s} className="badge bg-danger fs-6 px-2 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="border-top border-secondary pt-3 mb-3 small">
                <div className="d-flex justify-content-between text-secondary mb-2">
                  <span>Tickets Subtotal ({selectedSeats.length})</span>
                  <span className="text-white fw-semibold">₹{pricing.subtotal}</span>
                </div>
                <div className="d-flex justify-content-between text-secondary mb-2">
                  <span>Convenience Fee</span>
                  <span className="text-white">₹{pricing.fee}</span>
                </div>
                <div className="d-flex justify-content-between text-secondary mb-2">
                  <span>Integrated Tax (GST 5%)</span>
                  <span className="text-white">₹{pricing.tax}</span>
                </div>
                <hr className="border-secondary my-2" />
                <div className="d-flex justify-content-between fs-5 fw-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-danger">₹{pricing.total}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="btn btn-imovies w-100 py-2 fs-6 fw-bold"
                disabled={selectedSeats.length === 0}
                onClick={handleProceedToPayment}
              >
                Proceed to Checkout ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'})
              </button>

              <div className="text-center mt-3 text-secondary small" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-shield-lock text-success me-1"></i>
                Mock Payment Demo • No Real Charges Applied
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Payment Modal */}
      {showPaymentModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-secondary text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-credit-card-2-front text-danger me-2"></i>
                  Complete Payment (Demo)
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={bookingInProgress}
                ></button>
              </div>

              <div className="modal-body">
                <div className="p-3 mb-3 rounded bg-black border border-secondary">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-secondary">Movie:</span>
                    <strong className="text-white">{show.movie?.title}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-secondary">Seats:</span>
                    <strong className="text-white">{selectedSeats.join(', ')}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary">Total Payable:</span>
                    <strong className="text-danger fs-5">₹{pricing.total}</strong>
                  </div>
                </div>

                <label className="form-label text-secondary small fw-bold">Select Demo Payment Method</label>
                <div className="d-flex flex-column gap-2 mb-3">
                  <label className={`p-3 rounded border cursor-pointer d-flex align-items-center gap-3 ${paymentMethod === 'mock_card' ? 'border-danger bg-danger-subtle bg-opacity-10 text-white' : 'border-secondary bg-dark text-secondary'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mock_card"
                      checked={paymentMethod === 'mock_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <i className="bi bi-credit-card fs-4 text-white"></i>
                    <div>
                      <div className="text-white fw-bold">Mock Credit / Debit Card</div>
                      <div className="small text-secondary">Instant mock authorization</div>
                    </div>
                  </label>

                  <label className={`p-3 rounded border cursor-pointer d-flex align-items-center gap-3 ${paymentMethod === 'mock_upi' ? 'border-danger bg-danger-subtle bg-opacity-10 text-white' : 'border-secondary bg-dark text-secondary'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mock_upi"
                      checked={paymentMethod === 'mock_upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <i className="bi bi-qr-code-scan fs-4 text-white"></i>
                    <div>
                      <div className="text-white fw-bold">Mock UPI / QR Pay</div>
                      <div className="small text-secondary">Google Pay, PhonePe, Paytm simulation</div>
                    </div>
                  </label>

                  <label className={`p-3 rounded border cursor-pointer d-flex align-items-center gap-3 ${paymentMethod === 'cash' ? 'border-danger bg-danger-subtle bg-opacity-10 text-white' : 'border-secondary bg-dark text-secondary'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <i className="bi bi-wallet2 fs-4 text-white"></i>
                    <div>
                      <div className="text-white fw-bold">Pay At Cinema Counter (Cash)</div>
                      <div className="small text-secondary">Reserve seats and pay upon arrival</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="modal-footer border-secondary">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={bookingInProgress}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-imovies px-4"
                  onClick={handleConfirmBooking}
                  disabled={bookingInProgress}
                >
                  {bookingInProgress ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Confirming Seats...
                    </>
                  ) : (
                    `Pay ₹${pricing.total} & Confirm`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBooking;
