const User = require('../model/user');
const cron = require('node-cron');
const moment = require('moment');

module.exports = cron.schedule('* * * * *', () => {
  findTime();
});

const findTime = async () => {
  const currentTime = moment(new Date()).format('HH:mm');
  console.log(currentTime);

  const match = await User.find({ date: currentTime });
  if (match) {
    console.log('match');
  }
};
