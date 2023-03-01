function loadSkeleton() {
    console.log($('#navbarPlaceholder').load('./constants/navbar.html'));
    console.log($('#footerPlaceholder').load('./constants/footer.html'));
    console.log($('#footer_loginPlaceholder').load('./constants/footer_login.html'));
}

loadSkeleton(); 