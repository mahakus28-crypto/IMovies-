const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    default: 'Screen 1'
  },
  totalSeats: {
    type: Number,
    default: 60
  },
  rows: {
    type: Number,
    default: 6
  },
  cols: {
    type: Number,
    default: 10
  }
});

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Address/Location is required'],
      trim: true
    },
    screens: [screenSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Theatre', theatreSchema);
