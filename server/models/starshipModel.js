const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Starship = new Schema({
  description: {
    type: String,
    default: "A Starship",
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
    model: {
      type: String,
      required: true,
      default: "Unknown",
    },
    starship_class: {
      type: String,
      required: true,
      default: "Unknown",
    },
    manufacturer: {
      type: String,
      required: true,
      default: "Unknown",
    },
    cost_in_credits: {
      type: String,
      required: true,
      default: "Unknown",
    },
    length: {
      type: String,
      required: true,
      default: "Unknown",
    },
    crew: {
      type: String,
      required: true,
      default: "Unknown",
    },
    passengers: {
      type: String,
      required: true,
      default: "Unknown",
    },
    max_atmosphering_speed: {
      type: String,
      required: true,
      default: "Unknown",
    },
    hyperdrive_rating: {
      type: String,
      required: true,
      default: "Unknown",
    },
    MGLT: {
      type: String,
      required: true,
      default: "Unknown",
    },
    cargo_capacity: {
      type: String,
      required: true,
      default: "Unknown",
    },
    consumables: {
      type: String,
      required: true,
      default: "Unknown",
    },
    pilots: {
      type: Array,
      default: [],
      required: true,
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

module.exports = mongoose.model("starships", Starship);
