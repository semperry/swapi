const express = require("express");
const rootController = require("../controllers/rootController");

const router = express.Router();

router.get("/", rootController.getRootData);

module.exports = router;
