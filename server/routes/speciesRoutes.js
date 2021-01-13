const express = require("express");
const speciesRouter = express.Router();

const { checkCache, setCache } = require("../middleware/cache");
const Paginate = require("../middleware/pagination");
const SpeciesModel = require("../models/speciesModel");

// Search
const searchQuery = (req, res, next) => {
	if (!req.query.search) {
		next();
	} else {
		SpeciesModel.find(
			{
				"properties.name": { $regex: `${req.query.search}`, $options: "i" },
			},
			(err, results) => {
				if (err) {
					res
						.status(400)
						.json({ errors: `${err}`, message: "Could not find specie" });
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

		SpeciesModel.find({}, {}, speciesPagination.query, (err, results) => {
			if (err) {
				res
					.status(400)
					.json({ message: "Could not GET species", errors: `${err}` });
			} else if (results) {
				res.status(200).json({
					message: "ok",
					...pager,
					results: results.map((specimen) => {
						return {
							uid: specimen.uid,
							name: specimen.properties.name,
							url: specimen.properties.url,
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
speciesRouter.get("/species/:id", checkCache, (req, res) => {
	SpeciesModel.findOne({ uid: req.params.id }, (err, species) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET species", errors: `${err}` });
		} else if (species) {
			setCache(req, species.toObject());

			res.status(200).json({ message: "ok", result: species });
		} else {
			res.status(404).json({ message: "not found" });
		}
	});
});

module.exports = speciesRouter;
