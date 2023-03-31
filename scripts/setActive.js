function setActiveItem(item) {
    slug = window.location.pathname;

    pageName = slug.split("/").pop();
    pageName = pageName.split(".")[0];

    $(".active-nav-item").each(function (index) {
        $(this).removeClass("active-nav-item");
    });

    if (pageName == "mapinfo") {
        $(`#map`).addClass("active-nav-item");
    } else if (pageName == "trip-planner-results") {
        $(`#trip-planner`).addClass("active-nav-item");
    } else {
        $(`#${pageName}`).addClass("active-nav-item");
    }
}

setActiveItem();
