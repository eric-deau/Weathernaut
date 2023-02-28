function getCurrentWeather(latitude, longitude) {
    var twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
  
    async function getWeatherData() {
      const response = await fetch(url);
      return await response.json();
    }
  
    var url =
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&appid=" +
      "4e91d8495e609600b11d07a29c00fcb4";

    console.log(url)
  
    getWeatherData()
      .then((data) => {
        forecastTemp = Math.round(parseFloat(data.main.temp) - 273.15);
        forecastWeather = data.weather[0].main;
        forecastWeatherDesc = data.weather[0].description;
        weatherLastChecked = Date.now();
        weatherLastLocation = data.name;
        weatherFeelsLike = Math.round(parseFloat(data.main.feels_like) - 273.15);
  
        console.log("Got weather");
  
        $("#temperature").text(forecastTemp);
        $("#weather-type").text(forecastWeather);
        $("#weather-desc").text(forecastWeatherDesc);
        $("#last-location").text(weatherLastLocation);
        $("#feels-like").text(weatherFeelsLike);
      })
      .catch(function () {
        // alert("Error updating weather data. Please try refreshing this page.");
      });
  }

  getCurrentWeather("49.203", "-122.934");