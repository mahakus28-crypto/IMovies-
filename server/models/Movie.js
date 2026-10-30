const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Movie description is required']
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required']
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required']
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required']
    },
    rating: {
      type: Number,
      default: 8.0,
      min: 0,
      max: 10
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required']
    },
    bannerUrl: {
      type: String,
      default: ''
    },
    trailerUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['now_showing', 'upcoming'],
      default: 'now_showing'
    },
    director: {
      type: String,
      default: 'Director'
    },
    cast: {
      type: [String],
      default: []
    },
    certificate: {
      type: String,
      default: 'UA'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Movie', movieSchema);
