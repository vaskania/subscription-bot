const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const { connectDB, closeDB } = require('./db/db');
const User = require('./model/user');
const getWeather = require('./handler/forecast');
const setUser = require('./db/user');
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

connectDB();

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
  const user = await User.findOne({ chatId: msg.chat.id });
  if (!user) {
    return bot.sendMessage(msg.chat.id, 'Give me location', {
      reply_markup: replyMarkup,
    });
  }
  try {
    const setUserTime = registerTime(user.timezone, msg.text);
    await User.findOneAndUpdate(
      { chatId: msg.chat.id },
      { schedule: setUserTime },
    );
    logger.info(`Time setted for ${msg.chat.username}`);
  } catch (error) {
    throw new Error(error);
  }
  return bot.sendMessage(msg.chat.id, `Time setted at ${msg.text}`);
});

findTime(bot);

const shutdown = () => {
  closeDB();
  process.exit(0);
};

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);
