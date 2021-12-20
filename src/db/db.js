const mongoose = require('mongoose');
const logger = require('../log/logger');

const connectDB = () =>
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      logger.info('Connected to db');
    })
    .catch((error) => {
      logger.error(error);
    });
const closeDB = () => {
  logger.info('DB closed');
  mongoose.connection.close();
};

module.exports = { connectDB, closeDB };
