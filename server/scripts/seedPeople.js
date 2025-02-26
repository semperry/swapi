const fs = require("fs");
const path = require("path");

const PeopleModel = require("../models/PeopleModel");
const {
	convertReferencesToUrls,
} = require("../helpers/convertReferencesToUrls");
const { API_BASE_URL } = require("../config/config");

const seedPeople = async () => {
	console.log("📥 Seeding people...");

	const data = JSON.parse(
		fs.readFileSync(path.join(__dirname, "../fixtures/people.json"), "utf-8")
	);

	for (const item of data) {
		const uid = item.pk.toString(); // Convert UID to string for consistency
		const preparedData = convertReferencesToUrls(
			{
				uid,
				properties: {
					...item.fields,
					url: `${API_BASE_URL}/people/${uid}`,
				},
			},
			{ homeworld: "planets" }
		);

		const existingEntry = await PeopleModel.findOne({ uid: preparedData.uid });

		if (!existingEntry) {
			await PeopleModel.create(preparedData);
			console.log(`🆕 Created new person: ${preparedData.properties.name}`);
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
				await PeopleModel.findOneAndUpdate(
					{ uid: preparedData.uid },
					{
						$set: preparedData,
						$inc: { __v: 1 }, // Ensure versioning updates
					},
					{ new: true, runValidators: true }
				);

				console.log(`🔄 Updated person: ${preparedData.properties.name}`);
				console.log("🔍 Changes:", changes);
			} else {
				console.log(`✅ No changes for: ${preparedData.properties.name}`);
			}
		}
	}

	console.log("✅ People seeding complete!");
};

module.exports = seedPeople;
