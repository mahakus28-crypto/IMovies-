const Theatre = require('../models/Theatre');
const Show = require('../models/Show');

// @desc    Get all theatres
// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    let query = {};
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    const theatres = await Theatre.find(query).sort({ name: 1 });
    res.status(200).json({ success: true, count: theatres.length, theatres });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }
    res.status(200).json({ success: true, theatre });
  } catch (error) {
    next(error);
  }
};

// @desc    Create theatre
// @route   POST /api/theatres
// @access  Private (Admin)
exports.createTheatre = async (req, res, next) => {
  try {
    const { name, city, location, screens } = req.body;

    const defaultScreens = screens && screens.length > 0 ? screens : [
      { screenNumber: 1, name: 'Audi 1 - Laser 4K', totalSeats: 60, rows: 6, cols: 10 },
      { screenNumber: 2, name: 'Audi 2 - Dolby Atmos', totalSeats: 60, rows: 6, cols: 10 }
    ];

    const theatre = await Theatre.create({
      name,
      city,
      location,
      screens: defaultScreens
    });

    res.status(201).json({ success: true, theatre });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private (Admin)
exports.updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    res.status(200).json({ success: true, theatre });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre
// @route   DELETE /api/theatres/:id
// @access  Private (Admin)
exports.deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    await Show.deleteMany({ theatre: theatre._id });
    await theatre.deleteOne();

    res.status(200).json({ success: true, message: 'Theatre and related shows deleted successfully' });
  } catch (error) {
    next(error);
  }
};
