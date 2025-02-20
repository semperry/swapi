const express = require("express");

const { checkCache } = require("../utils/cache");
const People = require("../models/PeopleModel");
const peopleController = require("../controllers/peopleController");
const withWookiee = require("../utils/wookieeEncoding");

const peopleRouter = express.Router();

// Search
const searchQuery = (req, res, next) => {
	if (!req.query.name) {
		next();
	} else {
		People.find(
			{
				"properties.name": { $regex: `${req.query.name}`, $options: "i" },
			},
			(err, results) => {
				if (err) {
					res
						.status(400)
						.json({ errors: `${err}`, message: "Could not find person" });
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
peopleRouter.get("/people", searchQuery, peopleController.getPeople);

// GET one
peopleRouter.get("/people/:id", checkCache, peopleController.getPerson);

module.exports = peopleRouter;
