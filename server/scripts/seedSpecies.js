const fs = require("fs");
const path = require("path");

const SpeciesModel = require("../models/SpeciesModel");
const {
	convertReferencesToUrls,
} = require("../helpers/convertReferencesToUrls");
const { API_BASE_URL } = require("../config/config");

const seedSpecies = async () => {
	console.log("📥 Seeding species...");

	const data = JSON.parse(
		fs.readFileSync(path.join(__dirname, "../fixtures/species.json"), "utf-8")
	);

	for (const item of data) {
		const uid = item.pk.toString(); // Convert UID to string for consistency
		const preparedData = convertReferencesToUrls(
			{
				uid,
				properties: {
					...item.fields,
					url: `${API_BASE_URL}/species/${uid}`,
				},
			},
			{
				people: "people",
				homeworld: "planets",
			}
		);

		const existingEntry = await SpeciesModel.findOne({ uid: preparedData.uid });

		if (!existingEntry) {
			await SpeciesModel.create(preparedData);
			console.log(`🆕 Created new species: ${preparedData.properties.name}`);
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
				await SpeciesModel.findOneAndUpdate(
					{ uid: preparedData.uid },
					{
						$set: preparedData,
						$inc: { __v: 1 }, // Ensure versioning updates
					},
					{ new: true, runValidators: true, setDefaultsOnInsert: true }
				);

				console.log(`🔄 Updated species: ${preparedData.properties.name}`);
				console.log("🔍 Changes:", changes);
			} else {
				console.log(`✅ No changes for: ${preparedData.properties.name}`);
			}
		}
	}

	console.log("✅ Species seeding complete!");
};

module.exports = seedSpecies;
