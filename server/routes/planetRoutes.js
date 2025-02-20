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
		Planets.find(
			{
				"properties.name": { $regex: `${req.query.name}`, $options: "i" },
			},
			(err, results) => {
				if (err) {
					res
						.status(400)
						.json({ errors: `${err}`, message: "Could not find planet" });
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
planetRouter.get("/planets", searchQuery, planetController.getPlanets);

// GET one
planetRouter.get("/planets/:id", checkCache, planetController.getPlanet);

module.exports = planetRouter;
