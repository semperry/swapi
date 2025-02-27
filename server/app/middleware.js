const cors = require("cors");
const express = require("express");

const addAdURL = require("../middleware/addAdURL");
const setEncoding = require("../middleware/encodingFormat");
const setUrl = require("../middleware/setUrl");
const { apiLimiter, apiSlowDown } = require("../middleware/limiters");

const allowedHeaders = ["GET"];

const applyMiddleware = (app) => {
	app.use(cors());
	app.use(express.json());

	app.set("trust proxy", 1);
	app.use(cors({ methods: ["GET"] }));

	// Honey Pot middleware to drop unwanted traffic flood
	app.use((req, res, next) => {
		if (!allowedHeaders.includes(req.method)) {
			req.destroy();
		} else {
			next();
		}
	});

	// API-Specific Middleware
	app.use("/api", [apiLimiter, apiSlowDown, setEncoding, setUrl, addAdURL]);
	app.use("/track", [apiLimiter, apiSlowDown]);
};

module.exports = applyMiddleware;
