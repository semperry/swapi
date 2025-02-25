const Click = require("../models/AdClickModel");

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
	getClicks,
};
