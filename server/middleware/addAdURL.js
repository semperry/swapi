const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const addAdURL = (_, res, next) => {
	const originalJson = res.json;
	const url =
		process.env.NODE_ENV === "production"
			? "https://www.swapi.tech"
			: "http://localhost:5173";

	res.json = (data) => {
		data.apiVersion = "1.0";
		data.timestamp = new Date();
		data.support = {
			contact: "admin@swapi.tech",
		};

		originalJson.call(res, data);
	};

	next();
};

module.exports = addAdURL;
