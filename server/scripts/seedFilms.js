const fs = require("fs");
const path = require("path");

const FilmModel = require("../models/FilmModel");
const {
	convertReferencesToUrls,
} = require("../helpers/convertReferencesToUrls");
const { API_BASE_URL } = require("../config/config");

const seedFilms = async () => {
	console.log("📥 Seeding films...");

	const data = JSON.parse(
		fs.readFileSync(path.join(__dirname, "../fixtures/films.json"), "utf-8")
	);

	for (const item of data) {
		const uid = item.pk.toString(); // Convert UID to string for consistency
		const preparedData = convertReferencesToUrls(
			{
				uid,
				properties: {
					...item.fields,
					url: `${API_BASE_URL}/films/${uid}`,
				},
			},
			{
				planets: "planets",
				starships: "starships",
				vehicles: "vehicles",
				characters: "people",
				species: "species",
			}
		);

		const existingEntry = await FilmModel.findOne({ uid: preparedData.uid });

		if (!existingEntry) {
			await FilmModel.create(preparedData);
			console.log(`🆕 Created new film: ${preparedData.properties.title}`);
		} else {
			// Compare existing and new data to detect field changes
			const changes = {};
			for (const key in preparedData.properties) {
				const oldValue = existingEntry.properties[key];
				const newValue = preparedData.properties[key];

				// If values are arrays, sort & stringify them before comparing
				const isArray = Array.isArray(oldValue) && Array.isArray(newValue);
				const oldProcessed = isArray
					? JSON.stringify([...oldValue].sort())
					: oldValue;
				const newProcessed = isArray
					? JSON.stringify([...newValue].sort())
					: newValue;

				// Compare processed values
				if (oldProcessed !== newProcessed) {
					changes[key] = { before: oldValue, after: newValue };
				}
			}

			if (Object.keys(changes).length > 0) {
				await FilmModel.findOneAndUpdate(
					{ uid: preparedData.uid },
					{
						$set: preparedData,
						$inc: { __v: 1 }, // Ensure versioning updates
					},
					{ new: true, runValidators: true }
				);

				console.log(`🔄 Updated film: ${preparedData.properties.title}`);
				console.log("🔍 Changes:", changes);
			} else {
				console.log(`✅ No changes for: ${preparedData.properties.title}`);
			}
		}
	}

	console.log("✅ Film seeding complete!");
};

module.exports = seedFilms;
