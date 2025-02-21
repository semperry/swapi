const express = require("express");

const Planets = require("../models/PlanetModel");
const planetController = require("../controllers/planetController");
const withWookiee = require("../utils/wookieeEncoding");
const { checkCache } = require("../utils/cache");

const planetRouter = express.Router();

const searchQuery = (req, res, next) => {
	if (!req.query.name) {
		next();
	} else {
		Planets.find({
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
					.json({ errors: `${err}`, message: "Could not find planet" });
			});
	}
};

// GET all
planetRouter.get("/planets", searchQuery, planetController.getPlanets);

// GET one
planetRouter.get("/planets/:id", checkCache, planetController.getPlanet);

module.exports = planetRouter;
