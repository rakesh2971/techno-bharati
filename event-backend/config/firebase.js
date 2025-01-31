const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBtTcqcxxX6igjqUeNDc4J4i6xAZtSKqmU",
  authDomain: "techno-bharati.firebaseapp.com",
  projectId: "techno-bharati",
  storageBucket: "techno-bharati.firebasestorage.app",
  messagingSenderId: "328789615687",
  appId: "Y1:328789615687:web:fdc745a58f4ae1450d3d62",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

module.exports = { db, storage };
