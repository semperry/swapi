const adClickService = require("../services/adClickService");

const getAdsTxt = async (req, res) => {
	try {
		const adTxtFile = await adClickService.getAdsTxt();
		console.log(adTxtFile);

		res.setHeader("Content-Type", "text/plain");
		return res.status(200).send(adTxtFile);
	} catch (error) {
		console.error("Error reading ads.txt:", error);
		res.status(500).send("Unable to serve ads.txt");
	}
};

const addClick = async (req, res) => {
	const [referrer, userAgent] = [req.get("Referrer"), req.get("User-Agent")];
	const originType = req.params.originType;

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
	getAdsTxt,
	getClicks,
};
