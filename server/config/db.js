const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies_db';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);

    // Auto-seed if database is brand new and has 0 movies
    try {
      const Movie = require('../models/Movie');
      const movieCount = await Movie.countDocuments();
      if (movieCount === 0) {
        console.log('Database is empty. Automatically seeding blockbuster movies and shows...');
        const seedDatabase = require('../seed/seeder');
        await seedDatabase();
      }
    } catch (seedErr) {
      console.warn('Auto-seed check skipped:', seedErr.message);
    }
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.log('----------------------------------------------------------------------');
    console.log('📌 NOTE: To use full database features, ensure MongoDB is active.');
    console.log('   - Local MongoDB: Run "net start MongoDB" or "mongod"');
    console.log('   - MongoDB Atlas: Paste your connection string in "server/.env"');
    console.log('----------------------------------------------------------------------');
  }
};

module.exports = connectDB;
