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
    console.log(`✓ ${createdTheatres.length} Theatres inserted across Mumbai, Delhi NCR, and Bengaluru`);

    console.log('Seeding Movies...');
    const createdMovies = await Movie.insertMany(seedData.movies);
    console.log(`✓ ${createdMovies.length} Blockbuster Movies inserted`);

    console.log('Generating dynamic show schedules for the next 7 days...');
    const showTimes = ['09:45 AM', '01:15 PM', '04:45 PM', '08:15 PM', '10:30 PM'];
    const formats = ['2D', '3D', 'IMAX 3D', '4DX', 'Dolby Atmos'];
    const prices = [220, 280, 360, 420, 480];

    const showsToInsert = [];
    const nowShowingMovies = createdMovies.filter(m => m.status === 'now_showing');

    // Generate shows for next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      const dateStr = formatDate(d);

      for (const theatre of createdTheatres) {
        for (let mIdx = 0; mIdx < nowShowingMovies.length; mIdx++) {
          const movie = nowShowingMovies[mIdx];
          // Pick 2-3 showtimes per movie in this theatre
          const times = [
            showTimes[mIdx % showTimes.length],
            showTimes[(mIdx + 2) % showTimes.length]
          ];

          times.forEach((time, tIdx) => {
            const format = formats[(mIdx + tIdx) % formats.length];
            const basePrice = prices[(mIdx + tIdx) % prices.length];

            // Add varied pre-booked seats to make the seat selection grid visually realistic
            let initialBookedSeats = [];
            if (dayOffset === 0) {
              const seedBookings = [
                ['A3', 'A4', 'B5', 'C4', 'C5', 'D6'],
                ['B3', 'B4', 'C6', 'C7', 'E4', 'E5'],
                ['A1', 'A2', 'C2', 'C3', 'D5', 'D6', 'F7']
              ];
              initialBookedSeats = seedBookings[(mIdx + tIdx) % seedBookings.length];
            } else if (dayOffset === 1) {
              initialBookedSeats = ['B4', 'B5', 'C5'];
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

    // Create 1 Confirmed Booking for John Doe
    const sampleShow = insertedShows[0];
    const bookingCode1 = `IMOV-${Date.now().toString().slice(-6)}-101`;
    const demoBooking1 = await Booking.create({
      bookingId: bookingCode1,
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

    const payment1 = await Payment.create({
      booking: demoBooking1._id,
      user: demoUser._id,
      amount: demoBooking1.totalAmount,
      paymentMethod: 'mock_card',
      paymentStatus: 'completed',
      transactionId: `TXN-DEMO-${Date.now()}-101`
    });

    demoBooking1.payment = payment1._id;
    await demoBooking1.save();

    await Show.findByIdAndUpdate(sampleShow._id, {
      $push: { bookedSeats: { $each: ['B1', 'B2'] } }
    });

    // Create 1 Cancelled Booking for John Doe (to demonstrate refund & cancellation history)
    const secondShow = insertedShows[1];
    const bookingCode2 = `IMOV-${(Date.now() - 100000).toString().slice(-6)}-102`;
    const demoBooking2 = await Booking.create({
      bookingId: bookingCode2,
      user: demoUser._id,
      show: secondShow._id,
      movie: secondShow.movie,
      theatre: secondShow.theatre,
      seats: ['D1'],
      seatDetails: [
        { seatNumber: 'D1', seatType: 'standard', price: secondShow.price }
      ],
      convenienceFee: 30,
      taxAmount: Math.round(secondShow.price * 0.05),
      totalAmount: secondShow.price + 30 + Math.round(secondShow.price * 0.05),
      status: 'cancelled',
      cancelledAt: new Date()
    });

    const payment2 = await Payment.create({
      booking: demoBooking2._id,
      user: demoUser._id,
      amount: demoBooking2.totalAmount,
      paymentMethod: 'mock_upi',
      paymentStatus: 'refunded',
      transactionId: `TXN-DEMO-${Date.now()}-102`
    });

    demoBooking2.payment = payment2._id;
    await demoBooking2.save();

    console.log(`✓ Sample Confirmed Booking: ${bookingCode1}`);
    console.log(`✓ Sample Cancelled Booking: ${bookingCode2}`);
    console.log('====================================================');
    console.log('🎬 IMovies database seeding completed successfully!');
    console.log('====================================================');
    return { success: true, count: createdMovies.length };
  } catch (err) {
    console.error('Error seeding database:', err);
    throw err;
  }
};

// If run directly via CLI: node seed/seeder.js
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedDatabase;
