// TODO:
// Finish routes
// Search query
// Authorization and authentication
// Data input
// Documentation
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 4000;

// Routes
const filmRoutes = require("./routes/filmRoutes");
const peopleRoutes = require("./routes/peopleRoutes");

mongoose.connect(
  "mongodb://localhost:27017/swapi",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (!err) {
      console.log("Connected to SWAPI DB");
    } else {
      console.log("Error connecting: ", err);
    }
  }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use Routes
app.use("/api", filmRoutes);
app.use("/api", peopleRoutes);

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});

// req.query[name of param]

// /api
// /api/people
// /api/people/:id
// /api/people/?search=
// /api/planets
// /api/planets/:id
// /api/planets/?search=
// /api/films
// /api/films/:id
// /api/starships
// /api/starships/:id
// /api/starships/?search=
// /api/vehicles
// /api/vehicles/:id
// /api/vehicles/?search=
// /api/species
// /api/species/?search=
