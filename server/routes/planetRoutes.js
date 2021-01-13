const express = require("express");
const planetRouter = express.Router();

const { checkCache, setCache } = require("../middleware/cache");
const Paginate = require("../middleware/pagination");
const Planets = require("../models/planetModel");

const searchQuery = (req, res, next) => {
	if (!req.query.search) {
		next();
	} else {
		Planets.find(
			{
				"properties.name": { $regex: `${req.query.search}`, $options: "i" },
			},
			(err, results) => {
				if (err) {
					res
						.status(400)
						.json({ errors: `${err}`, message: "Could not find planet" });
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

		Planets.find({}, {}, planetPagination.query, (err, results) => {
			if (err) {
				res
					.status(400)
					.json({ message: "Could not GET planets", errors: `${err}` });
			} else if (results) {
				res.status(200).json({
					message: "ok",
					...pager,
					results: results.map((planet) => {
						return {
							uid: planet.uid,
							name: planet.properties.name,
							url: planet.properties.url,
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
planetRouter.get("/planets/:id", checkCache, (req, res) => {
	Planets.findOne({ uid: req.params.id }, (err, planet) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET planet", errors: `${err}` });
		} else if (planet) {
			setCache(req, planet.toObject());

			res.status(200).json({ message: "ok", result: planet });
		} else {
			res.status(404).json({ message: "not found" });
		}
	});
});

module.exports = planetRouter;
