// TODO:
// Contributions.md
// Use virtualization for vehicles
// Migrate to update all records, not append
// Single migration for all json files
// Transport, Vehicle, Starship model refactor
// Wookie encoding
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

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
const transportRoutes = require("./routes/transportRoutes");
const starshipRoutes = require("./routes/starshipRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const rootRoutes = require("./routes/rootRoutes");
const authRoutes = require("./routes/authRoutes");
const migrationRoutes = require("./routes/migrationsRoutes");
const countRoutes = require("./routes/getCounts");

dbConfig();

app.use(
	cors({
		credentials: true,
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "build")));

// Use Routes
app.use("/api", apiLimiter);
app.use("/api", [
	rootRoutes,
	filmRoutes,
	peopleRoutes,
	planetRoutes,
	speciesRoutes,
	transportRoutes,
	starshipRoutes,
	vehicleRoutes,
]);
app.use("/data", migrationRoutes);
app.use("/auth", authRoutes);
app.use("/count", countRoutes);

app.get(/.*/, (req, res) => {
	res.sendFile(path.join(__dirname, "/", "../build/index.html"));
});

app.listen(port, () => {
	console.log(`Server Running on port ${port}`);
});
