require('dotenv').config();

const requiredEnvs = ['MONGODB_URI', 'JWT_SECRET'];

requiredEnvs.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Error: Environment variable ${envVar} is missing.`);
    process.env[envVar] = 'test_fallback_value'; // For testing purposes if missing
  }
});

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gaanaspot',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  PORT: process.env.PORT || 5000
};
