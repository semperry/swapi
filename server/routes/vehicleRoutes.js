require("dotenv").config();
const express = require("express");
const vehicleRouter = express.Router();

const verifyToken = require("../middleware/verifyToken");
const Paginate = require("../middleware/pagination");
const VehicleModel = require("../models/vehicleModel");

const baseUrl = require("../baseUrl");

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
vehicleRouter.get("/vehicles/:id", (req, res) => {
	VehicleModel.findOne({ uid: req.params.id }, (err, vehicles) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET vehicles", errors: `${err}` });
		} else if (vehicles) {
			res.status(200).json({ message: "ok", result: vehicles });
		} else {
			res.status(404).end();
		}
	});
});

// POST
vehicleRouter.post("/vehicles", verifyToken, (req, res) => {
	const newVehicle = new VehicleModel(req.body);
	newVehicle.properties.url = `${baseUrl}/${req.route.path}/${req.body.uid}`;

	newVehicle
		.save()
		.then((vehicles) => {
			res.status(200).json({ message: "Vehicle Added", result: vehicles });
		})
		.catch((err) => {
			res
				.status(400)
				.json({ message: "Could not POST vehicles", errors: `${err}` });
		});
});

// PUT
vehicleRouter.put("/vehicles/update/:id", verifyToken, (req, res) => {
	VehicleModel.findOne({ uid: req.params.id }, (err, vehicles) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not PUT vehicles", errors: `${err}` });
		} else if (vehicles) {
			if (typeof req.body.properties === "undefined") {
				try {
					Object.keys(vehicles.toObject()).forEach((attribute) => {
						vehicles[attribute] = req.body[attribute] || vehicles[attribute];
					});
				} catch (err) {
					console.log(err);
				}
			} else {
				try {
					Object.keys(vehicles.toObject()).forEach((attribute) => {
						if (attribute === "properties") {
							Object.keys(vehicles.properties.toObject()).forEach(
								(property) => {
									vehicles.properties[property] =
										req.body.properties[property] ||
										vehicles.properties[property];
								}
							);
						} else {
							vehicles[attribute] = req.body[attribute] || vehicles[attribute];
						}
					});
				} catch (err) {
					console.log(err);
					res.status(400).json({ message: "Error", errors: `${err}` });
				}
			}

			vehicles.properties.edited = Date.now();

			vehicles.save().then((vehicle) => {
				res.status(200).json({ message: "Vehicle updatad", result: vehicle });
			});
		} else {
			res.status(404).end();
		}
	});
});

// DELETE
vehicleRouter.delete("/vehicles/delete/:id", verifyToken, (req, res) => {
	VehicleModel.findOneAndDelete({ uid: req.params.id }, (err, result) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not DELETE vehicles", errors: `${err}` });
		} else if (result) {
			res.status(200).json({ message: "Deleted" });
		} else {
			res.status(404).end();
		}
	});
});

module.exports = vehicleRouter;
