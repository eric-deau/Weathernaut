function createMap(longitude, latitude, zoom) {
  longitude ? (longitude = longitude) : (longitude = coordinates[0]);
  latitude ? (latitude = latitude) : (latitude = coordinates[1]);
  zoom ? (zoom = zoom) : (zoom = 11);

  console.log(coordinates);

  var map = L.map("map-embed").setView([longitude, latitude], zoom);
  var marker;
  var popup = L.popup();
  var markerOnMap = false;

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Event Clicker for Map
  function onMapClick(e) {
    console.log(e.latlng);
    coordinates = e.latlng;
    //popup.setLatLng(coordinates);
    //popup.openOn(map);
    if (markerOnMap == false) {
      marker = L.marker(coordinates, { alt: "Info" })
        .addTo(map)
        .bindPopup("test");
      popup.setContent("You clicked the map at " + coordinates.toString());
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
