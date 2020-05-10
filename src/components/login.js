import React, { useState, useEffect } from "react";

function LoginForm(props) {
  return (
    <div>
      <form>
        <div>
          <input type="email" />
        </div>
        <div>
          <input type="password" />
        </div>
        <div>
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
