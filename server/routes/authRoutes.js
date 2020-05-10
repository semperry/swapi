const express = require("express");
const bcrypt = require("bcrypt");

const userModel = require("../models/authModel");
const authRouter = express.Router();

// Post register
authRouter.post("/register", (req, res) => {
  const newUser = new userModel(req.body);
  const password = newUser.password;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      newUser.password = hash;

      newUser
        .save()
        .then((user) => {
          res.status(200).json({ message: "user generated", user });
        })
        .catch((err) => {
          res
            .status(400)
            .json({ error: `${err}`, message: "could not create" });
        });
    });
  });
});

module.exports = authRouter;
