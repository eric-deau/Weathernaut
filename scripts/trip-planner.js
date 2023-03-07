function handleTripPlanner() {
  console.log("Hi");
  $("#trip-planner-information").submit(function (event) {
    alert("Disclaimer: This is not a real trip planner. It is just a demo.");
  });
}

$(document).ready(function () {
  handleTripPlanner();
});
