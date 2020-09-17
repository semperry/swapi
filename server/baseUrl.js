require("dotenv").config();
module.exports =
	process.env.NODE_ENV === "production"
		? "https://www.swapi.tech/api"
		: `http://localhost:${process.env.PORT}/api`;
