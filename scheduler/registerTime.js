const registerTime = (userTimezone, inputTime) => {
  const serverTime = new Date();
  const userTime = inputTime.split(':');

  let setTime =
    +userTime[0] - serverTime.getTimezoneOffset() / -60 + userTimezone;

  if (setTime < 0) {
    setTime = +12;
  } else if (setTime < 10) {
    setTime += '0';
  }
  userTime[0] = setTime;
  return userTime.join(':');
};

module.exports = registerTime;
