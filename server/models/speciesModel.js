const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Species = new Schema({
  description: "A sepcies within the Star Wars universe",
  properties: {
    name: {
      type: String,
      required: true,
    },
    classification: {
      type: String,
      required: true,
      default: "Unkown",
    },
    designation: {
      type: String,
      required: true,
      default: "Unkown",
    },
    average_height: {
      type: String,
      required: true,
      default: "Unkown",
    },
    average_lifespan: {
      type: String,
      required: true,
      default: "Unkown",
    },
    hair_colors: {
      type: String,
      required: true,
      default: "Unkown",
    },
    skin_colors: {
      type: Array,
      required: true,
      default: [],
    },
    eye_colors: {
      type: Array,
      required: true,
      default: [],
    },
    homeworld: {
      type: String,
      required: true,
      default: "Unkown",
    },
    language: {
      type: String,
      required: true,
      default: "Unkown",
    },
    people: {
      type: Array,
      required: true,
      default: [],
    },
    films: {
      type: Array,
      required: true,
      default: [],
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
      required: true,
      default: Date.now(),
    },
  },
});

module.exports = mongoose.model("species", Species);
