import React from "react";
import { Link } from "react-router-dom";

function SwapiHeader() {
  return (
    <div className="row yellow">
      <div className="app-header">
        <h1>SWAPI</h1>
        <p>The Star Wars API</p>
        <p>
          <Link to="/about">(...looking for swapi.co?)</Link>
        </p>
      </div>
    </div>
  );
}

export default SwapiHeader;
