const express = require("express");

const speciesController = require("../controllers/speciesController");
const SpeciesModel = require("../models/SpeciesModel");
const withWookiee = require("../utils/wookieeEncoding");
const { checkCache } = require("../utils/cache");

const speciesRouter = express.Router();

// Search
const searchQuery = (req, res, next) => {
	if (!req.query.name) {
		next();
	} else {
		SpeciesModel.find({
			"properties.name": { $regex: `${req.query.name}`, $options: "i" },
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
					.json({ errors: `${err}`, message: "Could not find specie" });
			});
	}
};

// GET all
speciesRouter.get("/species", searchQuery, speciesController.getSpecies);

// GET one
speciesRouter.get("/species/:id", checkCache, speciesController.getOneSpecies);

module.exports = speciesRouter;
