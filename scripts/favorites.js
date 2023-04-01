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
                console.log(userDoc.data().name)
                userName = userDoc.data().name;
                console.log(userName)
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
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            // Get pointer the new card template
            let newcardTemplate = document.getElementById("savedCardTemplate");

            // Iterate through the ARRAY of bookmarked hikes (document ID's)
            bookmarks.forEach(thisTip => {
                console.log(thisTip);
                let newcard = newcardTemplate.content.cloneNode(true);
                newcard.querySelector('.card-title').innerHTML = thisTip;
                newcard.querySelector('a').onclick = () => deleteBookmark(thisTip);
                savedCardGroup.appendChild(newcard);
            })
        })
}

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