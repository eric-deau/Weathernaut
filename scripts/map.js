function createMap(longitude, latitude, zoom) {
  longitude ? (longitude = longitude) : (longitude = 49.203);
  latitude ? (latitude = latitude) : (latitude = -122.934);
  zoom ? (zoom = zoom) : (zoom = 11);

  // Assign map to div in html with ID "map-embed"
  var map = L.map("map-embed").setView([longitude, latitude], zoom);
  var marker;
  var popup = L.popup();
  var markerOnMap = false;
  var coordinates;
  var lat;
  var lng;

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // function newCoords(latitude, longitude) {
  //   // createMap(coords[0], coords[1], 20);
  //   map.panTo([latitude, longitude], 20);
  // }

  // Event Clicker for Map
  function onMapClick(e) {
    //console.log(e.latlng);
    coordinates = e.latlng;
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    //popup.setLatLng(coordinates);
    //popup.openOn(map);
    if (markerOnMap == false) {
      marker = L.marker(coordinates, { alt: "Info" })
        .addTo(map)
        .bindPopup(coordinates.toString() + '\n<a href="./mapinfo.html">Click for more info!</a>', () => { // link to new map coordinates from popup
          map.panTo(e.latlng.lat, e.latlng.lng, 20)
        });
      // popup.setContent("You clicked the map at " + coordinates.toString());
      markerOnMap = true;
    } else {
      marker.removeFrom(map);
      markerOnMap = false;
    }
    // marker = L.marker(coordinates).addTo(map);
  }

  map.on("click", onMapClick);
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

long = urlParams.get("long");
lat = urlParams.get("lat");
zoom = urlParams.get("zoom");

createMap(long, lat, zoom);
