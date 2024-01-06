const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".searchBtn");
const locationButton = document.querySelector(".locationBtn");
const weatherCardDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");

const createWeatherCard = (cityName, weatherItem, index) => {
  let iconClass = "icon";
  if (index !== 0) {
    // Add a separate class for subsequent icons
    iconClass = "icon-subsequent";
  }

  if (index === 0) {
    if (
      weatherItem.weather[0].icon == "04n" ||
      weatherItem.weather[0].icon == "04d"
    ) {
      return `<div class="details">
          <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
          <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(
            2
          )}°C </h4>
          <h4>Wind: ${weatherItem.wind.speed} M/S </h4>
          <h4>Humidity: ${weatherItem.main.humidity}% </h4>
      </div>
      <div class="${iconClass}">
          <img src="Images/cloudy.gif">
          <h4>${weatherItem.weather[0].description} </h4>
      </div>`;
    } else if (
      weatherItem.weather[0].icon == "09n" ||
      weatherItem.weather[0].icon == "09d" ||
      weatherItem.weather[0].icon == "10d" ||
      weatherItem.weather[0].icon == "10n"
    ) {
      return `<div class="details">
          <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
          <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(
            2
          )}°C </h4>
          <h4>Wind: ${weatherItem.wind.speed} M/S </h4>
          <h4>Humidity: ${weatherItem.main.humidity}% </h4>
      </div>
      <div class="${iconClass}">
          <img src="Images/rainy.gif">
          <h4>${weatherItem.weather[0].description} </h4>
      </div>`;
    }else{
      return `<div class="details">
          <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
          <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(
            2
          )}°C </h4>
          <h4>Wind: ${weatherItem.wind.speed} M/S </h4>
          <h4>Humidity: ${weatherItem.main.humidity}% </h4>
      </div>
      <div class="${iconClass}">
          <img src="Images/rainy.gif">
          <h4>${weatherItem.weather[0].description} </h4>
      </div>`;
    }
  } else {
    return `<li class="card">
          <h3>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h3>
          <div class="${iconClass}"> <!-- Use the separate class here too -->
            <img src="https://openweathermap.org/img/wn/${
              weatherItem.weather[0].icon
            }@2x.png" alt="weather-icon">
          </div>
          <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C </h4>
          <h4>Wind: ${weatherItem.wind.speed} M/S </h4>
          <h4>Humidity: ${weatherItem.main.humidity}% </h4>
        </li>`;
  }
};
const API_KEY = "23d674c6a1e7f543e4c60f6909b5c10e";

const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      const uniqueForecastDays = [];

      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      let latestUpdates = 0;
      const uniqueTimesDay = [];

      const timesDayForecast = data.list.filter((forecast) => {
        const forecastTime = new Date(forecast.dt_txt).getHours();
        while (latestUpdates < 5) {
          if (!uniqueTimesDay.includes(forecastTime)) {
            latestUpdates++;
            return uniqueTimesDay.push(forecastTime);
          }
        }
      });

      console.log(fiveDaysForecast);
      console.log(timesDayForecast);

      cityInput.value = "";
      weatherCardDiv.innerHTML = "";
      currentWeatherDiv.innerHTML = "";

      // Display multiple forecasts for the current day based on hours
      timesDayForecast.forEach((weatherItem, index) => {
        currentWeatherDiv.insertAdjacentHTML(
          "beforeend",
          createWeatherCard(cityName, weatherItem, index)
        );
      });

      // Display forecasts for the next 5 days
      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index !== 0) {
          weatherCardDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        }
      });
    })
    .catch(() => {
      alert("Error! getting the rest");
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) {
    return;
  }
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) {
        return alert(`Error! for ${cityName}`);
      }
      const { name, lat, lon } = data[0];

      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      console.error("Error fetching", Error);
      //   alert("Error!");
    });
};

const getLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
      fetch(REVERSE_GEOCODING_URL)
        .then((res) => res.json())
        .then((data) => {
          if (!data.length) {
            return alert(`Error! for ${cityName}`);
          }
          const { name } = data[0];

          getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
          console.error("Error fetching", Error);
          //   alert("Error!");
        });
    },
    (error) => {
      if (Error.code === error.PERMISSION_DENIED) {
        alert(
          "Find Location permission denied. Please allow by restarting the page. Thank you."
        );
      }
    }
  );
};

locationButton.addEventListener("click", getLocation);

searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates()
);
