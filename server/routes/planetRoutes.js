require("dotenv").config();
const express = require("express");
const planetRouter = express.Router();

const verifyToken = require("../middleware/verifyToken");
const Paginate = require("../middleware/pagination");
const Planets = require("../models/planetModel");
const baseUrl = require("../baseUrl");

const planetFixture = require("../fixtures/planets.json");

// Json migration
planetRouter.get("/planets/migrate", verifyToken, (req, res) => {
  if (req.user.roles.includes("superuser")) {
    try {
      planetFixture.forEach((planet) => {
        const newPlanet = new Planets(planet);
        newPlanet.uid = planet.pk;
        newPlanet.properties = planet.fields;
        newPlanet.properties.url = `${baseUrl}/planets/${planet.pk}`;

        Object.keys(planet.fields).forEach((field) => {
          if (Array.isArray(planet.fields[field])) {
            newPlanet.properties[field] = [];
            planet.fields[field].forEach((item) => {
              newPlanet.properties[field].push(
                `${baseUrl}/${
                  field === "characters" ? "people" : field
                }/${item}`
              );
            });
          }
        });
        newPlanet.save();
      });
      res.status(200).end();
    } catch (err) {
      res.status(500).json({ error: `${err}` });
    }
  } else {
    res.status(401).json({ message: "Invalide permissions" });
  }
});

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
  newPlanet.properties.url = `${req.baseUrl}/${req.route.path}/${req.body.uid}`;

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
