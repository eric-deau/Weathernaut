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
        console.log(userName);
        $("#name-goes-here").text(userName); //jquery
        $("#last-location").text(userCity);
      });
    }
  });
}

function getTipoftheDay() {
  date = new Date().toLocaleDateString();
  date = date.split("/").join("");
  console.log(date);

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
          console.log("today's tip: " + selectedTip);

          $("#tip-of-the-day").text(selectedTip);
        });
      } else {
        tipCollection.get().then((doc) => {
          var tipIDs = [];

          doc.forEach((res) => {
            tips.push(res.data().tip);
            tipIDs.push(res.id);
          });

          console.log(tipIDs);

          randomIndex = Math.floor(Math.random() * tips.length);
          selectedTip = tips[randomIndex];
          console.log("random tip: " + selectedTip);

          tipCollection.doc(tipIDs[randomIndex]).update({
            lastShown: date,
          });

          $("#tip-of-the-day").text(selectedTip);
        });
      }
    });
}

getTipoftheDay();
getTimeOfDay();
insertNameFromFirestore();
