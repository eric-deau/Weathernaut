function getTimeOfDay() {
  var today = new Date();
  var hourNow = today.getHours();
  var greeting;

  if (hourNow > 18) {
    greeting = "Good evening";
  } else if (hourNow > 12) {
    greeting = "Good afternoon";
  } else if (hourNow > 0) {
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
        console.log(userName);
        $("#name-goes-here").text(userName); //jquery
      });
    }
  });
}

getTimeOfDay();
insertNameFromFirestore();
