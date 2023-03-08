// function sayHello() {

// }
// //sayHello();

// function goToLogin() {
//   location.href = "login.html";
// }

function goToPage(e) {
  console.log($(this));
  dest = e.getAttribute("value");
  location.href = `${dest}.html`;
}

function setup() {
  console.log("Setup");
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("logging out user");
    })
    .catch((error) => {
      // An error happened.
    });
}

setup();
