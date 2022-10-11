const express = require("express");
const router = express.Router();

const withWookie = require("../utils/wookieeEncoding");

router.get("/", (req, res) => {
	const baseUrl = req.swapi_url;

	withWookie(req, res, {
		films: `${baseUrl}/films`,
		people: `${baseUrl}/people`,
		planets: `${baseUrl}/planets`,
		species: `${baseUrl}/species`,
		starships: `${baseUrl}/starships`,
		vehicles: `${baseUrl}/vehicles`,
	});
});

module.exports = router;
