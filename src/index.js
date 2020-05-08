import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";

import "./styles/main.scss";
import App from "./pages/App";
import About from "./pages/about";
import Docs from "./pages/docs";
import Auth from "./pages/auth";
import NavBar from "./navigation/navbar";
import Footer from "./components/footer";
import SwapiHeader from "./components/swapiHeader";

function Main() {
  return (
    <BrowserRouter>
      <NavBar />
      <SwapiHeader />
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/about" component={About} />
        <Route path="/docs" component={Docs} />
        <Route path="/admin" component={Auth} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);
