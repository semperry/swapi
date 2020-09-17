const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Maximum requests reached. Try again later.",
});

const authLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	message: "Account limit reached. Try again later.",
});

module.exports = {
	apiLimiter,
	authLimiter,
};
