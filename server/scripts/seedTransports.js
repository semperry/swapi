const fs = require("fs");
const path = require("path");

const VehicleModel = require("../models/VehicleModel");
const StarshipModel = require("../models/StarshipModel");
const { API_BASE_URL } = require("../config/config");
const {
	convertReferencesToUrls,
} = require("../helpers/convertReferencesToUrls");

const seedTransports = async () => {
	console.log("📥 Seeding vehicles and starships...");

	const transportsData = JSON.parse(
		fs.readFileSync(path.join(__dirname, "../fixtures/transport.json"), "utf-8")
	);
	const vehiclesData = JSON.parse(
		fs.readFileSync(path.join(__dirname, "../fixtures/vehicles.json"), "utf-8")
	);
	const starshipsData = JSON.parse(
		fs.readFileSync(path.join(__dirname, "../fixtures/starships.json"), "utf-8")
	);
	const filmsData = JSON.parse(
		fs.readFileSync(path.join(__dirname, "../fixtures/films.json"), "utf-8")
	);

	// Create a lookup table for transports
	const transportLookup = {};
	transportsData.forEach((transport) => {
		transportLookup[transport.pk] = transport.fields;
	});

	// Create a lookup table for films and their referenced transports
	const filmLookup = {};
	filmsData.forEach((film) => {
		const filmUrl = `${API_BASE_URL}/films/${film.pk}`;

		film.fields.vehicles.forEach((vehicleId) => {
			if (!filmLookup[vehicleId]) filmLookup[vehicleId] = [];
			filmLookup[vehicleId].push(filmUrl);
		});

		film.fields.starships.forEach((starshipId) => {
			if (!filmLookup[starshipId]) filmLookup[starshipId] = [];
			filmLookup[starshipId].push(filmUrl);
		});
	});

	// Helper function to log changes
	const logChanges = (oldData, newData, name) => {
		const changes = [];
		Object.keys(newData.properties).forEach((key) => {
			if (
				JSON.stringify(oldData.properties[key]) !==
				JSON.stringify(newData.properties[key])
			) {
				changes.push(
					`📝 ${key}: "${oldData.properties[key]}" ➝ "${newData.properties[key]}"`
				);
			}
		});

		if (changes.length > 0) {
			console.log(`🔄 Updated ${name}:\n${changes.join("\n")}`);
		} else {
			console.log(`✅ No changes for: ${name}`);
		}
	};

	// Function to process transport entries (for both vehicles and starships)
	const processTransportData = async (data, model, type) => {
		for (const item of data) {
			const transportInfo = transportLookup[item.pk];
			if (!transportInfo) {
				console.warn(
					`⚠️ No matching transport found for ${type}: ${item.fields.name}`
				);
				continue;
			}

			const uid = item.pk.toString();
			const preparedData = convertReferencesToUrls(
				{
					uid,
					properties: {
						...transportInfo,
						...item.fields,
						films: filmLookup[uid] || [], // Attach correct film URLs
						url: `${API_BASE_URL}/${type}/${uid}`,
					},
				},
				{ pilots: "people" } // Convert pilots to API URLs
			);

			const existingEntry = await model.findOne({ uid: preparedData.uid });

			if (!existingEntry) {
				await model.create(preparedData);
				console.log(`🆕 Created new ${type}: ${preparedData.properties.name}`);
			} else if (
				JSON.stringify(existingEntry.properties) !==
				JSON.stringify(preparedData.properties)
			) {
				logChanges(existingEntry, preparedData, preparedData.properties.name);
				await model.updateOne(
					{ uid: preparedData.uid },
					{ $set: preparedData, $inc: { __v: 1 } }
				);
			}
		}
	};

	console.log("🚀 Processing vehicles...");
	await processTransportData(vehiclesData, VehicleModel, "vehicles");

	console.log("🚀 Processing starships...");
	await processTransportData(starshipsData, StarshipModel, "starships");

	console.log("✅ Vehicles and Starships seeding complete!");
};

module.exports = seedTransports;
