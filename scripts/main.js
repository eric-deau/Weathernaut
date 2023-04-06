// get time of day and display dynamic greeting
function getTimeOfDay() {
  var today = new Date();
  var hourNow = today.getHours();
  var greeting;

  if (hourNow > 18 || hourNow < 4) {
    greeting = "Good evening";
  } else if (hourNow > 12) {
    greeting = "Good afternoon";
  } else if (hourNow >= 4) {
    greeting = "Good morning";
  } else {
    greeting = "Welcome";
  }

  $("#greeting").text(greeting); //jquery
}

// get name from Firestore to display in greeting
function insertNameFromFirestore() {
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid); // let me to know who is the user that logged in to get the UID
      currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
      currentUser.get().then((userDoc) => {
        //get the user name
        var userName = userDoc.data().name;
        var userCity = userDoc.data().city;
        $("#name-goes-here").text(userName); //jquery
        $("#last-location").text(userCity);

        getTransitAlerts(userCity);
      });
    }
  });
}

// get the tip of the day, or select one randomly if non-existing
function getTipoftheDay() {
  date = new Date().toLocaleDateString();
  date = date.split("/").join("");

  tipCollection = db.collection("tipOfTheDay");

  var tips = [];
  var selectedTip;

  tipCollection
    .where("lastShown", "==", String(date))
    .get()
    .then((doc) => {
      if (doc.size > 0) {
        doc.forEach((res) => {
          tips.push(res.data());
          selectedTip = tips[0].tip;

          $("#tip-of-the-day").text(selectedTip);
        });
      } else {
        tipCollection.get().then((doc) => {
          var tipIDs = [];

          doc.forEach((res) => {
            tips.push(res.data().tip);
            tipIDs.push(res.id);
          });

          randomIndex = Math.floor(Math.random() * tips.length);
          selectedTip = tips[randomIndex];

          tipCollection.doc(tipIDs[randomIndex]).update({
            lastShown: date,
          });

          $("#tip-of-the-day").text(selectedTip);
        });
      }
    });
}

// get transit alerts for the user's city
function getTransitAlerts(city) {
  db.collection("transitAlerts")
    .where("locations", "array-contains", city)
    .get()
    .then((res) => {
      res.forEach((alert) => {
        $("#alert-body").append(`                <h3>${alert.data().alertTitle
          }</h3>
        <p class="card-text">
          ${alert.data().alertDescription}
        </p>`);
      });
    });
}

$(document).ready(() => {
  getTipoftheDay();
  getTimeOfDay();
  insertNameFromFirestore();
});