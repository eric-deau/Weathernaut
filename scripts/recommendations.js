// Define the API endpoint and your API key
const apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "904aecba3bfef05b76019b6eb36cc2ea";

// Get the user's current location using the Geolocation API
navigator.geolocation.getCurrentPosition(async (position) => {
  // Retrieve the latitude and longitude coordinates from the Geolocation API response
  const { latitude, longitude } = position.coords;

  // Construct the API request URL with the latitude, longitude, and API key
  const apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  try {
    // Fetch the current weather data from the OpenWeatherMap API
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extract the weather condition from the API response
    const weatherCondition = data.weather[0].main.toLowerCase();

    // Update the recommended page link and title based on the weather condition
    updateRecommendationPage(getWeatherConditionCode(weatherCondition));
  } catch (error) {
    console.error(error);
  }
});

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


function updateRecommendationPage(weatherCondition) {
  // Get the recommended page link and title elements
  const recommendedPageLink = document.getElementById("recommendedPageLink");
  const recommendedPageTitle = document.getElementById("recommendedPageTitle");

  // Set the recommended page link and title based on the weather condition
  switch (weatherCondition) {
    case 1: // Rain
      recommendedPageTitle.textContent = "Recommended Based on Current Weather: Rain Recommendations";
      recommendedPageLink.href = "rainRecommendations.html";
      removeCard("rain");
      break;
    case 2: // Wind
      recommendedPageTitle.textContent = "Recommended Based on Current Weather: Wind Recommendations";
      recommendedPageLink.href = "windRecommendations.html";
      removeCard("wind");
      break;
    case 3: // Heat
      recommendedPageTitle.textContent = "Recommended Based on Current Weather: Heat Recommendations";
      recommendedPageLink.href = "heatRecommendations.html";
      removeCard("heat");
      break;
    case 4: // Snow
      recommendedPageTitle.textContent = "Recommended Based on Current Weather: Snow Recommendations";
      recommendedPageLink.href = "snowRecommendations.html";
      removeCard("snow");
      break;
    default:
      recommendedPageTitle.textContent = "Recommended Based on Current Weather: No Recommendations";
      recommendedPageLink.href = "funFacts.html";
      break;
  }
}

