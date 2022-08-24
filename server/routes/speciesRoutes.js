const express = require("express");
const speciesRouter = express.Router();

const { checkCache, setCache } = require("../utils/cache");
const withWookie = require("../utils/wookieeEncoding");
const isWookiee = require("../utils/isWookiee");
const Paginate = require("../helpers/pagination");
const SpeciesModel = require("../models/speciesModel");

// Search
const searchQuery = (req, res, next) => {
	if (!req.query.name) {
		next();
	} else {
		SpeciesModel.find(
			{
				"properties.name": { $regex: `${req.query.name}`, $options: "i" },
			},
			(err, results) => {
				if (err) {
					res
						.status(400)
						.json({ errors: `${err}`, message: "Could not find specie" });
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
speciesRouter.get("/species", searchQuery, (req, res) => {
	const { page, limit } = req.query;

	SpeciesModel.countDocuments((err, total) => {
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

		const speciesPagination = new Paginate(req, pageNumber, resultLimit, total);
		const pager = speciesPagination.paginate();

		SpeciesModel.find(
			{},
			{},
			{ ...speciesPagination.query, sort: { _id: 1 } },
			(err, results) => {
				if (err) {
					res
						.status(400)
						.json({ message: "Could not GET species", errors: `${err}` });
				} else if (results) {
					withWookie(req, res, {
						...pager,
						results: [
							...results.map((specimen) => {
								return {
									uid: specimen.uid,
									name: specimen.properties.name,
									url: specimen.properties.url,
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
speciesRouter.get("/species/:id", checkCache, (req, res) => {
	SpeciesModel.findOne({ uid: req.params.id }, (err, species) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET species", errors: `${err}` });
		} else if (species) {
			if (!isWookiee(req)) {
				setCache(req, species.toObject());
			}

			withWookie(req, res, species);
		} else {
			res.status(404).json({ message: "not found" });
		}
	});
});

module.exports = speciesRouter;
