const fs = require("fs");
const path = require("path");

const FILMS_DIR = path.join(__dirname, "./films/allFilmData");
const PEOPLE_FIXTURE_PATH = path.join(
	__dirname,
	"../server/fixtures/people.json"
);
const OUTPUT_PATH = path.join(__dirname, "./fixtures/people.json");

// Load existing people fixture
const existingPeople = JSON.parse(fs.readFileSync(PEOPLE_FIXTURE_PATH, "utf8"));

// Find the highest existing PK
let highestPk = existingPeople.reduce(
	(max, person) => Math.max(max, person.pk),
	0
);

// Normalize names for matching
const normalizeName = (name) =>
	name
		.toLowerCase()
		.replace(/\s+/g, "")
		.replace(/[^a-z0-9]/g, "");

// Build a lookup map of existing people by normalized name
const existingPeopleMap = new Map();
existingPeople.forEach((person) => {
	existingPeopleMap.set(normalizeName(person.fields.name), person);
});

const newPeople = new Map();

fs.readdirSync(FILMS_DIR).forEach((file) => {
	const filmData = JSON.parse(
		fs.readFileSync(path.join(FILMS_DIR, file), "utf8")
	);

	if (!filmData.characters || !filmData.characters.data) return;

	for (const char of filmData.characters.data) {
		const charName = char.title;
		const charDescription = char.description || "";
		const charCategories = char.categories || [];

		const normalizedCharName = normalizeName(charName);

		// Default new fields
		const charFields = {
			name: charName,
			gender: "",
			skin_color: "",
			hair_color: "",
			height: "",
			eye_color: "",
			mass: "",
			homeworld: "",
			birth_year: "",
		};

		// Process categories for dimensions and gender
		for (const category of charCategories) {
			if (category.name.toLowerCase() === "gender") {
				charFields.gender = category.properties[0]?.name.toLowerCase() || "";
			} else if (category.name.toLowerCase() === "dimensions") {
				for (const prop of category.properties) {
					const [key, value] = prop.name.split(": ");
					if (key && value) {
						charFields[key.toLowerCase()] = value.trim();
					}
				}
			}
		}

		if (existingPeopleMap.has(normalizedCharName)) {
			// Person exists, update ONLY description, keep all other fields intact
			const existingPerson = existingPeopleMap.get(normalizedCharName);
			existingPerson.description = charDescription; // Preserve scraped description
		} else {
			// Assign a new PK if not found
			highestPk += 1;
			const newPerson = {
				description: charDescription,
				fields: charFields,
				pk: highestPk,
				schema: "people",
			};
			newPeople.set(normalizedCharName, newPerson);
		}
	}
});

// Merge results while keeping existing records untouched (except for descriptions)
const mergedPeople = [...existingPeople, ...newPeople.values()];

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mergedPeople, null, 2), "utf8");
console.log(`✅ Merged people fixture saved to ${OUTPUT_PATH}`);
