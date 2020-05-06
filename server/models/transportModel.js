const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Transport = new Schema({
  uid: {
    type: String,
    required: true,
  },
  properties: {
    consumables: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cargo_capacity: {
      type: String,
      required: true,
    },
    passengers: {
      type: String,
      required: true,
    },
    max_atmosphering_speed: {
      type: String,
      required: true,
    },
    crew: {
      type: String,
      required: true,
    },
    length: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    cost_in_credits: {
      type: String,
      required: true,
    },
    manufacturer: {
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

module.exports = mongoose.model("transport", Transport);
