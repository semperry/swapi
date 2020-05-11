// TODO:
// Single migration for all json files
// Transport, Vehicle, Starship model refactor
// Search queries
// JSON Schema routes
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 8080;

// Rate Limiters
const apiLimiter = require("./middleware/apiLimiter");

// Routes
const filmRoutes = require("./routes/filmRoutes");
const peopleRoutes = require("./routes/peopleRoutes");
const planetRoutes = require("./routes/planetRoutes");
const speciesRoutes = require("./routes/speciesRoutes");
const transportRoutes = require("./routes/transportRoutes");
const starshipRoutes = require("./routes/starshipRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const rootRoutes = require("./routes/rootRoutes");
const authRoutes = require("./routes/authRoutes");
const migrationRoutes = require("./routes/migrationsRoutes");

const MONGODB_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI
    : "mongodb://localhost:27017/swapi";

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (!err) {
      console.log("Connected to SWAPI DB");
    } else {
      console.log("Error connecting: ", err);
    }
  }
);

app.use(
  cors({
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "build")));

// Use Routes
app.use("/api", apiLimiter);
app.use("/api", rootRoutes);
app.use("/api", filmRoutes);
app.use("/api", peopleRoutes);
app.use("/api", planetRoutes);
app.use("/api", speciesRoutes);
app.use("/api", transportRoutes);
app.use("/api", starshipRoutes);
app.use("/api", vehicleRoutes);

app.use("/data", migrationRoutes);

app.use("/auth", authRoutes);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "/", "../build/index.html"));
});

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});

// /api/species/?search=
