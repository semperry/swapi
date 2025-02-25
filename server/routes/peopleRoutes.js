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
		People.find({
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
					.json({ errors: `${err}`, message: "Could not find person" });
			});
	}
};

// GET all
peopleRouter.get("/people", searchQuery, peopleController.getPeople);

// GET one
peopleRouter.get("/people/:id", checkCache, peopleController.getPerson);

module.exports = peopleRouter;
