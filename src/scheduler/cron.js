const cron = require('node-cron');
const moment = require('moment');
const getWeather = require('../handler/forecast');
const matchedUserTime = require('../db/user');
const logger = require('../log/logger');

const findTime = async (bot) => {
  cron.schedule('* * * * *', async () => {
    const currentTime = moment(new Date()).format('HH:mm');

    const matchedUsers = await matchedUserTime(currentTime);

    matchedUsers.map(async (el) => {
      if (el.schedule === currentTime) {
        const { location } = el;
        const { city, temp, description } = await getWeather(location);
        logger.info(location);
        await bot.sendMessage(
          el.chatId,
          `Current weather in <code>${city}</code> is <b>${Math.floor(
            temp,
          )}</b> celsius and <pre>${description}</pre>`,
          { parse_mode: 'HTML' },
        );
      }
    });
  });
};

module.exports = findTime;
