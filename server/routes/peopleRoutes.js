const express = require("express");
const peopleRouter = express.Router();

const Paginate = require("../middleware/pagination");
const People = require("../models/peopleModel");

// GET all
peopleRouter.get("/people", async (req, res) => {
  const { page, limit } = req.query;

  People.countDocuments((err, total) => {
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

    const peoplePagination = new Paginate(req, pageNumber, resultLimit, total);
    const pager = peoplePagination.paginate();

    People.find({}, {}, peoplePagination.query, (err, results) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Could not GET people", errors: `${err}` });
      } else if (results) {
        res.status(200).json({
          message: "ok",
          ...pager,
          results: results.map((person) => {
            return {
              uid: person.uid,
              name: person.properties.name,
              url: person.properties.url,
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
peopleRouter.get("/people/:id", (req, res) => {
  People.findOne({ uid: req.params.id }, (err, person) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Could not GET person", errors: `${err}` });
    } else if (person) {
      res.status(200).json({ message: "ok", result: person });
    } else {
      res.status(404).end();
    }
  });
});

// POST
peopleRouter.post("/people", (req, res) => {
  req.body.properties.url = `http://localhost:4000/api${req.route.path}/${req.body.uid}`;
  const newPerson = new People(req.body);

  newPerson
    .save()
    .then((person) => {
      res.status(200).json({ message: "Person Added", result: person });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Could not POST person", errors: `${err}` });
    });
});

// PUT
peopleRouter.put("/people/update/:id", (req, res) => {
  People.findOne({ uid: req.params.id }, (err, person) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Could not PUT person", errors: `${err}` });
    } else if (person) {
      if (typeof req.body.properties === "undefined") {
        try {
          Object.keys(person.toObject()).forEach((attribute) => {
            person[attribute] = req.body[attribute] || person[attribute];
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          Object.keys(person.toObject()).forEach((attribute) => {
            if (attribute === "properties") {
              Object.keys(person.properties.toObject()).forEach((property) => {
                person.properties[property] =
                  req.body.properties[property] || person.properties[property];
              });
            } else {
              person[attribute] = req.body[attribute] || person[attribute];
            }
          });
        } catch (err) {
          console.log(err);
        }
      }

      person.properties.edited = Date.now();

      person.save().then((person) => {
        res.status(200).json({ message: "Person updatad", result: person });
      });
    } else {
      res.status(404).end();
    }
  });
});

// DELETE
peopleRouter.delete("/people/delete/:id", (req, res) => {
  People.findOneAndDelete({ uid: req.params.id }, (err, result) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Could not DELETE person", errors: `${err}` });
    } else if (result) {
      res.status(200).json({ message: "Deleted" });
    } else {
      res.status(404).end();
    }
  });
});

module.exports = peopleRouter;
