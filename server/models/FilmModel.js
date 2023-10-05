const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Film = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "A Star Wars Film",
  },
  properties: {
    title: {
      type: String,
      required: true,
    },
    episode_id: {
      type: Number,
      required: true,
    },
    opening_crawl: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    producer: {
      type: String,
      required: true,
    },
    release_date: {
      type: String,
      required: true,
    },
    characters: {
      type: Array,
      default: [],
      required: true,
    },
    planets: {
      type: Array,
      default: [],
      required: true,
    },
    starships: {
      type: Array,
      default: [],
      required: true,
    },
    vehicles: {
      type: Array,
      default: [],
      required: true,
    },
    species: {
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

module.exports = mongoose.model("films", Film);
