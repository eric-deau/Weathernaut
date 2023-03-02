// function sayHello() {

// }
// //sayHello();


function goToLogin() {
    location.href = 'login.html'
}

function goToTripPlanner() {
    location.href = 'trip-planner.html'
}

function setup() {
    console.log("Setup")
}

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
    });
}

setup();