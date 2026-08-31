require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Song = require('../models/Song');
const songData = require('./songData');
const env = require('../config/env');

const seedDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Drop existing songs
    await Song.deleteMany({});
    console.log('Deleted existing songs.');

    // Insert new songs
    await Song.insertMany(songData);
    console.log(`Inserted ${songData.length} songs.`);

    // Create Admin User
    const adminEmail = 'admin@gaanaspot.com';
    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      await User.create({
        username: 'admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin'
      });
      console.log('Created admin user.');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
