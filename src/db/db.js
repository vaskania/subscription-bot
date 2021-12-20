const mongoose = require('mongoose');

const connectDB = () => mongoose.connect(process.env.DB_URI);

const closeDB = () => {
  mongoose.connection.close();
};

module.exports = { connectDB, closeDB };
