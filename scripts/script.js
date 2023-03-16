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

setup();
