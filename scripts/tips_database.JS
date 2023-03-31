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
      bookmarkIcon.textContent = 'bookmark_border';
      buttonElement.appendChild(bookmarkIcon);
      buttonElement.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'me-2');
      tipElement.appendChild(buttonElement);

      tipsContainer.appendChild(tipElement);
    };
  } else {
    const noTipsElement = document.createElement('p');
    noTipsElement.textContent = 'No rain tips available.';
    tipsContainer.appendChild(noTipsElement);
  }

  // Add event listener to buttons
  const buttons = document.querySelectorAll('.tip-card button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Code to handle button click
    });
  });
};


getRainTips().then((data) => {
  console.log(data);
  renderRainTips(data);
});



const divElement = document.querySelector('#RainTipsContainer');
divElement.appendChild(hikeCard);



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

