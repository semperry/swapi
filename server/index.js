// TODO:
// Use redis to handle limiters
// IP grabber on each route for analytics
// Separate limiters for each route
// Add to Terms of service about polling
// Refactor Cache (with wookie data)
// Simplify Search Query Middleware
// Simplify pagination
// Cors policy
// Helmet
// Refactor errythang
// Contributions.md
// Squash Commits
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Middleware
const { apiLimiter, apiSlowDown } = require("./middleware/limiters");
const setEncoding = require("./middleware/encodingFormat");
const setUrl = require("./middleware/setUrl");
const dbConfig = require("./app/dbConfig");

const allowedHeaders = ["GET"];

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
app.set("trust proxy", 1);
app.use(
	cors({
		methods: allowedHeaders,
	})
);

app.use(express.static(path.join(__dirname, "..", "build")));

app.use((req, res, next) => {
	if (!allowedHeaders.includes(req.method)) {
		req.destroy();
	} else {
		next();
	}
});

app.use("/api", [
	apiLimiter,
	apiSlowDown,
	setEncoding,
	setUrl,
	rootRoutes,
	filmRoutes,
	peopleRoutes,
	planetRoutes,
	speciesRoutes,
	starshipRoutes,
	vehicleRoutes,
]);
app.use("/count", countRoutes);

// Catch all
app.get(/.*/, (req, res) => {
	res.sendFile(path.join(__dirname, "/", "../build/index.html"));
});

app.listen(port, () => {
	console.log(`Server Running on port ${port}`);
});
