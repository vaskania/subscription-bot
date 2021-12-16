const User = require('../model/user');
const registerTime = require('../scheduler/registerTime');

const setUserTime = (userId) => {
  const newUser = new User({
    chatId: userId,
  });
  console.log('set time');
  newUser.save();
};

const updateUserTime = async (userId, userTime) => {
  const time = await User.findOne({ chatId: userId });
  const setUser = registerTime(time.timezone, userTime);
  console.log(typeof setUser);
  await User.findOneAndUpdate({ chatId: userId }, { schedule: setUser });
  console.log('update time');
};

const setTime = async (id, userTime) => {
  const user = await User.findOne({ chatId: id });
  if (!user) {
    return setUserTime(id);
  }
  return updateUserTime(id, userTime);
};

module.exports = setTime;
