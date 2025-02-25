const checkReportKey = (req, res, next) => {
	try {
		const { report_key } = req.query;

		if (report_key === process.env.REPORT_KEY) {
			next();
		} else {
			throw new Error("Unauthorized");
		}
	} catch (error) {
		return res.status(401).json({ message: error.toString() });
	}
};

module.exports = {
	checkReportKey,
};
