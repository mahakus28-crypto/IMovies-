const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedData = require('./seedData');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

dotenv.config();

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing collections...');
    await User.deleteMany();
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();

    console.log('Seeding Users...');
    const admin = await User.create(seedData.adminUser);
    const demoUser = await User.create(seedData.demoUser);
    console.log(`✓ Admin created: ${admin.email} / admin123`);
    console.log(`✓ Demo user created: ${demoUser.email} / user123`);

    console.log('Seeding Theatres...');
    const createdTheatres = await Theatre.insertMany(seedData.theatres);
    console.log(`✓ ${createdTheatres.length} Theatres inserted`);

    console.log('Seeding Movies...');
    const createdMovies = await Movie.insertMany(seedData.movies);
    console.log(`✓ ${createdMovies.length} Movies inserted`);

    console.log('Generating Shows for the upcoming days...');
    const showTimes = ['10:30 AM', '02:00 PM', '06:00 PM', '09:30 PM'];
    const formats = ['2D', '3D', 'IMAX 3D', '4DX'];
    const prices = [220, 280, 350, 420];

    const showsToInsert = [];
    const nowShowingMovies = createdMovies.filter(m => m.status === 'now_showing');

    // Generate shows for next 5 days
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      const dateStr = formatDate(d);

      for (const theatre of createdTheatres) {
        for (let mIdx = 0; mIdx < nowShowingMovies.length; mIdx++) {
          const movie = nowShowingMovies[mIdx];
          // Pick 2-3 showtimes per movie in this theatre
          const times = [showTimes[mIdx % showTimes.length], showTimes[(mIdx + 2) % showTimes.length]];

          times.forEach((time, tIdx) => {
            const format = formats[(mIdx + tIdx) % formats.length];
            const basePrice = prices[(mIdx + tIdx) % prices.length];
            
            // Pre-seed some booked seats on day 0 to showcase real seat status in the grid
            let initialBookedSeats = [];
            if (dayOffset === 0 && tIdx === 0) {
              initialBookedSeats = ['A3', 'A4', 'B5', 'C5', 'C6', 'D7'];
            }

            showsToInsert.push({
              movie: movie._id,
              theatre: theatre._id,
              screenNumber: (tIdx % 2) + 1,
              showDate: dateStr,
              showTime: time,
              format,
              price: basePrice,
              vipPrice: basePrice + 120,
              bookedSeats: initialBookedSeats,
              totalSeats: 60
            });
          });
        }
      }
    }

    const insertedShows = await Show.insertMany(showsToInsert);
    console.log(`✓ ${insertedShows.length} Shows scheduled and indexed`);

    // Create a demo booking for the demo user on first show
    const sampleShow = insertedShows[0];
    const bookingCode = `IMOV-${Date.now().toString().slice(-6)}-101`;
    const demoBooking = await Booking.create({
      bookingId: bookingCode,
      user: demoUser._id,
      show: sampleShow._id,
      movie: sampleShow.movie,
      theatre: sampleShow.theatre,
      seats: ['B1', 'B2'],
      seatDetails: [
        { seatNumber: 'B1', seatType: 'vip', price: sampleShow.vipPrice },
        { seatNumber: 'B2', seatType: 'vip', price: sampleShow.vipPrice }
      ],
      convenienceFee: 60,
      taxAmount: Math.round(sampleShow.vipPrice * 2 * 0.05),
      totalAmount: (sampleShow.vipPrice * 2) + 60 + Math.round(sampleShow.vipPrice * 2 * 0.05),
      status: 'confirmed'
    });

    const payment = await Payment.create({
      booking: demoBooking._id,
      user: demoUser._id,
      amount: demoBooking.totalAmount,
      paymentMethod: 'mock_card',
      paymentStatus: 'completed',
      transactionId: `TXN-DEMO-${Date.now()}`
    });

    demoBooking.payment = payment._id;
    await demoBooking.save();

    // Mark seats as booked in the show
    await Show.findByIdAndUpdate(sampleShow._id, {
      $push: { bookedSeats: { $each: ['B1', 'B2'] } }
    });

    console.log(`✓ Sample booking created with code: ${bookingCode}`);
    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
