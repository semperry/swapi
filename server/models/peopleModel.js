const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Person = new Schema({
  description: {
    type: String,
    required: true,
    default: "A person within the Star Wars universe",
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
    height: {
      type: String,
      required: true,
      default: "Unkown",
    },
    mass: {
      type: String,
      required: true,
      default: "Unkown",
    },
    hair_color: {
      type: String,
      required: true,
      default: "Unkown",
    },
    skin_color: {
      type: String,
      required: true,
      default: "Unkown",
    },
    eye_color: {
      type: String,
      required: true,
      default: "Unkown",
    },
    birth_year: {
      type: String,
      required: true,
      default: "Unkown",
    },
    gender: {
      type: String,
      required: true,
      default: "Unkown",
    },
    homeworld: {
      type: String,
      required: true,
      default: "Unkown",
    },
    films: {
      type: Array,
      default: [],
      required: true,
    },
    species: {
      type: String,
      required: true,
      default: "Unkown",
    },
    vehicles: {
      type: Array,
      default: [],
      required: true,
    },
    starships: {
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
      required: true,
    },
  },
});

module.exports = mongoose.model("people", Person);
