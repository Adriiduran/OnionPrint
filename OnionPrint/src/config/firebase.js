// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQJDrir0SeuDUmWskTFjJTvcSbsUyTDow",
  authDomain: "onionprint-49a4e.firebaseapp.com",
  projectId: "onionprint-49a4e",
  storageBucket: "onionprint-49a4e.appspot.com",
  messagingSenderId: "229769973826",
  appId: "1:229769973826:web:230e4eed524ab20a1e9ddb",
  measurementId: "G-98S9YRSQBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);