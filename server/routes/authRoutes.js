const express = require("express");
const bcrypt = require("bcrypt");

const generateToken = require("../middleware/generateToken");
const verifyToken = require("../middleware/verifyToken");
const userModel = require("../models/authModel");
const authRouter = express.Router();

// Post register
authRouter.post("/register", verifyToken, (req, res) => {
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

// Get users
authRouter.get("/users", verifyToken, (req, res) => {
  if (req.user.roles.includes("superuser")) {
    userModel.find((err, results) => {
      if (err) {
        res
          .status(400)
          .json({ error: `${err}`, message: "could not get users" });
      }
      if (results) {
        res.status(200).json({ message: "users found", results });
      } else {
        res.status(404).end();
      }
    });
  } else {
    res.status(401).json({ message: "improper permissions to view" });
  }
});

// Post login
authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  userModel.findOne({ email }, (err, user) => {
    if (err) {
      res.status(401).json({ message: "invalid login" });
    } else {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (err) {
          res.status(401).json({ message: "could not login" });
        } else if (result) {
          await generateToken(res, user);
          res.status(200).json({
            message: "authorized",
            loggedIn: true,
            user: { roles: user.roles, id: user._id },
          });
        } else {
          res.status(401).json({ message: "not authorized" });
        }
      });
    }
  });
});

// Get logged in status
authRouter.get("/logged-in", verifyToken, (req, res) => {
  res.status(200).json({ loggedIn: true, user: req.user });
});

// Delete logout
authRouter.delete("/logout", verifyToken, (req, res) => {
  res.cookie._token = "";

  res.status(200).json({ message: "Logged out" });
});

module.exports = authRouter;
