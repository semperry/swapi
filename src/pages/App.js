import React from "react";
import { Link, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <div className="row yellow">
        <div className="app-header">
          <h1>SWAPI</h1>
          <p>The Star Wars API</p>
          <p>
            <Link to="/about">(...looking for swapi.co?)</Link>
          </p>
        </div>
      </div>
      <div className="content-container">
        <div className="row">
          <div>
            <p>All the Star Wars data you've ever wanted:</p>
            <p>
              <b>Planets, Spaceships, Vehicles, People, Films and Species</b>
            </p>
            <h4>Now with The Force Awakens data!</h4>
          </div>
        </div>

        <div class="row">
          <hr />
          <h1>Try it now!</h1>
          <div class="input-group">
            <span>https://rec-swapi.herokuapp.com/api/</span>
            <input type="text" placeholder="people/1/" />
            <span class="input-group-btn">
              <button>request</button>
            </span>
            <small>
              Need a hint? try{" "}
              <a href="#">
                <i>people/1/</i>
              </a>{" "}
              or{" "}
              <a href="#">
                <i>planets/3/</i>
              </a>{" "}
              or{" "}
              <a href="#">
                <i>starships/9/</i>
              </a>
            </small>
          </div>
          <p class="lead pad_top">Result:</p>
          <div class="well">{/* API CONTENT */}</div>
          <div class="row pad_bot">
            <div>
              <h4>What is this?</h4>
              <p>
                The Star Wars API, or "swapi" (Swah-pee) is the world's first
                quantified and programmatically-accessible data source for all
                the data from the Star Wars canon universe!
              </p>
              <p>
                We've taken all the rich contextual stuff from the universe and
                formatted into something easier to consume with software. Then
                we went and stuck an API on the front so you can access it all!
              </p>
            </div>
            <div>
              <h4>How can I use it?</h4>
              <p>
                All the data is accessible through our HTTP web API. Consult our{" "}
                <Link to="/docs">documentation</Link> if you'd like to get
                started.
              </p>
            </div>
            <div>
              <h4>What happened with old swapi.co?</h4>
              <p>
                swapi.co is not supported and maintained anymore. But since so
                many projects and tutorials used it as their educational
                playground, this is an "unofficial" branch
              </p>
            </div>
          </div>
          <hr />

          <div class="row">
            <div>
              Originially by Paul Hallett | Refactored and Maintained by Ryan
              Curtis &copy;{new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
