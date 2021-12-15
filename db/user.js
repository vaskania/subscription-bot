const mongoose = require('mongoose');
const User = require('../model/user');
const logger = require('../src/logger');

mongoose
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

const createUser = (userId, time) => {
  const newUser = new User({
    chatId: userId.chat.id,
    location: userId.location,
    date: time,
  });
  newUser.save();
};

const updateUserLocation = (userId, userTime) => {
  User.findOneAndUpdate(
    { chatId: userId.chat.id },
    { location: userId.location },
    { date: userTime },
    (err, data) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info(data);
      }
    },
  );
};

const findUser = async (msg, time) => {
  const user = await User.findOne({ chatId: msg.chat.id });
  if (!user) {
    return createUser(msg, time);
  }
  return updateUserLocation(msg, time);
};

module.exports = findUser;
