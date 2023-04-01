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
      const tips = doc.data();
      return tips;
    } else {
      console.log('No such document!');
      return null;
    }
  }).catch((error) => {
    console.log('Error getting document:', error);
    return null;
  });
};
function fillBookmarks(tip) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const currentUser = db.collection('users').doc(user.uid);

      currentUser.get().then(userDoc => {
        //get the user name
        var bookmarks = userDoc.data().bookmarks;
        console.log(bookmarks)

        const tipid = tip.replace(/ /g, '-').toLowerCase()
        console.log(tipid)

        if (bookmarks.includes(tipid)) {

          console.log("check")
          document.getElementById('save-' + tipid).innerText = 'bookmark';
        }
      })
    } else {
      // User is signed out
    }
  });
}


const renderRainTips = (data) => {
  const container = document.getElementById('RainTipsContainer');

  // Create HTML structure
  const template = `
    <div class="rain-tips">
      <h1>Rain Tips</h1>
      <div class="tips-container"></div>
    </div>
  `;
  container.innerHTML = template;


  // Populate tips container
  const tipsContainer = document.querySelector('.tips-container');
  if (data && Object.keys(data).length > 0) {
    for (const tip in data) {
      const tipElement = document.createElement('div');
      tipElement.classList.add('tip-card');

      const titleElement = document.createElement('h2');
      titleElement.textContent = tip;
      tipElement.appendChild(titleElement);

      const textElement = document.createElement('p');
      textElement.textContent = data[tip];
      tipElement.appendChild(textElement);

      const buttonElement = document.createElement('button');
      const bookmarkIcon = document.createElement('span');
      bookmarkIcon.classList.add('material-icons');
      bookmarkIcon.id = 'save-' + tip.replace(/ /g, '-').toLowerCase();
      bookmarkIcon.textContent = 'bookmark_border';
      buttonElement.appendChild(bookmarkIcon);
      buttonElement.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'me-2');
      buttonElement.addEventListener('click', () => {
        saveBookmark(tip, tipElement.id);
      });
      tipElement.appendChild(buttonElement);

      tipElement.id = tip.replace(/ /g, '-').toLowerCase();
      tipsContainer.appendChild(tipElement);
      fillBookmarks(tip);
    };
  } else {
    const noTipsElement = document.createElement('p');
    noTipsElement.textContent = 'No rain tips available.';
    tipsContainer.appendChild(noTipsElement);
  }
};


getRainTips().then((data) => {
  console.log(data);
  renderRainTips(data);
});



const divElement = document.querySelector('#RainTipsContainer');

//-----------------------------------------------------------------------------
// Change this function to make it work for the above code, when the user clicks on the bookmark icon
// This function is called whenever the user clicks on the "bookmark" button.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------

function saveBookmark(title, docID) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, call saveBookmark() function here
      const currentUser = db.collection('users').doc(user.uid);
      console.log(currentUser)

      currentUser.update({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(docID)
      })
        .then(() => {
          console.log(`Bookmark has been saved for: ${currentUser.id}`);
          const iconID = 'save-' + title.replace(/ /g, '-').toLowerCase();
          const icon = document.getElementById(iconID);
          icon.innerText = 'bookmark';
          icon.classList.remove('material-icons-outlined');
          icon.classList.add('material-icons');
        })
        .catch((error) => {
          console.log('Error saving bookmark:', error);
        });
    } else {
      // User is signed out
    }
  });

}




// const getSnowTips = () => {
//   const snowTipsRef = db.collection('Tips and Tricks').doc('Snow tips');

//   return snowTipsRef.get().then((doc) => {
//     if (doc.exists) {
//       return doc.data();
//     } else {
//       console.log('No such document!');
//       return null;
//     }
//   }).catch((error) => {
//     console.log('Error getting document:', error);
//     return null;
//   });
// };
// getSnowTips().then((snowTips) => {
//   console.log(snowTips);
// }).catch((error) => {
//   console.log(error);
// });


// const getHeatTips = () => {
//   const heatTipsRef = db.collection('Tips and Tricks').doc('Heat tips');

//   return heatTipsRef.get().then((doc) => {
//     if (doc.exists) {
//       return doc.data();
//     } else {
//       console.log('No such document!');
//       return null;
//     }
//   }).catch((error) => {
//     console.log('Error getting document:', error);
//     return null;
//   });
// };
// getHeatTips().then((heatTips) => {
//   console.log(heatTips);
// }).catch((error) => {
//   console.log(error);
// });

// const getWindTips = () => {
//   const windTipsRef = db.collection('Tips and Tricks').doc('Wind tips');

//   return windTipsRef.get().then((doc) => {
//     if (doc.exists) {
//       return doc.data();
//     } else {
//       console.log('No such document!');
//       return null;
//     }
//   }).catch((error) => {
//     console.log('Error getting document:', error);
//     return null;
//   });
// };
// getWindTips().then((windTips) => {
//   console.log(windTips);
// }).catch((error) => {
//   console.log(error);
// });
