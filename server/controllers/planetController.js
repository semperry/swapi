const isWookiee = require("../utils/isWookiee");
const planetService = require("../services/planetService");
const withWookiee = require("../utils/wookieeEncoding");
const { setCache } = require("../utils/cache");

// Get All
const getPlanets = async (req, res) => {
	const { page, limit } = req.query;

	try {
		const { planets, pager } = await planetService.getAllPlanets(
			req,
			page,
			limit
		);

		if (!planets) return res.status(404).json({ message: "Planets not found" });

		return withWookiee(req, res, {
			...pager,
			results: [
				...planets.map((planet) => {
					return {
						uid: planet.uid,
						name: planet.properties.name,
						url: planet.properties.url,
					};
				}),
			],
		});
	} catch (error) {
		console.error(`Get Planets Error: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET Planets", errors: `${error}` });
	}
};

// Get by ID
const getPlanet = async (req, res) => {
	const id = req.params.id;

	try {
		const planet = await planetService.getPlanetById(id);

		if (!planet) return res.status(404).json({ messsage: "Not found" });

		if (!isWookiee(req)) {
			setCache(req, planet.toObject());
		}

		return withWookiee(req, res, planet);
	} catch (error) {
		console.error(`Get Planet Error: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET planet", error: `${error}` });
	}
};

module.exports = {
	getPlanets,
	getPlanet,
};
