// load sticky navbar and footer onto page
function loadSkeleton() {
    $('#navbarPlaceholder').load('/constants/navbar.html');
    $('#footerPlaceholder').load('/constants/footer.html');
    $('#footer_loginPlaceholder').load('/constants/footer_login.html');
    $('#navbar_loginPlaceholder').load('/constants/navbar_login.html');
}
loadSkeleton(); //invoke the function