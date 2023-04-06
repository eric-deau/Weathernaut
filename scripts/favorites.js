var currentUser;

function setup() {
    //check if user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) { //if user logged in
            insertNameFromFirestore();
            currentUser = db.collection("users").doc(user.uid);
            getBookmarks(user);
        } else {
            console.log("User is not logged in.")
            window.location.href = "index.html";
        }
    })
}

setup();

// Get the user's name from Firestore and insert it into the page
function insertNameFromFirestore() {
    //check if user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) { //if user logged in
            console.log(user.uid)
            db.collection("users").doc(user.uid).get().then(userDoc => {
                userName = userDoc.data().name;
                document.getElementById("name-goes-here").innerHTML = userName;
            })
        }
    })
}

// Get the array of bookmarks from the user's document
function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

            // Get the Array of bookmarks
            var tips = db.collection("Tips and Tricks").doc("Rain tips");

            // Get the saved card group and append to div
            tips.get().then((doc) => {
                if (doc.exists) {
                    bookmarks.forEach(thisTip => {
                        let newcard = newcardTemplate.content.cloneNode(true);
                        newcard.querySelector('.card-title').innerHTML = thisTip;
                        newcard.querySelector('.card-text').innerHTML = doc.data()[thisTip];
                        console.log(doc.data()[thisTip])
                        console.log(thisTip)
                        newcard.querySelector('a').onclick = () => deleteBookmark(thisTip);
                        savedCardGroup.appendChild(newcard);
                    })
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            // Get pointer the new card template
            let newcardTemplate = document.getElementById("savedCardTemplate");
        })
}

// function to remove bookmark from user's firestore array
function deleteBookmark(tip) {
    currentUser.set({
        bookmarks: firebase.firestore.FieldValue.arrayRemove(tip)
    }, {
        merge: true
    })
        .then(function () {
            console.log("bookmark has been deleted for: " + currentUser);
            location.reload();
        });
}