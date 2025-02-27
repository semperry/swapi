const adClickRoutes = require("../routes/adClickRoutes");
const countRoutes = require("../routes/countRoutes");
const filmRoutes = require("../routes/filmRoutes");
const peopleRoutes = require("../routes/peopleRoutes");
const planetRoutes = require("../routes/planetRoutes");
const rootRoutes = require("../routes/rootRoutes");
const speciesRoutes = require("../routes/speciesRoutes");
const starshipRoutes = require("../routes/starshipRoutes");
const vehicleRoutes = require("../routes/vehicleRoutes");

const applyRoutes = (app) => {
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
	app.use("/track", adClickRoutes);
};

module.exports = applyRoutes;
