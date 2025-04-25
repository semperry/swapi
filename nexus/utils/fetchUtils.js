const BASE_URL = "https://www.starwars.com/_grill/filter";

/**
 * Fetch paginated API results from a given URL until no more pages exist.
 * @param {string} url - The initial API URL to fetch from.
 * @param {object} page - Puppeteer page instance.
 * @returns {Promise<Array>} - An array of all fetched results.
 */
async function fetchAllPages(url, page, filmSlug) {
	let results = [];
	let nextUrl = url;

	while (nextUrl) {
		console.log(`🔍 Fetching: ${nextUrl}`);
		await page.goto(nextUrl, { waitUntil: "domcontentloaded" });

		const responseData = await page.evaluate(() =>
			JSON.parse(document.body.innerText)
		);

		if (responseData.data) {
			results = results.concat(responseData.data);
		}

		if (responseData.next) {
			const nextPath = responseData.next.startsWith("/films")
				? responseData.next
				: `/films/${filmSlug}${responseData.next}`;
			nextUrl = `${BASE_URL}${nextPath}`;
		} else {
			nextUrl = null;
		}
	}

	return results;
}

module.exports = { fetchAllPages };
