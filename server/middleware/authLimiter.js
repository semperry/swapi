const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Account limit reached. Try again later.",
});

module.exports = authLimiter;
