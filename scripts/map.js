

function createMap(latitude, longitude, zoom) {
  latitude ? (latitude = latitude) : (latitude = 49.203);
  longitude ? (longitude = longitude) : (longitude = -122.934);
  zoom ? (zoom = zoom) : (zoom = 11);

  // Assign map to div in html with ID "map-embed"
  var map = L.map("map-embed").setView([latitude, longitude], zoom);
  var marker;
  var markerOnMap = false;
  var coordinates;
  var lat;
  var lng;

  // Geocoding API
  // var requestOptions = {
  //   method: 'GET',
  // };

  // fetch("https://api.geoapify.com/v1/geocode/search?text=38%20Upper%20Montagu%20Street%2C%20Westminster%20W1H%201LJ%2C%20United%20Kingdom&apiKey=b8982cbd275848cea36a58777f3cfcfa", requestOptions)
  //   .then(response => response.json())
  //   .then(result => console.log(result))
  //   .catch(error => console.log('error', error));

  function addressAutocomplete(containerElement, callback, options) {
    // create container for input element
    const inputContainerElement = document.createElement("div");
    inputContainerElement.setAttribute("class", "input-container");
    containerElement.appendChild(inputContainerElement);

    // create input element
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", options.placeholder);
    inputContainerElement.appendChild(inputElement);

    const MIN_ADDRESS_LENGTH = 3;
    const DEBOUNCE_DELAY = 300;

    /* Process a user input: */
    inputElement.addEventListener("input", function (e) {
      const currentValue = this.value;

      // Cancel previous timeout
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      // Cancel previous request promise
      if (currentPromiseReject) {
        currentPromiseReject({
          canceled: true
        });
      }

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

          // Get an API Key on https://myprojects.geoapify.com
          const apiKey = "b8982cbd275848cea36a58777f3cfcfa";

          var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&format=json&limit=5&apiKey=${apiKey}`;

          fetch(url)
            .then(response => {
              currentPromiseReject = null;

              // check if the call was successful
              if (response.ok) {
                response.json().then(data => resolve(data));
              } else {
                response.json().then(data => reject(data));
              }
            });
        });

        promise.then((data) => {
          // here we get address suggestions
          console.log(data);

          /*create a DIV element that will contain the items (values):*/
          const autocompleteItemsElement = document.createElement("div");
          autocompleteItemsElement.setAttribute("class", "autocomplete-items");
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
        }, (err) => {
          if (!err.canceled) {
            console.log(err);
          }
        });
      }, DEBOUNCE_DELAY);
    });

    /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
    let focusedItemIndex;

    /* Add support for keyboard navigation */
    inputElement.addEventListener("keydown", function (e) {
      var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
      if (autocompleteItemsElement) {
        var itemElements = autocompleteItemsElement.getElementsByTagName("div");
        if (e.keyCode == 40) {
          e.preventDefault();
          /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
          focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
          /*and and make the current item more visible:*/
          setActive(itemElements, focusedItemIndex);
        } else if (e.keyCode == 38) {
          e.preventDefault();

          /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
          focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
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
          var event = document.createEvent('Event');
          event.initEvent('input', true, true);
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
      var autocompleteItemsElement = inputContainerElement.querySelector(".autocomplete-items");
      if (autocompleteItemsElement) {
        inputContainerElement.removeChild(autocompleteItemsElement);
      }
    }

  }

  addressAutocomplete(document.getElementById("autocomplete-container"), (data) => {
    console.log("Selected option: ");
    console.log(data);
  }, {
    placeholder: "Enter an address here"

  });

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
    var streetInfo;
    coordinates = e.latlng;
    lat = e.latlng.lat;
    lng = e.latlng.lng;

    // Reverse Geocoding
    $.ajax({
      url: `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=b8982cbd275848cea36a58777f3cfcfa`,
      type: "GET",
      success: function (res) {
        // console.log(res);
        streetInfo = res.results[0].street;
        if (markerOnMap == false) {
          marker = L.marker(coordinates, { alt: "Info" })
            .addTo(map)
            .bindPopup(
              streetInfo +
              `\n<a href='./mapinfo.html?lat=${lat}&lng=${lng}'>More Info</a>`
            )
            .openPopup();
          markerOnMap = true;
        } else {
          marker.removeFrom(map);
          markerOnMap = false;
        }

        // console.log("response", res.results[0].street);
        // console.log("streetInfo", streetInfo);
      }
    });
    console.log("streetInfo after", streetInfo);
    // fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=b8982cbd275848cea36a58777f3cfcfa`)
    //   .then(response => response.json())
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));

    //   // Marker popup
    //   if (markerOnMap == false) {
    //     marker = L.marker(coordinates, { alt: "Info" })
    //       .addTo(map)
    //       .bindPopup(
    //         streetInfo +
    //         `\n<a href='./mapinfo.html?lat=${lat}&long=${lng}&zoom=15'>Click for more info!</a>`
    //       );
    //     markerOnMap = true;
    //   } else {
    //     marker.removeFrom(map);
    //     markerOnMap = false;
    //   }
    // }
  }
  // Update URL on drag
  function updateURL(g) {
    var center = g.target.getCenter();
    var zoom = g.target.getZoom();
    var newURL =
      "map.html?lat=" + center.lat + "&long=" + center.lng + "&zoom=" + zoom;
    window.history.pushState({ path: newURL }, "", newURL);
  }

  map.on("moveend", updateURL);
  map.on("click", onMapClick);
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

long = urlParams.get("long");
lat = urlParams.get("lat");
zoom = urlParams.get("zoom");

createMap(lat, long, zoom);
