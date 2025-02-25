const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message:
		"API requests ain't like dusting crops, kid! The nav computer needs a moment, try again soon.",
});

const apiSlowDown = slowDown({
	windowMs: 15 * 60 * 1000,
	delayAfter: 5,
	delayMs: (hits) => hits * 100,
});

module.exports = {
	apiLimiter,
	apiSlowDown,
};
