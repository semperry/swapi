import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";

import "./styles/main.scss";
import App from "./pages/App";
import About from "./pages/about";
import Docs from "./pages/docs";
import Auth from "./pages/auth";
import NavBar from "./navigation/navbar";

function Main() {
  return (
    <BrowserRouter>
      <NavBar />

      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/about" component={About} />
        <Route path="/docs" component={Docs} />
        <Route exact path="/admin/login" component={Auth} />
      </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);
