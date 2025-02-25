const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
	adName: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
	referrer: { type: String },
	userAgent: { type: String },
});

module.exports = mongoose.model("Click", clickSchema);
