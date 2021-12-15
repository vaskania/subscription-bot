const TOKEN =
  process.env.TELEGRAM_TOKEN ||
  '5079396565:AAFzITDPOncLBHBVqDtmk4z70gwxyFWB1Ck';
const TelegramBot = require('node-telegram-bot-api');
const db = require('../db/db');
const getWeather = require('../handler/forecast');
const setUser = require('../db/user');
const convertTime = require('../helper/convertTime');
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
  bot.sendMessage(msg.chat.id, 'Please set time HH:MM');
});

bot.onText(/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/, async (msg) => {
  const userTime = await convertTime(msg.text);
  setTime(msg.chat.id, userTime);

  bot.sendMessage(msg.chat.id, 'Give me location', {
    reply_markup: replyMarkup,
  });
});

bot.on('location', async (msg) => {
  const { location } = msg;

  try {
    const { city, temp, description } = await getWeather(location);
    await setUser(msg);

    bot.sendMessage(
      msg.chat.id,
      `Current weather in <code>${city}</code> is <b>${Math.floor(
        temp,
      )}</b> celsius and <pre>${description}</pre>`,
      { parse_mode: 'HTML' },
    );
  } catch (error) {
    bot.sendMessage(msg.chat.id, `${error}`, { reply_markup: replyMarkup });
  }
});
