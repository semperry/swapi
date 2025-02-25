const Paginate = require("../helpers/pagination");
const VehicleModel = require("../models/VehicleModel");

// Get All
const getAllVehicles = async (req, page, limit) => {
	try {
		const total = await VehicleModel.countDocuments();
		const { pageNumber, resultLimit } = Paginate.parseSkip(page, limit, total);
		const vehiclePagination = new Paginate(req, pageNumber, resultLimit, total);
		const pager = vehiclePagination.paginate();

		const vehicles = await VehicleModel.find(
			{},
			{},
			{ ...vehiclePagination.query, sort: { _id: 1 } }
		);

		return { vehicles, pager };
	} catch (error) {
		throw error;
	}
};

// Get by ID
const getVehicleById = async (id) => {
	try {
		const vehicle = await VehicleModel.findOne({ uid: id });

		return vehicle;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	getAllVehicles,
	getVehicleById,
};
