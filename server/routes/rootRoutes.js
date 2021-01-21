const express = require("express");
const router = express.Router();

const withWookie = require("../utils/wookieeEncoding");
const baseUrl = require("../app/baseUrl");

router.get("/", (req, res) => {
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
