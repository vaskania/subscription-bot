const axios = require('axios');
const logger = require('../src/logger');

const API = process.env.API_KEY || '64f266fb3ffa0f2b1da717bf3720157e';

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
    };
  } catch (error) {
    logger.error("Server doesn't response.");
    throw new Error("Couldn't fetch data from server");
  }
};

module.exports = getWeather;
