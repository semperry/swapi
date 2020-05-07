import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";

import "./styles/main.scss";
import App from "./pages/App";
import About from "./pages/about";
import Docs from "./pages/docs";
import Auth from "./pages/auth";

function Main() {
  return (
    <BrowserRouter>
      <div>
        <div>
          <NavLink exact to="/">
            Home
          </NavLink>
        </div>
        <div>
          <NavLink to="/about">About</NavLink>
        </div>
        <div>
          <NavLink to="/docs">Documentation</NavLink>
        </div>
      </div>

      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/about" component={About} />
        <Route path="/docs" component={Docs} />
        <Route path="/admin/login" component={Auth} />
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
