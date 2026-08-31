require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Song = require('../models/Song');
const songData = require('./songData');
const env = require('../config/env');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');

    // Drop indexes and existing songs to reset clean text index
    try {
      await Song.collection.dropIndexes();
    } catch (e) {
      // ignore if indexes do not exist yet
    }

    await Song.deleteMany({});
    console.log('Deleted existing songs.');

    const preparedSongs = songData.map(song => {
      const releaseYear = song.releaseYear || 2020;
      const dec = Math.floor(releaseYear / 10) * 10;
      const norm = (song.title || '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim();
      return {
        ...song,
        decade: `${dec}s`,
        normalizedTitle: norm,
        isActive: true
      };
    });

    // Insert new songs in batches of 200
    for (let i = 0; i < preparedSongs.length; i += 200) {
      const batch = preparedSongs.slice(i, i + 200);
      await Song.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / 200) + 1} (${batch.length} songs)`);
    }

    console.log(`Successfully seeded total ${preparedSongs.length} Bollywood songs!`);

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
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
