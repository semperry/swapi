require("dotenv").config();
const express = require("express");
const transportRouter = express.Router();

const verifyToken = require("../middleware/verifyToken");
const Paginate = require("../middleware/pagination");

const TransportModel = require("../models/transportModel");
const VehicleModel = require("../models/vehicleModel");
const StarShipModel = require("../models/starshipModel");

const baseUrl = require("../baseUrl");
const tranportFixture = require("../fixtures/transport.json");
const vehicleFixture = require("../fixtures/vehicles.json");
const starshipFixture = require("../fixtures/starships.json");

// Json migration - Transports
transportRouter.get("/transport/migrate", verifyToken, (req, res) => {
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
transportRouter.get("/starships/migrate", verifyToken, (req, res) => {
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
transportRouter.get("/vehicles/migrate", verifyToken, (req, res) => {
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

// GET all transports
transportRouter.get("/transport", verifyToken, (req, res) => {
  const { page, limit } = req.query;

  TransportModel.countDocuments((err, total) => {
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

    const transportPagination = new Paginate(
      req,
      pageNumber,
      resultLimit,
      total
    );
    const pager = transportPagination.paginate();

    TransportModel.find({}, {}, transportPagination.query, (err, results) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Could not GET transports", errors: `${err}` });
      } else if (results) {
        res.status(200).json({
          message: "ok",
          ...pager,
          results: results.map((transport) => {
            return {
              uid: transport.uid,
              name: transport.properties.name,
              url: transport.properties.url,
            };
          }),
        });
      } else {
        res.status(404).end();
      }
    });
  });
});

// GET all vehicles
transportRouter.get("/vehicles", (req, res) => {
  const { page, limit } = req.query;

  VehicleModel.countDocuments((err, total) => {
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

    const vehiclePagination = new Paginate(req, pageNumber, resultLimit, total);
    const pager = vehiclePagination.paginate();

    VehicleModel.find({}, {}, vehiclePagination.query, (err, results) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Could not GET vehicles", errors: `${err}` });
      } else if (results) {
        res.status(200).json({
          message: "ok",
          ...pager,
          results: results.map((vehicle) => {
            return {
              uid: vehicle.uid,
              name: vehicle.properties.name,
              url: vehicle.properties.url,
            };
          }),
        });
      } else {
        res.status(404).end();
      }
    });
  });
});

// GET all starships
transportRouter.get("/starships", (req, res) => {
  const { page, limit } = req.query;

  StarShipModel.countDocuments((err, total) => {
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

    StarShipModel.find({}, {}, starshipPagination.query, (err, results) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Could not GET starships", errors: `${err}` });
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

// GET one vehicle
transportRouter.get("/vehicles/:id", (req, res) => {
  VehicleModel.findOne({ uid: req.params.id }, (err, vehicle) => {
    if (err) {
      res
        .status(400)
        .json({ error: `${err}`, message: "Could not GET vehicle" });
    } else {
      res.status(200).json({ message: "ok", result: vehicle });
    }
  });
});

// GET one starship
transportRouter.get("/starships/:id", (req, res) => {
  StarShipModel.findOne({ uid: req.params.id }, (err, starship) => {
    if (err) {
      res
        .status(400)
        .json({ error: `${err}`, message: "Could not GET starship" });
    } else {
      res.status(200).json({ message: "ok", result: starship });
    }
  });
});

module.exports = transportRouter;
