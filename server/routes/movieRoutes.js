const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getFilterOptions
} = require('../controllers/movieController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/meta/filters', getFilterOptions);
router.get('/', getMovies);
router.get('/:id', getMovieById);

// Admin-only routes
router.post('/', protect, adminOnly, createMovie);
router.put('/:id', protect, adminOnly, updateMovie);
router.delete('/:id', protect, adminOnly, deleteMovie);

module.exports = router;
