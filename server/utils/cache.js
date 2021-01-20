// TODO:
// Set Cache for all routes (result should be results, or do we streamline?)

class SwapiCache {
	constructor() {
		this.cache = {};
		this.window = 10 * 60 * 1000;
	}

	checkCache = (req, res, next) => {
		const routePath = req.route.path.split("/")[1];
		const id = req.params.id;

		if (
			this.cache[`${routePath}:${id}`] &&
			Date.now() < this.cache[`${routePath}:${id}`].time + this.window
		) {
			const result = { ...this.cache[`${routePath}:${id}`] };
			delete result.time;

			return res.status(200).json({ message: "ok", result });
		} else {
			next();
		}
	};

	setCache = (req, data) => {
		const routePath = req.route.path.split("/")[1];
		const id = req.params.id;

		this.cache[`${routePath}:${id}`] = {
			...data,
			time: Date.now(),
		};
	};
}

const cache = new SwapiCache();

module.exports = cache;
