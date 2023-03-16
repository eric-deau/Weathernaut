function createMap(latitude, longitude, zoom) {
  latitude ? (latitude = latitude) : (latitude = 49.203);
  longitude ? (longitude = longitude) : (longitude = -122.934);
  zoom ? (zoom = zoom) : (zoom = 11);

  // Assign map to div in html with ID "map-embed"
  var map = L.map("map-embed").setView([latitude, longitude], zoom);
  var marker;
  var markerOnMap = false;
  var lat = latitude;
  var lng = longitude;

  getLocation(lat, lng);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Event Clicker for Map
  function onMapClick(e) {
    //console.log(e.latlng);
    coordinates = e.latlng;
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    getLocation(lat, lng);
  }
  // Reverse Geocoding
  function getLocation(lattitude, longitude) {
    console.log(lattitude, longitude);
    $.ajax({
      url: `https://api.geoapify.com/v1/geocode/reverse?lat=${lattitude}&lon=${longitude}&format=json&apiKey=b8982cbd275848cea36a58777f3cfcfa`,
      type: "GET",
      success: function (res) {
        console.log("response", res);
        // console.log("get location", res.results[0].lat, res.results[0].lon);
        var addressInfo =
          //   res.results[0].address_line1 + " " + res.results[0].address_line2;
          res.results[0].address_line1 + ", " + res.results[0].city;

        $("#destination").text(addressInfo);

        placeMarker(latitude, longitude);
      },
    });
  }

  function placeMarker(lat, lng) {
    if (markerOnMap == false) {
      marker = L.marker([lat, lng], { alt: "Info" }).addTo(map);
      markerOnMap = true;
    } else {
      marker.removeFrom(map);
      markerOnMap = false;
    }
  }
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

long = urlParams.get("lng");
lat = urlParams.get("lat");
zoom = urlParams.get("zoom");

const geoKey = "b8982cbd275848cea36a58777f3cfcfa";

function updateWeather() {
  var lat = urlParams.get("lat");
  var lng = urlParams.get("lng");
  $.ajax({
    url: `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${geoKey} `,
    type: "GET",
    success: function (res) {
      getCurrentWeather(res.results[0].lat, res.results[0].lon);
    },
  });
}

function getCurrentWeather(latitude, longitude) {
  console.log("weather lat", latitude);
  console.log("weather long", longitude);
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

  console.log(url);

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
    })
    .catch(function () {
      alert("Error updating weather data. Please try refreshing this page.");
    });
}

updateWeather();
createMap(lat, long, zoom);
