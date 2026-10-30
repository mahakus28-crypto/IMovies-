const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Payment = require('../models/Payment');
const Movie = require('../models/Movie');

// @desc    Create a new booking with atomic seat reservation
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seats, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid show ID and at least one seat'
      });
    }

    // Verify show existence
    const show = await Show.findById(showId).populate('movie').populate('theatre');
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // ATOMIC RESERVATION: Ensure none of the requested seats are in bookedSeats
    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        bookedSeats: { $nin: seats } // No collision allowed
      },
      {
        $push: { bookedSeats: { $each: seats } }
      },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(409).json({
        success: false,
        message: 'One or more selected seats have already been booked. Please pick different seats.'
      });
    }

    // Price calculation: VIP rows (A & B) vs Standard rows (C+)
    const seatDetails = seats.map(seat => {
      const row = seat.charAt(0).toUpperCase();
      const isVip = row === 'A' || row === 'B';
      const seatPrice = isVip ? (show.vipPrice || show.price + 100) : show.price;
      return {
        seatNumber: seat,
        seatType: isVip ? 'vip' : 'standard',
        price: seatPrice
      };
    });

    const subtotal = seatDetails.reduce((sum, item) => sum + item.price, 0);
    const convenienceFee = 30 * seats.length;
    const taxAmount = Math.round(subtotal * 0.05); // 5% GST/Tax
    const totalAmount = subtotal + convenienceFee + taxAmount;

    // Unique Booking Code
    const bookingId = `IMOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // Create Booking
    const booking = new Booking({
      bookingId,
      user: userId,
      show: show._id,
      movie: show.movie._id,
      theatre: show.theatre._id,
      seats,
      seatDetails,
      convenienceFee,
      taxAmount,
      totalAmount,
      status: 'confirmed'
    });

    // Create Mock Payment
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const payment = await Payment.create({
      booking: booking._id,
      user: userId,
      amount: totalAmount,
      paymentMethod: paymentMethod || 'mock_card',
      paymentStatus: 'completed',
      transactionId
    });

    booking.payment = payment._id;
    await booking.save();

    // Populate full details for immediate frontend response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie')
      .populate('theatre')
      .populate('show')
      .populate('payment');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user booking history
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie')
      .populate('theatre')
      .populate('show')
      .populate('payment')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking details by booking ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie')
      .populate('theatre')
      .populate('show')
      .populate('payment')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Ensure authorized user or admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking and release seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify ownership or admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    // Release booked seats atomically from Show
    await Show.findByIdAndUpdate(booking.show, {
      $pull: { bookedSeats: { $in: booking.seats } }
    });

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    // Update payment to refunded
    if (booking.payment) {
      await Payment.findByIdAndUpdate(booking.payment, {
        paymentStatus: 'refunded'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been released.',
      booking
    });
  } catch (error) {
    next(error);
  }
};
