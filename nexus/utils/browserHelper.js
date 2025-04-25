const puppeteer = require("puppeteer");

async function setupBrowser() {
	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();

	await page.setUserAgent(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
	);
	await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

	return { browser, page };
}

module.exports = { setupBrowser };
