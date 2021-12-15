const findUser = require('./user');

const str = '12:33';
const userId = 369704871;

const setTime = async (id, time) => {
  await findUser(id, time);
};

setTime(userId, str);

module.exports = setTime;
