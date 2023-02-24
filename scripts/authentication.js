var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        return true;
      },

      uiShown: function() {
        document.getElementById('loader').style.display = 'none';
      }
    },

    signInFlow: 'popup',
    signInSuccessUrl: './main.html',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],

    tosUrl: '<your-tos-url>',

    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

  ui.start('#firebaseui-auth-container', uiConfig);