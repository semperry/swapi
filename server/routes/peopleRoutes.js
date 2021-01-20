const express = require("express");
const peopleRouter = express.Router();

const { checkCache, setCache } = require("../utils/cache");
const Paginate = require("../helpers/pagination");
const People = require("../models/peopleModel");

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
						.json({ errors: `${err}`, message: "Could not find film" });
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
peopleRouter.get("/people", searchQuery, async (req, res) => {
	const { page, limit } = req.query;

	People.countDocuments((err, total) => {
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

		const peoplePagination = new Paginate(req, pageNumber, resultLimit, total);
		const pager = peoplePagination.paginate();

		People.find({}, {}, peoplePagination.query, (err, results) => {
			if (err) {
				res
					.status(400)
					.json({ message: "Could not GET people", errors: `${err}` });
			} else if (results) {
				res.status(200).json({
					message: "ok",
					...pager,
					results: results.map((person) => {
						return {
							uid: person.uid,
							name: person.properties.name,
							url: person.properties.url,
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
peopleRouter.get("/people/:id", checkCache, (req, res) => {
	People.findOne({ uid: req.params.id }, (err, person) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET person", errors: `${err}` });
		} else if (person) {
			setCache(req, person.toObject());

			res.status(200).json({ message: "ok", result: person });
		} else {
			res.status(404).json({ message: "not found" });
		}
	});
});

module.exports = peopleRouter;
