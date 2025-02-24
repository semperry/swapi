function addAdURL(_, res, next) {
	const originalJson = res.json;

	res.json = (data) => {
		data.apiVersion = "1.0";
		data.timestamp = new Date();
		data.support = {
			contact: "admin@swapi.tech",
			donate:
				"https://www.paypal.com/donate/?business=2HGAUVTWGR5T2&no_recurring=0&currency_code=USD",
			partnerDiscounts: {
				saberMasters: {
					link: "https://www.sabermasters.com/discount/RYAN47680",
					details: "Use this link to automatically get $10 off your purchase!",
				},
			},
		};
		data.social = {
			discord: "https://discord.gg/zWvA6GPeNG",
			reddit: "https://www.reddit.com/r/SwapiOfficial/",
			github: "https://github.com/semperry/swapi/blob/main/CONTRIBUTORS.md",
		};

		originalJson.call(res, data);
	};

	next();
}

module.exports = addAdURL;
