import React, { createContext, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./styles/main.scss";
import App from "./pages/App";
import About from "./pages/about";
import Docs from "./pages/docs";
import Auth from "./pages/auth";
import NavBar from "./navigation/navbar";
import Footer from "./components/footer";
import SwapiHeader from "./components/swapiHeader";
import AdminDashboard from "./pages/admin";

export const UserContext = createContext();

const initialState = {
  loggedInStatus: "NOT_LOGGED_IN",
  user: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setUser":
      return { ...state, user: action.user };
    case "setLoggedInStatus":
      return { ...state, loggedInStatus: action.loggedInStatus };
    default:
      return state;
  }
};

function Main() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <SwapiHeader />
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/about" component={About} />
          <Route path="/docs" component={Docs} />
          {state.loggedInStatus === "NOT_LOGGED_IN" ? (
            <Route path="/admin" component={Auth} />
          ) : (
            <Route path="/admin" component={AdminDashboard} />
          )}
        </Switch>
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);
