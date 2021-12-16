const TOKEN =
  process.env.TELEGRAM_TOKEN ||
  '5079396565:AAFzITDPOncLBHBVqDtmk4z70gwxyFWB1Ck';
const TelegramBot = require('node-telegram-bot-api');
// eslint-disable-next-line no-unused-vars
const db = require('../db/db');
const getWeather = require('../handler/forecast');
const setUser = require('../db/user');
const setTime = require('../db/setTime');
const cron = require('../scheduler/cron');

cron.start();

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
    const { city, temp, description, timezone } = await getWeather(location);

    await setUser(msg, timezone);

    await bot.sendMessage(
      msg.chat.id,
      `Current weather in <code>${city}</code> is <b>${Math.floor(
        temp,
      )}</b> celsius and <pre>${description}</pre>`,
      { parse_mode: 'HTML' },
    );
    bot.sendMessage(msg.chat.id, 'Please set time HH:MM');
  } catch (error) {
    bot.sendMessage(msg.chat.id, `${error}`, { reply_markup: replyMarkup });
  }
});

bot.onText(/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/, async (msg) => {
  await setTime(msg.chat.id, msg.text);
});
