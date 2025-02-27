const rootService = require("../services/rootService");

const getRootData = (req, res) => {
	try {
		const apiRootData = rootService.getRootData(req);

		if (!apiRootData)
			return res.status(404).json({ message: "Root API data not found" });

		return res.status(200).json({ message: "ok", result: apiRootData });
	} catch (error) {
		console.error(`Get API Root Error: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET root data", errors: `${error}` });
	}
};

module.exports = {
	getRootData,
};
