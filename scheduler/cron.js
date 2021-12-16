const cron = require('node-cron');
const moment = require('moment');
const User = require('../model/user');

const findTime = async () => {
  const currentTime = moment(new Date()).format('HH:mm');

  const match = await User.find({ date: currentTime });
  if (match === currentTime) {
    console.log('match');
  }
};

module.exports = cron.schedule('* * * * *', () => {
  findTime();
});
