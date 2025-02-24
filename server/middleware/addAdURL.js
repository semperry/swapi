function addAdURL(_, res, next) {
	const originalJson = res.json;

	res.json = (data) => {
		data.apiVersion = "1.0";
		data.timestamp = new Date();
		data.support = {
			contact: "admin@swapi.tech",
			donate:
				"https://www.paypal.com/donate?token=2VGWvL-DXMDnO2Zy7d13qAxGSQYpZEKBVWrnK8ahwXTtrBJi4tXQtEBwcfWOjt-DoXagFraQrEs2eysl",
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
