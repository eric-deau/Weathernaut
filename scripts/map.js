var map = L.map('map-embed').setView([49.203, -122.934], 11);
var marker;
var popup = L.popup();
var numOfMarkers = 0;


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Event Clicker for Map
function onMapClick(e) {
    // alert(e.latlng);
    coordinates = (e.latlng);
    popup.setLatLng(coordinates);
    popup.openOn(map);
    if (numOfMarkers == 0) {
        marker = L.marker(coordinates).addTo(map);
        popup.setContent("You clicked the map at " + coordinates.toString());
        numOfMarkers++;
    } else {
        marker.removeFrom(map);
        numOfMarkers--;
    }
    // marker = L.marker(coordinates).addTo(map);
}

map.on('click', onMapClick);
