const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Maximum requests reached. Try again later.",
});

const apiSlowDown = slowDown({
	windowMs: 15 * 60 * 1000,
	delayAfter: 5,
	delayMs: 100,
});

module.exports = {
	apiLimiter,
	apiSlowDown,
};
