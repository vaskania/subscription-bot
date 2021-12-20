const User = require('../model/user');
const logger = require('../log/logger');

const createUserLocation = (chatId, timezone) => {
  try {
    const newUser = new User({
      chatId,
      location: chatId.location,
      timezone: timezone / 3600,
    });
    logger.info('Create location');
    newUser.save();
  } catch (error) {
    throw new Error(error);
  }
};

const updateUserLocation = async (chatId, timezone) => {
  try {
    await User.findOneAndUpdate(
      { chatId },
      { location: chatId.location },
      { timezone: timezone / 3600 },
    );
    logger.info('Update location');
  } catch (error) {
    throw new Error(error);
  }
};
const setUser = async (msg, timezone) => {
  const chatId = msg.chat.id;
  try {
    const user = await User.findOne({ chatId });
    if (!user) {
      return createUserLocation(chatId, timezone);
    }
    return updateUserLocation(chatId, timezone);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = setUser;
