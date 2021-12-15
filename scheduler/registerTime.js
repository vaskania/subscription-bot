const moment = require('moment');

const userTime = new Date();

const registerTime = () => {
  const currentTime = moment(userTime).format('HH:mm');
  const hour = currentTime.split(':');
  let time = +hour[0] + userTime.getTimezoneOffset() / 60;
  if (time < 0) {
    time = +12;
  }
  hour[0] = time;
  return hour.join(':');
};

module.exports = registerTime;
