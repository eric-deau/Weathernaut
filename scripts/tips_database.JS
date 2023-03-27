const firebaseConfig = {
  apiKey: "AIzaSyBYJmXlirIV9u79Qd2gWySn4pgF3p-8svg",
  authDomain: "comp1800-60ab7.firebaseapp.com",
  projectId: "comp1800-60ab7",
  storageBucket: "comp1800-60ab7.appspot.com",
  messagingSenderId: "194039630689",
  appId: "1:194039630689:web:52d083fb580c5dcd941320"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const getRainTips = () => {
  const rainTipsRef = db.collection('Tips and Tricks').doc('Rain tips');

  return rainTipsRef.get().then((doc) => {
    if (doc.exists) {
      return doc.data();
    } else {
      console.log('No such document!');
      return null;
    }
  }).catch((error) => {
    console.log('Error getting document:', error);
    return null;
  });
};

const getSnowTips = () => {
  const snowTipsRef = db.collection('Tips and Tricks').doc('Snow tips');

  return snowTipsRef.get().then((doc) => {
    if (doc.exists) {
      return doc.data();
    } else {
      console.log('No such document!');
      return null;
    }
  }).catch((error) => {
    console.log('Error getting document:', error);
    return null;
  });
};

const getHeatTips = () => {
  const heatTipsRef = db.collection('Tips and Tricks').doc('Heat tips');

  return heatTipsRef.get().then((doc) => {
    if (doc.exists) {
      return doc.data();
    } else {
      console.log('No such document!');
      return null;
    }
  }).catch((error) => {
    console.log('Error getting document:', error);
    return null;
  });
};

const getWindTips = () => {
  const windTipsRef = db.collection('Tips and Tricks').doc('Wind tips');

  return windTipsRef.get().then((doc) => {
    if (doc.exists) {
      return doc.data();
    } else {
      console.log('No such document!');
      return null;
    }
  }).catch((error) => {
    console.log('Error getting document:', error);
    return null;
  });
};

export { getRainTips, getSnowTips, getHeatTips, getWindTips };