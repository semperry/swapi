require("dotenv").config();
const express = require("express");
const planetRouter = express.Router();

const verifyToken = require("../middleware/verifyToken");
const Paginate = require("../middleware/pagination");
const Planets = require("../models/planetModel");
const baseUrl = require("../baseUrl");

// GET all
planetRouter.get("/planets", (req, res) => {
  const { page, limit } = req.query;

  Planets.countDocuments((err, total) => {
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

    const planetPagination = new Paginate(req, pageNumber, resultLimit, total);
    const pager = planetPagination.paginate();

    Planets.find({}, {}, planetPagination.query, (err, results) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Could not GET planets", errors: `${err}` });
      } else if (results) {
        res.status(200).json({
          message: "ok",
          ...pager,
          results: results.map((planet) => {
            return {
              uid: planet.uid,
              name: planet.properties.name,
              url: planet.properties.url,
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
planetRouter.get("/planets/:id", (req, res) => {
  Planets.findOne({ uid: req.params.id }, (err, planet) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Could not GET planet", errors: `${err}` });
    } else if (planet) {
      res.status(200).json({ message: "ok", result: planet });
    } else {
      res.status(404).end();
    }
  });
});

// POST
planetRouter.post("/planets", verifyToken, (req, res) => {
  const newPlanet = new Planets(req.body);
  newPlanet.properties.url = `${baseUrl}/${req.route.path}/${req.body.uid}`;

  newPlanet
    .save()
    .then((planet) => {
      res.status(200).json({ message: "Planet Added", result: planet });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Could not POST planet", errors: `${err}` });
    });
});

// PUT
planetRouter.put("/planets/update/:id", verifyToken, (req, res) => {
  Planets.findOne({ uid: req.params.id }, (err, planet) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Could not PUT planet", errors: `${err}` });
    } else if (planet) {
      if (typeof req.body.properties === "undefined") {
        try {
          Object.keys(planet.toObject()).forEach((attribute) => {
            planet[attribute] = req.body[attribute] || planet[attribute];
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          Object.keys(planet.toObject()).forEach((attribute) => {
            if (attribute === "properties") {
              Object.keys(planet.properties.toObject()).forEach((property) => {
                planet.properties[property] =
                  req.body.properties[property] || planet.properties[property];
              });
            } else {
              planet[attribute] = req.body[attribute] || planet[attribute];
            }
          });
        } catch (err) {
          console.log(err);
          res.status(400).json({ message: "Error", errors: `${err}` });
        }
      }

      planet.properties.edited = Date.now();

      planet.save().then((planet) => {
        res.status(200).json({ message: "Planet updatad", result: planet });
      });
    } else {
      res.status(404).end();
    }
  });
});

// DELETE
planetRouter.delete("/planets/delete/:id", verifyToken, (req, res) => {
  Planets.findOneAndDelete({ uid: req.params.id }, (err, result) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Could not DELETE planet", errors: `${err}` });
    } else if (result) {
      res.status(200).json({ message: "Deleted" });
    } else {
      res.status(404).end();
    }
  });
});

module.exports = planetRouter;
