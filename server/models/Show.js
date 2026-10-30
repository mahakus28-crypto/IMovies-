const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true
    },
    screenNumber: {
      type: Number,
      default: 1
    },
    showDate: {
      type: String, // Stored as ISO YYYY-MM-DD for reliable day-by-day matching
      required: [true, 'Show date is required']
    },
    showTime: {
      type: String, // E.g., '10:00 AM', '02:30 PM', '06:45 PM'
      required: [true, 'Show time is required']
    },
    format: {
      type: String,
      default: '2D'
    },
    price: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [50, 'Price must be at least 50']
    },
    vipPrice: {
      type: Number,
      default: function() {
        return this.price + 100;
      }
    },
    bookedSeats: {
      type: [String],
      default: []
    },
    totalSeats: {
      type: Number,
      default: 60
    }
  },
  {
    timestamps: true
  }
);

// Compound index to help quickly search shows by movie and date
showSchema.index({ movie: 1, showDate: 1, theatre: 1 });

module.exports = mongoose.model('Show', showSchema);
