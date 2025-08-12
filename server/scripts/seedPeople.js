const fs = require("fs");
const path = require("path");

const PeopleModel = require("../models/PeopleModel");
const {
	convertReferencesToUrls,
} = require("../helpers/convertReferencesToUrls");
const { API_BASE_URL } = require("../config/config");

const fixturesPath = (p) => path.join(__dirname, "..", "fixtures", p);
const readFixtureData = (fileName) =>
	JSON.parse(fs.readFileSync(fixturesPath(fileName)), "utf-8");

const buildRelationalData = () => {
	const vehicles = readFixtureData("vehicles.json");
	const starships = readFixtureData("starships.json");
	const films = readFixtureData("films.json");

	const byPerson = new Map();

	const add = (personPk, kind, itemPk) => {
		const key = String(personPk);
		const entry = byPerson.get(key) || {
			vehicles: [],
			starships: [],
			films: [],
		};

		entry[kind].push(Number(itemPk));
		byPerson.set(key, entry);
	};

	// vehicles
	for (const vehicle of vehicles) {
		const itemPk = vehicle.pk;
		const pilots =
			vehicle.fields && Array.isArray(vehicle.fields.pilots)
				? vehicle.fields.pilots
				: [];

		for (const personPk of pilots) add(personPk, "vehicles", itemPk);
	}

	// Starships
	for (const starship of starships) {
		const itemPk = starship.pk;
		const pilots =
			starship.fields && Array.isArray(starship.fields.pilots)
				? starship.fields.pilots
				: [];

		for (const personPk of pilots) add(personPk, "starships", itemPk);
	}

	// Films
	for (const film of films) {
		const itemPk = film.pk;
		const characters =
			film.fields && Array.isArray(film.fields.characters)
				? film.fields.characters
				: [];

		for (const personPk of characters) add(personPk, "films", itemPk);
	}

	// Make unique
	for (const entry of byPerson.values()) {
		entry.vehicles = [...new Set(entry.vehicles)].sort((a, b) => a - b);
		entry.starships = [...new Set(entry.starships)].sort((a, b) => a - b);
		entry.films = [...new Set(entry.films)].sort((a, b) => a - b);
	}

	return byPerson;
};

const seedPeople = async () => {
	console.log("📥 Seeding people...");

	const data = readFixtureData("people.json");
	const relationalData = buildRelationalData();

	for (const item of data) {
		const uid = item.pk.toString(); // Convert UID to string for consistency
		const refs = relationalData.get(uid) || {
			vehicles: [],
			starships: [],
			films: [],
		};

		const preparedData = convertReferencesToUrls(
			{
				uid,
				properties: {
					...item.fields,
					vehicles: refs.vehicles,
					starships: refs.starships,
					films: refs.films,
					url: `${API_BASE_URL}/people/${uid}`,
				},
			},
			{ homeworld: "planets", vehicles, starships, films }
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
