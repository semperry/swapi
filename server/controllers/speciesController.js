const speciesService = require("../services/speciesService");
const { setCache } = require("../utils/cache");
const withWookiee = require("../utils/wookieeEncoding");

// Get All
const getSpecies = async (req, res) => {
	const { page, limit } = req.query;

	try {
		const { species, pager } = await speciesService.getAllSpecies(
			req,
			page,
			limit
		);

		if (!species) return res.status(404).json({ message: "Species not found" });

		return withWookiee(req, res, {
			...pager,
			results: [
				...species.map((specimen) => {
					return {
						uid: specimen.uid,
						name: specimen.properties.name,
						url: specimen.properties.url,
					};
				}),
			],
		});
	} catch (error) {
		console.error(`Could not GET Species: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET all Species", errors: `${error}` });
	}
};

// Get by ID
const getOneSpecies = async (req, res) => {
	const id = req.params.id;

	try {
		const species = await speciesService.getSpeciesById(id);

		if (!species) return res.status(404).json({ message: "Not found" });

		if (!isWookiee(req)) {
			setCache(req, species.toObject());
		}

		return withWookiee(req, res, species);
	} catch (error) {
		console.error(`Could not GET Species by ID: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET that Species", errors: `${error}` });
	}
};

module.exports = {
	getSpecies,
	getOneSpecies,
};
