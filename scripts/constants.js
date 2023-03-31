function loadSkeleton() {
    console.log($('#navbarPlaceholder').load('./constants/navbar.html'));
    console.log($('#footerPlaceholder').load('./constants/footer.html'));
    console.log($('#footer_loginPlaceholder').load('./constants/footer_login.html'));
    console.log($('#navbar_loginPlaceholder').load('./constants/navbar_login.html'));
    // firebase.auth().onAuthStateChanged(function (user) {
    //     if (user) {
    //         // User is signed in.
    //         // Do something for the user here.
    //         console.log($('#navbarPlaceholder').load('../constants/navbar.html'));
    //         console.log($('#footerPlaceholder').load('../constants/footer.html'));
    //     } else {
    //         // No user is signed in.
    //         console.log($('#navbarPlaceholder').load('../constants/navbar.html'));
    //         console.log($('#footerPlaceholder').load('../constants/footer.html'));
    //     }
    // });
}
loadSkeleton(); //invoke the function