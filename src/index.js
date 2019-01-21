import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

firebase.initializeApp({
  apiKey: "AIzaSyD8XH4nFnBLq2xIk5TgaMpB6xTGEkAvpRQ",
  authDomain: "bookshelf-2f6c0.firebaseapp.com",
  projectId: "bookshelf-2f6c0",
});

function renderToDom() {
  ReactDOM.render(<App />, document.getElementById("app"));
}

renderToDom();

if (module.hot) {
  module.hot.accept("./components/App", () => {
    renderToDom();
  });
}
