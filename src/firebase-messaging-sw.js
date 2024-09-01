importScripts("https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyBI2NBh9HXM8VXKKKnrgKB3KZwcfzrf1E8",
    authDomain: "facilitymanagement-82978.firebaseapp.com",
    projectId: "facilitymanagement-82978",
    storageBucket: "facilitymanagement-82978.appspot.com",
    messagingSenderId: "577841958574",
    appId: "1:577841958574:web:f6913e27e5915051fde73f",
    vapidKey:
        "BElFlpEl4njyX3vyHl-OR0gMU3rHhX_1Gp7YQxh6XEISq6jsl3NqiZon9tjOrDw8JtDJ7G2CGDE21F-keO3gzcQ",
});
const messaging = firebase.messaging();