module.exports = (req, res, next) => {
	const encodings = ["wookiee", "json"];
	req.encoding = req.query.format;

	if (!encodings.includes(req.encoding) && req.encoding) {
		res.status(404).json({ message: "Encoding not found" });
	} else {
		next();
	}
};
