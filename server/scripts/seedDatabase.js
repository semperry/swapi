const mongoose = require("mongoose");

const seedFilms = require("./seedFilms");
const seedPeople = require("./seedPeople");
const seedPlanets = require("./seedPlanets");
const seedSpecies = require("./seedSpecies");
const seedTransports = require("./seedTransports");

const MONGO_URI = "mongodb://localhost:27017/swapi";

const seedAll = async () => {
	try {
		console.log("🌱 Connecting to MongoDB...");
		await mongoose.connect(MONGO_URI);

		console.log("🚀 Running seeders...");
		await seedFilms();
		await seedPeople();
		await seedPlanets();
		await seedSpecies();
		await seedTransports();

		console.log("✅ All seeders executed successfully!");
		mongoose.connection.close();
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		mongoose.connection.close();
		process.exit(1);
	}
};

seedAll();
