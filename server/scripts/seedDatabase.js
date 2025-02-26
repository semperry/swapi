const mongoose = require("mongoose");
const readline = require("readline");

const seedFilms = require("./seedFilms");
const seedPeople = require("./seedPeople");
const seedPlanets = require("./seedPlanets");
const seedSpecies = require("./seedSpecies");
const seedTransports = require("./seedTransports");

const MONGO_URI = "mongodb://localhost:27017/swapi";

const models = {
	films: seedFilms,
	people: seedPeople,
	planets: seedPlanets,
	species: seedSpecies,
	transports: seedTransports,
};

const selectedModels = process.argv.slice(2).map((arg) => arg.toLowerCase());
const modelsToSeed = selectedModels.length
	? selectedModels.map((model) => {
			if (model === "starships" || model === "vehicles") {
				console.log(
					"Starships and Vehicles are seeded together through transports."
				);
				return "transports";
			}

			return models[model];
	  })
	: Object.keys(models);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const confirmSeeding = async () => {
	return new Promise((resolve) => {
		rl.question(
			`⚠️ Are you sure you want to seed the following models? ${modelsToSeed.join(
				", "
			)} (yes/no): `,
			(answer) => {
				if (answer.toLowerCase() === "yes") {
					resolve(true);
				} else {
					console.log("❌ Seeding cancelled.");
					process.exit(0);
				}
			}
		);
	});
};

const seedDatabase = async () => {
	try {
		console.log("🌱 Connecting to MongoDB...");
		await mongoose.connect(MONGO_URI);

		if (!(await confirmSeeding())) return;

		console.log("🚀 Running selected seeders...");
		for (const model of modelsToSeed) {
			if (models[model]) {
				await models[model]();
			} else {
				console.warn(`⚠️ No seeding function found for: ${model}`);
			}
		}

		console.log("✅ Seeding process complete!");
	} catch (error) {
		console.error("❌ Error seeding database:", error);
	} finally {
		mongoose.connection.close();
		rl.close();
	}
};

seedDatabase();
