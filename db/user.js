const User = require('../model/user');

const createUserLocation = (userId, timezone) => {
  const newUser = new User({
    chatId: userId.chat.id,
    location: userId.location,
    timezone: timezone / 3600,
  });
  console.log('create location');
  newUser.save();
};

const updateUserLocation = async (userId) => {
  User.findOneAndUpdate(
    { chatId: userId.chat.id },
    { location: userId.location },
  );
  console.log('update location');
};
const setUser = async (msg, timezone) => {
  const user = await User.findOne(
    { chatId: msg.chat.id },
    { location: msg.location },
  );
  if (!user) {
    return createUserLocation(msg, timezone);
  }
  return updateUserLocation(msg);
};

module.exports = setUser;
