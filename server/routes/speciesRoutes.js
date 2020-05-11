require("dotenv").config();
const express = require("express");
const speciesRouter = express.Router();

const verifyToken = require("../middleware/verifyToken");
const Paginate = require("../middleware/pagination");
const SpeciesModel = require("../models/speciesModel");

const baseUrl = require("../baseUrl");

// Search
const searchQuery = (req, res, next) => {
  if (!req.query.search) {
    next();
  } else {
    SpeciesModel.find(
      {
        "properties.name": { $regex: `${req.query.search}`, $options: "i" },
      },
      (err, results) => {
        if (err) {
          res
            .status(400)
            .json({ errors: `${err}`, message: "Could not find specie" });
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
speciesRouter.get("/species", searchQuery, (req, res) => {
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
speciesRouter.post("/species", verifyToken, (req, res) => {
  const newSpecies = new SpeciesModel(req.body);
  newSpecies.properties.url = `${baseUrl}/${req.route.path}/${req.body.uid}`;

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
speciesRouter.put("/species/update/:id", verifyToken, (req, res) => {
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
speciesRouter.delete("/species/delete/:id", verifyToken, (req, res) => {
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
