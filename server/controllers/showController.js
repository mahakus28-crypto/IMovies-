const Show = require('../models/Show');
const Theatre = require('../models/Theatre');
const Movie = require('../models/Movie');

// @desc    Get shows by filters (movie, date, theatre)
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    const { movieId, date, theatreId } = req.query;
    let query = {};

    if (movieId) query.movie = movieId;
    if (date) query.showDate = date;
    if (theatreId) query.theatre = theatreId;

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration genre language certificate rating')
      .populate('theatre', 'name city location screens')
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({ success: true, count: shows.length, shows });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shows grouped by theatre for a movie & date
// @route   GET /api/shows/movie/:movieId
// @access  Public
exports.getShowsForMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    let query = { movie: movieId };
    if (date) {
      query.showDate = date;
    }

    const shows = await Show.find(query)
      .populate('theatre')
      .sort({ showTime: 1 });

    // Group shows by theatre
    const grouped = {};
    shows.forEach(show => {
      if (!show.theatre) return;
      const tId = show.theatre._id.toString();
      if (!grouped[tId]) {
        grouped[tId] = {
          theatre: show.theatre,
          shows: []
        };
      }
      grouped[tId].shows.push({
        _id: show._id,
        showDate: show.showDate,
        showTime: show.showTime,
        format: show.format,
        price: show.price,
        vipPrice: show.vipPrice,
        screenNumber: show.screenNumber,
        totalSeats: show.totalSeats,
        availableSeatsCount: show.totalSeats - (show.bookedSeats ? show.bookedSeats.length : 0)
      });
    });

    res.status(200).json({
      success: true,
      theatres: Object.values(grouped)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show details including booked seats
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theatre');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Get screen info from theatre to know rows & cols
    const screen = show.theatre?.screens?.find(s => s.screenNumber === show.screenNumber) || {
      rows: 6,
      cols: 10,
      totalSeats: 60
    };

    res.status(200).json({
      success: true,
      show,
      screenLayout: {
        rows: screen.rows || 6,
        cols: screen.cols || 10,
        totalSeats: show.totalSeats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create show
// @route   POST /api/shows
// @access  Private (Admin)
exports.createShow = async (req, res, next) => {
  try {
    const { movie, theatre, screenNumber, showDate, showTime, format, price, vipPrice } = req.body;

    const theatreDoc = await Theatre.findById(theatre);
    if (!theatreDoc) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const movieDoc = await Movie.findById(movie);
    if (!movieDoc) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const screen = theatreDoc.screens.find(s => s.screenNumber === Number(screenNumber || 1));
    const totalSeats = screen ? (screen.rows * screen.cols) : 60;

    const show = await Show.create({
      movie,
      theatre,
      screenNumber: Number(screenNumber) || 1,
      showDate,
      showTime,
      format: format || '2D',
      price: Number(price),
      vipPrice: vipPrice ? Number(vipPrice) : Number(price) + 100,
      totalSeats
    });

    res.status(201).json({ success: true, show });
  } catch (error) {
    next(error);
  }
};

// @desc    Update show
// @route   PUT /api/shows/:id
// @access  Private (Admin)
exports.updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('movie').populate('theatre');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.status(200).json({ success: true, show });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private (Admin)
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    await show.deleteOne();
    res.status(200).json({ success: true, message: 'Show deleted successfully' });
  } catch (error) {
    next(error);
  }
};
