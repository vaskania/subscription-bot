const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const { connectDB, closeDB } = require('./db/db');
const getWeather = require('./handler/forecast');
const { setUser, findUser, setUserTime } = require('./db/user');
const findTime = require('./scheduler/cron');
const registerTime = require('./scheduler/registerTime');
const logger = require('./log/logger');

const replyMarkup = {
  keyboard: [[{ text: 'Location', request_location: true }]],
  resize_keyboard: true,
  one_time_keyboard: true,
};

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

(async () => {
  await connectDB();
})();

bot.onText(/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Give me location', {
    reply_markup: replyMarkup,
  });
});

bot.on('location', async (msg) => {
  const { location } = msg;

  try {
    const { timezone } = await getWeather(location);
    await setUser(msg, timezone);
    bot.sendMessage(msg.chat.id, 'Please set time HH:MM');
  } catch (error) {
    bot.sendMessage(msg.chat.id, `${error}`, { reply_markup: replyMarkup });
  }
});

bot.onText(/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/, async (msg) => {
  const userLocation = await findUser(msg.chat.id);
  if (!userLocation) {
    return bot.sendMessage(msg.chat.id, 'Give me location', {
      reply_markup: replyMarkup,
    });
  }
  try {
    const userTime = registerTime(userLocation.timezone, msg.text);
    await setUserTime(msg.chat.id, userTime);
    logger.info(`Time setted for ${msg.chat.username}`);
  } catch (error) {
    throw new Error(error);
  }
  return bot.sendMessage(msg.chat.id, `Time setted at ${msg.text}`);
});

findTime(bot);

const shutdown = async () => {
  logger.info('Signal received: Gracefully killing application');
  const promises = [closeDB(), bot.close()];
  return Promise.all(promises)
    .then(() => {
      logger.info('Application closed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error(error);
    });
};

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);
