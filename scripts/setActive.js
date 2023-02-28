function setActiveItem(item) {
    slug = window.location.pathname;

    pageName = slug.split("/").pop();
    pageName = pageName.split(".")[0];

    $(".active-nav-item").each(function (index) {
        $(this).removeClass("active-nav-item");
    });

    $(`#${pageName}`).addClass("active-nav-item");
}

setActiveItem();