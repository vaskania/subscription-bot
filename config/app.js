module.exports = {
  sendForecast: {
    frequency: '* * * * * *',
    handler: 'handler/updateForecast',
  },
};
