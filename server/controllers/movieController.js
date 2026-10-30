const Movie = require('../models/Movie');
const Show = require('../models/Show');

// @desc    Get all movies with search & filter
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    const { search, genre, language, status, sort } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (genre && genre !== 'All') {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }

    if (language && language !== 'All') {
      query.language = { $regex: `^${language}$`, $options: 'i' };
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    let sortOptions = { releaseDate: -1 };
    if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    }

    const movies = await Movie.find(query).sort(sortOptions);
    res.status(200).json({ success: true, count: movies.length, movies });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.status(200).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private (Admin)
exports.createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      duration,
      genre,
      language,
      releaseDate,
      rating,
      posterUrl,
      bannerUrl,
      trailerUrl,
      status,
      director,
      cast,
      certificate
    } = req.body;

    const movie = await Movie.create({
      title,
      description,
      duration: Number(duration),
      genre: Array.isArray(genre) ? genre : genre.split(',').map(g => g.trim()),
      language,
      releaseDate,
      rating: rating ? Number(rating) : 8.0,
      posterUrl,
      bannerUrl: bannerUrl || '',
      trailerUrl: trailerUrl || '',
      status: status || 'now_showing',
      director: director || 'Director',
      cast: Array.isArray(cast) ? cast : (cast ? cast.split(',').map(c => c.trim()) : []),
      certificate: certificate || 'UA'
    });

    res.status(201).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private (Admin)
exports.updateMovie = async (req, res, next) => {
  try {
    let updateData = { ...req.body };
    if (updateData.genre && !Array.isArray(updateData.genre)) {
      updateData.genre = updateData.genre.split(',').map(g => g.trim());
    }
    if (updateData.cast && !Array.isArray(updateData.cast)) {
      updateData.cast = updateData.cast.split(',').map(c => c.trim());
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    res.status(200).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private (Admin)
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Cascade delete any shows associated with this movie
    await Show.deleteMany({ movie: movie._id });
    await movie.deleteOne();

    res.status(200).json({ success: true, message: 'Movie and related shows deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get metadata (distinct genres & languages)
// @route   GET /api/movies/meta/filters
// @access  Public
exports.getFilterOptions = async (req, res, next) => {
  try {
    const genres = await Movie.distinct('genre');
    const languages = await Movie.distinct('language');
    res.status(200).json({ success: true, genres, languages });
  } catch (error) {
    next(error);
  }
};
