require("dotenv").config();
module.exports =
  process.env.NODE_ENV === "production"
    ? "https://rec-swapi.herokuapp.com/api"
    : `http://localhost:${process.env.PORT}/api`;
