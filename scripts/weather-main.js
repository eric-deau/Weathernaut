// Get weather for the user's current city
function getCityWeather() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      currentUser.get().then((userDoc) => {
        var userCity = userDoc.data().city;
        $.ajax({
          url: `https://api.geoapify.com/v1/geocode/search?city=${userCity}&format=json&apiKey=${API_KEY}`,
          type: "GET",
          success: function (res) {
            getCurrentWeather(userCity);
          },
        });
      });
    }
  });
}

function getCurrentWeather(userCity) {
  var twoHoursAgo = new Date();
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

  async function getWeatherData() {
    const response = await fetch(url);
    return await response.json();
  }

  var url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userCity +
    "&appid=" +
    OWM_API_KEY;

  getWeatherData()
    .then((data) => {
      forecastTemp = Math.round(parseFloat(data.main.temp) - 273.15);
      forecastWeather = data.weather[0].main;
      forecastWeatherDesc = data.weather[0].description;
      weatherLastChecked = Date.now();
      weatherLastLocation = data.name;
      weatherFeelsLike = Math.round(parseFloat(data.main.feels_like) - 273.15);
      weatherIcon = data.weather[0].icon;

      $("#temperature").text(forecastTemp);
      $("#weather-type").text(forecastWeather);
      $("#weather-desc").text(forecastWeatherDesc);
      $("#last-location").text(weatherLastLocation);
      $("#feels-like").text(weatherFeelsLike);
      $("#weather-icon").html(
        `<img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="weather icon" width="64" height="64">`
      );
    })
    .catch(function () {
      alert("Error updating weather data. Please try refreshing this page.");
    });
}

const setup = () => {
  getCityWeather();
}

$(document).ready(setup())