require("dotenv").config();
const express = require("express");
const starshipRouter = express.Router();

const { checkCache, setCache } = require("../middleware/cache");
const verifyToken = require("../middleware/verifyToken");
const Paginate = require("../middleware/pagination");
const StarshipModel = require("../models/starshipModel");

const baseUrl = require("../baseUrl");

// Search
const searchQuery = (req, res, next) => {
	if (!req.query.search) {
		next();
	} else {
		StarshipModel.find(
			{
				$or: [
					{
						"properties.name": { $regex: `${req.query.search}`, $options: "i" },
					},
					{
						"properties.model": {
							$regex: `${req.query.search}`,
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
					res.status(200).json({ message: "ok", results });
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

		StarshipModel.find({}, {}, starshipPagination.query, (err, results) => {
			if (err) {
				res
					.status(400)
					.json({ message: "Could not GET starhsips", errors: `${err}` });
			} else if (results) {
				res.status(200).json({
					message: "ok",
					...pager,
					results: results.map((starship) => {
						return {
							uid: starship.uid,
							name: starship.properties.name,
							url: starship.properties.url,
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
starshipRouter.get("/starships/:id", checkCache, (req, res) => {
	StarshipModel.findOne({ uid: `${req.params.id}` }, (err, starhsips) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not GET starhsips", errors: `${err}` });
		} else if (starhsips) {
			setCache(req, starhsips.toObject());

			res.status(200).json({ message: "ok", result: starhsips });
		} else {
			res.status(404).json({ message: "not found" });
		}
	});
});

// POST
starshipRouter.post("/starhsips", verifyToken, (req, res) => {
	const newStarship = new StarshipModel(req.body);
	newStarship.properties.url = `${baseUrl}/${req.route.path}/${req.body.uid}`;

	newStarship
		.save()
		.then((starhsips) => {
			res.status(200).json({ message: "Planet Added", result: starhsips });
		})
		.catch((err) => {
			res
				.status(400)
				.json({ message: "Could not POST starhsips", errors: `${err}` });
		});
});

// PUT
starshipRouter.put("/starhsips/update/:id", verifyToken, (req, res) => {
	StarshipModel.findOne({ uid: req.params.id }, (err, starhsips) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not PUT starhsips", errors: `${err}` });
		} else if (starhsips) {
			if (typeof req.body.properties === "undefined") {
				try {
					Object.keys(starhsips.toObject()).forEach((attribute) => {
						starhsips[attribute] = req.body[attribute] || starhsips[attribute];
					});
				} catch (err) {
					console.log(err);
				}
			} else {
				try {
					Object.keys(starhsips.toObject()).forEach((attribute) => {
						if (attribute === "properties") {
							Object.keys(starhsips.properties.toObject()).forEach(
								(property) => {
									starhsips.properties[property] =
										req.body.properties[property] ||
										starhsips.properties[property];
								}
							);
						} else {
							starhsips[attribute] =
								req.body[attribute] || starhsips[attribute];
						}
					});
				} catch (err) {
					console.log(err);
					res.status(400).json({ message: "Error", errors: `${err}` });
				}
			}

			starhsips.properties.edited = Date.now();

			starhsips.save().then((starhsip) => {
				res.status(200).json({ message: "Starship updatad", result: starhsip });
			});
		} else {
			res.status(404).end();
		}
	});
});

// DELETE
starshipRouter.delete("/starhsips/delete/:id", verifyToken, (req, res) => {
	StarshipModel.findOneAndDelete({ uid: req.params.id }, (err, result) => {
		if (err) {
			res
				.status(400)
				.json({ message: "Could not DELETE starhsips", errors: `${err}` });
		} else if (result) {
			res.status(200).json({ message: "Deleted" });
		} else {
			res.status(404).end();
		}
	});
});

module.exports = starshipRouter;
