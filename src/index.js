import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

function renderToDom() {
  ReactDOM.render(<App />, document.getElementById("app"));
}

renderToDom();

if (module.hot) {
  module.hot.accept("./components/App", () => {
    renderToDom();
  });
}
