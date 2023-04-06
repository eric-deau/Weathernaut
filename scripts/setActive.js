// Change CSS of button for active page in Footer or Navbar
function setActiveItem(item) {
    slug = window.location.pathname; // get slug of current page

    pageName = slug.split("/").pop();
    pageName = pageName.split(".")[0]; // get page name

    // remove active class from all nav items
    $(".active-nav-item").each(function (index) {
        $(this).removeClass("active-nav-item");
    });

    // add active class to current nav item based on slug
    if (pageName == "mapinfo") {
        $(`#map`).addClass("active-nav-item");
    } else if (pageName == "trip-planner-results") {
        $(`#trip-planner`).addClass("active-nav-item");
    } else {
        $(`#${pageName}`).addClass("active-nav-item");
    }
}

// run function when page loads
$(document).ready(() => {
    setActiveItem();
})

