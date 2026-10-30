const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllBookings,
  getAllUsers
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes in this file require Admin authorization
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);

module.exports = router;
