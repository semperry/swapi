const express = require("express");

const filmController = require("../controllers/filmController");
const withWookiee = require("../utils/wookieeEncoding");
const { checkCache } = require("../utils/cache");
const Films = require("../models/FilmModel");

const filmRouter = express.Router();

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
					withWookiee(req, res, results);
				} else {
					res.status(404).json({ message: "No results, refine your query" });
				}
			}
		);
	}
};

// GET all
filmRouter.get("/films", searchQuery, filmController.getFilms);

// GET one
filmRouter.get("/films/:id", checkCache, filmController.getFilm);

module.exports = filmRouter;
