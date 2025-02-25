const Paginate = require("../helpers/pagination");
const Planets = require("../models/PlanetModel");

// Get All
const getAllPlanets = async (req, page, limit) => {
	try {
		const total = await Planets.countDocuments();
		const { pageNumber, resultLimit } = Paginate.parseSkip(page, limit, total);
		const planetPagination = new Paginate(req, pageNumber, resultLimit, total);
		const pager = planetPagination.paginate();

		const planets = await Planets.find(
			{},
			{},
			{ ...planetPagination.query, sort: { _id: 1 } }
		);

		return { pager, planets };
	} catch (error) {
		throw error;
	}
};

// Get by ID
const getPlanetById = async (id) => {
	try {
		const planet = await Planets.findOne({ uid: id });

		return planet;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	getAllPlanets,
	getPlanetById,
};
