import React from "react";

function Footer() {
  return (
    <div className="footer">
      <div>
        Originially by <a href="https://phalt.github.io/">Paul Hallett</a> |
        Refactored and Maintained by Ryan Curtis &copy;
        {new Date().getFullYear()}
      </div>
      <div />
    </div>
  );
}

export default Footer;
