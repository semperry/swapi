const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Species = new Schema({
  description: {
    type: String,
    default: "A sepcies within the Star Wars universe",
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
      type: String,
      required: true,
      default: "Unknown",
    },
    eye_colors: {
      type: String,
      required: true,
      default: "Unknown",
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

module.exports = mongoose.model("species", Species);
