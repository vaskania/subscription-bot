const mongoose = require('mongoose');

const db = mongoose
  .connect(
    process.env.DB_URI ||
      'mongodb+srv://vaskania:Hofmann123@cluster0.vfszr.mongodb.net/forecast?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('Connected to db');
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = db;
