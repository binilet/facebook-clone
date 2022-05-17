// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBNiNbf3YQxSIC-1SYzPtsocmssmuaXXtE',
  authDomain: 'facebook-553b4.firebaseapp.com',
  databaseURL: 'https://facebook-553b4-default-rtdb.firebaseio.com',
  projectId: 'facebook-553b4',
  storageBucket: 'facebook-553b4.appspot.com',
  messagingSenderId: '652147009511',
  appId: '1:652147009511:web:caaf0e2ca96a6f596fbf42',
  measurementId: 'G-P8YRNE4VN6',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export default getFirestore();
