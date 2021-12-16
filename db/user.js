const User = require('../model/user');
const registerTime = require('../scheduler/registerTime');

const createUser = (userId) => {
  const newUser = new User({
    chatId: userId.chat.id,
    location: userId.location,
  });

  newUser.save();
};

const updateUserLocation = async (userId, timezone) => {
  const { time: inputTime } = await User.findOne({ chatId: userId.chat.id });
  const time = await registerTime(timezone, inputTime);
  User.findOneAndUpdate(
    { chatId: userId.chat.id },
    { location: userId.location },
    { time },
  );
};
const setUser = async (msg, timezone) => {
  const user = await User.findOne({ chatId: msg.chat.id });
  if (!user) {
    return createUser(msg);
  }
  return updateUserLocation(msg, timezone);
};

module.exports = setUser;
