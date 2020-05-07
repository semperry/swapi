const mongoose = require("mongoose");

const MONGODB_URI =
	process.env.NODE_ENV === "production"
		? process.env.MONGODB_URI
		: "mongodb://localhost:27017/swapi";

module.exports = () =>
	mongoose.connect(
		MONGODB_URI,
		{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
		(err) => {
			if (!err) {
				console.log("Connected to SWAPI DB");
			} else {
				console.log("Error connecting: ", err);
			}
		}
	);
