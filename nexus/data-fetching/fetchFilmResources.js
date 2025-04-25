const fs = require("fs");
const path = require("path");

const { setupBrowser } = require("../utils/browserHelper"); // Ensure you're using the helper
const { fetchAllPages } = require("../utils/fetchUtils"); // Fetch paginated data

const RAW_FILMS_PATH = path.join(__dirname, "../raw-data/films.json");
const OUTPUT_DIR = path.join(__dirname, "../raw-data/films");

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const BASE_URL = "https://www.starwars.com/_grill/filter";
const RESOURCE_TYPES = { characters: "Characters" };

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

async function fetchFilmResources(film, page) {
	const filmSlug = film.slug.replace("films/", ""); // Extract proper slug
	const outputPath = path.join(OUTPUT_DIR, `${filmSlug}.json`);

	// Keep all original film data
	let filmData = { ...film };

	for (const [key, param] of Object.entries(RESOURCE_TYPES)) {
		const modValue = MOD_LOOKUP[filmSlug] || 8;
		const resourceUrl = `${BASE_URL}/${
			film.slug
		}?filter=${param}&mod=${modValue}&slug=${param.toLowerCase()}`;

		console.log(`Fetching ${key} for ${film.title}...`);

		const resourceList = await fetchAllPages(resourceUrl, page, filmSlug);
		if (resourceList.length) {
			filmData[key] = {
				count: resourceList.length,
				title: param,
				data: resourceList,
			};
		}
	}

	fs.writeFileSync(outputPath, JSON.stringify(filmData, null, 2), "utf8");
	console.log(`✅ Saved data for ${film.title}`);
}

async function main() {
	if (!fs.existsSync(RAW_FILMS_PATH)) {
		console.error(
			`❌ Error: ${RAW_FILMS_PATH} not found. Run fetchFilmsData.js first.`
		);
		process.exit(1);
	}

	const rawFilms = JSON.parse(fs.readFileSync(RAW_FILMS_PATH, "utf8"));
	const { browser, page } = await setupBrowser();

	for (const film of rawFilms.data) {
		await fetchFilmResources(film, page);
	}

	console.log("🎉 All film data fetched and saved.");
	await browser.close();
}

main().catch(console.error);
