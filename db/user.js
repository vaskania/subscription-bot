const User = require('../model/user');

const createUser = (userId) => {
  const newUser = new User({
    chatId: userId.chat.id,
    location: userId.location,
  });
  newUser.save();
};

const updateUserLocation = (userId) => {
  return User.findOneAndUpdate(
    { chatId: userId.chat.id },
    { location: userId.location },
  );
};

const setUser = async (msg) => {
  const user = await User.findOne({ chatId: msg.chat.id });
  if (!user) {
    return createUser(msg);
  }
  return updateUserLocation(msg);
};

module.exports = setUser;
