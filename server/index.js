// TODO:
// Cors policy
// Refactor
// Contributions.md
// Squash Commits
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Rate Limiters
const { apiLimiter } = require("./middleware/limiters");

const dbConfig = require("./app/dbConfig");

const app = express();
const port = process.env.PORT;

// Routes
const filmRoutes = require("./routes/filmRoutes");
const peopleRoutes = require("./routes/peopleRoutes");
const planetRoutes = require("./routes/planetRoutes");
const speciesRoutes = require("./routes/speciesRoutes");
const starshipRoutes = require("./routes/starshipRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const rootRoutes = require("./routes/rootRoutes");
const countRoutes = require("./routes/getCounts");

dbConfig();

app.use(cors());

app.use(express.static(path.join(__dirname, "..", "build")));

// Use Routes
app.use("/api", apiLimiter);
app.use("/api", [
	rootRoutes,
	filmRoutes,
	peopleRoutes,
	planetRoutes,
	speciesRoutes,
	starshipRoutes,
	vehicleRoutes,
]);
app.use("/count", countRoutes);

app.get(/.*/, (req, res) => {
	res.sendFile(path.join(__dirname, "/", "../build/index.html"));
});

app.listen(port, () => {
	console.log(`Server Running on port ${port}`);
});
