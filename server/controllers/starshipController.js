const starshipService = require("../services/starshipService");
const { setCache } = require("../utils/cache");
const withWookiee = require("../utils/wookieeEncoding");

// Get All
const getStarships = async (req, res) => {
	const { page, limit } = req.query;

	try {
		const { pager, starships } = await starshipService.getAllStarships(
			req,
			page,
			limit
		);

		if (!starships) return res.status(404).json({ message: "Not found" });

		return withWookiee(req, res, {
			...pager,
			results: [
				...starships.map((starship) => {
					return {
						uid: starship.uid,
						name: starship.properties.name,
						url: starship.properties.url,
					};
				}),
			],
		});
	} catch (error) {
		console.error(`Could not GET starhsips: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET starhsips", errors: `${error}` });
	}
};

// Get By ID
const getStarship = async (req, res) => {
	const id = req.params.id;

	try {
		const starship = await starshipService.getStarshipById(id);

		if (!starship) return res.status(404).json({ message: "Not found" });

		if (!isWookiee(req)) setCache(req, starship.toObject());

		return withWookiee(req, res, starship);
	} catch (error) {
		console.error(`Could not GET Starship: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET Starship", errors: `${error}` });
	}
};

module.exports = {
	getStarships,
	getStarship,
};
