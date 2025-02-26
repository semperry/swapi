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
		VehicleModel.find({
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
		})
			.then((results) => {
				if (results) {
					withWookiee(req, res, results);
				} else {
					return res
						.status(404)
						.json({ message: "No results, refine your query" });
				}
			})
			.catch((err) => {
				return res
					.status(400)
					.json({ errors: `${err}`, message: "Could not find vehicle" });
			});
	}
};

// GET all
vehicleRouter.get("/vehicles", searchQuery, vehicleController.getVehicles);

// GET one
vehicleRouter.get("/vehicles/:id", checkCache, vehicleController.getVehicle);

module.exports = vehicleRouter;
