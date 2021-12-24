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
    logger.error(error);
    throw new Error('Location is not setted');
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
    throw new Error("Couldn't update location");
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
    throw new Error('Something went wrong.');
  }
};

const findUser = async (chatId) => {
  const user = await User.findOne({ chatId });
  return user;
};

const setUserTime = async (chatId, userTime) => {
  const user = await User.findOneAndUpdate({ chatId }, { schedule: userTime });
  return user;
};

const matchedUserTime = async (currentTime) => {
  const users = await User.find({ schedule: currentTime });
  return users;
};

module.exports = { setUser, findUser, setUserTime, matchedUserTime };
