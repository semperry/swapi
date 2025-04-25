const fs = require("fs");
const path = require("path");
const { normalizeFilmTitle } = require("./scrapeAllQuotes");

const FILMS_FIXTURE_PATH = path.join(
	__dirname,
	"../server/fixtures/films.json"
);
const RAW_FILMS_PATH = path.join(__dirname, "./films/rawFilms.json");
const OUTPUT_PATH = path.join(__dirname, "./fixtures/films.json");

const existingFilms = JSON.parse(fs.readFileSync(FILMS_FIXTURE_PATH, "utf8"));
const rawFilms = JSON.parse(fs.readFileSync(RAW_FILMS_PATH, "utf8"));

const existingFilmsMap = new Map();
existingFilms.forEach((film) => {
	existingFilmsMap.set(normalizeFilmTitle(film.fields.title), film);
});

for (const rawFilm of rawFilms) {
	const normalizedTitle = normalizeFilmTitle(rawFilm.title);

	if (existingFilmsMap.has(normalizedTitle)) {
		const existingFilm = existingFilmsMap.get(normalizedTitle);
		existingFilm.fields.description =
			rawFilm.description || existingFilm.fields.description;
		existingFilm.fields.release_date =
			rawFilm.released_on || existingFilm.fields.release_date;
	} else {
		const newFilm = {
			fields: {
				title: normalizedTitle,
				episode_id: "",
				description: rawFilm.description,
				release_date: rawFilm.released_on,
				producer: "", // Placeholder
				director: "", // Placeholder
				opening_crawl: "", // Placeholder
				characters: [],
				species: [],
				planets: [],
				starships: [],
				vehicles: [],
			},
			schema: "films",
			pk: existingFilms.length + 1,
		};

		existingFilms.push(newFilm);
	}
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existingFilms, null, 2), "utf8");
console.log("Merged films fixture saved to mergedFilms.json");
