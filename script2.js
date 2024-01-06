
const currentWeatherDiv = document.querySelector(".london-card");
const weatherCardDiv = document.querySelector(".london-card");

const londonCardDiv = document.querySelector("#london-card");
const berlinCardDiv = document.querySelector("#berlin-card");
const amsterdamCardDiv = document.querySelector("#amsterdam-card");
const tokyoCardDiv = document.querySelector("#tokyo-card");

const romeCardDiv = document.querySelector("#rome-card");
const kuwaitCardDiv = document.querySelector("#kuwait-card");
const meccaCardDiv = document.querySelector("#mecca-card");
const cairoCardDiv = document.querySelector("#cairo-card");

const createWeatherCard = (cityName, weatherItem, index) => {
  const imagePath = `Images/${cityName.toLowerCase()}.jpg`;
  console.log(imagePath);
  return ` <div class="-card">
      <div class="image">
        <img src="${imagePath}" alt="" />
      </div>
      <div class="city-name">
        <h2>${cityName}</h2>
      </div>
      <div class="forecast">
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
      </div>
    </div>`;
};

const API_KEY = "23d674c6a1e7f543e4c60f6909b5c10e";

const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  return fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      const uniqueTimesDay = [];

      const timesDayForecast = data.list.filter((forecast) => {
        const forecastTime = new Date(forecast.dt_txt).getHours();
        if (
          uniqueTimesDay.length < 5 &&
          !uniqueTimesDay.includes(forecastTime)
        ) {
          uniqueTimesDay.push(forecastTime);
          return true;
        }
        return false;
      });

      return {
        cityName,
        timesDayForecast,
      };
    });
};

const getCityCoordinates = (cityName, cardDiv) => {
  if (!cityName) {
    return;
  }

  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  return fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) {
        return alert(`Error! for ${cityName}`);
      }

      const { lat, lon } = data[0];
      return getWeatherDetails(cityName, lat, lon);
    })
    .then(({ cityName, timesDayForecast }) => {
      cardDiv.innerHTML = "";
      // Display forecasts for the current day based on hours
      for (let index = 0; index < 1; index++) {
        cardDiv.innerHTML += createWeatherCard(
          cityName,
          timesDayForecast[index],
          index
        );
      }
    })
    .catch(() => {
      console.error("Error fetching", Error);
      // alert("Error!");
    });
};

const cityName = "London";
const cityName2 = "Berlin";
const cityName3 = "Amsterdam";
const cityName4 = "Tokyo";

const cityName5 = "Rome";
const cityName6 = "Kuwait";
const cityName7 = "Mecca";
const cityName8 = "Cairo";

Promise.all([
  getCityCoordinates(cityName, londonCardDiv),
  getCityCoordinates(cityName2, berlinCardDiv),
  getCityCoordinates(cityName3, amsterdamCardDiv),
  getCityCoordinates(cityName4, tokyoCardDiv),

  getCityCoordinates(cityName5, romeCardDiv),
  getCityCoordinates(cityName6, kuwaitCardDiv),
  getCityCoordinates(cityName7, meccaCardDiv),
  getCityCoordinates(cityName8, cairoCardDiv),
]).catch(() => alert("Error! getting the rest"));
