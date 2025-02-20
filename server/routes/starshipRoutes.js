const express = require("express");

const isWookiee = require("../utils/isWookiee");
const starshipController = require("../controllers/starshipController");
const StarshipModel = require("../models/StarshipModel");
const withWookiee = require("../utils/wookieeEncoding");
const { checkCache } = require("../utils/cache");

const starshipRouter = express.Router();

// Search
const searchQuery = (req, res, next) => {
	const { name, model } = req.query;

	if (!name && !model) {
		next();
	} else {
		StarshipModel.find(
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
						.json({ errors: `${err}`, message: "Could not find starship" });
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
starshipRouter.get("/starships", searchQuery, starshipController.getStarships);

// GET one
starshipRouter.get(
	"/starships/:id",
	checkCache,
	starshipController.getStarship
);

module.exports = starshipRouter;
