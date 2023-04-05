// get city from user profile
function getCity() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      currentUser.get().then((userDoc) => {
        var userCity = userDoc.data().city;

        getCurrentWeather(userCity);
        get8HourForecast(userCity);
      });
    }
  });
}

// get current weather of user's city
function getCurrentWeather(userCity) {
  async function getWeatherData() {
    const response = await fetch(url);
    return await response.json();
  }

  var url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userCity +
    "&appid=" +
    OWM_API_KEY;

  // get weather data from openweathermap
  getWeatherData()
    .then((data) => {
      forecastTemp = Math.round(parseFloat(data.main.temp) - 273.15);
      forecastWeather = data.weather[0].description;
      feelsLike = Math.round(parseFloat(data.main.feels_like) - 273.15);
      humidity = data.main.humidity;
      weatherLastChecked = Date.now();
      weatherLastLocation = data.name;
      weatherCode = data.weather[0].id;

      updateBackgroundBasedOnWeather(weatherCode);

      $("#temperature").text(forecastTemp);
      $("#feelsLike").text(feelsLike);
      $("#weatherType").text(forecastWeather);
      $("#lastLocation").text(weatherLastLocation);
    })

    .catch(function () {
      alert("Error updating weather data. Please try refreshing this page.");
    });
}

// get and parse the weather forecast for the next 8 hours
function get8HourForecast(cityName) {
  async function get8HourForecastData() {
    const response = await fetch(url);
    return await response.json();
  }

  function convert24HTime(time) {
    if (time > 12) {
      time = time - 12 + " PM";
    } else if (time == 12) {
      time = time + " PM";
    } else {
      time = time + " AM";
    }
    return time;
  }

  var url =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    OWM_API_KEY +
    "&cnt=8";

  // get 8 hour forecast data from openweathermap
  get8HourForecastData()
    .then((data) => {
      data.list.forEach((element) => {
        hour = new Date(element.dt * 1000).getHours();
        hour = convert24HTime(hour);

        feelsLike = Math.round(parseFloat(element.main.feels_like) - 273.15);

        weather = element.weather[0].description;

        $("#forecast").append(
          `<tr><td>${hour}</td><td>${weather} and feels like ${feelsLike}°C</td></tr>`
        );
      });
    })

    .catch(function () {
      alert("Error updating weather data. Please try refreshing this page.");
    });
}

// update the background image based on the weather code from openweathermap
function updateBackgroundBasedOnWeather(code) {
  code_cat = code.toString().charAt(0);

  switch (code_cat) {
    case "2":
      $("main").css(
        "background-image",
        "url(../images/weather-backgrounds/thunderstorm.jpg)"
      );
      break;
    case "3":
      $("main").css(
        "background-image",
        "url(../images/weather-backgrounds/drizzle.jpg)"
      );
      break;
    case "5":
      $("main").css(
        "background-image",
        "url(../images/weather-backgrounds/rain.jpg)"
      );
      break;
    case "6":
      $("main").css(
        "background-image",
        "url(../images/weather-backgrounds/snow.jpg)"
      );
      break;
    case "7":
      $("main").css(
        "background-image",
        "url(../images/weather-backgrounds/atmosphere.jpg)"
      );
      break;
    case "8":
      $("main").css(
        "background-image",
        "linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(../images/weather-backgrounds/clear.jpg)"
      );
      break;
    default:
      $("main").css("background-image", "grey");
      break;
  }
}

const setup = () => {
  getCity();
}

$(document).ready(setup())