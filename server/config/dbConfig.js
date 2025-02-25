const mongoose = require("mongoose");

const MONGODB_URI =
	process.env.NODE_ENV === "production"
		? process.env.MONGODB_URI
		: "mongodb://127.0.0.1:27017/swapi";

module.exports = () => {
	mongoose
		.connect(MONGODB_URI)
		.then(() => console.log("Connected to SWAPI DB"))
		.catch((err) => {
			console.log("Error connecting: ", err);
		});

	mongoose.connection.on("error", (err) =>
		console.log("Error after successful connection: ", err),
	);
};
