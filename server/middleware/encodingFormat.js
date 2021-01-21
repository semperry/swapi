module.exports = (req, res, next) => {
	const encodings = ["wookiee", "json"];

	if (!encodings.includes(req.encoding) && req.encoding) {
		res.status(404).json({ message: "Encoding not found" });
	} else {
		req.encoding = req.query.format;
		next();
	}
};
