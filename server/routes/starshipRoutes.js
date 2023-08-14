const express = require("express");
const starshipRouter = express.Router();

const { checkCache, setCache } = require("../utils/cache");
const withWookiee = require("../utils/wookieeEncoding");
const isWookiee = require("../utils/isWookiee");
const Paginate = require("../helpers/pagination");
const StarshipModel = require("../models/StarshipModel");

// Search
const searchQuery = (req, res, next) => {
	const { name, model } = req.query;

	if (!name && !model) {
		next();
	} else {
		StarshipModel.find(
			{
				$or: [
					{
						"properties.name": { $regex: `${name}`, $options: "i" },
					},
					{
						"properties.model": {
							$regex: `${model}`,
							$options: "i",
						},
					},
				],
			},
			(err, results) => {
				if (err) {
					res
						.status(400)
						.json({ errors: `${err}`, message: "Could not find starship" });
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
starshipRouter.get("/starships", searchQuery, (req, res) => {
	const { page, limit } = req.query;

	StarshipModel.countDocuments((err, total) => {
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

		const starshipPagination = new Paginate(
			req,
			pageNumber,
			resultLimit,
			total
		);
		const pager = starshipPagination.paginate();

		StarshipModel.find(
			{},
			{},
			{ ...starshipPagination.query, sort: { _id: 1 } },
			(err, results) => {
				if (err) {
					res
						.status(400)
						.json({ message: "Could not GET starhsips", errors: `${err}` });
				} else if (results) {
					withWookiee(req, res, {
						...pager,
						results: [
							...results.map((starship) => {
								return {
									uid: starship.uid,
									name: starship.properties.name,
									url: starship.properties.url,
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
starshipRouter.get("/starships/:id", checkCache, (req, res) => {
	StarshipModel.findOne({ uid: `${req.params.id}` }, (err, starhsips) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET starhsips", errors: `${err}` });
		} else if (starhsips) {
			if (!isWookiee(req)) {
				setCache(req, starhsips.toObject());
			}

			withWookiee(req, res, starhsips);
		} else {
			res.status(404).json({ message: "not found" });
		}
	});
});

module.exports = starshipRouter;
