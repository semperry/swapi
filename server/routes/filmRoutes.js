const express = require("express");
const filmRouter = express.Router();

const { checkCache, setCache } = require("../middleware/cache");
const Films = require("../models/filmModel");

// Search
const searchQuery = (req, res, next) => {
	if (!req.query.search) {
		next();
	} else {
		Films.find(
			{
				"properties.title": { $regex: `${req.query.search}`, $options: "i" },
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
filmRouter.get("/films", searchQuery, (req, res) => {
	Films.find((err, films) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET Films", errors: `${err}` });
		} else if (films) {
			res.status(200).json({ message: "ok", results: films });
		} else {
			res.status(404).end();
		}
	});
});

// GET one
filmRouter.get("/films/:id", checkCache, (req, res) => {
	Films.findOne({ uid: req.params.id }, (err, film) => {
		if (err) {
			res.status(400).json({ message: "Could not GET film", errors: `${err}` });
		} else if (film) {
			setCache(req, film.toObject());

			res.status(200).json({ message: "ok", result: film });
		} else {
			res.status(404).json({ message: "not found" });
		}
	});
});

module.exports = filmRouter;
