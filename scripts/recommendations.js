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
      recommendedPageLink.href = "#";
      break;
  }
}

function removeCard(cardClassName) {
  const currentWeatherCard = document.querySelector(`.row .${cardClassName}`);
  if (currentWeatherCard) {
    currentWeatherCard.parentNode.removeChild(currentWeatherCard);
  }
}


updateRecommendationPage(4);