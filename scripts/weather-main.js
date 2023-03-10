function getCity() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid); // let me to know who is the user that logged in to get the UID
      currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
      currentUser.get().then((userDoc) => {
        //get the user name
        var userCity = userDoc.data().city;
        console.log(userCity);
        $.ajax({
          url: `https://api.geoapify.com/v1/geocode/search?city=${userCity}&format=json&apiKey=b8982cbd275848cea36a58777f3cfcfa`,
          type: "GET",
          success: function (res) {
            console.log(res);
            getCurrentWeather(res.results[0].lat, res.results[0].lon);
          }
        });
      });
    }
  });

}

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
getCity();
