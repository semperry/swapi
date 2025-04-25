const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const FILMS_DIR = path.join(__dirname, "./films/allFilmData");
const PEOPLE_FIXTURE_PATH = path.join(__dirname, "./fixtures/people.json");
const FILMS_FIXTURE_PATH = path.join(__dirname, "./fixtures/films.json");
const QUOTES_FIXTURE_PATH = path.join(__dirname, "./fixtures/quotes.json");
const OUTPUT_PATH = path.join(__dirname, "./fixtures/quotes.json");

const existingPeople = JSON.parse(fs.readFileSync(PEOPLE_FIXTURE_PATH, "utf8"));
const existingFilms = JSON.parse(fs.readFileSync(FILMS_FIXTURE_PATH, "utf8"));
const existingQuotes = JSON.parse(fs.readFileSync(QUOTES_FIXTURE_PATH, "utf8"));

const peopleMap = new Map();
existingPeople.forEach((person) => {
	peopleMap.set(person.fields.name.toLowerCase(), person.pk);
});

const filmsMap = new Map();
existingFilms.forEach((film) => {
	filmsMap.set(film.fields.title.toLowerCase(), film.pk);
});

const fetchedCharacters = new Set();

function normalizeFilmTitle(title) {
	return title
		.replace(/^Star Wars: /i, "")
		.replace(/\(Episode .*?\)/i, "")
		.trim();
}

async function fetchQuotes(characterUrl) {
	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();

	await page.setUserAgent(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
	);
	await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

	console.log(`Fetching quotes from ${characterUrl}...`);
	await page.goto(characterUrl, { waitUntil: "domcontentloaded" });

	await page.waitForSelector("#burger");
	const scriptContent = await page.evaluate(() => {
		const burgerElement = document.querySelector("#burger");
		if (!burgerElement) return null;
		let scriptTag = burgerElement.nextElementSibling;
		while (scriptTag) {
			if (scriptTag.tagName.toLowerCase() === "script") {
				return scriptTag.textContent.trim();
			}
			scriptTag = scriptTag.nextElementSibling;
		}
		return null;
	});

	await browser.close();
	if (!scriptContent) return null;

	const quoteContent = scriptContent.slice(
		scriptContent.indexOf("=") + 1,
		scriptContent.lastIndexOf("}:") + 1
	);

	try {
		const parsedJson = JSON.parse(quoteContent);
		const quotesData = parsedJson.stack
			.filter((obj) => obj.title === "Quotes")
			.flatMap((item) =>
				item.data.map((quote) => ({
					quote: quote.description,
					film: quote.attribution,
				}))
			);
		return quotesData;
	} catch (error) {
		console.error(`Error parsing JSON for ${characterUrl}:`, error);
		return null;
	}
}

const newQuotes = [];

(async () => {
	for (const file of fs.readdirSync(FILMS_DIR)) {
		const filmData = JSON.parse(
			fs.readFileSync(path.join(FILMS_DIR, file), "utf8")
		);
		if (!filmData.characters || !filmData.characters.data) continue;

		function preprocessCharacterName(name) {
			if (name.includes("See Threepio")) return "C-3PO";
			if (name.includes("Darth Sidious") || name.includes("Emperor Palpatine"))
				return "Palpatine";
			return name;
		}

		for (const character of filmData.characters.data) {
			const processedCharacterName = preprocessCharacterName(character.title);

			const characterPk =
				peopleMap.get(processedCharacterName.toLowerCase()) || null;
			if (fetchedCharacters.has(characterPk)) continue;

			fetchedCharacters.add(characterPk);

			const filmTitleNormalized = normalizeFilmTitle(filmData.title);
			const filmPk = filmsMap.get(filmTitleNormalized.toLowerCase()) || null;
			if (!filmPk) continue;

			const quotes = await fetchQuotes(character.href);
			for (const quote of quotes) {
				const normalizedFilmTitle = normalizeFilmTitle(quote.film);
				const filmPk = filmsMap.get(normalizedFilmTitle.toLowerCase()) || null;

				if (!filmPk) {
					console.log(`Warning: No matching film PK found for ${quote.film}`);
				}

				newQuotes.push({
					fields: {
						quote: quote.quote,
						people: characterPk ? [characterPk] : [],
						films: filmPk ? [filmPk] : [],
						character_name: processedCharacterName,
						film_title: normalizedFilmTitle,
					},
					pk: existingQuotes.length + newQuotes.length + 1,
					schema: "quotes",
				});
			}
		}
	}

	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(newQuotes, null, 2), "utf8");
	console.log("Merged quotes fixture saved to quotes.json");
})();
