const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Planet = new Schema({
  description: "A planet.",
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
      default: "Unknown",
    },
    surface_water: {
      type: String,
      required: true,
      default: "Unknown",
    },
    films: {
      type: Array,
      default: [],
      required: true,
    },
    residents: {
      type: Array,
      default: [],
      required: true,
    },
    url: {
      type: String,
    },
    created: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    edited: {
      type: Date,
      default: Date.now(),
      required: true,
    },
  },
});

module.exports = mongoose.model("planets", Planet);
