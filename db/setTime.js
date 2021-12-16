const User = require('../model/user');

const setUserTime = (userId, time) => {
  const newUser = new User({
    chatId: userId,
    time,
  });
  newUser.save();
};

const updateUserTime = (userId, time) =>
  User.findOneAndUpdate({ chatId: userId }, { time });

const setTime = async (id, time) => {
  const user = await User.findOne({ chatId: id });
  if (!user) {
    return setUserTime(id, time);
  }
  return updateUserTime(id, time);
};

module.exports = setTime;
