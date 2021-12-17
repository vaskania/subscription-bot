const cron = require('node-cron');
const moment = require('moment');
const User = require('../model/user');
const getWeather = require('../handler/forecast');
const logger = require('../log/logger');

const findTime = async (bot) => {
  cron.schedule('* * * * *', async () => {
    const currentTime = moment(new Date()).format('HH:mm');
    logger.info(currentTime);
    try {
      const match = await User.find({ schedule: currentTime });

      match.map(async (el) => {
        if (el.schedule === currentTime) {
          const { location } = el;
          const { city, temp, description } = await getWeather(location);
          await bot.sendMessage(
            el.chatId,
            `Current weather in <code>${city}</code> is <b>${Math.floor(
              temp,
            )}</b> celsius and <pre>${description}</pre>`,
            { parse_mode: 'HTML' },
          );
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  });
};

module.exports = findTime;
