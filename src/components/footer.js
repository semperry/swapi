import React from "react";

function Footer() {
  return (
    <div className="footer">
      <div>
        Originially by{" "}
        <a href="https://phalt.github.io/" target="_blank">
          Paul Hallett
        </a>{" "}
        | Refactored and Maintained by{" "}
        <a href="https://github.com/semperry" target="_blank">
          Ryan Curtis
        </a>{" "}
        &copy;
        {new Date().getFullYear()}
      </div>
      <div />
    </div>
  );
}

export default Footer;
