const countService = require("../services/countService");

const getCounts = async (_, res) => {
	try {
		const counts = await countService.getAllCounts();

		if (!counts) return res.status(404).json({ message: "Counts not found" });

		return res.status(200).json({ message: "ok", counts });
	} catch (error) {
		console.error(`Get Counts Error: ${error}`);

		return res
			.status(400)
			.json({ message: "Could not GET counts", errors: `${error}` });
	}
};

module.exports = {
	getCounts,
};
