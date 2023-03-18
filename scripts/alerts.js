function getCityFromFirestore() {
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid); // let me to know who is the user that logged in to get the UID
      currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
      currentUser.get().then((userDoc) => {
        //get the user name
        var userCity = userDoc.data().city;
        console.log(userCity);

        getTransitAlerts(userCity);
      });
    }
  });
}

function getTransitAlerts(city) {
  db.collection("transitAlerts")
    // .where("locations", "array-contains", city)
    .get()
    .then((res) => {
      res.forEach((alert) => {
        // console.log(alert.data());
        $("#transit-alert-placeholder").append(`
        <div class="container text-center mt-2 w-100">
          <div class="row justify-content-center">
            <div class="col-auto w-100">
              <div class="card text-bg-primary mb-3" style="max-width: 100%">
                <div class="card-header">
                  <!--<img src="../1800_202310_DTC12/images/notifications_FILL1_wght400_GRAD0_opsz48.svg" alt="notification bell"> -->
                  <h3>
                    <span class="material-symbols-outlined"> bus_alert </span>
                    Transit
                  </h3>
                </div>
                <div class="card-body">
                <h3>${alert.data().alertTitle}</h3>
                  <p class="card-text">
                    ${alert.data().alertDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>`);
      });
    });
}

getCityFromFirestore();
