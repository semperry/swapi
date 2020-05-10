const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  roles: {
    type: Array,
    required: true,
    default: ["standard"],
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("users", User);
