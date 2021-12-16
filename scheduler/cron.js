const cron = require('node-cron');
const moment = require('moment');
const User = require('../model/user');

const findTime = async () => {
  const currentTime = moment(new Date()).format('HH:mm');

  const match = await User.find({ schedule: currentTime });
  // eslint-disable-next-line array-callback-return
  match.map((el) => {
    // eslint-disable-next-line no-unused-expressions
    el.schedule === currentTime;
    console.log('match');
  });
};

module.exports = cron.schedule('* * * * *', () => {
  findTime();
});
