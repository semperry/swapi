const fs = require("fs");
const path = require("path");

const BASE_PATH = __dirname;
const PEOPLE_FILE = path.join(BASE_PATH, "./fixtures/people.json");
const QUOTES_FILE = path.join(BASE_PATH, "./fixtures/quotes.json");
const FILMS_FILE = path.join(BASE_PATH, "./fixtures/films.json");

function loadJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveJson(filePath, data) {
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Load datasets
let peopleData = loadJson(PEOPLE_FILE);
let quotesData = loadJson(QUOTES_FILE);
let filmsData = loadJson(FILMS_FILE);

// Step 1: **Rebuild People PK Map**
const peoplePkMap = {};
peopleData.forEach((person, index) => {
	peoplePkMap[person.pk] = index + 1; // Map old PK to new PK
	person.pk = index + 1; // Update in place
});

// Step 2: **Rebuild Quotes PK Map**
const quotesPkMap = {};
quotesData.forEach((quote, index) => {
	quotesPkMap[quote.pk] = index + 1; // Map old PK to new PK
	quote.pk = index + 1; // Update in place
});

// Step 3: **Update People References in Quotes**
quotesData.forEach((quote) => {
	quote.fields.people = quote.fields.people.map(
		(oldPk) => peoplePkMap[oldPk] || oldPk
	);
});

// Step 4: **Update People References in Films**
filmsData.forEach((film) => {
	film.fields.characters = film.fields.characters.map(
		(oldPk) => peoplePkMap[oldPk] || oldPk
	);
});

// Step 5: **Update Films References in Quotes**
quotesData.forEach((quote) => {
	quote.fields.films = quote.fields.films.map(
		(oldPk) => quotesPkMap[oldPk] || oldPk
	);
});

// Save the updated data back
saveJson(PEOPLE_FILE, peopleData);
saveJson(QUOTES_FILE, quotesData);
saveJson(FILMS_FILE, filmsData);

console.log("✅ All foreign key references updated successfully!");
