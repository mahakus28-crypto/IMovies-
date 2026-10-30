const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowsForMovie,
  getShowById,
  createShow,
  updateShow,
  deleteShow
} = require('../controllers/showController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getShows);
router.get('/movie/:movieId', getShowsForMovie);
router.get('/:id', getShowById);

// Admin-only routes
router.post('/', protect, adminOnly, createShow);
router.put('/:id', protect, adminOnly, updateShow);
router.delete('/:id', protect, adminOnly, deleteShow);

module.exports = router;
