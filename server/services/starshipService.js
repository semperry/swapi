const Paginate = require("../helpers/pagination");
const StarshipModel = require("../models/StarshipModel");

// Get All
const getAllStarships = async (req, page, limit) => {
	try {
		const total = await StarshipModel.countDocuments();
		const { pageNumber, resultLimit } = Paginate.parseSkip(page, limit, total);
		const starshipPagination = new Paginate(
			req,
			pageNumber,
			resultLimit,
			total
		);
		const pager = starshipPagination.paginate();

		const starships = await StarshipModel.find(
			{},
			{},
			{ ...starshipPagination.query, sort: { _id: 1 } }
		);

		return { pager, starships };
	} catch (error) {
		throw error;
	}
};

// Get By ID
const getStarshipById = async (id) => {
	try {
		const starship = await StarshipModel.findOne({ uid: id });

		return starship;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	getAllStarships,
	getStarshipById,
};
