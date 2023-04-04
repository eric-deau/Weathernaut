var currentUser;

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userCountry = userDoc.data().country;
                    var userState = userDoc.data().state;
                    var userCity = userDoc.data().city;
                    var userStreet = userDoc.data().street;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userCountry != null) {
                        document.getElementById("countryInput").value = userCountry;
                    }
                    if (userState != null) {
                        document.getElementById("stateInput").value = userState;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userStreet != null) {
                        document.getElementById("streetInput").value = userStreet;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    var userName = document.getElementById('nameInput').value;
    var userCountry = document.getElementById('countryInput').value;
    var userState = document.getElementById('stateInput').value;
    var userCity = document.getElementById('cityInput').value;
    var userStreet = document.getElementById('streetInput').value;


    currentUser.set({
        name: userName,
        country: userCountry,
        state: userState,
        city: userCity,
        street: userStreet
    })
        .then(() => {
            console.log("Document successfully updated!");
            alert("Saved successfully!");
        })

    document.getElementById('personalInfoFields').disabled = true;
}

function logout() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            // Sign-out successful.
            console.log("logging out user");
            location.href = "/index.html";
        })
        .catch((error) => {
            // An error happened.
        });
}

//call the function to run it 
populateUserInfo();