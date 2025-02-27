const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const addAdURL = (_, res, next) => {
	const originalJson = res.json;
	const url =
		process.env.NODE_ENV === "production"
			? "https://www.swapi.tech"
			: "http://localhost:5173";

	res.json = (data) => {
		data.apiVersion = "1.0";
		data.timestamp = new Date();
		data.support = {
			contact: "admin@swapi.tech",
			donate:
				"https://www.paypal.com/donate/?business=2HGAUVTWGR5T2&no_recurring=0&item_name=Support+Swapi+and+keep+the+galaxy%27s+data+free%21+Your+donation+fuels+open-source+innovation+and+helps+us+grow.+Thank+you%21+%F0%9F%9A%80&currency_code=USD",
			partnerDiscounts: {
				saberMasters: {
					link: `${url}/partner-discount/sabermasters-swapi`,
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
};

module.exports = addAdURL;
