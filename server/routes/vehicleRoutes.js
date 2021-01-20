const express = require("express");
const vehicleRouter = express.Router();

const { checkCache, setCache } = require("../utils/cache");
const Paginate = require("../helpers/pagination");
const VehicleModel = require("../models/vehicleModel");

// Search
const searchQuery = (req, res, next) => {
	if (!req.query.search) {
		next();
	} else {
		VehicleModel.find(
			{
				$or: [
					{
						"properties.name": { $regex: `${req.query.search}`, $options: "i" },
					},
					{
						"properties.model": {
							$regex: `${req.query.search}`,
							$options: "i",
						},
					},
				],
			},
			(err, results) => {
				if (err) {
					res
						.status(400)
						.json({ errors: `${err}`, message: "Could not find vehicle" });
				} else if (results) {
					res.status(200).json({ message: "ok", results });
				} else {
					res.status(404).json({ message: "No results, refine your query" });
				}
			}
		);
	}
};

// GET all
vehicleRouter.get("/vehicles", searchQuery, (req, res) => {
	const { page, limit } = req.query;

	VehicleModel.countDocuments((err, total) => {
		if (err) {
			return res.status(400).json({ error: true, message: "Could not Count" });
		}
		const pageNumber =
			page && limit
				? parseInt(page) < 1
					? 1
					: parseInt(page) > Math.ceil(total / limit)
					? Math.ceil(total / limit)
					: parseInt(page)
				: 1;
		const resultLimit =
			page && limit ? (parseInt(limit) > total ? total : parseInt(limit)) : 10;

		const starshipPagination = new Paginate(
			req,
			pageNumber,
			resultLimit,
			total
		);
		const pager = starshipPagination.paginate();

		VehicleModel.find({}, {}, starshipPagination.query, (err, results) => {
			if (err) {
				res
					.status(400)
					.json({ message: "Could not GET vehicles", errors: `${err}` });
			} else if (results) {
				res.status(200).json({
					message: "ok",
					...pager,
					results: results.map((vehicle) => {
						return {
							uid: vehicle.uid,
							name: vehicle.properties.name,
							url: vehicle.properties.url,
						};
					}),
				});
			} else {
				res.status(404).end();
			}
		});
	});
});

// GET one
vehicleRouter.get("/vehicles/:id", checkCache, (req, res) => {
	VehicleModel.findOne({ uid: req.params.id }, (err, vehicles) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET vehicles", errors: `${err}` });
		} else if (vehicles) {
			setCache(req, vehicles.toObject());

			res.status(200).json({ message: "ok", result: vehicles });
		} else {
			res.status(404).json({ message: "not found" });
		}
	});
});

module.exports = vehicleRouter;
