import React, { useState, useContext } from "react";

import { UserContext } from "../index";
import LoginForm from "../components/login";

function Auth() {
  const { state, dispatch } = useContext(UserContext);
  const [errorText, setErrorText] = useState("");

  return (
    <div className="auth-container">
      <LoginForm />
    </div>
  );
}

export default Auth;
