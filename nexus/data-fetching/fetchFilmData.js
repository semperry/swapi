const fs = require("fs");
const path = require("path");

const { setupBrowser } = require("../utils/browserHelper");

const OUTPUT_PATH = path.join(__dirname, "../raw-data/films.json");

// Check if the file exists before reading
if (!fs.existsSync(OUTPUT_PATH)) {
	console.error(`Error: ${OUTPUT_PATH} does not exist.`);
	process.exit(1); // Exit the script
}

const rawFilms = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));
console.log(`Loaded ${rawFilms.length} films.`);

const BASE_URL =
	"https://www.starwars.com/_grill/filter/films?filter=Chronological&mod=6&slug=chronological";

async function fetchFilmData() {
	const { browser, page } = await setupBrowser();

	console.log(`Fetching film data from: ${BASE_URL}`);
	await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

	const filmData = await page.evaluate(() =>
		JSON.parse(document.body.innerText)
	);

	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(filmData, null, 2), "utf8");
	console.log(`✅ Saved film data to ${OUTPUT_PATH}`);

	await browser.close();
}

fetchFilmData().catch(console.error);
