const cron = require('node-cron');

cron.schedule('* * * * *', () => {
  // eslint-disable-next-line no-console
  console.log('5 star means code run every minute');
});
