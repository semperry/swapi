import React from "react";

function About() {
  return (
    <div className="about-content">
      <div className="">
        <h4>Statistics</h4>
        <p>People: 82</p>
        <p>Planets: 60</p>
        <p>Films: 6</p>
        <p>Species : 37</p>
        <p>Vehicles: 39</p>
        <p>Starships: 36</p>
      </div>
      <div className="">
        <h2>What is this?</h2>

        <p>From the prequel:</p>
        <p>
          "The Star Wars API is the world's first quantified and
          programmatically-formatted set of Star Wars data.
        </p>

        <p>
          After hours of watching films and trawling through content online, we
          present to you all the{" "}
          <strong>
            People, Films, Species, Starships, Vehicles and Planets
          </strong>{" "}
          from Star Wars.
        </p>

        <p>
          We've formatted this data in{" "}
          <a href="https://json.org">
            <strong>JSON</strong>
          </a>{" "}
          and exposed it to you in a{" "}
          <a href="https://en.wikipedia.org/wiki/Representational_state_transfer">
            <strong>RESTish</strong>
          </a>{" "}
          implementation that allows you to programmatically collect and measure
          the data."
        </p>

        <p>
          I have replicated the original SWAPI platform, not only as a challenge
          for myself ( the{" "}
          <a
            href="https://github.com/phalt/swapi"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Official SWAPI repository{" "}
          </a>{" "}
          takes you pretty far if you want a clone in Django), <br />
          but as a way to provide a standard API for my students without fear of
          it being taken down
        </p>

        <p>
          <a href="/docs">
            Check out the documentation to get started consuming swapi data
          </a>
        </p>

        <h2 id="what-happened">What happened to swapi.co?</h2>

        <p>
          Swapi.co?? Swapi.co.... That's a name I've not heard in a long time...
          A long time.
        </p>
        <p>
          Unfortulately swapi.co is no longer maintained, and the service is
          currently down. This is a personalized branch of SWAPI that I have
          built to continue in assisting <br />
          my students (and others) with api comminucation. I will maintain it as
          much as possible.
        </p>

        <h2>What can you use this for?</h2>

        <p>
          Use SWAPI to fetch Star Wars universe data. This api is a fantastic
          educational resource.
        </p>
        <p>
          The original swapi had amazing helper libraries that I will steadily
          begin implenting. If you have one to contribute, or would like to
          contribute, feel free to contact me.
        </p>

        <p>
          <em>Fetch people, planets, vehicles, and more.</em>:
        </p>

        <pre>
          <code>
            fetch('https://www.swapi.tech/api/planets/1')
            <br /> .then(res => res.json())
            <br /> .then(data => console.log(data))
            <br /> .catch(err => console.error(err);
            <br /> )
          </code>
        </pre>

        <h2>What are the features?</h2>

        <p>
          Originially SWAPI used{" "}
          <a
            href="https://djangoproject.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Django{" "}
          </a>
          and{" "}
          <a
            href="https://django-rest-framework.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Django REST Framework
          </a>{" "}
          to serve a{" "}
          <a
            href="https://en.wikipedia.org/wiki/REST"
            target="_blank"
            rel="noopener noreferrer"
          >
            RESTish
          </a>{" "}
          API to you.
        </p>
        <p>
          In this implementation I used{" "}
          <a
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>{" "}
          and{" "}
          <a
            href="https://expressjs.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Express
          </a>{" "}
          to serve a{" "}
          <a
            href="https://en.wikipedia.org/wiki/Monolithic_application"
            target="_blank"
            rel="noopener noreferrer"
          >
            monolothic
          </a>{" "}
          style application . The data is all formatted in{" "}
          <a href="http://json.org" target="_blank" rel="noopener noreferrer">
            JSON
          </a>
          .
        </p>

        <h2>Who are you?</h2>

        <p>
          I am{" "}
          <a
            href="https://github.com/semperry"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ryan Curtis
          </a>
          , Full Stack Web Engineer and Instructor at Bottega Tech coding
          school.
        </p>

        <h2>Original author?</h2>

        <p>
          This project was originally built and maintained by{" "}
          <a href="http://phalt.co" target="_blank" rel="noopener noreferrer">
            Paul Hallett
          </a>
          .
        </p>

        <h2>Copyright and stuff?</h2>

        <p>Star Wars and all associated names are copyright Lucasfilm ltd.</p>

        <p>This project is open source and carries a BSD licence.</p>

        <p>
          All data has been freely collected from open sources such as{" "}
          <a
            href="https://starwars.wikia.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wookiepedia
          </a>
          .
        </p>

        <p>
          All data as of 5/8/2020 was collected by the original contributors. I
          will be adding data from the same open sources slowly but surely
        </p>

        <h2>Contributors</h2>

        <p>
          SWAPI would not be possible without contributions from the following
          people:
        </p>

        <ul>
          <li>
            <a
              href="https://phalt.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              Paul Hallett
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Videocard"
              target="_blank"
              rel="noopener noreferrer"
            >
              Owen Hallett
            </a>
          </li>
          <li>
            <a
              href="https://github.com/carvilsi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Carvilsi
            </a>
          </li>
          <li>
            <a
              href="https://github.com/astagi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Andrea Stagi
            </a>
          </li>
          <li>
            <a
              href="https://github.com/juriy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Juriy Bura
            </a>
          </li>
        </ul>

        <p>
          I thank you for providing a solid framework to piggy back off of to
          continue educating the masses about api comminucation. Thank you.
        </p>
      </div>
    </div>
  );
}

export default About;
