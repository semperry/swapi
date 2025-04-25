const fs = require("fs");
const path = require("path");

const FILMS_DIR = path.join(__dirname, "./films/allFilmData");
const FILMS_FIXTURE_PATH = path.join(__dirname, "./fixtures/films.json");
const PEOPLE_FIXTURE_PATH = path.join(__dirname, "./fixtures/people.json");
const OUTPUT_PATH = path.join(__dirname, "./fixtures/updatedFilms.json");

const filmsData = JSON.parse(fs.readFileSync(FILMS_FIXTURE_PATH, "utf8"));
const peopleData = JSON.parse(fs.readFileSync(PEOPLE_FIXTURE_PATH, "utf8"));
const peopleMap = new Map(
	peopleData.map((p) => [p.fields.name.toLowerCase(), p.pk])
);

// Custom mappings for name normalization
const nameCorrections = {
	"c-3po (see threepio)": "c-3po",
	"emperor palpatine (darth sidious)": "palpatine",
};

function normalizeFilmTitle(title) {
	return title
		.replace(/^Star Wars: /i, "")
		.replace(/\(Episode .*?\)/i, "")
		.trim();
}

fs.readdirSync(FILMS_DIR).forEach((file) => {
	const filmData = JSON.parse(
		fs.readFileSync(path.join(FILMS_DIR, file), "utf8")
	);
	const filmTitle = normalizeFilmTitle(filmData.title);

	const matchedFilm = filmsData.find((f) => f.fields.title === filmTitle);
	if (!matchedFilm) return; // Skip if the film isn't in our existing fixture

	if (!filmData.characters || !filmData.characters.data) return;

	const existingCharacterPks = new Set(matchedFilm.fields.characters || []);

	filmData.characters.data.forEach((char) => {
		let charName = char.title.toLowerCase();
		if (nameCorrections[charName]) {
			charName = nameCorrections[charName];
		}
		const characterPk = peopleMap.get(charName);
		if (characterPk && !existingCharacterPks.has(characterPk)) {
			existingCharacterPks.add(characterPk);
		}
	});

	matchedFilm.fields.characters = Array.from(existingCharacterPks);
});

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(filmsData, null, 2), "utf8");
console.log("Updated films.json saved as updatedFilms.json.");
