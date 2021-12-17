const mongoose = require('mongoose');
const logger = require('../log/logger');

const db = mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    logger.info('Connected to db');
  })
  .catch((error) => {
    logger.error(error);
  });

module.exports = db;
