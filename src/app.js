const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
// eslint-disable-next-line no-unused-vars
const db = require('./db/db');
const User = require('./model/user');
const getWeather = require('./handler/forecast');
const setUser = require('./db/user');
const setTime = require('./db/setTime');
const findTime = require('./scheduler/cron');

const replyMarkup = {
  keyboard: [[{ text: 'Location', request_location: true }]],
  resize_keyboard: true,
  one_time_keyboard: true,
};

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

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
  try {
    const user = await User.findOne({ chatId: msg.chat.id });
    if (!user) {
      return bot.sendMessage(msg.chat.id, 'Give me location', {
        reply_markup: replyMarkup,
      });
    }
    await setTime(msg.chat.id, msg.text);
    return bot.sendMessage(msg.chat.id, `Time setted at ${msg.text}`);
  } catch (error) {
    throw new Error(error);
  }
});

findTime(bot);
