const adClickService = require("../services/adClickService");

const addClick = async (req, res) => {
	const [referrer, userAgent] = [req.get("Referrer"), req.get("User-Agent")];
	const originType = req.params.originType;

	console.log(req.params);

	try {
		const newClick = await adClickService.addClick(
			referrer,
			userAgent,
			originType
		);

		return res.status(200).json({ message: "Click tracked", click: newClick });
	} catch (error) {
		console.error("Tracking Error: ", error);

		return res
			.status(400)
			.json({ message: "Could not track click", error: error.toString() });
	}
};

const getClicks = async (_, res) => {
	try {
		const allClicks = await adClickService.getClicks();

		return res.status(200).json({ message: "Ok", clicks: allClicks });
	} catch (error) {
		return res
			.status(400)
			.json({ message: "something went wrong", error: error.toString() });
	}
};

module.exports = {
	addClick,
	getClicks,
};
