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
    console.log("createMap: " + "Lat: " + lat + " Lng: " + lng);

    getLocation(lat, lng);

    // Geocoding API

    function addressAutocomplete(containerElement, callback, options) {
        const MIN_ADDRESS_LENGTH = 3;
        const DEBOUNCE_DELAY = 300;

        // create container for input element
        const inputContainerElement = document.createElement("div");
        inputContainerElement.setAttribute("class", "input-container");
        containerElement.appendChild(inputContainerElement);

        // create input element
        const inputElement = document.createElement("input");
        inputElement.setAttribute("type", "text");
        inputElement.setAttribute("placeholder", options.placeholder);
        inputContainerElement.appendChild(inputElement);

        // add input field clear button
        const clearButton = document.createElement("div");
        clearButton.classList.add("clear-button");
        addIcon(clearButton);
        clearButton.addEventListener("click", (e) => {
            e.stopPropagation();
            inputElement.value = "";
            callback(null);
            clearButton.classList.remove("visible");
            closeDropDownList();
        });
        inputContainerElement.appendChild(clearButton);

        /* We will call the API with a timeout to prevent unneccessary API activity.*/
        let currentTimeout;

        /* Save the current request promise reject function. To be able to cancel the promise when a new request comes */
        let currentPromiseReject;

        /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
        let focusedItemIndex;

        /* Process a user input: */
        inputElement.addEventListener("input", function (e) {
            const currentValue = this.value;

            /* Close any already open dropdown list */
            closeDropDownList();

            // Cancel previous timeout
            if (currentTimeout) {
                clearTimeout(currentTimeout);
            }

            // Cancel previous request promise
            if (currentPromiseReject) {
                currentPromiseReject({
                    canceled: true,
                });
            }

            if (!currentValue) {
                clearButton.classList.remove("visible");
            }

            // Show clearButton when there is a text
            clearButton.classList.add("visible");

            // Skip empty or short address strings
            if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
                return false;
            }

            /* Call the Address Autocomplete API with a delay */
            currentTimeout = setTimeout(() => {
                currentTimeout = null;

                /* Create a new promise and send geocoding request */
                const promise = new Promise((resolve, reject) => {
                    currentPromiseReject = reject;

                    // The API Key provided is restricted to JSFiddle website
                    // Get your own API Key on https://myprojects.geoapify.com

                    var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                        currentValue
                    )}&format=json&limit=5&apiKey=${API_KEY}`;

                    fetch(url).then((response) => {
                        currentPromiseReject = null;
                        // check if the call was successful
                        if (response.ok) {
                            response.json().then((data) => resolve(data));
                        } else {
                            response.json().then((data) => reject(data));
                        }
                    });
                });
                promise.then(
                    (data) => {
                        // here we get address suggestions
                        currentItems = data.results;

                        /*create a DIV element that will contain the items (values):*/
                        const autocompleteItemsElement = document.createElement("div");
                        autocompleteItemsElement.setAttribute(
                            "class",
                            "autocomplete-items"
                        );
                        inputContainerElement.appendChild(autocompleteItemsElement);

                        /* For each item in the results */
                        data.results.forEach((result, index) => {
                            /* Create a DIV element for each element: */
                            const itemElement = document.createElement("div");
                            /* Set formatted address as item value */
                            itemElement.innerHTML = result.formatted;
                            autocompleteItemsElement.appendChild(itemElement);

                            /* Set the value for the autocomplete text field and notify: */
                            itemElement.addEventListener("click", function (e) {
                                inputElement.value = currentItems[index].formatted;
                                callback(currentItems[index]);
                                /* Close the list of autocompleted values: */
                                closeDropDownList();
                            });
                        });
                    },
                    (err) => {
                        if (!err.canceled) {
                            console.log(err);
                        }
                    }
                );
            }, DEBOUNCE_DELAY);
        });

        /* Add support for keyboard navigation */
        inputElement.addEventListener("keydown", function (e) {
            var autocompleteItemsElement = containerElement.querySelector(
                ".autocomplete-items"
            );
            if (autocompleteItemsElement) {
                var itemElements = autocompleteItemsElement.getElementsByTagName("div");
                if (e.keyCode == 40) {
                    e.preventDefault();
                    /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
                    focusedItemIndex =
                        focusedItemIndex !== itemElements.length - 1
                            ? focusedItemIndex + 1
                            : 0;
                    /*and and make the current item more visible:*/
                    setActive(itemElements, focusedItemIndex);
                } else if (e.keyCode == 38) {
                    e.preventDefault();

                    /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
                    focusedItemIndex =
                        focusedItemIndex !== 0
                            ? focusedItemIndex - 1
                            : (focusedItemIndex = itemElements.length - 1);
                    /*and and make the current item more visible:*/
                    setActive(itemElements, focusedItemIndex);
                } else if (e.keyCode == 13) {
                    /* If the ENTER key is pressed and value as selected, close the list*/
                    e.preventDefault();
                    if (focusedItemIndex > -1) {
                        closeDropDownList();
                    }
                }
            } else {
                if (e.keyCode == 40) {
                    /* Open dropdown list again */
                    var event = document.createEvent("Event");
                    event.initEvent("input", true, true);
                    inputElement.dispatchEvent(event);
                }
            }
        });

        function setActive(items, index) {
            if (!items || !items.length) return false;

            for (var i = 0; i < items.length; i++) {
                items[i].classList.remove("autocomplete-active");
            }

            /* Add class "autocomplete-active" to the active element*/
            items[index].classList.add("autocomplete-active");

            // Change input value and notify
            inputElement.value = currentItems[index].formatted;
            callback(currentItems[index]);
        }

        function closeDropDownList() {
            const autocompleteItemsElement = inputContainerElement.querySelector(
                ".autocomplete-items"
            );
            if (autocompleteItemsElement) {
                inputContainerElement.removeChild(autocompleteItemsElement);
            }

            focusedItemIndex = -1;
        }

        function addIcon(buttonElement) {
            const svgElement = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );
            svgElement.setAttribute("viewBox", "0 0 24 24");
            svgElement.setAttribute("height", "24");

            const iconElement = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );
            iconElement.setAttribute(
                "d",
                "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            );
            iconElement.setAttribute("fill", "currentColor");
            svgElement.appendChild(iconElement);
            buttonElement.appendChild(svgElement);
        }

        /* Close the autocomplete dropdown when the document is clicked. 
                  Skip, when a user clicks on the input field */
        document.addEventListener("click", function (e) {
            if (e.target !== inputElement) {
                closeDropDownList();
            } else if (!containerElement.querySelector(".autocomplete-items")) {
                // open dropdown list again
                var event = document.createEvent("Event");
                event.initEvent("input", true, true);
                inputElement.dispatchEvent(event);
            }
        });
    }
    // Auto search location and place marker on the map, zoom in on location after
    addressAutocomplete(
        document.getElementById("autocomplete-container"),
        (data) => {
            var addressInfo = data.address_line1 + " " + data.address_line2;
            if (markerOnMap == true) {
                map.removeLayer(marker);
                markerOnMap = false;
                map.panTo([data.lat, data.lon]);
                map.setZoom(18);
                placeMarker(addressInfo, data.lat, data.lon);
            } else {
                map.panTo([data.lat, data.lon]);
                map.setZoom(18);
                placeMarker(addressInfo, data.lat, data.lon);
            }
        },
        {
            placeholder: "Enter an address here",
        }
    );

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Event Clicker for Map
    function onMapClick(e) {
        coordinates = e.latlng;
        lat = e.latlng.lat;
        lng = e.latlng.lng;
        getLocation(lat, lng);
    }
    // Reverse Geocoding
    function getLocation(latitude, longitude) {
        $.ajax({
            url: `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${API_KEY}`,
            type: "GET",
            success: function (res) {
                var addressInfo =
                    res.results[0].address_line1 + " " + res.results[0].address_line2;
                placeMarker(addressInfo, latitude, longitude);
            },
        });
    }
    // Place a marker on the map coordinates
    function placeMarker(locationInfo, lat, lng) {
        if (markerOnMap == false) {
            marker = L.marker([lat, lng], { alt: "Info" })
                .addTo(map)
                .bindPopup(
                    locationInfo +
                    `\n<a href='./mapinfo.html?lat=${lat}&lng=${lng}&zoom=18'>Click Here For More Info</a>`
                )
                .openPopup();

            localStorage.setItem("locationInfo", locationInfo);

            $("#trip-planner-link").attr(
                "href",
                `./trip-planner.html?lat=${lat}&lng=${lng}`
            );

            markerOnMap = true;
        } else {
            marker.removeFrom(map);
            markerOnMap = false;
        }
    }
    // Update URL on drag
    function updateURL(g) {
        console.log(g);
        var center = g.target.getCenter();
        var zoom = g.target.getZoom();
        console.log(center.lat, center.lng);
        var newURL =
            "mapinfo.html?lat=" +
            center.lat +
            "&long=" +
            center.lng +
            "&zoom=" +
            zoom;
        window.history.pushState({ path: newURL }, "", newURL);
    }

    map.on("moveend", updateURL);
    map.on("click", onMapClick);
}

// Get the coordinates from URL parameters and populate into map
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var lng = urlParams.get("long");
var lat = urlParams.get("lat");
var zoom = urlParams.get("zoom");

// Grab weather info based off coordinates
function updateWeather() {
    $.ajax({
        url: `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${API_KEY} `,
        type: "GET",
        success: function (res) {
            getCurrentWeather(res.results[0].lat, res.results[0].lon);
        },
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

    getWeatherData()
        .then((data) => {
            forecastTemp = Math.round(parseFloat(data.main.temp) - 273.15);
            forecastWeather = data.weather[0].main;
            forecastWeatherDesc = data.weather[0].description;
            weatherLastChecked = Date.now();
            weatherLastLocation = data.name;
            weatherFeelsLike = Math.round(parseFloat(data.main.feels_like) - 273.15);

            $("#temperature").text(forecastTemp);
            $("#weather-type").text(forecastWeather);
            $("#weather-desc").text(forecastWeatherDesc);
            $("#last-location").text(weatherLastLocation);
            $("#feels-like").text(weatherFeelsLike);
        })
        .catch(function () {
            alert("Error updating weather data. Please try refreshing this page.");
        });
}

updateWeather();
createMap(lat, lng, zoom);
