const Paginate = require("../helpers/pagination");
const People = require("../models/PeopleModel");

// Get All
const getAllPeople = async (req, page, limit) => {
	try {
		const total = await People.countDocuments();
		const { pageNumber, resultLimit } = Paginate.parseSkip(page, limit, total);
		const peoplePagination = new Paginate(req, pageNumber, resultLimit, total);
		const pager = peoplePagination.paginate();

		const people = await People.find(
			{},
			{},
			{ ...peoplePagination.query, sort: { _id: 1 } }
		);

		return { pager, people };
	} catch (error) {
		throw error;
	}
};

// Get by ID
const getPersonById = async (id) => {
	try {
		const person = await People.findOne({ uid: id });

		return person;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	getAllPeople,
	getPersonById,
};
