const jwt = require("jsonwebtoken");

const generateToken = (res, userData) => {
  const { roles, _id } = userData;

  const token = jwt.sign({ _id, roles }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });

  return res.cookie("_token", token, {
    httpOnly: true,
    maxAge: 3600000,
    secure: process.env.NODE_ENV === "production",
  });
};

module.exports = generateToken;
