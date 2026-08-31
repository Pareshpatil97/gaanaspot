const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    let retries = 5;
    while (retries) {
      try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('MongoDB Connected...');
        break;
      } catch (err) {
        console.error('MongoDB connection error:', err.message);
        retries -= 1;
        console.log(`Retries left: ${retries}`);
        await new Promise(res => setTimeout(res, 5000));
      }
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectDB;
