const path = require("path");

dotenv = require("dotenv").config({ path: path.join(__dirname, "../.env") });
const cors = require("cors");
const express = require("express");

const dbConfig = require("./config/dbConfig");

// Middleware modules
const addAdURL = require("./middleware/addAdURL");
const setEncoding = require("./middleware/encodingFormat");
const setUrl = require("./middleware/setUrl");
const { apiLimiter, apiSlowDown } = require("./middleware/limiters");

// Route modules
const adClickRoutes = require("./routes/adClickRoutes");
const countRoutes = require("./routes/countRoutes");
const filmRoutes = require("./routes/filmRoutes");
const peopleRoutes = require("./routes/peopleRoutes");
const planetRoutes = require("./routes/planetRoutes");
const rootRoutes = require("./routes/rootRoutes");
const speciesRoutes = require("./routes/speciesRoutes");
const starshipRoutes = require("./routes/starshipRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");

// Config
const app = express();
const PORT = process.env.PORT || 5000;

dbConfig();

const allowedHeaders = ["GET"];

// Middleware
app.use(cors());
app.use(express.json());

app.set("trust proxy", 1);
app.use(
	cors({
		methods: allowedHeaders,
	})
);

// Honey Pot middleware to drop NPM Package traffic flood
app.use((req, res, next) => {
	if (!allowedHeaders.includes(req.method)) {
		req.destroy();
	} else {
		next();
	}
});

// API Routes
app.use("/api", [
	addAdURL,
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
app.use("/track", apiLimiter, apiSlowDown, adClickRoutes);

// Production Build
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
