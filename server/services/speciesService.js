const Paginate = require("../helpers/pagination");
const Species = require("../models/SpeciesModel");

// Get All
const getAllSpecies = async (req, page, limit) => {
	try {
		const total = await Species.countDocuments();
		const { pageNumber, resultLimit } = Paginate.parseSkip(page, limit, total);
		const speciesPagination = new Paginate(req, pageNumber, resultLimit, total);
		const pager = speciesPagination.paginate();

		const species = await Species.find(
			{},
			{},
			{ ...speciesPagination.query, sort: { _id: 1 } }
		);

		return { species, pager };
	} catch (error) {
		throw error;
	}
};

// Get by ID
const getSpeciesById = async (id) => {
	try {
		const species = await Species.findOne({ uid: id });

		return species;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	getAllSpecies,
	getSpeciesById,
};
