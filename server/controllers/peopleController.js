const peopleService = require("../services/peopleService");
const { setCache } = require("../utils/cache");
const withWookiee = require("../utils/wookieeEncoding");

// Get All
const getPeople = async (req, res) => {
	const { page, limit } = req.query;

	try {
		const { people, pager } = await peopleService.getAllPeople(
			req,
			page,
			limit
		);

		if (!people) return res.status(404).json({ message: "People not found" });

		return withWookiee(req, res, {
			...pager,
			results: [
				...people.map((person) => {
					return {
						uid: person.uid,
						name: person.properties.name,
						url: person.properties.url,
					};
				}),
			],
		});
	} catch (error) {
		console.error(`Get People Error: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET people", errors: `${error}` });
	}
};

// Get by ID
const getPerson = async (req, res) => {
	const id = req.params.id;

	try {
		const person = await peopleService.getPersonById(id);

		if (!person) return res.status(404).json({ message: "not found" });

		if (!isWookiee(req)) {
			setCache(req, person.toObject());
		}

		return withWookiee(req, res, person);
	} catch (error) {
		console.error(`Get Person Error: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET person", errors: `${error}` });
	}
};

module.exports = {
	getPeople,
	getPerson,
};
