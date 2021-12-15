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

const createUser = (userId) => {
  const newUser = new User({
    chatId: userId.chat.id,
    location: userId.location,
  });
  newUser.save();
};

const updateUserLocation = (userId) => {
  User.findOneAndUpdate(
    { chatId: userId.chat.id },
    { location: userId.location },
    (err, data) => {
      if (err) {
        logger.log(err);
      } else {
        logger.info(data);
      }
    },
  );
};

const findUser = async (msg) => {
  const user = await User.findOne({ chatId: msg.chat.id });
  if (!user) {
    return createUser(msg);
  }
  return updateUserLocation(msg);
};

module.exports = findUser;
