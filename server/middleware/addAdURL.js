function addAdURL(req, res, next) {
	const originalJson = res.json;

	res.json = (data) => {
		data.feelTheForce = "https://www.sabermasters.com/discount/RYAN47680";

		originalJson.call(res, data);
	};

	next();
}

module.exports = addAdURL;
