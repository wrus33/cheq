import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyD0C15Qb9uIT7eBhYwTNWWDG5gprJcR05k",
  authDomain: "cheqos-b3a29.firebaseapp.com",
  projectId: "cheqos-b3a29",
  storageBucket: "cheqos-b3a29.appspot.com",
  messagingSenderId: "645211488047",
  appId: "1:645211488047:web:b96b720bfb1ab84cbcebda",
  measurementId: "G-R2YWJ7DQRS"
  });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
