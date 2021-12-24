const axios = require('axios');
const logger = require('../log/logger');

const API = process.env.API_KEY;

const getWeather = async (coordinates) => {
  const { latitude, longitude } = coordinates;
  try {
    const uri = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API}&units=metric`;
    const response = await axios(uri);
    const { data } = response;
    return {
      city: data.name,
      temp: data.main.temp,
      description: data.weather[0].description,
      timezone: data.timezone,
    };
  } catch (error) {
    logger.error("Server doesn't response.");
    throw new Error("Couldn't send data to database");
  }
};

module.exports = getWeather;
