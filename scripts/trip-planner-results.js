// Get stored info from URL param and local storage if it exists
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

long = urlParams.get("lng");
lat = urlParams.get("lat");
transportMode = urlParams.get("transport-mode");

// Create map and map search
const geoKey = "b8982cbd275848cea36a58777f3cfcfa";

function createMap(latitude, longitude) {
  latitude ? (latitude = latitude) : (latitude = 49.203);
  longitude ? (longitude = longitude) : (longitude = -122.934);
  zoom = 11;

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

        if (transportMode == "transit") {
          getTransitAlerts(res.results[0].city);
        }
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

// Get current weather
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
    OWM_API_KEY;

  console.log(url);

  getWeatherData()
    .then((data) => {
      forecastTemp = Math.round(parseFloat(data.main.temp) - 273.15);
      forecastWeather = data.weather[0].main;
      forecastWeatherDesc = data.weather[0].description;
      weatherLastChecked = Date.now();
      weatherLastLocation = data.name;
      weatherFeelsLike = Math.round(parseFloat(data.main.feels_like) - 273.15);

      // updateRecommendationPage(getWeatherConditionCode(forecastWeather.toLowerCase()));

      $("#temperature").text(forecastTemp);
      $("#weather-type").text(forecastWeather);
    })
    .catch(function () {
      alert("Error updating weather data. Please try refreshing this page.");
    });
}

function getTransitAlerts(city) {
  db.collection("transitAlerts")
    .where("locations", "array-contains", city)
    .get()
    .then((res) => {
      res.forEach((alert) => {
        console.log(alert.data());
        $("#transit-alert-placeholder").append(`
        <div class="container text-center mt-2 w-100">
          <div class="row justify-content-center">
            <div class="col-auto w-100">
              <div class="card text-bg-primary mb-3" style="max-width: 100%">
                <div class="card-header">
                  <!--<img src="../1800_202310_DTC12/images/notifications_FILL1_wght400_GRAD0_opsz48.svg" alt="notification bell"> -->
                  <h1>
                    <span class="material-symbols-outlined"> notifications </span>
                    Transit Alert
                  </h1>
                </div>
                <div class="card-body">
                <h3>${alert.data().alertTitle}</h3>
                  <p class="card-text">
                    ${alert.data().alertDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>`);
      });
    });
}

function getWeatherConditionCode(weatherCondition) {
  switch (weatherCondition) {
    case "rain":
      return 1;
    case "wind":
      return 2;
    case "clouds":
    case "clear":
      return 3;
    case "snow":
      return 4;
    default:
      return 0;
  }
}

const getRainTips = () => {
  const rainTipsRef = db.collection('Tips and Tricks').doc('Rain tips');

  return rainTipsRef.get().then((doc) => {
    if (doc.exists) {
      const tips = doc.data();
      return tips;
    } else {
      console.log('No such document!');
      return null;
    }
  }).catch((error) => {
    console.log('Error getting document:', error);
    return null;
  });
};

function fillBookmarks(tip) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const currentUser = db.collection('users').doc(user.uid);

      currentUser.get().then(userDoc => {
        //get the user name
        var bookmarks = userDoc.data().bookmarks;
        console.log(bookmarks)

        const tipid = tip.replace(/ /g, '-').toLowerCase()
        console.log(tipid)

        if (bookmarks.includes(tipid)) {

          console.log("check")
          document.getElementById('save-' + tipid).innerText = 'bookmark';
        }
      })
    } else {
      // User is signed out
    }
  });
}

const renderRainTips = (data) => {
  const container = document.getElementById('RainTipsContainer');

  // Create HTML structure
  const template = `
    <div class="rain-tips">
      <div class="tips-container"></div>
    </div>
  `;
  container.innerHTML = template;


  // Populate tips container
  const tipsContainer = document.querySelector('.tips-container');
  if (data && Object.keys(data).length > 0) {
    for (const tip in data) {
      const tipElement = document.createElement('div');
      tipElement.classList.add('tip-card');

      // const titleElement = document.createElement('h3');
      // titleElement.textContent = tip;
      // tipElement.appendChild(titleElement);

      const textElement = document.createElement('p');
      textElement.textContent = data[tip];
      tipElement.appendChild(textElement);

      const buttonElement = document.createElement('button');
      const bookmarkIcon = document.createElement('span');
      bookmarkIcon.classList.add('material-icons');
      bookmarkIcon.id = 'save-' + tip.replace(/ /g, '-').toLowerCase();
      bookmarkIcon.textContent = 'bookmark_border';
      buttonElement.appendChild(bookmarkIcon);
      buttonElement.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'me-2');
      buttonElement.addEventListener('click', () => {
        saveBookmark(tip, tipElement.id);
      });
      tipElement.appendChild(buttonElement);

      tipElement.id = tip.replace(/ /g, '-').toLowerCase();
      tipsContainer.appendChild(tipElement);

      fillBookmarks(tip);
    };
  } else {
    const noTipsElement = document.createElement('p');
    noTipsElement.textContent = 'No tips available.';
    tipsContainer.appendChild(noTipsElement);
  }
};


function saveBookmark(title, docID) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, call saveBookmark() function here
      const currentUser = db.collection('users').doc(user.uid);

      currentUser.get().then(userDoc => {

        if (userDoc.data().bookmarks.includes(docID)) {
          var iconID = 'save-' + title.replace(/ /g, '-').toLowerCase();
          currentUser.update({
            bookmarks: firebase.firestore.FieldValue.arrayRemove(docID),
          });

          document.getElementById(iconID).innerText = "bookmark_border";
        }
        else {

          currentUser.update({
            bookmarks: firebase.firestore.FieldValue.arrayUnion(docID)
          })
            .then(() => {
              console.log(`Bookmark has been saved for: ${currentUser.id}`);
              const iconID = 'save-' + title.replace(/ /g, '-').toLowerCase();
              const icon = document.getElementById(iconID);
              icon.innerText = 'bookmark';
              icon.classList.remove('material-icons-outlined');
              icon.classList.add('material-icons');
            })
            .catch((error) => {
              console.log('Error saving bookmark:', error);
            });
        }
      })
    } else {
      // User is signed out
    }
  });
}

$(document).ready(function () {
  updateWeather();
  createMap(lat, long);
  getRainTips().then((data) => {
    console.log(data);
    renderRainTips(data);
  });
});