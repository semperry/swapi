const express = require("express");
const planetRouter = express.Router();

const { checkCache, setCache } = require("../utils/cache");
const withWookie = require("../utils/wookieeEncoding");
const isWookiee = require("../utils/isWookiee");
const Paginate = require("../helpers/pagination");
const Planets = require("../models/PlanetModel");

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
					withWookie(req, res, results);
				} else {
					res.status(404).json({ message: "No results, refine your query" });
				}
			}
		);
	}
};

// GET all
planetRouter.get("/planets", searchQuery, (req, res) => {
	const { page, limit } = req.query;

	Planets.countDocuments((err, total) => {
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

		const planetPagination = new Paginate(req, pageNumber, resultLimit, total);
		const pager = planetPagination.paginate();

		Planets.find(
			{},
			{},
			{ ...planetPagination.query, sort: { _id: 1 } },
			(err, results) => {
				if (err) {
					res
						.status(400)
						.json({ message: "Could not GET planets", errors: `${err}` });
				} else if (results) {
					withWookie(req, res, {
						...pager,
						results: [
							...results.map((planet) => {
								return {
									uid: planet.uid,
									name: planet.properties.name,
									url: planet.properties.url,
								};
							}),
						],
					});
				} else {
					res.status(404).end();
				}
			}
		);
	});
});

// GET one
planetRouter.get("/planets/:id", checkCache, (req, res) => {
	Planets.findOne({ uid: req.params.id }, (err, planet) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET planet", errors: `${err}` });
		} else if (planet) {
			if (!isWookiee(req)) {
				setCache(req, planet.toObject());
			}

			withWookie(req, res, planet, false);
		} else {
			res.status(404).json({ message: "not found" });
		}
	});
});

module.exports = planetRouter;
