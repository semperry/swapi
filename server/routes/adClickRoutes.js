const express = require("express");

const adClickController = require("../controllers/adClickController");
const checkKey = require("../middleware/checkKey");

const adRouter = express.Router();

// Get Ads.txt
adRouter.get("/ads.txt", adClickController.getAdsTxt);

// Create Click
adRouter.get("/saber-masters/:originType", adClickController.addClick);

// Get Clicks
adRouter.get("/clicks", checkKey.checkReportKey, adClickController.getClicks);

module.exports = adRouter;
