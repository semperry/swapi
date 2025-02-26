const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const API_BASE_URL =
	process.env.NODE_ENV === "production"
		? "https://www.swapi.tech/api"
		: "http://localhost:5000/api";

module.exports = { API_BASE_URL };
