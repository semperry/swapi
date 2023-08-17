const countRouter = require("express").Router();
const countController = require("../controllers/countController");

// Get counts
countRouter.get("/all", countController.getCounts);

module.exports = countRouter;
