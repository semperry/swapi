import React, { useState, useContext } from "react";

import { UserContext } from "../index";
import LoginForm from "../components/login";

function Auth() {
  const { dispatch } = useContext(UserContext);
  const [errorText, setErrorText] = useState("");

  const handleLogin = (userObj) => {
    dispatch({ type: "setUser", user: userObj });
    dispatch({ type: "setLoggedInStatus", loggedInStatus: "LOGGED_IN" });
  };

  const handleNonLogin = (errString) => {
    errString = errString || "Invalid Credentials";
    setErrorText(errString);
  };

  return (
    <div className="auth-container">
      <LoginForm
        errorText={errorText}
        handleLogin={handleLogin}
        handleNonLogin={handleNonLogin}
      />
    </div>
  );
}

export default Auth;
