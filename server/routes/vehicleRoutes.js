const express = require("express");

const isWookiee = require("../utils/isWookiee");
const vehicleController = require("../controllers/vehicleController");
const VehicleModel = require("../models/VehicleModel");
const withWookiee = require("../utils/wookieeEncoding");
const { checkCache, setCache } = require("../utils/cache");

const vehicleRouter = express.Router();

// Search
const searchQuery = (req, res, next) => {
	const { name, model } = req.query;

	if (!name && !model) {
		next();
	} else {
		VehicleModel.find(
			{
				$or: [
					{
						"properties.name": { $regex: `${name}`, $options: "i" },
					},
					{
						"properties.model": {
							$regex: `${model}`,
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
					withWookiee(req, res, results);
				} else {
					res.status(404).json({ message: "No results, refine your query" });
				}
			}
		);
	}
};

// GET all
vehicleRouter.get("/vehicles", searchQuery, vehicleController.getVehicles);

// GET one
vehicleRouter.get("/vehicles/:id", checkCache, (req, res) => {
	VehicleModel.findOne({ uid: req.params.id }, (err, vehicles) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET vehicles", errors: `${err}` });
		} else if (vehicles) {
			if (!isWookiee(req)) {
				setCache(req, vehicles.toObject());
			}

			withWookiee(req, res, vehicles);
		} else {
			res.status(404).json({ message: "not found" });
		}
	});
});

module.exports = vehicleRouter;
