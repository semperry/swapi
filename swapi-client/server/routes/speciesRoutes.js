require("dotenv").config();
const express = require("express");
const speciesRouter = express.Router();

const Paginate = require("../middleware/pagination");
const SpeciesModel = require("../models/speciesModel");

const baseUrl = require("../baseUrl");
const speciesFixture = require("../fixtures/species.json");

// Json migration
speciesRouter.get("/species/migrate", (req, res) => {
  try {
    speciesFixture.forEach((specimen) => {
      const newSpecies = new SpeciesModel(specimen);
      newSpecies.uid = specimen.pk;
      newSpecies.properties = specimen.fields;
      newSpecies.properties.url = `${baseUrl}/species/${specimen.pk}`;
      newSpecies.properties.homeworld = `${baseUrl}/planets/${specimen.pk}`;

      Object.keys(specimen.fields).forEach((field) => {
        if (Array.isArray(specimen.fields[field])) {
          newSpecies.properties[field] = [];
          specimen.fields[field].forEach((item) => {
            newSpecies.properties[field].push(
              `${baseUrl}/${field === "characters" ? "people" : field}/${item}`
            );
          });
        }
      });
      newSpecies.save();
    });
    res.status(200).end();
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  }
});

// GET all
speciesRouter.get("/species", (req, res) => {
  const { page, limit } = req.query;

  SpeciesModel.countDocuments((err, total) => {
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

    const speciesPagination = new Paginate(req, pageNumber, resultLimit, total);
    const pager = speciesPagination.paginate();

    SpeciesModel.find({}, {}, speciesPagination.query, (err, results) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Could not GET species", errors: `${err}` });
      } else if (results) {
        res.status(200).json({
          message: "ok",
          ...pager,
          results: results.map((specimen) => {
            return {
              uid: specimen.uid,
              name: specimen.properties.name,
              url: specimen.properties.url,
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
speciesRouter.get("/species/:id", (req, res) => {
  SpeciesModel.findOne({ uid: req.params.id }, (err, species) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Could not GET species", errors: `${err}` });
    } else if (species) {
      res.status(200).json({ message: "ok", result: species });
    } else {
      res.status(404).end();
    }
  });
});

// POST
speciesRouter.post("/species", (req, res) => {
  const newSpecies = new SpeciesModel(req.body);
  newSpecies.properties.url = `${req.baseUrl}/${req.route.path}/${req.body.uid}`;

  newSpecies
    .save()
    .then((species) => {
      res.status(200).json({ message: "Planet Added", result: species });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Could not POST species", errors: `${err}` });
    });
});

// PUT
speciesRouter.put("/species/update/:id", (req, res) => {
  SpeciesModel.findOne({ uid: req.params.id }, (err, species) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Could not PUT species", errors: `${err}` });
    } else if (species) {
      if (typeof req.body.properties === "undefined") {
        try {
          Object.keys(species.toObject()).forEach((attribute) => {
            species[attribute] = req.body[attribute] || species[attribute];
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          Object.keys(species.toObject()).forEach((attribute) => {
            if (attribute === "properties") {
              Object.keys(species.properties.toObject()).forEach((property) => {
                species.properties[property] =
                  req.body.properties[property] || species.properties[property];
              });
            } else {
              species[attribute] = req.body[attribute] || species[attribute];
            }
          });
        } catch (err) {
          console.log(err);
          res.status(400).json({ message: "Error", errors: `${err}` });
        }
      }

      species.properties.edited = Date.now();

      species.save().then((species) => {
        res.status(200).json({ message: "Species updatad", result: species });
      });
    } else {
      res.status(404).end();
    }
  });
});

// DELETE
speciesRouter.delete("/species/delete/:id", (req, res) => {
  SpeciesModel.findOneAndDelete({ uid: req.params.id }, (err, result) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Could not DELETE species", errors: `${err}` });
    } else if (result) {
      res.status(200).json({ message: "Deleted" });
    } else {
      res.status(404).end();
    }
  });
});

module.exports = speciesRouter;
