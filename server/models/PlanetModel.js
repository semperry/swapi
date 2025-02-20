const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Planet = new Schema({
  description: {
    type: String,
    required: true,
    default: "A planet.",
  },
  uid: {
    type: String,
    required: true,
  },
  properties: {
    name: {
      type: String,
      required: true,
    },
    diameter: {
      type: String,
      required: true,
      default: "Unknown",
    },
    rotation_period: {
      type: String,
      required: true,
      default: "Unknown",
    },
    orbital_period: {
      type: String,
      required: true,
      default: "Unknown",
    },
    gravity: {
      type: String,
      required: true,
      default: "Unknown",
    },
    population: {
      type: String,
      required: true,
      default: "Unknown",
    },
    climate: {
      type: String,
      required: true,
      default: "Unknown",
    },
    terrain: {
      type: String,
      required: true,
      default: "Unkown",
    },
    surface_water: {
      type: String,
      required: true,
      default: "Unknown",
    },
    url: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now(),
    },
    edited: {
      type: Date,
      default: Date.now(),
    },
  },
});

module.exports = mongoose.model("planets", Planet);
