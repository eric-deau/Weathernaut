// Replace with your Firebase project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYJmXlirIV9u79Qd2gWySn4pgF3p-8svg",
  authDomain: "comp1800-60ab7.firebaseapp.com",
  projectId: "comp1800-60ab7",
  storageBucket: "comp1800-60ab7.appspot.com",
  messagingSenderId: "194039630689",
  appId: "1:194039630689:web:52d083fb580c5dcd941320"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve the recommendations from the Firestore database
const db = firebase.firestore();
const documentRef = db.collection('Tips and Tricks').doc('Rain tips');

documentRef.get().then((doc) => {
  if (doc.exists) {
    console.log(doc.data());
    const title = doc.data().title;
    const text = doc.data().text;
    // Do something with title and text here
  } else {
    console.log('No such document!');
  }
}).catch((error) => {
  console.log('Error getting document:', error);
});

