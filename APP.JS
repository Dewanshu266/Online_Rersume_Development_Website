// Initialize Firebase
var config = {
    apiKey: "AlzaSyDECYRkmOiwqIsmw3MJxf0XAxk0ljf4sGo",
    authDomain: "resume-db-1403c.firebaseapp.com",
    databaseURL: "https://resume-db-1403c.firebaseio.com",
    projectId: "resume-db-1403c",
    storageBucket: "resume-db-1403c.appspot.com",
    messagingSenderId: "578628846812"
};

firebase.initializeApp(config);

var currentUser;

setTimeout(() => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in
            currentUser = user;

            if (document.getElementById('user-photo')) {
                document.getElementById('user-photo').src = user.photoURL;
            }

            if (document.getElementById('user-name')) {
                document.getElementById('user-name').innerHTML = user.displayName;
            }

            if (document.getElementById('user-id')) {
                document.getElementById('user-id').innerHTML = user.email;
            }

            console.log("User is signed in:", user);
        } else {
            // No user is signed in
            console.log('Not signed in');
            currentUser = null;
        }
    });
}, 800);
