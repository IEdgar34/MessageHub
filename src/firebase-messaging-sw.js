// Import scripts for Firebase
importScripts("https://www.gstatic.com/firebasejs/9.21.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker with your config object.
const firebaseConfig = {
    apiKey: "AIzaSyAm4FIpmTq7ScBxHHguXclYCAQPYAUAOys",
    authDomain: "chat-39b72.firebaseapp.com",
    databaseURL: "https://chat-39b72-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chat-39b72",
    storageBucket: "chat-39b72.appspot.com",
    messagingSenderId: "720352596482",
    appId: "1:720352596482:web:694f46c4fe9efbbe974d1b",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object to handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
        body: "Background Message body.",
        icon: "/firebase-logo.png", // You can set your own icon here
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
