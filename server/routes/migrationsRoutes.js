const express = require("express");
const fs = require("fs");
const path = require("path");
const migrationRouter = express.Router();

const verifyToken = require("../middleware/verifyToken");

const TransportModel = require("../models/transportModel");
const VehicleModel = require("../models/vehicleModel");
const StarShipModel = require("../models/starshipModel");

const baseUrl = require("../baseUrl");
const tranportFixture = require("../fixtures/transport.json");
const vehicleFixture = require("../fixtures/vehicles.json");
const starshipFixture = require("../fixtures/starships.json");
const filmFixture = require("../fixtures/films.json");
const peopleFixture = require("../fixtures/people.json");
const planetFixture = require("../fixtures/planets.json");
const speciesFixture = require("../fixtures/species.json");

const migrateData = async (res) => {
  const transportData = await fs.readFileSync(
    path.join(__dirname + "/" + "../fixtures/transport.json"),
    "utf8"
  );

  const allFixtures = await fs.readdirSync(
    path.join(__dirname + "/" + "../fixtures"),
    "utf8"
  );
  const formatFixtures = await allFixtures.map((file) => {
    if (file !== "transport.json") {
      return JSON.parse(
        fs.readFileSync(path.join(`${__dirname}/../fixtures/${file}`), "utf8")
      );
    }
  });

  console.log(...formatFixtures);
  // Send a report of what was updated and added
  res.status(200).json(...formatFixtures, ...JSON.parse(transportData));
};

// go through tranport.json
// go through the rest
// query based on switch model
// if exists, compare each obj to model
// if not, add new

migrationRouter.get("/migrate-all", verifyToken, (req, res) => {
  if (req.user.roles.includes("superuser")) {
    migrateData(res);
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
});

// Json migration
migrationRouter.get("/species/migrate", verifyToken, (req, res) => {
  if (req.user.roles.includes("superuser")) {
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
                `${baseUrl}/${
                  field === "characters" ? "people" : field
                }/${item}`
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
  } else {
    res.status(401).json({ message: "Invalid permissions" });
  }
});

// Json migration
migrationRouter.get("/planets/migrate", verifyToken, (req, res) => {
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

// Json migration
migrationRouter.get("/people/migrate", verifyToken, (req, res) => {
  if (req.user.roles.includes("superuser")) {
    try {
      peopleFixture.forEach((person) => {
        const newPerson = new People(person);
        newPerson.uid = person.pk;
        newPerson.properties = person.fields;
        newPerson.properties.homeworld = `${baseUrl}/planets/${person.fields.homeworld}`;
        newPerson.properties.url = `${baseUrl}/people/${person.pk}`;

        Object.keys(person.fields).forEach((field) => {
          if (Array.isArray(person.fields[field])) {
            newPerson.properties[field] = [];
            person.fields[field].forEach((item) => {
              newPerson.properties[field].push(
                `${baseUrl}/${
                  field === "characters" ? "people" : field
                }/${item}`
              );
            });
          }
        });
        newPerson.save();
      });
      res.status(200).end();
    } catch (err) {
      res.status(500).json({ error: `${err}` });
    }
  } else {
    res.status(401).json({ message: "Invalid permissions" });
  }
});

// Json migration
migrationRouter.get("/films/migrate", verifyToken, (req, res) => {
  if (req.user.roles.includes("superuser")) {
    try {
      filmFixture.forEach((film) => {
        const newFilm = new Films(film);
        newFilm.uid = film.pk;
        newFilm.properties = film.fields;
        newFilm.properties.url = `${baseUrl}/films/${film.pk}`;

        Object.keys(film.fields).forEach((field) => {
          if (Array.isArray(film.fields[field])) {
            newFilm.properties[field] = [];
            film.fields[field].forEach((item) => {
              newFilm.properties[field].push(
                `${baseUrl}/${
                  field === "characters" ? "people" : field
                }/${item}`
              );
            });
          }
        });
        newFilm.save();
      });
      res.status(200).end();
    } catch (err) {
      res.status(500).json({ error: `${err}` });
    }
  } else {
    res.status(401).json({ message: "invalid permissions" });
  }
});

// Json migration - Transports
migrationRouter.get("/transport/migrate", verifyToken, (req, res) => {
  if (req.user.roles.includes("superuser")) {
    try {
      tranportFixture.forEach((transport) => {
        const newTransport = new TransportModel(transport);
        newTransport.uid = transport.pk;
        newTransport.properties = transport.fields;
        newTransport.properties.url = `${baseUrl}/transport/${transport.pk}`;

        Object.keys(transport.fields).forEach((field) => {
          if (Array.isArray(transport.fields[field])) {
            newTransport.properties[field] = [];
            transport.fields[field].forEach((item) => {
              newTransport.properties[field].push(
                `${baseUrl}/${
                  field === "characters" ? "people" : field
                }/${item}`
              );
            });
          }
        });
        newTransport.save();
      });
      res.status(200).json({ message: "data migrated" });
    } catch (err) {
      res.status(500).json({ error: `${err}` });
    }
  } else {
    res.status(401).json({ message: "Invalid permissions" });
  }
});

// Json migration - Starships
migrationRouter.get("/starships/migrate", verifyToken, (req, res) => {
  if (req.user.roles.includes("superuser")) {
    try {
      starshipFixture.forEach(async (starship) => {
        let newStarship;
        await TransportModel.findOne({ uid: starship.pk }, (err, transport) => {
          newStarship = {
            properties: {
              ...starship.fields,
              ...transport.properties.toObject(),
              pilots: starship.fields.pilots.map((pilot) => {
                return `${baseUrl}/people/${pilot}`;
              }),
              url: `${baseUrl}/starships/${transport.uid}`,
            },
            uid: transport.uid,
          };
        });
        const updatedStarship = new StarShipModel(newStarship);
        updatedStarship.save();
      });
      res.status(200).json({ message: "data migrated" });
    } catch (err) {
      res.status(500).json({ error: `${err}` });
    }
  } else {
    res.status(401).json({ message: "Invalid permissions" });
  }
});

// Json migration - Vehicles
migrationRouter.get("/vehicles/migrate", verifyToken, (req, res) => {
  if (req.user.roles.includes("superuser")) {
    try {
      vehicleFixture.forEach(async (vehicle) => {
        let newVehicle;
        await TransportModel.findOne({ uid: vehicle.pk }, (err, transport) => {
          newVehicle = {
            properties: {
              ...vehicle.fields,
              ...transport.properties.toObject(),
              pilots: vehicle.fields.pilots.map((pilot) => {
                return `${baseUrl}/people/${pilot}`;
              }),
              url: `${baseUrl}/vehicles/${transport.uid}`,
            },
            uid: transport.uid,
          };
        });
        const updatedVehicle = new VehicleModel(newVehicle);
        updatedVehicle.save();
      });
      res.status(200).json({ message: "data migrated" });
    } catch (err) {
      res.status(500).json({ error: `${err}` });
    }
  } else {
    res.status(401).json({ message: "Invalid permissions" });
  }
});

module.exports = migrationRouter;
