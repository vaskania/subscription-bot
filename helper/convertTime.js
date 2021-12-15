const serverTime = new Date();

const convertTime = (userTime) => {
  const hour = userTime.split(':');
  let time = +hour[0] + serverTime.getTimezoneOffset() / 60;
  if (time < 0) {
    time = +12;
  }
  hour[0] = time;
  return hour.join(':');
};

module.exports = convertTime;
