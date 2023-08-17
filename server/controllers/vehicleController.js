const vehicleService = require("../services/vehicleService");
const { setCache } = require("../utils/cache");
const withWookiee = require("../utils/wookieeEncoding");

// Get All
const getVehicles = async (req, res) => {
	const { page, limit } = req.query;

	try {
		const { vehicles, pager } = await vehicleService.getAllVehicles(
			req,
			page,
			limit
		);

		if (!vehicles) return res.status(404).json({ message: "Not found" });

		return withWookiee(req, res, {
			...pager,
			results: [
				...vehicles.map((vehicle) => {
					return {
						uid: vehicle.uid,
						name: vehicle.properties.name,
						url: vehicle.properties.url,
					};
				}),
			],
		});
	} catch (error) {
		console.error(`Could not GET Vehicles: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET vehicles", errors: `${error}` });
	}
};

// Get by Id
const getVehicle = async (req, res) => {
	const id = req.params.id;

	try {
		const vehicle = await vehicleService.getVehicleById(id);

		if (!vehicle) return res.status(404).json({ message: "Not found" });

		if (!isWookiee(req)) {
			setCache(req, vehicle.toObject());
		}

		return withWookiee(req, res, vehicle);
	} catch (error) {
		console.error(`Get Vehicle Error: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET Vehicle", errors: `${error}` });
	}
};

module.exports = {
	getVehicles,
	getVehicle,
};
