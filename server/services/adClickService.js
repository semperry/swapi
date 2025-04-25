const path = require("path");
const fs = require("fs");

const Click = require("../models/AdClickModel");

const getAdsTxt = () => {
	try {
		const adsPath = path.join(__dirname, "../../ads.txt"); // adjust as needed
		const file = fs.readFileSync(adsPath, "utf8");

		return file;
	} catch (error) {
		console.error("Error reading ads.txt:", error);
		throw error;
	}
};

const addClick = async (referrer, userAgent, type) => {
	try {
		const newClick = await Click.create({
			adName: `Saber Masters: ${type}`,
			timestamp: new Date(),
			referrer,
			userAgent,
		});

		return newClick;
	} catch (error) {
		throw error;
	}
};

const getClicks = async () => {
	try {
		const allClicks = await Click.find();

		return allClicks;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	addClick,
	getAdsTxt,
	getClicks,
};
