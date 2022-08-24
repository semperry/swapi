const express = require("express");
const filmRouter = express.Router();

const { checkCache, setCache } = require("../utils/cache");
const withWookie = require("../utils/wookieeEncoding");
const isWookiee = require("../utils/isWookiee");
const Films = require("../models/filmModel");

// Search
const searchQuery = (req, res, next) => {
	if (!req.query.title) {
		next();
	} else {
		Films.find(
			{
				"properties.title": { $regex: `${req.query.title}`, $options: "i" },
			},
			(err, results) => {
				if (err) {
					res
						.status(400)
						.json({ errors: `${err}`, message: "Could not find film" });
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
filmRouter.get("/films", searchQuery, (req, res) => {
	Films.find((err, films) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET Films", errors: `${err}` });
		} else if (films) {
			withWookie(req, res, films);
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
			if (!isWookiee(req)) {
				setCache(req, film.toObject());
			}

			withWookie(req, res, film, false);
		} else {
			res.status(404).json({ message: "not found" });
		}
	});
});

module.exports = filmRouter;
