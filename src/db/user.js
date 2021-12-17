const User = require('../model/user');
const logger = require('../log/logger');

const createUserLocation = (userId, timezone) => {
  try {
    const newUser = new User({
      chatId: userId.chat.id,
      location: userId.location,
      timezone: timezone / 3600,
    });
    logger.info('Create location');
    newUser.save();
  } catch (error) {
    throw new Error(error);
  }
};

const updateUserLocation = async (userId, timezone) => {
  try {
    await User.findOneAndUpdate(
      { chatId: userId.chat.id },
      { location: userId.location },
      { timezone: timezone / 3600 },
    );
    logger.info('Update location');
  } catch (error) {
    throw new Error(error);
  }
};
const setUser = async (msg, timezone) => {
  try {
    const user = await User.findOne({ chatId: msg.chat.id });
    if (!user) {
      return createUserLocation(msg, timezone);
    }
    return updateUserLocation(msg, timezone);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = setUser;
