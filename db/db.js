const mongoose = require('mongoose');
const logger = require('../src/logger');

const db = mongoose
  .connect(
    process.env.DB_URI ||
      'mongodb+srv://vaskania:Hofmann123@cluster0.vfszr.mongodb.net/forecast?retryWrites=true&w=majority',
  )
  .then(() => {
    logger.info('Connected to db');
  })
  .catch((error) => {
    logger.error(error);
  });

module.exports = db;
