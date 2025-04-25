const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const RAW_FILMS_PATH = path.join(__dirname, "./films/rawFilms.json");
const OUTPUT_DIR = path.join(__dirname, "./films/allFilmData");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const BASE_URL = "https://www.starwars.com/_grill/filter";
const RESOURCE_TYPES = {
	characters: "Characters",
	species: "Creatures",
	planets: "Locations",
	transports: "Vehicles",
};

const MOD_LOOKUP = {
	solo: "7",
	"star-wars-episode-viii-the-last-jedi": 7,
	"star-wars-episode-vii-the-force-awakens": 6,
	"star-wars-episode-iii-revenge-of-the-sith": 7,
	"star-wars-episode-ii-attack-of-the-clones": 7,
	"star-wars-episode-i-the-phantom-menace": 7,
	"star-wars-episode-vi-return-of-the-jedi": 6,
	"star-wars-episode-v-the-empire-strikes-back": 6,
	"star-wars-episode-iv-a-new-hope": 6,
};

async function fetchFilmData(film) {
	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();

	// Mimic a real browser
	await page.setUserAgent(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
	);
	await page.setExtraHTTPHeaders({
		"Accept-Language": "en-US,en;q=0.9",
	});

	const filmSlug = film.url.split("/").pop();
	const outputPath = path.join(OUTPUT_DIR, `${filmSlug}.json`);

	let filmData = fs.existsSync(outputPath)
		? JSON.parse(fs.readFileSync(outputPath, "utf8"))
		: { ...film };

	for (const [key, param] of Object.entries(RESOURCE_TYPES)) {
		const filmUrl = film.url.slice(film.url.indexOf("/films"));

		const resourceUrl = `${BASE_URL}${filmUrl}?filter=${param}&mod=${
			MOD_LOOKUP[filmSlug] ? MOD_LOOKUP[filmSlug] : 8
		}&slug=${param.toLowerCase()}`;

		console.log("URL: ", resourceUrl);
		console.log(`Fetching ${key} for ${film.title}...`);

		try {
			await page.goto(resourceUrl, { waitUntil: "domcontentloaded" });

			const resourceJson = await page.evaluate(() => {
				try {
					return JSON.parse(document.body.innerText);
				} catch (error) {
					console.error("JSON parse error: ", error);
					return null;
				}
			});

			if (resourceJson) {
				filmData[key] = resourceJson;
			} else {
				console.warn(`No data found for ${key} in ${film.title}`);
			}
		} catch (error) {
			console.error(`Error fetching ${key} in ${film.title}`);
		}
	}

	fs.writeFileSync(outputPath, JSON.stringify(filmData, null, 2), "utf8");
	console.log(`Saved data for ${film.title}`);
	await browser.close();
}

async function main() {
	const rawFilms = JSON.parse(fs.readFileSync(RAW_FILMS_PATH, "utf8"));
	for (const film of rawFilms) {
		await fetchFilmData(film);
	}
	console.log("All film data fetched and saved.");
}

main().catch(console.error);
