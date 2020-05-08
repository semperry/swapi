const express = require("express");
const router = express.Router();

const baseUrl = require("../baseUrl");

router.get("/", (req, res) => {
  res.status(200).json({
    films: `${baseUrl}/films`,
    people: `${baseUrl}/people`,
    planets: `${baseUrl}/planets`,
    species: `${baseUrl}/species`,
    starships: `${baseUrl}/starships`,
    vehicles: `${baseUrl}/vehicles`,
  });
});

module.exports = router;
