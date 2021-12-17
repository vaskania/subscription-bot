const User = require('../model/user');
const registerTime = require('../scheduler/registerTime');
const logger = require('../src/logger');

const setUserTime = async (userId, userTime) => {
  try {
    const time = await User.findOne({ chatId: userId });
    const setUser = registerTime(time.timezone, userTime);
    await User.findOneAndUpdate({ chatId: userId }, { schedule: setUser });
    logger.info('Time setted');
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = setUserTime;
